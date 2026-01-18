import { tables } from "../plugin/database/client.js";
import { eq, and } from "drizzle-orm";
import { User } from "../schemas/user.schema.js";
import { LibSQLDatabase } from "drizzle-orm/libsql";

export type FindUserWhere = { username?: string; email?: string; id?: string };

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

export async function postUser(db: LibSQLDatabase<Record<string, never>>, user: User) {
  const now = Math.floor(new Date().getTime() / 1000);
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

  return register;
}
