import { desc, eq } from "drizzle-orm";
import { coursesTable } from "../plugin/database/schema.js";
import { LibSQLDatabase } from "drizzle-orm/libsql";

/**
 * List courses created by an instructor.
 *
 * @param db - LibSQLDatabase instance
 * @param instructorId - instructor id
 *
 * @returns A promise that resolves to an array of course objects, sorted by updatedAt in descending order.
 *
 * Each course object contains the following properties:
 * - id
 * - title
 * - status
 * - studentCount
 * - ratingAvg
 * - ratingCount
 * - priceCurrent
 * - updatedAt
 */
export async function listInstructorCourses(db: LibSQLDatabase<Record<string, never>>, instructorId: string) {
  return await db
    .select({
      id: coursesTable.id,
      title: coursesTable.title,
      status: coursesTable.status,
      studentCount: coursesTable.studentCount,
      ratingAvg: coursesTable.ratingAvg,
      ratingCount: coursesTable.ratingCount,
      priceCurrent: coursesTable.priceCurrent,
      updatedAt: coursesTable.updatedAt,
    })
    .from(coursesTable)
    .where(eq(coursesTable.instructorId, instructorId))
    .orderBy(desc(coursesTable.updatedAt));
}
