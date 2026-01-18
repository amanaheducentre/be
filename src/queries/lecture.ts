import { and, eq, sql } from "drizzle-orm";
import { courseLecturesTable, lectureProgressTable, courseProgressSnapshotTable } from "../plugin/database/schema.js";
import { LibSQLDatabase } from "drizzle-orm/libsql";

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
