import "dotenv/config";
import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { openapi } from "@elysiajs/openapi";
import { fail, ok } from "./utils/response.js";
import { logger } from "@bogeychan/elysia-logger";
import { getUserBy, postUser } from "./queries/user.js";
import { User, UserCheckResponseSchema, UserResponseSchema, UserSchema } from "./schemas/user.schema.js";
import { ApiError, ApiHeaderSchema, ApiResponseSchema } from "./schemas/api.schema.js";
import { CheckBodySchema, SignBodySchema, SignResponseSchema } from "./schemas/sign.schema.js";
import { CourseListResponseSchema } from "./schemas/course.schema.js";
import { verifyGoogleIdToken } from "./utils/google.js";
import { useDB } from "./plugin/database/client.js";
import { listCourses } from "./queries/course.js";
import { getCoursesTags } from "./queries/tags.js";
import { TagsQuerySchema, TagsResponseSchema } from "./schemas/tag.schema.js";
import { getCourseDetail, getCategories, getCategory, getCoursesByCategory } from "./queries/category.js";
import { getUserDetail, getInstructors, getInstructorDetail } from "./queries/profile.js";
import { getUserEnrollments, isUserEnrolled } from "./queries/enrollment.js";
import { listInstructorCourses } from "./queries/instructor.js";
import { getCourseCurriculum, getLectureDetail } from "./queries/lecture.js";
import {
  CategoryQuerySchema,
  CategoryParamsSchema,
  CategoryCoursesParamsSchema,
  CategoryCoursesQuerySchema,
  CategoryResponseSchema,
  CategoryListResponseSchema,
  CategoryCoursesResponseSchema,
} from "./schemas/category.schema.js";
import {
  InstructorListQuerySchema,
  InstructorParamsSchema,
  InstructorCoursesParamsSchema,
  InstructorListResponseSchema,
  InstructorDetailResponseSchema,
  InstructorCoursesResponseSchema,
} from "./schemas/instructor.schema.js";
import {
  EnrollmentCheckParamsSchema,
  EnrollmentListResponseSchema,
  EnrollmentCheckResponseSchema,
} from "./schemas/enrollment.schema.js";
import { ProfileParamsSchema, ProfileResponseSchema } from "./schemas/profile.schema.js";
import {
  CourseListQuerySchema,
  CourseDetailParamsSchema,
  CourseReviewsQuerySchema,
  CourseDetailResponseSchema,
  CourseReviewsResponseSchema,
} from "./schemas/course.schema.js";
import {
  CourseCurriculumParamsSchema,
  LectureDetailParamsSchema,
  CourseCurriculumResponseSchema,
  LectureDetailResponseSchema,
} from "./schemas/lecture.schema.js";

