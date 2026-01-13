import { tables, useDB } from "../plugin/database/conn.js";
import { eq, and } from "drizzle-orm";
import { UserSchemaStatic } from "../schemas/user.schema.js";

export type FindUserWhere = { username?: string; email?: string; sub?: string };

export async function getUserBy(where: FindUserWhere) {
  const conditions = [];

  if ("username" in where) conditions.push(eq(tables.usersTable.name, where.username!));
  if ("email" in where) conditions.push(eq(tables.usersTable.email, where.email!));
  if ("sub" in where) conditions.push(eq(tables.usersTable.sub, where.sub!));

  if (conditions.length <= 0) return [];

  const row = await useDB()
    .select()
    .from(tables.usersTable)
    .where(conditions.length == 1 ? conditions[0] : and(...conditions))
    .limit(1);

  return row;
}

export async function postUser(user: UserSchemaStatic) {
  const register = await useDB()
    .insert(tables.usersTable)
    .values({
      sub: crypto.randomUUID(),
      name: user.name,
      email: user.email,
      password: await Bun.password.hash(user.password, {
        algorithm: "bcrypt",
      }),
      picture: user.picture,
    })
    .returning()
    .get();

  return register;
}
