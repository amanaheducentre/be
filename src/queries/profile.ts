import { eq, desc, and } from "drizzle-orm";
import { usersTable, coursesTable } from "../plugin/database/schema.js";
import { LibSQLDatabase } from "drizzle-orm/libsql";

/**
 * Get user detail by ID or username
 *
 * @param db - LibSQLDatabase instance
 * @param userIdentifier - User ID or username
 *
 * @returns User detail object (without password) or null
 */
export async function getUserDetail(db: LibSQLDatabase<Record<string, never>>, userIdentifier: string) {
  const result = await db
    .select({
      id: usersTable.id,
      name: usersTable.name,
      username: usersTable.username,
      email: usersTable.email,
      avatar: usersTable.avatar,
      bio: usersTable.bio,
      phone: usersTable.phone,
      location: usersTable.location,
      createdAt: usersTable.createdAt,
    })
    .from(usersTable)
    .where(userIdentifier.length === 36 ? eq(usersTable.id, userIdentifier) : eq(usersTable.username, userIdentifier))
    .limit(1);

  return result.length > 0 ? result[0] : null;
}

/**
 * Get list of instructors (users who have created courses)
 *
 * @param db - LibSQLDatabase instance
 * @param page - Page number (default: 1)
 * @param pageSize - Page size (default: 12)
 *
 * @returns Array of instructor objects with stats
 */
export async function getInstructors(
  db: LibSQLDatabase<Record<string, never>>,
  page: number = 1,
  pageSize: number = 12,
) {
  const offset = (Math.max(1, page) - 1) * Math.min(50, Math.max(1, pageSize));

  // Get users who are instructors (have created courses)
  return await db
    .selectDistinct({
      id: usersTable.id,
      name: usersTable.name,
      username: usersTable.username,
      avatar: usersTable.avatar,
      bio: usersTable.bio,
      courseCount: coursesTable.id,
    })
    .from(usersTable)
    .leftJoin(coursesTable, eq(coursesTable.instructorId, usersTable.id))
    .where(eq(coursesTable.status, "published"))
    .orderBy(desc(usersTable.createdAt))
    .limit(Math.min(50, Math.max(1, pageSize)))
    .offset(offset);
}

/**
 * Get instructor detail with their courses
 *
 * @param db - LibSQLDatabase instance
 * @param instructorIdentifier - Instructor ID or username
 *
 * @returns Instructor object with courses array or null
 */
export async function getInstructorDetail(db: LibSQLDatabase<Record<string, never>>, instructorIdentifier: string) {
  // Get instructor detail
  const instructor = await getUserDetail(db, instructorIdentifier);

  if (!instructor) return null;

  // Get instructor's courses
  const courses = await db
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
      publishedAt: coursesTable.publishedAt,
    })
    .from(coursesTable)
    .where(and(eq(coursesTable.instructorId, instructor.id), eq(coursesTable.status, "published")))
    .orderBy(desc(coursesTable.publishedAt));

  return {
    ...instructor,
    courses,
    courseCount: courses.length,
  };
}
