import { and, asc, desc, eq, inArray, like, or, sql } from "drizzle-orm";
import {
  usersTable,
  categoriesTable,
  coursesTable,
  courseSectionsTable,
  courseLecturesTable,
  lectureAssetsTable,
  enrollmentsTable,
} from "../plugin/database/schema.js";
import { LibSQLDatabase } from "drizzle-orm/libsql";

type CourseListParams = {
  q?: string;
  categoryId?: string;
  instructorId?: string;
  levelId?: string;
  status?: "published" | "draft" | "review" | "archived";
  minPrice?: number;
  maxPrice?: number;
  sort?: "newest" | "popular" | "rating" | "price_low" | "price_high";
  page?: number;
  pageSize?: number;
};

export async function listCourses(db: LibSQLDatabase<Record<string, never>>, params: CourseListParams) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 12));
  const offset = (page - 1) * pageSize;

  const whereParts = [
    params.status ? eq(coursesTable.status, params.status) : eq(coursesTable.status, "published"),
    params.categoryId ? eq(coursesTable.categoryId, params.categoryId) : undefined,
    params.instructorId ? eq(coursesTable.instructorId, params.instructorId) : undefined,
    params.levelId ? eq(coursesTable.levelId, params.levelId) : undefined,
    params.minPrice != null ? sql`${coursesTable.priceCurrent} >= ${params.minPrice}` : undefined,
    params.maxPrice != null ? sql`${coursesTable.priceCurrent} <= ${params.maxPrice}` : undefined,
    params.q ? or(like(coursesTable.title, `%${params.q}%`), like(coursesTable.subtitle, `%${params.q}%`)) : undefined,
  ].filter(Boolean);

  const orderBy =
    params.sort === "popular"
      ? desc(coursesTable.studentCount)
      : params.sort === "rating"
        ? desc(coursesTable.ratingAvg)
        : params.sort === "price_low"
          ? asc(coursesTable.priceCurrent)
          : params.sort === "price_high"
            ? desc(coursesTable.priceCurrent)
            : desc(coursesTable.publishedAt); // newest default

  const rows = await db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      slug: coursesTable.slug,
      subtitle: coursesTable.subtitle,
      thumbnailUrl: coursesTable.thumbnailUrl,
      promoVideoUrl: coursesTable.promoVideoUrl,
      currency: coursesTable.currency,
      priceCurrent: coursesTable.priceCurrent,
      ratingAvg: coursesTable.ratingAvg,
      ratingCount: coursesTable.ratingCount,
      studentCount: coursesTable.studentCount,
      instructor: {
        id: usersTable.id,
        name: usersTable.name,
        avatar: usersTable.avatar,
      },
      category: {
        id: categoriesTable.id,
        name: categoriesTable.name,
        slug: categoriesTable.slug,
      },
    })
    .from(coursesTable)
    .leftJoin(usersTable, eq(usersTable.id, coursesTable.instructorId))
    .leftJoin(categoriesTable, eq(categoriesTable.id, coursesTable.categoryId))
    .where(and(...(whereParts as any)))
    .orderBy(orderBy)
    .limit(pageSize)
    .offset(offset);

  const totalRow = await db
    .select({ count: sql<number>`count(*)` })
    .from(coursesTable)
    .where(and(...(whereParts as any)));

  return {
    page,
    pageSize,
    total: totalRow[0]?.count ?? 0,
    items: rows,
  };
}

