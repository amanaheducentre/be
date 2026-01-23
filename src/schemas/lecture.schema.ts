import { t } from "elysia";

// Lecture Progress Schema
export const LectureProgressSchema = t.Object({
  status: t.Union([t.Literal("not_started"), t.Literal("in_progress"), t.Literal("completed")]),
  lastPositionSeconds: t.Number(),
  completedAt: t.Union([t.Number(), t.Null()]),
});

// Lecture Item Schema
export const LectureItemSchema = t.Object({
  id: t.String(),
  sectionId: t.String(),
  type: t.Union([t.Literal("video"), t.Literal("quiz"), t.Literal("article")]),
  title: t.String(),
  description: t.Union([t.String(), t.Null()]),
  durationSeconds: t.Union([t.Number(), t.Null()]),
  isPreview: t.Boolean(),
  sortOrder: t.Number(),
  status: t.Union([t.Literal("draft"), t.Literal("published"), t.Literal("archived")]),
  progress: t.Union([LectureProgressSchema, t.Null()]),
});

// Section with Lectures Schema
export const SectionWithLecturesSchema = t.Object({
  id: t.String(),
  title: t.String(),
  sortOrder: t.Number(),
  lectures: t.Array(LectureItemSchema),
  lectureCount: t.Number(),
  totalDuration: t.Number(),
});

// Lecture Asset Schema
export const LectureAssetSchema = t.Object({
  id: t.String(),
  assetType: t.Union([t.Literal("video"), t.Literal("pdf"), t.Literal("code"), t.Literal("document")]),
  url: t.String(),
  filename: t.Union([t.String(), t.Null()]),
  sizeBytes: t.Union([t.Number(), t.Null()]),
  meta: t.Any(), // JSON field for additional metadata
});

// Next/Prev Lecture Schema
export const NextPrevLectureSchema = t.Object({
  id: t.String(),
  title: t.String(),
  type: t.Union([t.Literal("video"), t.Literal("quiz"), t.Literal("article")]),
});

// Lecture Detail Schema
export const LectureDetailSchema = t.Object({
  id: t.String(),
  courseId: t.String(),
  sectionId: t.String(),
  type: t.Union([t.Literal("video"), t.Literal("quiz"), t.Literal("article")]),
  title: t.String(),
  description: t.Union([t.String(), t.Null()]),
  durationSeconds: t.Union([t.Number(), t.Null()]),
  isPreview: t.Boolean(),
  status: t.Union([t.Literal("draft"), t.Literal("published"), t.Literal("archived")]),
  publishedAt: t.Union([t.Number(), t.Null()]),
  assets: t.Array(LectureAssetSchema),
  progress: t.Union([
    t.Object({
      status: t.Union([t.Literal("not_started"), t.Literal("in_progress"), t.Literal("completed")]),
      lastPositionSeconds: t.Number(),
      completedAt: t.Union([t.Number(), t.Null()]),
      updatedAt: t.Number(),
    }),
    t.Null(),
  ]),
  nextLecture: t.Union([NextPrevLectureSchema, t.Null()]),
  prevLecture: t.Union([NextPrevLectureSchema, t.Null()]),
});

// Request Schemas

// Get Course Curriculum Params
export const CourseCurriculumParamsSchema = t.Object({
  courseIdentifier: t.String(),
});

// Get Lecture Detail Params
export const LectureDetailParamsSchema = t.Object({
  lectureId: t.String(),
});

// Response Schemas

// Course Curriculum Response
export const CourseCurriculumResponseSchema = t.Object({
  ok: t.Boolean(),
  status: t.Number(),
  message: t.String(),
  data: t.Array(SectionWithLecturesSchema),
});

// Lecture Detail Response
export const LectureDetailResponseSchema = t.Object({
  ok: t.Boolean(),
  status: t.Number(),
  message: t.String(),
  data: LectureDetailSchema,
});
