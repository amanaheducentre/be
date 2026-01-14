import { t } from "elysia";

export const ApiErrorSchema = t.Object({
  code: t.Number(),
  message: t.String(),
});

export const ApiResponseSchema = t.Object({
  ok: t.Boolean(),
  status: t.Number(),
  message: t.String(),
  data: t.Optional(t.Unknown()),
  errors: t.Optional(t.Array(ApiErrorSchema)),
  meta: t.Optional(t.Record(t.String(), t.Unknown())),
});

export const ApiHeaderSchema = t.Object({
  authorization: t.String({ examples: ["Bearer ey1234567890"] }),
  "content-type": t.Optional(t.String({ default: "application/json" })),
});

export type ApiResponseBase = typeof ApiResponseSchema.static;

export type ApiError = typeof ApiErrorSchema.static;
export type ApiHeader = typeof ApiHeaderSchema.static;
export type ApiResponse<T = unknown> = Omit<ApiResponseBase, "data"> & { data?: T };
