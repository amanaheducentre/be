import { and, eq, sql } from "drizzle-orm";
import { coursesTable, courseReviewsTable } from "../plugin/database/schema.js";
import { LibSQLDatabase } from "drizzle-orm/libsql";

/**
 * Upsert a course review into the database.
 * If the review already exists, it will be updated.
 * If the review does not exist, it will be inserted.
 *
 * @param db - LibSQLDatabase instance
 * @param input - Object containing:
 * - id: Review id
 * - userId: User id
 * - courseId: Course id
 * - rating: Rating (1..5)
 * - title: Review title (optional)
 * - body: Review body (optional)
 *
 * @returns true if successful, otherwise false
 */
export async function upsertCourseReview(
  db: LibSQLDatabase<Record<string, never>>,
  input: {
    id: string;
    userId: string;
    courseId: string;
    rating: number; // 1..5
    title?: string | null;
    body?: string | null;
  },
) {
  const now = Math.floor(Date.now() / 1000);

  // upsert review
  await db
    .insert(courseReviewsTable)
    .values({
      id: input.id,
      userId: input.userId,
      courseId: input.courseId,
      rating: Math.max(1, Math.min(5, Math.floor(input.rating))),
      title: input.title ?? null,
      body: input.body ?? null,
      isPublic: true,
      isFlagged: false,
      createdAt: now,
      updatedAt: now,
    })
    .onConflictDoUpdate({
      target: [courseReviewsTable.userId, courseReviewsTable.courseId],
      set: {
        rating: Math.max(1, Math.min(5, Math.floor(input.rating))),
        title: input.title ?? null,
        body: input.body ?? null,
        updatedAt: now,
      },
    });

  // recompute rating
  await recomputeCourseRating(db, input.courseId);

  return true;
}

/**
 * Recompute the rating of a course based on its public reviews.
 *
 * @param db - LibSQLDatabase instance
 * @param courseId - Course id
 *
 * @returns An object containing the recomputed rating count and average rating.
 */
export async function recomputeCourseRating(db: LibSQLDatabase<Record<string, never>>, courseId: string) {
  const [agg] = await db
    .select({
      ratingCount: sql<number>`count(*)`,
      ratingAvg: sql<number>`coalesce(avg(${courseReviewsTable.rating}), 0)`,
    })
    .from(courseReviewsTable)
    .where(and(eq(courseReviewsTable.courseId, courseId), eq(courseReviewsTable.isPublic, true)));

  await db
    .update(coursesTable)
    .set({
      ratingCount: agg?.ratingCount ?? 0,
      ratingAvg: agg?.ratingAvg ?? 0,
      updatedAt: Math.floor(Date.now() / 1000),
    })
    .where(eq(coursesTable.id, courseId));

  return agg;
}
