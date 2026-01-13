import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export const usersTable = sqliteTable("users_table", {
  sub: text("sub").primaryKey(),
  name: text("name").notNull(),
  username: text("username"),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  picture: text("picture"),
  role: text("role").notNull().default("user"), // user | admin
});
