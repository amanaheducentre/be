# Amanah Edu Centre - Backend API

Backend REST API untuk platform Learning Management System (LMS) Amanah Edu Centre, dibangun dengan Elysia.js, Drizzle ORM, dan Turso (LibSQL).

## Tech Stack

- **Runtime**: Bun
- **Framework**: Elysia.js
- **Database**: Turso (LibSQL/SQLite)
- **ORM**: Drizzle ORM
- **Authentication**: JWT (@elysiajs/jwt)
- **Documentation**: OpenAPI (@elysiajs/openapi)
- **Logging**: @bogeychan/elysia-logger

## Development

```bash
bun i
bun run dev
```

```
open http://localhost:8000/
```

## Deploy

```bash
vc deploy
```

---

## AI Rules - Panduan Pengembangan Project

### 1. STRUKTUR PROJECT

```
src/
├── index.ts                 # Entry point, routing, middleware
├── plugin/                  # Plugin dan konfigurasi
│   └── database/
│       ├── client.ts        # Database connection
│       ├── schema.ts        # Database schema definitions
│       ├── relations.ts     # Drizzle relations
│       └── populate.ts      # Seed data
├── queries/                 # Database query functions
│   ├── user.ts
│   ├── course.ts
│   ├── lecture.ts
│   └── ...
├── schemas/                 # Elysia schema validations (TypeBox)
│   ├── api.schema.ts
│   ├── user.schema.ts
│   ├── course.schema.ts
│   └── ...
└── utils/                   # Helper utilities
    ├── response.ts
    └── google.ts
```

### 2. DATABASE PATTERNS (Drizzle ORM + SQLite)

#### 2.1 Schema Definition (`schema.ts`)

**Naming Convention:**

- Table names: `camelCase` (e.g., `users`, `courseLectures`)
- Column names: `camelCase` di TypeScript, `snake_case` di database
- Status fields: gunakan literal types untuk status values (e.g., `draft/published/archived`)

**Helper Functions:**

```typescript
// Timestamp dalam UNIX seconds (INTEGER)
const ts = (name: string) => integer(name);

// Boolean di SQLite: 0/1
const bool = (name: string) => integer(name, { mode: "boolean" }).notNull().default(false);
```

**Foreign Key Pattern:**

```typescript
instructorId: text("instructor_id")
  .notNull()
  .references(() => usersTable.id, { onDelete: "cascade" });
```

**Index Pattern:**

```typescript
export const usersTable = sqliteTable(
  "users",
  {
    /* columns */
  },
  (t) => [uniqueIndex("users_email_uidx").on(t.email), index("users_status_idx").on(t.status)],
);
```

**WAJIB menggunakan:**

- Primary key: `id: text("id").primaryKey()`
- Timestamps: `createdAt`, `updatedAt` (UNIX seconds)
- Status fields untuk state management

#### 2.2 Relations (`relations.ts`)

Definisikan relasi setelah schema:

```typescript
export const coursesRelations = relations(coursesTable, ({ one, many }) => ({
  instructor: one(usersTable, {
    fields: [coursesTable.instructorId],
    references: [usersTable.id],
  }),
  sections: many(courseSectionsTable),
  lectures: many(courseLecturesTable),
}));
```

#### 2.3 Database Client (`client.ts`)

Gunakan singleton pattern untuk database connection.

### 3. QUERY FUNCTIONS (`queries/`)

**Penamaan Function:**

- `get*` untuk single item (e.g., `getCourseDetail`)
- `list*` untuk multiple items (e.g., `listCourses`)
- `post*` untuk create (e.g., `postUser`)
- `upsert*` untuk insert/update (e.g., `upsertLectureProgress`)
- `recompute*` untuk recalculation (e.g., `recomputeCourseRating`)

**WAJIB:**

- Type parameter pertama selalu: `db: LibSQLDatabase<Record<string, never>>`
- Gunakan JSDoc untuk dokumentasi function
- Include `@param`, `@returns`, dan `@example` jika perlu
- Export semua query functions sebagai named exports

**Pattern untuk Pagination:**

```typescript
type ListParams = {
  page?: number;
  pageSize?: number;
  // filter params...
};

export async function listItems(db: LibSQLDatabase<Record<string, never>>, params: ListParams) {
  const page = Math.max(1, params.page ?? 1);
  const pageSize = Math.min(50, Math.max(1, params.pageSize ?? 12));
  const offset = (page - 1) * pageSize;

  // query with limit and offset
}
```

**Pattern untuk Complex Queries:**

```typescript
// Build where conditions dynamically
const whereParts = [
  params.status ? eq(table.status, params.status) : undefined,
  params.categoryId ? eq(table.categoryId, params.categoryId) : undefined,
  params.q ? or(
    like(table.title, `%${params.q}%`),
    like(table.subtitle, `%${params.q}%`)
  ) : undefined,
].filter(Boolean);

// Use in query
.where(and(...(whereParts as any)))
```

