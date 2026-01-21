import { and, eq, sql, asc } from "drizzle-orm";
import {
  courseLecturesTable,
  courseSectionsTable,
  lectureAssetsTable,
  lectureProgressTable,
  courseProgressSnapshotTable,
} from "../plugin/database/schema.js";
import { LibSQLDatabase } from "drizzle-orm/libsql";

/**
 * Upsert lecture progress to the database.
 *
 * If the lecture progress does not exist, create a new one.
 * If the lecture progress already exists, update the existing one.
 *
 * The `status` parameter is optional and defaults to `"in_progress"`.
 * The `lastPositionSeconds` parameter is optional and defaults to `0`.
 * The `completed` parameter is optional and defaults to `false`.
 *
 * If `completed` is `true`, the `completedAt` field is set to the current timestamp.
 * If `completed` is `false`, the `completedAt` field is set to `null`.
 *
 * @param db - LibSQLDatabase instance
 * @param input - Object containing:
 * - userId: User id
 * - courseId: Course id
 * - lectureId: Lecture id
 * - status: "not_started" | "in_progress" | "completed"
 * - lastPositionSeconds: Timestamp (unix seconds) of the last position in the lecture
 * - completed: Boolean indicating whether the lecture is completed
 *
 * @returns Promise resolving to `true` if the upsert is successful
 */
export async function upsertLectureProgress(
  db: LibSQLDatabase<Record<string, never>>,
  input: {
    userId: string;
    courseId: string;
    lectureId: string;
    status?: "not_started" | "in_progress" | "completed";
    lastPositionSeconds?: number;
    completed?: boolean;
  },
) {
  const now = Math.floor(Date.now() / 1000);

  const status = input.completed ? "completed" : (input.status ?? "in_progress");

  const completedAt = input.completed ? now : null;

  await db
    .insert(lectureProgressTable)
    .values({
      userId: input.userId,
      courseId: input.courseId,
      lectureId: input.lectureId,
      status,
      lastPositionSeconds: Math.max(0, input.lastPositionSeconds ?? 0),
      completedAt,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [lectureProgressTable.userId, lectureProgressTable.lectureId],
      set: {
        courseId: input.courseId,
        status,
        lastPositionSeconds: Math.max(0, input.lastPositionSeconds ?? 0),
        completedAt: input.completed ? now : lectureProgressTable.completedAt, // jangan hapus completedAt kalau sudah ada
        updatedAt: now,
      },
    });

  // optional: recompute snapshot course biar progress cepat
  await recomputeCourseProgressSnapshot(db, input.userId, input.courseId);

  return true;
}

/**
 * Recompute course progress snapshot for a user.
 *
 * @param db - LibSQLDatabase instance
 * @param userId - User id
 * @param courseId - Course id
 *
 * @returns Promise resolving to an object with the following properties:
 * - percent: Percentage of completed lectures (0-100)
 * - completed: Number of completed lectures
 * - total: Total number of lectures in the course
 */
export async function recomputeCourseProgressSnapshot(
  db: LibSQLDatabase<Record<string, never>>,
  userId: string,
  courseId: string,
) {
  const now = Math.floor(Date.now() / 1000);

  const [tot] = await db
    .select({
      total: sql<number>`count(*)`,
    })
    .from(courseLecturesTable)
    .where(and(eq(courseLecturesTable.courseId, courseId), eq(courseLecturesTable.status, "published")));

  const [done] = await db
    .select({
      completed: sql<number>`count(*)`,
    })
    .from(lectureProgressTable)
    .where(
      and(
        eq(lectureProgressTable.userId, userId),
        eq(lectureProgressTable.courseId, courseId),
        eq(lectureProgressTable.status, "completed"),
      ),
    );

  const total = tot?.total ?? 0;
  const completed = done?.completed ?? 0;

  const percent = total === 0 ? 0 : Math.floor((completed / total) * 100);

  await db
    .insert(courseProgressSnapshotTable)
    .values({
      userId,
      courseId,
      percent,
      completedLectures: completed,
      totalLectures: total,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [courseProgressSnapshotTable.userId, courseProgressSnapshotTable.courseId],
      set: {
        percent,
        completedLectures: completed,
        totalLectures: total,
        updatedAt: now,
      },
    });

  return { percent, completed, total };
}

/**
 * Get course curriculum with sections and lectures
 *
 * @param db - LibSQLDatabase instance
 * @param courseId - Course id
 * @param userId - Optional user id to include progress information
 *
 * @returns Promise resolving to an array of sections with their lectures
 */
