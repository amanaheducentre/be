import { t } from "elysia";
import { ApiResponseSchema } from "./api.schema.js";

export const SignResponseSchema = t.Intersect([
  ApiResponseSchema,
  t.Object({
    data: t.Object({
      token: t.String(),
    }),
  }),
]);

export const CheckBodySchema = t.Object({
  id: t.Optional(t.String({ format: "uuid" })),
  username: t.Optional(t.String()),
  email: t.Optional(t.String()),
});

export const SignBodySchema = t.Object({
  type: t.Union([t.Literal("local"), t.Literal("sso")]),
  provider: t.Optional(t.String()),
  id: t.Optional(t.String({ format: "uuid" })),
  username: t.Optional(t.String()),
  email: t.Optional(t.String()),
  token: t.Optional(t.String()),
  password: t.Optional(t.String({ minLength: 8 })),
});
