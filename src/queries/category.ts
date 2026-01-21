import { eq, desc, and, isNull } from "drizzle-orm";
import { categoriesTable, coursesTable, usersTable } from "../plugin/database/schema.js";
import { LibSQLDatabase } from "drizzle-orm/libsql";

/**
 * Get course detail by ID or slug
 *
 * @param db - LibSQLDatabase instance
 * @param courseIdentifier - Course ID or slug
 *
 * @returns Course detail object or null
 */
export async function getCourseDetail(db: LibSQLDatabase<Record<string, never>>, courseIdentifier: string) {
  const result = await db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      slug: coursesTable.slug,
      subtitle: coursesTable.subtitle,
      description: coursesTable.description,
      thumbnailUrl: coursesTable.thumbnailUrl,
      promoVideoUrl: coursesTable.promoVideoUrl,
      level: coursesTable.levelId,
      currency: coursesTable.currency,
      priceBase: coursesTable.priceBase,
      priceCurrent: coursesTable.priceCurrent,
      ratingAvg: coursesTable.ratingAvg,
      ratingCount: coursesTable.ratingCount,
      studentCount: coursesTable.studentCount,
      status: coursesTable.status,
      publishedAt: coursesTable.publishedAt,
      createdAt: coursesTable.createdAt,
      updatedAt: coursesTable.updatedAt,
      instructor: {
        id: usersTable.id,
        name: usersTable.name,
        avatar: usersTable.avatar,
        bio: usersTable.bio,
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
    .where(
      courseIdentifier.length === 36 ? eq(coursesTable.id, courseIdentifier) : eq(coursesTable.slug, courseIdentifier),
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get all categories
 *
 * @param db - LibSQLDatabase instance
 * @param parentId - Optional parent category ID (for nested categories)
 *
 * @returns Array of category objects
 */
export async function getCategories(db: LibSQLDatabase<Record<string, never>>, parentId?: string) {
  const query = db.select().from(categoriesTable);

  if (parentId) {
    return await query.where(eq(categoriesTable.parentId, parentId));
  }

  // Get root categories only if parentId not specified
  return await query.where(isNull(categoriesTable.parentId)).orderBy(categoriesTable.sortOrder);
}

/**
 * Get category by ID or slug
 *
 * @param db - LibSQLDatabase instance
 * @param categoryIdentifier - Category ID or slug
 *
 * @returns Category object or null
 */
export async function getCategory(db: LibSQLDatabase<Record<string, never>>, categoryIdentifier: string) {
  const result = await db
    .select()
    .from(categoriesTable)
    .where(
      categoryIdentifier.length === 36
        ? eq(categoriesTable.id, categoryIdentifier)
        : eq(categoriesTable.slug, categoryIdentifier),
    )
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get courses by category
 *
 * @param db - LibSQLDatabase instance
 * @param categoryId - Category ID
 * @param page - Page number (default: 1)
 * @param pageSize - Page size (default: 12)
 *
 * @returns Array of course objects with pagination
 */
export async function getCoursesByCategory(
  db: LibSQLDatabase<Record<string, never>>,
  categoryId: string,
  page: number = 1,
  pageSize: number = 12,
) {
  const offset = (Math.max(1, page) - 1) * Math.min(50, Math.max(1, pageSize));

  return await db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      slug: coursesTable.slug,
      subtitle: coursesTable.subtitle,
      thumbnailUrl: coursesTable.thumbnailUrl,
      priceCurrent: coursesTable.priceCurrent,
      ratingAvg: coursesTable.ratingAvg,
      ratingCount: coursesTable.ratingCount,
      studentCount: coursesTable.studentCount,
      instructor: {
        id: usersTable.id,
        name: usersTable.name,
        avatar: usersTable.avatar,
      },
    })
    .from(coursesTable)
    .leftJoin(usersTable, eq(usersTable.id, coursesTable.instructorId))
    .where(and(eq(coursesTable.categoryId, categoryId), eq(coursesTable.status, "published")))
    .orderBy(desc(coursesTable.publishedAt))
    .limit(Math.min(50, Math.max(1, pageSize)))
    .offset(offset);
}
