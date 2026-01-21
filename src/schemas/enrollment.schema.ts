import { t } from "elysia";
import { ApiResponseSchema } from "./api.schema.js";

export const EnrollmentCheckParamsSchema = t.Object({
  courseIdentifier: t.String(),
});

const EnrollmentItemSchema = t.Object({
  enrollmentId: t.String(),
  enrolledAt: t.Number(),
  courseId: t.Union([t.String(), t.Null()]),
  courseTitle: t.Union([t.String(), t.Null()]),
  courseSlug: t.Union([t.String(), t.Null()]),
  courseSubtitle: t.Union([t.String(), t.Null()]),
  courseThumbnailUrl: t.Union([t.String(), t.Null()]),
  coursePriceCurrent: t.Union([t.Number(), t.Null()]),
  courseRatingAvg: t.Union([t.Number(), t.Null()]),
  courseRatingCount: t.Union([t.Number(), t.Null()]),
  instructorId: t.Union([t.String(), t.Null()]),
  instructorName: t.Union([t.String(), t.Null()]),
  instructorAvatar: t.Union([t.String(), t.Null()]),
});

export const EnrollmentListResponseSchema = t.Intersect([
  ApiResponseSchema,
  t.Object({
    data: t.Array(EnrollmentItemSchema),
  }),
]);

export const EnrollmentCheckResponseSchema = t.Intersect([
  ApiResponseSchema,
  t.Object({
    data: t.Object({
      enrolled: t.Boolean(),
    }),
  }),
]);
