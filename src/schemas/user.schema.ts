import { t } from "elysia";

export const UserSchema = t.Object({
  sub: t.Optional(t.String()),
  name: t.String(),
  username: t.Optional(t.Union([t.String({ minLength: 6 }), t.Null()])),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
  picture: t.Optional(t.Union([t.String(), t.Null()])),
  role: t.Optional(t.String()),
});

export type UserSchemaStatic = typeof UserSchema.static;
