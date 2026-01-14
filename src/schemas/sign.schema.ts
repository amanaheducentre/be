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
