import { and, eq, sql } from "drizzle-orm";
import { courseLecturesTable, lectureProgressTable, courseProgressSnapshotTable } from "../plugin/database/schema.js";
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
