import { t } from "elysia";
import { ApiResponseSchema } from "./api.schema.js";

export const UserSchema = t.Object({
  id: t.Optional(t.String()),
  name: t.String(),
  username: t.Optional(t.Union([t.String({ minLength: 6 }), t.Null()])),
  email: t.String({ format: "email" }),
  password: t.String({ minLength: 8 }),
  avatar: t.Optional(t.Union([t.String(), t.Null()])),
  bio: t.Optional(t.String()),
  phone: t.Optional(t.String()),
  location: t.Optional(t.String()),
  status: t.Union([t.Literal("active"), t.Literal("banned")]),
});

export const UserResponseSchema = t.Intersect([
  ApiResponseSchema,
  t.Object({
    data: UserSchema,
  }),
]);

export const UserCheckResponseSchema = t.Intersect([
  ApiResponseSchema,
  t.Object({
    data: t.Object({
      registered: t.Boolean(),
    }),
  }),
]);

export type User = typeof UserSchema.static;
export type UserCheck = typeof UserCheckResponseSchema.static;
