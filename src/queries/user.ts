import { tables } from "../plugin/database/client.js";
import { eq, and } from "drizzle-orm";
import { User } from "../schemas/user.schema.js";
import { LibSQLDatabase } from "drizzle-orm/libsql";

export type FindUserWhere = { username?: string; email?: string; id?: string };

/**
 * Find a user by given conditions
 * @param {LibSQLDatabase<Record<string, never>>} db - The database to query
 * @param {FindUserWhere} where - The conditions to search for the user
 * @returns {Promise<User[]>} - An array of users matching the conditions
 */
export async function getUserBy(db: LibSQLDatabase<Record<string, never>>, where: FindUserWhere) {
  const conditions = [];

  if ("username" in where) conditions.push(eq(tables.usersTable.name, where.username!));
  if ("email" in where) conditions.push(eq(tables.usersTable.email, where.email!));
  if ("id" in where) conditions.push(eq(tables.usersTable.id, where.id!));

  if (conditions.length <= 0) return [];

  const row = await db
    .select()
    .from(tables.usersTable)
    .where(conditions.length == 1 ? conditions[0] : and(...conditions))
    .limit(1);

  return row;
}

/**
 * Register a new user
 * @param {LibSQLDatabase<Record<string, never>>} db - The database to query
 * @param {User} user - The user to register
 * @returns {Promise<User>} - The registered user
 */
export async function postUser(db: LibSQLDatabase<Record<string, never>>, user: User) {
  const now = Math.floor(Date.now() / 1000);
  const register = await db
    .insert(tables.usersTable)
    .values({
      id: crypto.randomUUID(),
      name: user.name,
      email: user.email,
      password: await Bun.password.hash(user.password, {
        algorithm: "bcrypt",
      }),
      avatar: user.avatar,
      status: "active",
      createdAt: now,
      updatedAt: now,
    })
    .returning()
    .get();

  // Get the "student" role ID
  const studentRole = await db
    .select()
    .from(tables.rolesTable)
    .where(eq(tables.rolesTable.name, "student"))
    .limit(1)
    .get();

  // If student role exists, assign it to the new user
  if (studentRole) {
    await db.insert(tables.userRolesTable).values({
      userId: register.id,
      roleId: studentRole.id,
      createdAt: now,
    });
  }

  return register;
}
