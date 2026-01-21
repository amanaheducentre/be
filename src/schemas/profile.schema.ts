import { t } from "elysia";
import { ApiResponseSchema } from "./api.schema.js";

export const ProfileParamsSchema = t.Object({
  userIdentifier: t.String(),
});

const ProfileDetailSchema = t.Object({
  id: t.String(),
  name: t.String(),
  username: t.Union([t.String(), t.Null()]),
  email: t.String(),
  avatar: t.Union([t.String(), t.Null()]),
  bio: t.Union([t.String(), t.Null()]),
  phone: t.Union([t.String(), t.Null()]),
  location: t.Union([t.String(), t.Null()]),
  createdAt: t.Number(),
});

export const ProfileResponseSchema = t.Intersect([
  ApiResponseSchema,
  t.Object({
    data: ProfileDetailSchema,
  }),
]);
