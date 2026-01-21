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

export const CourseListQuerySchema = t.Object({
  page: t.Optional(t.String()),
  pageSize: t.Optional(t.String()),
  q: t.Optional(t.String()),
  categoryId: t.Optional(t.String()),
});

export const CourseDetailParamsSchema = t.Object({
  courseIdentifier: t.String(),
});

export const CourseReviewsQuerySchema = t.Object({
  page: t.Optional(t.String()),
  pageSize: t.Optional(t.String()),
});

const CourseDetailSchema = t.Object({
  id: t.String(),
  title: t.String(),
  slug: t.String(),
  subtitle: t.Union([t.String(), t.Null()]),
  description: t.Union([t.String(), t.Null()]),
  thumbnailUrl: t.Union([t.String(), t.Null()]),
  promoVideoUrl: t.Union([t.String(), t.Null()]),
  level: t.Union([t.String(), t.Null()]),
  currency: t.String(),
  priceBase: t.Number(),
  priceCurrent: t.Number(),
  ratingAvg: t.Number(),
  ratingCount: t.Number(),
  studentCount: t.Number(),
  status: t.String(),
  publishedAt: t.Union([t.Number(), t.Null()]),
  createdAt: t.Number(),
  updatedAt: t.Number(),
  instructor: t.Union([
    t.Object({
      id: t.String(),
      name: t.String(),
      avatar: t.Union([t.String(), t.Null()]),
      bio: t.Union([t.String(), t.Null()]),
    }),
    t.Null(),
  ]),
  category: t.Union([
    t.Object({
      id: t.String(),
      name: t.String(),
      slug: t.String(),
    }),
    t.Null(),
  ]),
});

const ReviewerSchema = t.Object({
  id: t.String(),
  name: t.String(),
  avatar: t.Union([t.String(), t.Null()]),
});

const ReviewItemSchema = t.Object({
  id: t.String(),
  rating: t.Number(),
  title: t.Union([t.String(), t.Null()]),
  body: t.Union([t.String(), t.Null()]),
  createdAt: t.Number(),
  reviewer: t.Union([ReviewerSchema, t.Null()]),
});

export const CourseDetailResponseSchema = t.Intersect([
  ApiResponseSchema,
  t.Object({
    data: CourseDetailSchema,
  }),
]);

export const CourseReviewsResponseSchema = t.Intersect([
  ApiResponseSchema,
  t.Object({
    data: t.Object({
      data: t.Array(ReviewItemSchema),
    }),
  }),
]);