const app = new Elysia()
  .use(logger())
  .use(openapi())
  .use(
    jwt({
      name: "jwt",
      secret: "pR1as0LoITul4GI",
    }),
  )

  // Errors pool
  .derive(() => {
    const errors: ApiError[] = [];
    const addError = (e: ApiError) => {
      errors.push(e);
    };
    const hasError = () => errors.length > 0;

    return {
      errors,
      addError,
      hasError,
    };
  })

  // Build database connection
  .derive(() => {
    const dbClient = useDB();

    return {
      db: dbClient,
    };
  })

  .onAfterHandle(({ errors, hasError, set }) => {
    if (hasError()) {
      set.status = errors[0].code;
      return fail(errors[0].code, errors);
    }
  })

  .onError(({ error, code }) => {
    const statusCode = typeof code == "number" ? code : 500;
    return fail(statusCode, [
      {
        code: statusCode,
        message: error.toString(),
      },
    ]);
  })

  .get(
    "/",
    () => {
      return ok({ hello: "from elysia" });
    },
    {
      response: ApiResponseSchema,
    },
  )

  // SIGN IN
  .post(
    "/sign",
    async ({ jwt, body, addError, db }) => {
      let token = "";

      if (body.type == "sso") {
        switch (body.provider) {
          case "google":
            const gAuth = await verifyGoogleIdToken(body.token!);
            body = {
              ...body,
              email: gAuth.email,
            };
            break;
          default:
            addError({
              code: 401,
              message: "Invalid sso provider",
            });
        }
      }

      const user = await getUserBy(db, body);

      if (user.length <= 0) {
        addError({
          code: 400,
          message: "User not found",
        });
      } else {
        const auth = user[0];

        // Verify password if login type is local
        if (body.type == "local") {
          const isVerified = await Bun.password.verify(body.password!, auth.password!, "bcrypt");
          if (!isVerified) {
            addError({
              code: 401,
              message: "Invalid credentials",
            });
          }
        }

        token = await jwt.sign({ sub: auth.id });
      }

      return ok({ token });
    },
    {
      body: SignBodySchema,
      response: SignResponseSchema,
      detail: {
        summary: "Sign in",
      },
    },
  )

  // USERS
  .group("/user", (app) =>
    app
      // CHECK
      .post(
        "/check",
        async ({ body, db }) => {
          const user = await getUserBy(db, body);

          return ok({
            registered: user.length > 0,
          });
        },
        {
          body: CheckBodySchema,
          response: UserCheckResponseSchema,
          detail: {
            summary: "Check user status",
          },
        },
      )

      // REGISTER
      .post(
        "/register",
        async ({ body, addError, db }) => {
          try {
            const user = await postUser(db, body);
            return ok(user);
          } catch (e: any) {
            addError({
              code: 500,
              message: "Internal server error",
            });
            return ok({} as User);
          }
        },
        {
          body: UserSchema,
          response: UserResponseSchema,
          detail: {
            summary: "Register user",
          },
        },
      )

      // PROFILE
      .get(
        "/profile",
        async ({ jwt, headers: { authorization }, addError, db }) => {
          const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : authorization;

          if (!token) {
            addError({
              code: 401,
              message: "Missing Authorization header",
            });
          }

          const user = await jwt.verify(token);
          if (!user) {
            addError({
              code: 401,
              message: "Invalid token",
            });

            return ok({} as User);
          }

          const profile = await getUserBy(db, { id: user.sub });
          if (profile.length <= 0) {
            addError({
              code: 404,
              message: "Profile not found",
            });
          }

          return ok(profile[0]);
        },
        {
          headers: ApiHeaderSchema,
          response: UserResponseSchema,
          detail: {
            summary: "Get current user profile",
          },
        },
      ),
  )

  // COURSES
  .group("/course", (app) =>
    app
      .get(
        "/list",
        async ({ query, addError, db }) => {
          const course = await listCourses(db, {
            page: query.page ? parseInt(query.page as string) : 1,
            pageSize: query.pageSize ? parseInt(query.pageSize as string) : 12,
            q: query.q as string | undefined,
            categoryId: query.categoryId as string | undefined,
            status: "published",
          });
          if (!course) {
            addError({
              code: 404,
              message: "Course not found",
            });
          }
          return ok(course);
        },
        {
          query: CourseListQuerySchema,
          response: CourseListResponseSchema,
          detail: {
            summary: "Get list of courses",
            tags: ["Courses"],
          },
        },
      )
      .get(
        "/:courseIdentifier",
        async ({ params: { courseIdentifier }, addError, db }) => {
          const course = await getCourseDetail(db, courseIdentifier);
          if (!course) {
            addError({
              code: 404,
              message: "Course not found",
            });
            return ok({} as any);
          }
          return ok(course);
        },
        {
          params: CourseDetailParamsSchema,
          response: CourseDetailResponseSchema,
          detail: {
            summary: "Get course detail by ID or slug",
            tags: ["Courses"],
          },
        },
      )
      .get(
        "/tags",
        async ({ query, addError, db }) => {
          const courseIds = query.courseId.split(",");
          const tags = await getCoursesTags(db, courseIds);
          if (!tags) {
            addError({
              code: 404,
              message: "Course not found",
            });
          }
          return ok(tags);
        },
        {
          query: TagsQuerySchema,
          response: TagsResponseSchema,
          detail: {
            summary: "Get course tags",
            tags: ["Courses"],
          },
        },
      )
      .get(
        "/:courseIdentifier/reviews",
        async ({ params: { courseIdentifier }, query, addError, db }) => {
          // First verify course exists
          const course = await getCourseDetail(db, courseIdentifier);
          if (!course) {
            addError({
              code: 404,
              message: "Course not found",
            });
            return ok({ data: [] });
          }

          // Import here to avoid circular dependency
          const { getCourseReviews } = await import("./queries/review.js");
          const reviews = await getCourseReviews(
            db,
            course.id,
            query.page ? parseInt(query.page as string) : 1,
            query.pageSize ? parseInt(query.pageSize as string) : 10,
          );

          return ok(reviews);
        },
        {
          params: CourseDetailParamsSchema,
          query: CourseReviewsQuerySchema,
          response: CourseReviewsResponseSchema,
          detail: {
            summary: "Get reviews for a course",
            tags: ["Courses", "Reviews"],
          },
        },
      ),
  )

  // CATEGORIES
  .group("/category", (app) =>
    app
      .get(
        "/",
        async ({ query, addError, db }) => {
          const categories = await getCategories(db, query.parentId as string | undefined);
          return ok(categories);
        },
        {
          query: CategoryQuerySchema,
          response: CategoryListResponseSchema,
          detail: {
            summary: "Get all categories",
            tags: ["Categories"],
          },
        },
      )
      .get(
        "/:categoryIdentifier",
        async ({ params: { categoryIdentifier }, addError, db }) => {
          const category = await getCategory(db, categoryIdentifier);
          if (!category) {
            addError({
              code: 404,
              message: "Category not found",
            });
            return ok({} as any);
          }
          return ok(category);
        },
        {
          params: CategoryParamsSchema,
          response: CategoryResponseSchema,
          detail: {
            summary: "Get category detail by ID or slug",
            tags: ["Categories"],
          },
        },
      )
      .get(
        "/:categoryIdentifier/courses",
        async ({ params: { categoryIdentifier }, query, addError, db }) => {
          const courses = await getCoursesByCategory(
            db,
            categoryIdentifier,
            query.page ? parseInt(query.page as string) : 1,
            query.pageSize ? parseInt(query.pageSize as string) : 12,
          );
          return ok(courses);
        },
        {
          params: CategoryCoursesParamsSchema,
          query: CategoryCoursesQuerySchema,
          response: CategoryCoursesResponseSchema,
          detail: {
            summary: "Get courses by category",
            tags: ["Categories", "Courses"],
          },
        },
      ),
  )

  // INSTRUCTORS & PROFILES
  .group("/instructor", (app) =>
    app
      .get(
        "/",
        async ({ query, db }) => {
          const instructors = await getInstructors(
            db,
            query.page ? parseInt(query.page as string) : 1,
            query.pageSize ? parseInt(query.pageSize as string) : 12,
          );
          return ok(instructors);
        },
        {
          query: InstructorListQuerySchema,
          response: InstructorListResponseSchema,
          detail: {
            summary: "Get list of instructors",
            tags: ["Instructors"],
          },
        },
      )
      .get(
        "/:instructorIdentifier",
        async ({ params: { instructorIdentifier }, addError, db }) => {
          const instructor = await getInstructorDetail(db, instructorIdentifier);
          if (!instructor) {
            addError({
              code: 404,
              message: "Instructor not found",
            });
            return ok({} as any);
          }
          return ok(instructor);
        },
        {
          params: InstructorParamsSchema,
          response: InstructorDetailResponseSchema,
          detail: {
            summary: "Get instructor detail with their courses",
            tags: ["Instructors"],
          },
        },
      )
      .get(
        "/:instructorIdentifier/courses",
        async ({ params: { instructorIdentifier }, addError, db }) => {
          const courses = await listInstructorCourses(db, instructorIdentifier);
          if (!courses || courses.length === 0) {
            addError({
              code: 404,
              message: "No courses found for this instructor",
            });
            return ok([]);
          }
          return ok(courses);
        },
        {
          params: InstructorCoursesParamsSchema,
          response: InstructorCoursesResponseSchema,
          detail: {
            summary: "Get courses created by an instructor",
            tags: ["Instructors", "Courses"],
          },
        },
      ),
  )

  // USER ENROLLMENTS (Protected Route)
  .group("/enrollment", (app) =>
    app
      .get(
        "/my-courses",
        async ({ jwt, headers: { authorization }, addError, db }) => {
          const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : authorization;

          if (!token) {
            addError({
              code: 401,
              message: "Missing Authorization header",
            });
            return ok([]);
          }

          const user = await jwt.verify(token);
          if (!user) {
            addError({
              code: 401,
              message: "Invalid or expired token",
            });
            return ok([]);
          }

          const enrollments = await getUserEnrollments(db, user.sub!, 1, 50);
          return ok(enrollments);
        },
        {
          headers: ApiHeaderSchema,
          response: EnrollmentListResponseSchema,
          detail: {
            summary: "Get user's enrolled courses (Protected)",
            tags: ["Enrollments"],
          },
        },
      )
      .get(
        "/:courseIdentifier/check",
        async ({ params: { courseIdentifier }, jwt, headers: { authorization }, addError, db }) => {
          const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : authorization;

          if (!token) {
            addError({
              code: 401,
              message: "Missing Authorization header",
            });
            return ok({ enrolled: false });
          }

          const user = await jwt.verify(token);
          if (!user) {
            addError({
              code: 401,
              message: "Invalid or expired token",
            });
            return ok({ enrolled: false });
          }

          const enrolled = await isUserEnrolled(db, user.sub!, courseIdentifier);
          return ok({ enrolled });
        },
        {
          params: EnrollmentCheckParamsSchema,
          headers: ApiHeaderSchema,
          response: EnrollmentCheckResponseSchema,
          detail: {
            summary: "Check if user is enrolled in a course (Protected)",
            tags: ["Enrollments"],
          },
        },
      ),
  )

  // PUBLIC PROFILE
  .get(
    "/profile/:userIdentifier",
    async ({ params: { userIdentifier }, addError, db }) => {
      const user = await getUserDetail(db, userIdentifier);
      if (!user) {
        addError({
          code: 404,
          message: "User not found",
        });
        return ok({} as any);
      }
      return ok(user);
    },
    {
      params: ProfileParamsSchema,
      response: ProfileResponseSchema,
      detail: {
        summary: "Get public user profile",
        tags: ["Users"],
      },
    },
  )

  // LECTURES & CURRICULUM
  .get(
    "/courses/:courseIdentifier/curriculum",
    async ({ params: { courseIdentifier }, headers, addError, db, jwt }) => {
      // Get course by ID or slug
      const course = await getCourseDetail(db, courseIdentifier);
      if (!course) {
        addError({
          code: 404,
          message: "Course not found",
        });
        return ok({ sections: [] } as any);
      }

      // Get user ID from token if provided
      let userId: string | undefined;
      const token = headers.authorization?.replace("Bearer ", "");
      if (token) {
        const user = await jwt.verify(token);
        if (user) {
          userId = user.sub!;
        }
      }

      const curriculum = await getCourseCurriculum(db, course.id, userId);
      return ok(curriculum);
    },
    {
      params: CourseCurriculumParamsSchema,
      headers: ApiHeaderSchema,
      response: CourseCurriculumResponseSchema,
      detail: {
        summary: "Get course curriculum with sections and lectures",
        description: "Returns course curriculum with progress if user is authenticated",
        tags: ["Lectures"],
      },
    },
  )

  .get(
    "/lectures/:lectureId",
    async ({ params: { lectureId }, headers, addError, db, jwt }) => {
      // Get user ID from token if provided
      let userId: string | undefined;
      const token = headers.authorization?.replace("Bearer ", "");
      if (token) {
        const user = await jwt.verify(token);
        if (user) {
          userId = user.sub!;
        }
      }

      const lecture = await getLectureDetail(db, lectureId, userId);
      if (!lecture) {
        addError({
          code: 404,
          message: "Lecture not found",
        });
        return ok({} as any);
      }

      return ok(lecture);
    },
    {
      params: LectureDetailParamsSchema,
      headers: ApiHeaderSchema,
      response: LectureDetailResponseSchema,
      detail: {
        summary: "Get lecture detail with assets and progress",
        description: "Returns lecture detail with assets and user progress if authenticated",
        tags: ["Lectures"],
      },
    },
  );

export default app;
