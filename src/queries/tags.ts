import { or, eq } from "drizzle-orm";
import { courseTagsTable } from "../plugin/database/schema.js";
import { LibSQLDatabase } from "drizzle-orm/libsql";

/**
 * Get course tags for the given course ids.
 *
 * @param db - LibSQLDatabase instance
 * @param courseIds - Array of course ids
 *
 * @returns A promise that resolves to an array of course tags.
 */
export async function getCoursesTags(db: LibSQLDatabase<Record<string, never>>, courseIds: string[]) {
  const whereParts = courseIds.map((courseId) => eq(courseTagsTable.courseId, courseId));
  return await db
    .select()
    .from(courseTagsTable)
    .where(or(...whereParts));
}
