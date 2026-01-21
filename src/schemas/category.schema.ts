import { t } from "elysia";
import { ApiResponseSchema } from "./api.schema.js";

export const CategoryQuerySchema = t.Object({
  parentId: t.Optional(t.String()),
});

export const CategoryParamsSchema = t.Object({
  categoryIdentifier: t.String(),
});

export const CategoryCoursesParamsSchema = t.Object({
  categoryIdentifier: t.String(),
});

export const CategoryCoursesQuerySchema = t.Object({
  page: t.Optional(t.String()),
  pageSize: t.Optional(t.String()),
});

const CategorySchema = t.Object({
  id: t.String(),
  parentId: t.Union([t.String(), t.Null()]),
  name: t.String(),
  slug: t.String(),
  sortOrder: t.Number(),
});

const CourseInstructorSchema = t.Object({
  id: t.String(),
  name: t.String(),
  avatar: t.Union([t.String(), t.Null()]),
});

const CategoryCourseItemSchema = t.Object({
  id: t.String(),
  title: t.String(),
  slug: t.String(),
  subtitle: t.Union([t.String(), t.Null()]),
  thumbnailUrl: t.Union([t.String(), t.Null()]),
  priceCurrent: t.Number(),
  ratingAvg: t.Number(),
  ratingCount: t.Number(),
  studentCount: t.Number(),
  instructor: t.Union([CourseInstructorSchema, t.Null()]),
});

export const CategoryResponseSchema = t.Intersect([
  ApiResponseSchema,
  t.Object({
    data: CategorySchema,
  }),
]);

export const CategoryListResponseSchema = t.Intersect([
  ApiResponseSchema,
  t.Object({
    data: t.Array(CategorySchema),
  }),
]);

export const CategoryCoursesResponseSchema = t.Intersect([
  ApiResponseSchema,
  t.Object({
    data: t.Array(CategoryCourseItemSchema),
  }),
]);
