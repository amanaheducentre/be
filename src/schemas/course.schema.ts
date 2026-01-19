import { t } from "elysia";
import { listCourses } from "../queries/course.js";
import { ApiResponseSchema } from "./api.schema.js";

export type CourseList = Awaited<ReturnType<typeof listCourses>>;

const InstructorSchema = t.Object({
  id: t.String(),
  name: t.String(),
  avatar: t.Union([t.String(), t.Null()]),
});

const CategorySchema = t.Object({
  id: t.String(),
  name: t.String(),
  slug: t.String(),
});

const CourseItemSchema = t.Object({
  id: t.String(),
  title: t.String(),
  slug: t.String(),
  subtitle: t.Union([t.String(), t.Null()]),
  thumbnailUrl: t.Union([t.String(), t.Null()]),
  promoVideoUrl: t.Union([t.String(), t.Null()]),
  currency: t.String(),
  priceCurrent: t.Number(),
  ratingAvg: t.Number(),
  ratingCount: t.Number(),
  studentCount: t.Number(),
  instructor: t.Union([InstructorSchema, t.Null()]),
  category: t.Union([CategorySchema, t.Null()]),
});

const CourseListSchema = t.Object({
  page: t.Number(),
  pageSize: t.Number(),
  total: t.Number(),
  items: t.Array(CourseItemSchema),
});

export const CourseListResponseSchema = t.Intersect([
  ApiResponseSchema,
  t.Object({
    data: CourseListSchema,
  }),
]);
