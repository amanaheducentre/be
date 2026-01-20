import { t } from "elysia";
import { ApiResponseSchema } from "./api.schema.js";

export const TagsResponseSchema = t.Intersect([
  ApiResponseSchema,
  t.Object({
    data: t.Array(
      t.Object({
        courseId: t.String(),
        tag: t.String(),
      }),
    ),
  }),
]);

export const TagsQuerySchema = t.Object({
  courseId: t.String(),
});