export async function getCourseCurriculum(
  db: LibSQLDatabase<Record<string, never>>,
  courseId: string,
  userId?: string,
) {
  // Get all sections for the course
  const sections = await db
    .select({
      id: courseSectionsTable.id,
      title: courseSectionsTable.title,
      sortOrder: courseSectionsTable.sortOrder,
    })
    .from(courseSectionsTable)
    .where(eq(courseSectionsTable.courseId, courseId))
    .orderBy(asc(courseSectionsTable.sortOrder));

  // Get all lectures for the course
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
    .where(and(eq(courseLecturesTable.courseId, courseId), eq(courseLecturesTable.status, "published")))
    .orderBy(asc(courseLecturesTable.sortOrder));

  // Get user progress if userId is provided
  let userProgress: Map<string, any> = new Map();
  if (userId) {
    const progress = await db
      .select({
        lectureId: lectureProgressTable.lectureId,
        status: lectureProgressTable.status,
        lastPositionSeconds: lectureProgressTable.lastPositionSeconds,
        completedAt: lectureProgressTable.completedAt,
      })
      .from(lectureProgressTable)
      .where(and(eq(lectureProgressTable.userId, userId), eq(lectureProgressTable.courseId, courseId)));

    progress.forEach((p) => {
      userProgress.set(p.lectureId, p);
    });
  }

  // Build curriculum structure
  return sections.map((section) => {
    const sectionLectures = lectures
      .filter((l) => l.sectionId === section.id)
      .map((lecture) => {
        const progress = userProgress.get(lecture.id);
        return {
          ...lecture,
          progress: progress
            ? {
                status: progress.status,
                lastPositionSeconds: progress.lastPositionSeconds,
                completedAt: progress.completedAt,
              }
            : null,
        };
      });

    return {
      ...section,
      lectures: sectionLectures,
      lectureCount: sectionLectures.length,
      totalDuration: sectionLectures.reduce((sum, l) => sum + (l.durationSeconds || 0), 0),
    };
  });
}

/**
 * Get lecture detail with assets
 *
 * @param db - LibSQLDatabase instance
 * @param lectureId - Lecture id
 * @param userId - Optional user id to include progress information
 *
 * @returns Promise resolving to lecture detail with assets and progress
 */
export async function getLectureDetail(db: LibSQLDatabase<Record<string, never>>, lectureId: string, userId?: string) {
  // Get lecture detail
  const [lecture] = await db
    .select({
      id: courseLecturesTable.id,
      courseId: courseLecturesTable.courseId,
      sectionId: courseLecturesTable.sectionId,
      type: courseLecturesTable.type,
      title: courseLecturesTable.title,
      description: courseLecturesTable.description,
      durationSeconds: courseLecturesTable.durationSeconds,
      isPreview: courseLecturesTable.isPreview,
      status: courseLecturesTable.status,
      publishedAt: courseLecturesTable.publishedAt,
    })
    .from(courseLecturesTable)
    .where(eq(courseLecturesTable.id, lectureId))
    .limit(1);

  if (!lecture) return null;

  // Get lecture assets
  const assets = await db
    .select({
      id: lectureAssetsTable.id,
      assetType: lectureAssetsTable.assetType,
      url: lectureAssetsTable.url,
      filename: lectureAssetsTable.filename,
      sizeBytes: lectureAssetsTable.sizeBytes,
      metaJson: lectureAssetsTable.metaJson,
    })
    .from(lectureAssetsTable)
    .where(eq(lectureAssetsTable.lectureId, lectureId));

  // Get user progress if userId is provided
  let progress = null;
  if (userId) {
    const [userProgress] = await db
      .select({
        status: lectureProgressTable.status,
        lastPositionSeconds: lectureProgressTable.lastPositionSeconds,
        completedAt: lectureProgressTable.completedAt,
        updatedAt: lectureProgressTable.updatedAt,
      })
      .from(lectureProgressTable)
      .where(and(eq(lectureProgressTable.userId, userId), eq(lectureProgressTable.lectureId, lectureId)))
      .limit(1);

    progress = userProgress || null;
  }

  return {
    ...lecture,
    assets: assets.map((a) => ({
      ...a,
      meta: a.metaJson ? JSON.parse(a.metaJson) : null,
    })),
    progress,
  };
}