export async function getCourseDetail(db: LibSQLDatabase<Record<string, never>>, courseId: string) {
  const [course] = await db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      subtitle: coursesTable.subtitle,
      description: coursesTable.description,
      thumbnailUrl: coursesTable.thumbnailUrl,
      promoVideoUrl: coursesTable.promoVideoUrl,
      language: coursesTable.language,
      currency: coursesTable.currency,
      priceCurrent: coursesTable.priceCurrent,
      ratingAvg: coursesTable.ratingAvg,
      ratingCount: coursesTable.ratingCount,
      studentCount: coursesTable.studentCount,
      instructor: {
        id: usersTable.id,
        name: usersTable.name,
        avatar: usersTable.avatar,
        bio: usersTable.bio,
      },
    })
    .from(coursesTable)
    .leftJoin(usersTable, eq(usersTable.id, coursesTable.instructorId))
    .where(eq(coursesTable.id, courseId))
    .limit(1);

  if (!course) return null;

  const sections = await db
    .select({
      id: courseSectionsTable.id,
      title: courseSectionsTable.title,
      sortOrder: courseSectionsTable.sortOrder,
    })
    .from(courseSectionsTable)
    .where(eq(courseSectionsTable.courseId, courseId))
    .orderBy(asc(courseSectionsTable.sortOrder));

  const lectures = await db
    .select({
      id: courseLecturesTable.id,
      sectionId: courseLecturesTable.sectionId,
      type: courseLecturesTable.type,
      title: courseLecturesTable.title,
      description: courseLecturesTable.description,
      durationSeconds: courseLecturesTable.durationSeconds,
      isPreview: courseLecturesTable.isPreview,
      sortOrder: courseLecturesTable.sortOrder,
      status: courseLecturesTable.status,
    })
    .from(courseLecturesTable)
    .where(eq(courseLecturesTable.courseId, courseId))
    .orderBy(asc(courseLecturesTable.sectionId), asc(courseLecturesTable.sortOrder));

  const lectureIds = lectures.map((l: any) => l.id);
  const assets = lectureIds.length
    ? await db
        .select({
          id: lectureAssetsTable.id,
          lectureId: lectureAssetsTable.lectureId,
          assetType: lectureAssetsTable.assetType,
          url: lectureAssetsTable.url,
          filename: lectureAssetsTable.filename,
          sizeBytes: lectureAssetsTable.sizeBytes,
        })
        .from(lectureAssetsTable)
        .where(inArray(lectureAssetsTable.lectureId, lectureIds))
    : [];

  const assetsByLecture = new Map<string, any[]>();
  for (const a of assets) {
    const arr = assetsByLecture.get(a.lectureId) ?? [];
    arr.push(a);
    assetsByLecture.set(a.lectureId, arr);
  }

  const lecturesBySection = new Map<string, any[]>();
  for (const lec of lectures) {
    const arr = lecturesBySection.get(lec.sectionId) ?? [];
    arr.push({ ...lec, assets: assetsByLecture.get(lec.id) ?? [] });
    lecturesBySection.set(lec.sectionId, arr);
  }

  return {
    ...course,
    sections: sections.map((s: any) => ({
      ...s,
      lectures: lecturesBySection.get(s.id) ?? [],
    })),
  };
}

export async function getEnrollment(db: LibSQLDatabase<Record<string, never>>, userId: string, courseId: string) {
  const [enroll] = await db
    .select({
      id: enrollmentsTable.id,
      status: enrollmentsTable.status,
      enrolledAt: enrollmentsTable.enrolledAt,
      accessExpiresAt: enrollmentsTable.accessExpiresAt,
    })
    .from(enrollmentsTable)
    .where(and(eq(enrollmentsTable.userId, userId), eq(enrollmentsTable.courseId, courseId)))
    .limit(1);

  // akses valid jika status active dan (expires null atau belum lewat)
  const now = Math.floor(Date.now() / 1000);
  const hasAccess =
    !!enroll && enroll.status === "active" && (enroll.accessExpiresAt == null || enroll.accessExpiresAt > now);

  return { enroll, hasAccess };
}

export async function enrollCourse(
  db: any,
  input: {
    id: string; // enrollment id (uuid)
    userId: string;
    courseId: string;
    source?: "purchase" | "free" | "coupon" | "gift" | "admin_grant";
    accessExpiresAt?: number | null;
  },
) {
  const now = Math.floor(Date.now() / 1000);

  await db
    .insert(enrollmentsTable)
    .values({
      id: input.id,
      userId: input.userId,
      courseId: input.courseId,
      source: input.source ?? "free",
      enrolledAt: now,
      accessExpiresAt: input.accessExpiresAt ?? null,
      status: "active",
    })
    .onConflictDoNothing(); // kalau sudah enrolled, diam

  // Return enrollment terbaru
  return await getEnrollment(db, input.userId, input.courseId);
}