**Pattern untuk Joins dengan Nested Objects:**

```typescript
.select({
  id: coursesTable.id,
  title: coursesTable.title,
  instructor: {
    id: usersTable.id,
    name: usersTable.name,
    avatar: usersTable.avatar,
  },
  category: {
    id: categoriesTable.id,
    name: categoriesTable.name,
  },
})
.leftJoin(usersTable, eq(usersTable.id, coursesTable.instructorId))
.leftJoin(categoriesTable, eq(categoriesTable.id, coursesTable.categoryId))
```

**Pattern untuk Optional User Data (Auth-aware queries):**

```typescript
export async function getData(
  db: LibSQLDatabase<Record<string, never>>,
  itemId: string,
  userId?: string, // Optional untuk include user-specific data
) {
  // Get main data
  const item = await db.select().from(table).where(eq(table.id, itemId));

  // Get user-specific data if userId provided
  let userProgress = null;
  if (userId) {
    const [progress] = await db
      .select()
      .from(progressTable)
      .where(and(eq(progressTable.userId, userId), eq(progressTable.itemId, itemId)))
      .limit(1);
    userProgress = progress || null;
  }

  return { ...item, progress: userProgress };
}
```

### 4. SCHEMA VALIDATION (`schemas/`)

**Gunakan Elysia TypeBox (`t.*`):**

```typescript
import { t } from "elysia";

// Response Schema Pattern
export const ItemResponseSchema = t.Object({
  ok: t.Boolean(),
  status: t.Number(),
  message: t.String(),
  data: ItemSchema,
});

// Query Params Schema
export const ItemListQuerySchema = t.Object({
  page: t.Optional(t.String()),
  pageSize: t.Optional(t.String()),
  q: t.Optional(t.String()),
});

// Path Params Schema
export const ItemParamsSchema = t.Object({
  itemId: t.String(),
});
```

**Nullable Pattern:**

- Gunakan `t.Union([t.String(), t.Null()])` untuk nullable fields
- Jangan gunakan `t.Optional()` untuk API response fields

**Literal Types untuk Status:**

```typescript
status: t.Union([t.Literal("draft"), t.Literal("published"), t.Literal("archived")]);
```

**Type Inference dari Query:**

```typescript
import { listCourses } from "../queries/course.js";
export type CourseList = Awaited<ReturnType<typeof listCourses>>;
```

### 5. API ENDPOINTS (`index.ts`)

**Pattern untuk Route Definition:**

```typescript
.get(
  "/path/:param",
  async ({ params, query, body, headers, db, jwt, addError }) => {
    // Handler logic
    return ok(data);
  },
  {
    params: ParamsSchema,
    query: QuerySchema,
    body: BodySchema,
    headers: HeaderSchema,
    response: ResponseSchema,
    detail: {
      summary: "Endpoint description",
      description: "Detailed description (optional)",
      tags: ["Tag Name"],
    },
  }
)
```

**Error Handling Pattern:**

```typescript
// Di handler, gunakan addError untuk menambah error
if (!item) {
  addError({
    code: 404,
    message: "Item not found",
  });
  return ok({} as any); // Return empty untuk satisfy type
}
```

**Authentication Pattern (Optional JWT):**

```typescript
// Get user ID from token if provided
let userId: string | undefined;
const token = headers.authorization?.replace("Bearer ", "");
if (token) {
  const user = await jwt.verify(token);
  if (user) {
    userId = user.sub!;
  }
}

// Pass userId to query function
const data = await getData(db, itemId, userId);
```

**Authentication Pattern (Required JWT):**

```typescript
const token = authorization?.startsWith("Bearer ") ? authorization.slice("Bearer ".length) : authorization;

if (!token) {
  addError({ code: 401, message: "Missing Authorization header" });
}

const user = await jwt.verify(token);
if (!user) {
  addError({ code: 401, message: "Invalid token" });
  return ok({} as any);
}
```

**Grouping Routes:**

```typescript
.group("/prefix", (app) =>
  app
    .get("/path1", handler1, config1)
    .post("/path2", handler2, config2)
)
```

### 6. RESPONSE UTILITIES (`utils/response.ts`)

**Standard Response Pattern:**

```typescript
// Success
return ok(data);
return ok(data, 200, "Custom message");

// Error (handled by middleware)
addError({ code: 404, message: "Not found" });
```

**Response Structure:**

```typescript
{
  ok: boolean,
  status: number,
  message: string,
  data?: T,
  errors?: ApiError[],
  meta?: Record<string, unknown>
}
```

### 7. NAMING CONVENTIONS

**Files:**

- `kebab-case.ts` untuk filenames
- Suffix `.schema.ts` untuk schema files
- Singular untuk query files (e.g., `course.ts`, `user.ts`)

