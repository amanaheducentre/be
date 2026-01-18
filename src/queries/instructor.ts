import { desc, eq } from "drizzle-orm";
import { coursesTable } from "../plugin/database/schema.js";
import { LibSQLDatabase } from "drizzle-orm/libsql";

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
