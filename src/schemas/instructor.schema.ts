import { t } from "elysia";
import { ApiResponseSchema } from "./api.schema.js";

export const InstructorListQuerySchema = t.Object({
  page: t.Optional(t.String()),
  pageSize: t.Optional(t.String()),
});

export const InstructorParamsSchema = t.Object({
  instructorIdentifier: t.String(),
});

export const InstructorCoursesParamsSchema = t.Object({
  instructorIdentifier: t.String(),
});

const InstructorItemSchema = t.Object({
  id: t.String(),
  name: t.String(),
  username: t.Union([t.String(), t.Null()]),
  avatar: t.Union([t.String(), t.Null()]),
  bio: t.Union([t.String(), t.Null()]),
  courseCount: t.Union([t.String(), t.Null()]),
});

const InstructorCourseSchema = t.Object({
  id: t.String(),
  title: t.String(),
  slug: t.String(),
  subtitle: t.Union([t.String(), t.Null()]),
  thumbnailUrl: t.Union([t.String(), t.Null()]),
  priceCurrent: t.Number(),
  ratingAvg: t.Number(),
  ratingCount: t.Number(),
  studentCount: t.Number(),
  publishedAt: t.Union([t.Number(), t.Null()]),
});

const InstructorDetailSchema = t.Object({
  id: t.String(),
  name: t.String(),
  username: t.Union([t.String(), t.Null()]),
  email: t.String(),
  avatar: t.Union([t.String(), t.Null()]),
  bio: t.Union([t.String(), t.Null()]),
  phone: t.Union([t.String(), t.Null()]),
  location: t.Union([t.String(), t.Null()]),
  createdAt: t.Number(),
  courses: t.Array(InstructorCourseSchema),
  courseCount: t.Number(),
});

const InstructorCourseItemSchema = t.Object({
  id: t.String(),
  title: t.String(),
  status: t.String(),
  studentCount: t.Number(),
  ratingAvg: t.Number(),
  ratingCount: t.Number(),
  priceCurrent: t.Number(),
  updatedAt: t.Number(),
});

export const InstructorListResponseSchema = t.Intersect([
  ApiResponseSchema,
  t.Object({
    data: t.Array(InstructorItemSchema),
  }),
]);

export const InstructorDetailResponseSchema = t.Intersect([
  ApiResponseSchema,
  t.Object({
    data: InstructorDetailSchema,
  }),
]);

export const InstructorCoursesResponseSchema = t.Intersect([
  ApiResponseSchema,
  t.Object({
    data: t.Array(InstructorCourseItemSchema),
  }),
]);
