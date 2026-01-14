import "dotenv/config";
import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { openapi } from "@elysiajs/openapi";
import { getUserBy, postUser } from "./queries/user.js";
import { UserSchema } from "./schemas/user.schema.js";
import { ApiError, ApiHeaderSchema, ApiResponseSchema } from "./schemas/api.schema.js";
import { fail, ok } from "./utils/response.js";

const SignBodySchema = t.Object({
  id: t.Optional(t.String({ format: "uuid" })),
  username: t.Optional(t.String()),
  email: t.Optional(t.String()),
  password: t.String({ minLength: 8 }),
});

const app = new Elysia()
  .use(openapi())
  .use(
    jwt({
      name: "jwt",
      secret: "pR1as0LoITul4GI",
    })
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

  .onAfterHandle(({ errors, hasError, set }) => {
    if (hasError()) {
      set.status = errors[0].code;
      return fail(errors[0].code, errors);
    }
  })

  .get("/", "hello from elysia")

  // SIGN IN
  .post(
    "/sign",
    async ({ jwt, body, addError }) => {
      const user = await getUserBy(body);

      if (user.length <= 0) {
        addError({
          code: 400,
          message: "User not found",
        });
      }

      const auth = user[0];

      const isVerified = await Bun.password.verify(body.password, auth.password, "bcrypt");
      if (!isVerified) {
        addError({
          code: 401,
          message: "Invalid credentials",
        });
      }

      const token = await jwt.sign({ sub: auth.sub, role: auth.role });

      return ok({ token });
    },
    {
      body: SignBodySchema,
      response: ApiResponseSchema,
      detail: {
        summary: "Sign in",
      },
    }
  )

  .group("/user", (app) =>
    app
      // REGISTER
      .post(
        "/register",
        async ({ body, addError }) => {
          try {
            await postUser(body);
            return ok({});
          } catch (e: any) {
            addError({
              code: 500,
              message: "Internal server error",
            });
            return ok(null);
          }
        },
        {
          body: UserSchema,
          response: ApiResponseSchema,
          detail: {
            summary: "Register user",
          },
        }
      )

      // PROFILE
      .get(
        "/profile",
        async ({ jwt, headers: { authorization }, addError }) => {
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

            return ok(null);
          }

          const profile = await getUserBy({ sub: user.sub });
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
          response: ApiResponseSchema,
          detail: {
            summary: "Get current user profile",
          },
        }
      )
  )
  .listen(8000);

export default app;
