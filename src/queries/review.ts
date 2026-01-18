import { and, eq, sql } from "drizzle-orm";
import { coursesTable, courseReviewsTable } from "../plugin/database/schema.js";
import { LibSQLDatabase } from "drizzle-orm/libsql";

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
      isPublic: 1,
      isFlagged: 0,
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

export async function recomputeCourseRating(db: LibSQLDatabase<Record<string, never>>, courseId: string) {
  const [agg] = await db
    .select({
      ratingCount: sql<number>`count(*)`,
      ratingAvg: sql<number>`coalesce(avg(${courseReviewsTable.rating}), 0)`,
    })
    .from(courseReviewsTable)
    .where(and(eq(courseReviewsTable.courseId, courseId), eq(courseReviewsTable.isPublic, 1)));

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
