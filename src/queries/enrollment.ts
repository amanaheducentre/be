import { eq, desc, and } from "drizzle-orm";
import { enrollmentsTable, coursesTable, usersTable } from "../plugin/database/schema.js";
import { LibSQLDatabase } from "drizzle-orm/libsql";

/**
 * Get user enrollments (courses they are taking)
 *
 * @param db - LibSQLDatabase instance
 * @param userId - User id
 * @param page - Page number (default: 1)
 * @param pageSize - Page size (default: 12)
 *
 * @returns Array of course objects with enrollment info
 */
export async function getUserEnrollments(
  db: LibSQLDatabase<Record<string, never>>,
  userId: string,
  page: number = 1,
  pageSize: number = 12,
) {
  const offset = (Math.max(1, page) - 1) * Math.min(50, Math.max(1, pageSize));

  return await db
    .select({
      enrollmentId: enrollmentsTable.id,
      enrolledAt: enrollmentsTable.enrolledAt,
      courseId: coursesTable.id,
      courseTitle: coursesTable.title,
      courseSlug: coursesTable.slug,
      courseSubtitle: coursesTable.subtitle,
      courseThumbnailUrl: coursesTable.thumbnailUrl,
      coursePriceCurrent: coursesTable.priceCurrent,
      courseRatingAvg: coursesTable.ratingAvg,
      courseRatingCount: coursesTable.ratingCount,
      instructorId: usersTable.id,
      instructorName: usersTable.name,
      instructorAvatar: usersTable.avatar,
    })
    .from(enrollmentsTable)
    .leftJoin(coursesTable, eq(coursesTable.id, enrollmentsTable.courseId))
    .leftJoin(usersTable, eq(usersTable.id, coursesTable.instructorId))
    .where(eq(enrollmentsTable.userId, userId))
    .orderBy(desc(enrollmentsTable.enrolledAt))
    .limit(Math.min(50, Math.max(1, pageSize)))
    .offset(offset);
}

/**
 * Check if user is enrolled in a course
 *
 * @param db - LibSQLDatabase instance
 * @param userId - User id
 * @param courseId - Course id
 *
 * @returns true if enrolled, false otherwise
 */
export async function isUserEnrolled(db: LibSQLDatabase<Record<string, never>>, userId: string, courseId: string) {
  const enrollment = await db
    .select()
    .from(enrollmentsTable)
    .where(and(eq(enrollmentsTable.userId, userId), eq(enrollmentsTable.courseId, courseId)))
    .limit(1);

  return enrollment.length > 0;
}