**Variables & Functions:**

- `camelCase` untuk variables dan functions
- `PascalCase` untuk types, interfaces, schemas
- `UPPER_SNAKE_CASE` untuk constants

**Database:**

- Table names di code: `camelCase`
- Column names di DB: `snake_case`
- Foreign keys: `entityId` → `entity_id`

### 8. COMMENTS & DOCUMENTATION

**JSDoc untuk Functions:**

```typescript
/**
 * Brief description of function.
 *
 * @param db - Database instance description
 * @param param - Parameter description
 * @returns Promise resolving to description
 *
 * @example
 * functionName(db, { param: "value" })
 */
```

**Inline Comments:**

```typescript
// Comment untuk single line

/**
 * Multi-line comment
 * untuk complex logic
 */
```

**Database Schema Comments:**

```typescript
status: text("status").notNull().default("active"), // active/banned
```

### 9. IMPORTS

**Order:**

1. External packages
2. Internal utilities dan helpers
3. Schemas
4. Query functions
5. Types

**Style:**

```typescript
import "dotenv/config"; // Side-effect imports
import { Elysia, t } from "elysia"; // Named imports
import { ok, fail } from "./utils/response.js"; // Always use .js extension
```

### 10. TYPESCRIPT CONVENTIONS

**Type Definitions:**

```typescript
// Export types from schemas
export type User = typeof UserSchema.static;

// Type inference dari function return
export type CourseList = Awaited<ReturnType<typeof listCourses>>;
```

**Generic Types:**

```typescript
LibSQLDatabase<Record<string, never>>; // Untuk database instance
```

### 11. MIDDLEWARE PATTERNS

**Error Pool Pattern:**

```typescript
.derive(() => {
  const errors: ApiError[] = [];
  const addError = (e: ApiError) => errors.push(e);
  const hasError = () => errors.length > 0;
  return { errors, addError, hasError };
})

.onAfterHandle(({ errors, hasError, set }) => {
  if (hasError()) {
    set.status = errors[0].code;
    return fail(errors[0].code, errors);
  }
})
```

**Database Client Injection:**

```typescript
.derive(() => {
  const dbClient = useDB();
  return { db: dbClient };
})
```

### 12. SECURITY & BEST PRACTICES

**Input Validation:**

- WAJIB validasi semua input menggunakan Elysia schemas
- Sanitasi string untuk SQL injection prevention (handled by Drizzle)

**Authentication:**

- JWT untuk authentication
- Optional auth: pass `userId?: string` ke query functions
- Required auth: validate token dan return 401 jika invalid

**Pagination:**

- Default page: 1
- Default pageSize: 12
- Max pageSize: 50
- Always validate: `Math.max(1, page)` dan `Math.min(50, pageSize)`

**Timestamps:**

- Gunakan UNIX seconds: `Math.floor(Date.now() / 1000)`
- Field names: `createdAt`, `updatedAt`, `publishedAt`, dll

**Null Handling:**

- Return `null` untuk missing optional data, bukan `undefined`
- Use `t.Union([Type, t.Null()])` dalam schema

### 13. TESTING & DEVELOPMENT

**Environment Variables:**

- Gunakan `dotenv` dengan `import "dotenv/config"`
- Akses via `process.env.VARIABLE_NAME`

**Logging:**

- Elysia logger sudah integrated
- Log akan otomatis muncul untuk setiap request

**OpenAPI Documentation:**

- Akses di `/swagger` (auto-generated)
- Wajib isi `detail.summary` dan `detail.tags` untuk setiap endpoint

### 14. CHECKLIST UNTUK SETIAP FEATURE BARU

Saat menambahkan feature baru, pastikan:

- [ ] Schema database sudah didefinisikan di `schema.ts`
- [ ] Relations sudah ditambahkan di `relations.ts`
- [ ] Query functions dibuat di `queries/`
- [ ] JSDoc lengkap untuk query functions
- [ ] Schema validation dibuat di `schemas/`
- [ ] API endpoint dibuat di `index.ts`
- [ ] Response schema sesuai standard
- [ ] Error handling sudah proper
- [ ] Authentication handling sesuai kebutuhan
- [ ] Pagination implemented jika list data
- [ ] Indexes ditambahkan untuk foreign keys
- [ ] OpenAPI detail (summary, tags) sudah diisi

### 15. CONTOH IMPLEMENTASI LENGKAP

Lihat implementasi lengkap di:

- Lecture feature: `queries/lecture.ts`, `schemas/lecture.schema.ts`
- Course feature: `queries/course.ts`, `schemas/course.schema.ts`
- User authentication: `queries/user.ts`, endpoint `/sign` di `index.ts`

---

## API Documentation

Setelah server berjalan, akses OpenAPI documentation di:

```
http://localhost:8000/openapi
```
