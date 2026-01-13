import "dotenv/config";
import { Elysia, t } from "elysia";
import { jwt } from "@elysiajs/jwt";
import { openapi } from "@elysiajs/openapi";
import { getUserBy, postUser } from "./queries/user.js";
import { UserSchema, UserSchemaStatic } from "./schemas/user.schema.js";

// Reusable elysia schemas
const headerSchema = t.Object({
  authorization: t.String({ examples: ["Bearer ey11223344556677889900"] }),
});

const ErrorSchema = t.Object({
  message: t.String(),
});

const OkSchema = t.Object({
  ok: t.Boolean(),
});

const TokenSchema = t.Object({
  token: t.String(),
});

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
  .get("/", "hello from elysia")

  // SIGN IN
  .post(
    "/sign",
    async ({ jwt, body, status }) => {
      const user = await getUserBy(body);

      if (user.length <= 0) {
        return status(400, { message: "User not found" });
      }

      const auth = user[0];

      const ok = await Bun.password.verify(body.password, auth.password, "bcrypt");
      if (!ok) {
        return status(401, { message: "Invalid credentials" });
      }

      const token = await jwt.sign({ sub: auth.sub, role: auth.role });

      return status(200, { token });
    },
    {
      body: SignBodySchema,
      response: {
        200: TokenSchema,
        400: ErrorSchema,
        401: ErrorSchema,
      },
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
        async ({ body, status }) => {
          try {
            await postUser(body);
            return status(200, { ok: true });
          } catch (e: any) {
            return status(500, { message: e?.message ?? "Internal server error" });
          }
        },
        {
          body: UserSchema,
          response: {
            200: OkSchema,
            500: ErrorSchema,
          },
          detail: {
            summary: "Register user",
          },
        }
      )

      // PROFILE
      .get(
        "/profile",
        async ({ jwt, status, headers: { authorization } }) => {
          // "authorization" biasanya "Bearer <token>"
          const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : authorization;

          if (!token) {
            return status(401, { message: "Missing Authorization header" });
          }

          const user = await jwt.verify(token);
          if (!user) {
            return status(401, { message: "Invalid token" });
          }

          const profile = await getUserBy({ sub: user.sub });
          if (profile.length <= 0) {
            return status(404, { message: "Profile not found" });
          }

          return status(200, profile[0] as UserSchemaStatic);
        },
        {
          headers: headerSchema,
          response: {
            200: UserSchema,
            401: ErrorSchema,
            404: ErrorSchema,
          },
          detail: {
            summary: "Get current user profile",
          },
        }
      )
  )
  .listen(8000);

export default app;
