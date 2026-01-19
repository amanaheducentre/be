import "dotenv/config";
import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { openapi } from "@elysiajs/openapi";
import { logger } from "@bogeychan/elysia-logger";
import { getUserBy, postUser } from "./queries/user.js";
import { User, UserCheckResponseSchema, UserResponseSchema, UserSchema } from "./schemas/user.schema.js";
import { ApiError, ApiHeaderSchema, ApiResponseSchema } from "./schemas/api.schema.js";
import { fail, ok } from "./utils/response.js";
import { CheckBodySchema, SignBodySchema, SignResponseSchema } from "./schemas/sign.schema.js";
import { verifyGoogleIdToken } from "./utils/google.js";
import { useDB } from "./plugin/database/client.js";
import { listCourses } from "./queries/course.js";

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

      if (body.type == "local") {
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
    app.get("/", async ({ addError, db }) => {
      const course = await listCourses(db, {});
      if (!course) {
        addError({
          code: 404,
          message: "Course not found",
        });
      }
      return ok(course);
    }),
  );

export default app;
