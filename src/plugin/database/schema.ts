// server/db/schema.ts
import { sql } from "drizzle-orm";
import { foreignKey, sqliteTable, text, integer, real, primaryKey, uniqueIndex, index } from "drizzle-orm/sqlite-core";

// =========================
// Helpers
// =========================
/**
 * Simpan timestamp sebagai UNIX seconds (INTEGER).
 * Isi nilainya dari app: Math.floor(Date.now() / 1000)
 */
const ts = (name: string) => integer(name);

/** Boolean di SQLite: 0/1 */
const bool = (name: string) => integer(name, { mode: "number" }).notNull().default(0);

// =========================
// Users & Roles
// =========================
export const usersTable = sqliteTable(
  "users",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(),
    username: text("username"),
    email: text("email").notNull(),
    password: text("password"),
    avatar: text("avatar"),
    bio: text("bio"),
    phone: text("phone"),
    location: text("location"),
    status: text("status").notNull().default("active"), // active/banned
    createdAt: ts("created_at").notNull(),
    updatedAt: ts("updated_at").notNull(),
    lastLoginAt: ts("last_login_at"),
  },
  (t) => [uniqueIndex("users_email_uidx").on(t.email), index("users_status_idx").on(t.status)],
);

export const rolesTable = sqliteTable(
  "roles",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(), // student/instructor/admin
    createdAt: ts("created_at").notNull(),
  },
  (t) => [uniqueIndex("roles_name_uidx").on(t.name)],
);

export const userRolesTable = sqliteTable(
  "user_roles",
  {
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    roleId: text("role_id")
      .notNull()
      .references(() => rolesTable.id, { onDelete: "cascade" }),
    createdAt: ts("created_at").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.roleId] }),
    index("user_roles_user_idx").on(t.userId),
    index("user_roles_role_idx").on(t.roleId),
  ],
);

// =========================
// Marketplace: categories, levels, courses
// =========================
export const categoriesTable = sqliteTable(
  "categories",
  {
    id: text("id").primaryKey(),
    parentId: text("parent_id"),
    name: text("name").notNull(),
    slug: text("slug").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [
    uniqueIndex("categories_slug_uidx").on(t.slug),
    index("categories_parent_idx").on(t.parentId),
    foreignKey({
      columns: [t.parentId],
      foreignColumns: [t.id],
      name: "categories_parent_id_fkey",
    }),
  ],
);

export const courseLevelsTable = sqliteTable(
  "course_levels",
  {
    id: text("id").primaryKey(),
    name: text("name").notNull(), // beginner/intermediate/advanced/all
  },
  (t) => [uniqueIndex("course_levels_name_uidx").on(t.name)],
);

export const coursesTable = sqliteTable(
  "courses",
  {
    id: text("id").primaryKey(),
    instructorId: text("instructor_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "restrict" }),
    categoryId: text("category_id").references(() => categoriesTable.id, { onDelete: "set null" }),
    levelId: text("level_id").references(() => courseLevelsTable.id, { onDelete: "set null" }),

    title: text("title").notNull(),
    slug: text("slug").notNull(),
    subtitle: text("subtitle"),
    description: text("description"), // rich text

    language: text("language").notNull().default("id"),
    thumbnailUrl: text("thumbnail_url"),
    promoVideoUrl: text("promo_video_url"),

    currency: text("currency").notNull().default("IDR"),
    priceBase: integer("price_base").notNull().default(0),
    priceCurrent: integer("price_current").notNull().default(0),

    status: text("status").notNull().default("draft"), // draft/review/published/archived

    ratingAvg: real("rating_avg").notNull().default(0),
    ratingCount: integer("rating_count").notNull().default(0),
    studentCount: integer("student_count").notNull().default(0),

    createdAt: ts("created_at").notNull(),
    updatedAt: ts("updated_at").notNull(),
    publishedAt: ts("published_at"),
  },
  (t) => [
    uniqueIndex("courses_slug_uidx").on(t.slug),
    index("courses_instructor_idx").on(t.instructorId),
    index("courses_category_idx").on(t.categoryId),
    index("courses_status_idx").on(t.status),
  ],
);

export const courseTagsTable = sqliteTable(
  "course_tags",
  {
    courseId: text("course_id")
      .notNull()
      .references(() => coursesTable.id, { onDelete: "cascade" }),
    tag: text("tag").notNull(),
  },
  (t) => [primaryKey({ columns: [t.courseId, t.tag] }), index("course_tags_tag_idx").on(t.tag)],
);

export const courseRequirementsTable = sqliteTable(
  "course_requirements",
  {
    id: text("id").primaryKey(),
    courseId: text("course_id")
      .notNull()
      .references(() => coursesTable.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("course_requirements_course_idx").on(t.courseId)],
);

export const courseOutcomesTable = sqliteTable(
  "course_outcomes",
  {
    id: text("id").primaryKey(),
    courseId: text("course_id")
      .notNull()
      .references(() => coursesTable.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("course_outcomes_course_idx").on(t.courseId)],
);

export const courseTargetAudienceTable = sqliteTable(
  "course_target_audience",
  {
    id: text("id").primaryKey(),
    courseId: text("course_id")
      .notNull()
      .references(() => coursesTable.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("course_target_course_idx").on(t.courseId)],
);

// =========================
// Curriculum: sections, lectures, assets
// =========================
export const courseSectionsTable = sqliteTable(
  "course_sections",
  {
    id: text("id").primaryKey(),
    courseId: text("course_id")
      .notNull()
      .references(() => coursesTable.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("course_sections_course_idx").on(t.courseId)],
);

export const courseLecturesTable = sqliteTable(
  "course_lectures",
  {
    id: text("id").primaryKey(),
    courseId: text("course_id")
      .notNull()
      .references(() => coursesTable.id, { onDelete: "cascade" }),
    sectionId: text("section_id")
      .notNull()
      .references(() => courseSectionsTable.id, { onDelete: "cascade" }),

    type: text("type").notNull().default("video"), // video/article/quiz/assignment/resource/live
    title: text("title").notNull(),
    description: text("description"),

    durationSeconds: integer("duration_seconds"),
    isPreview: bool("is_preview"),

    sortOrder: integer("sort_order").notNull().default(0),
    status: text("status").notNull().default("draft"), // draft/published
    publishedAt: ts("published_at"),
  },
  (t) => [
    index("course_lectures_course_idx").on(t.courseId),
    index("course_lectures_section_idx").on(t.sectionId),
    index("course_lectures_type_idx").on(t.type),
  ],
);

export const lectureAssetsTable = sqliteTable(
  "lecture_assets",
  {
    id: text("id").primaryKey(),
    lectureId: text("lecture_id")
      .notNull()
      .references(() => courseLecturesTable.id, { onDelete: "cascade" }),

    assetType: text("asset_type").notNull(), // video/pdf/zip/link/image
    url: text("url").notNull(),
    filename: text("filename"),
    sizeBytes: integer("size_bytes"),
    metaJson: text("meta_json"), // JSON string
  },
  (t) => [index("lecture_assets_lecture_idx").on(t.lectureId), index("lecture_assets_type_idx").on(t.assetType)],
);

// =========================
// Enrollment & Progress
// =========================
export const enrollmentsTable = sqliteTable(
  "enrollments",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    courseId: text("course_id")
      .notNull()
      .references(() => coursesTable.id, { onDelete: "cascade" }),

    source: text("source").notNull().default("purchase"), // purchase/free/coupon/gift/admin_grant
    enrolledAt: ts("enrolled_at").notNull(),
    accessExpiresAt: ts("access_expires_at"),
    status: text("status").notNull().default("active"), // active/refunded/revoked
  },
  (t) => [
    uniqueIndex("enrollments_user_course_uidx").on(t.userId, t.courseId),
    index("enrollments_user_idx").on(t.userId),
    index("enrollments_course_idx").on(t.courseId),
    index("enrollments_status_idx").on(t.status),
  ],
);

export const lectureProgressTable = sqliteTable(
  "lecture_progress",
  {
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    lectureId: text("lecture_id")
      .notNull()
      .references(() => courseLecturesTable.id, { onDelete: "cascade" }),

    courseId: text("course_id")
      .notNull()
      .references(() => coursesTable.id, { onDelete: "cascade" }),

    status: text("status").notNull().default("not_started"), // not_started/in_progress/completed
    lastPositionSeconds: integer("last_position_seconds").notNull().default(0),
    completedAt: ts("completed_at"),
    updatedAt: ts("updated_at").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.lectureId] }),
    index("lecture_progress_user_idx").on(t.userId),
    index("lecture_progress_lecture_idx").on(t.lectureId),
    index("lecture_progress_course_idx").on(t.courseId),
  ],
);

export const courseProgressSnapshotTable = sqliteTable(
  "course_progress_snapshot",
  {
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    courseId: text("course_id")
      .notNull()
      .references(() => coursesTable.id, { onDelete: "cascade" }),

    percent: integer("percent").notNull().default(0),
    completedLectures: integer("completed_lectures").notNull().default(0),
    totalLectures: integer("total_lectures").notNull().default(0),
    updatedAt: ts("updated_at").notNull(),
  },
  (t) => [
    primaryKey({ columns: [t.userId, t.courseId] }),
    index("course_progress_user_idx").on(t.userId),
    index("course_progress_course_idx").on(t.courseId),
  ],
);

// =========================
// Orders / Payments / Coupons / Refunds
// =========================
export const ordersTable = sqliteTable(
  "orders",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    subtotal: integer("subtotal").notNull().default(0),
    discountTotal: integer("discount_total").notNull().default(0),
    taxTotal: integer("tax_total").notNull().default(0),
    total: integer("total").notNull().default(0),
    currency: text("currency").notNull().default("IDR"),

    status: text("status").notNull().default("pending"), // pending/paid/failed/refunded
    paymentProvider: text("payment_provider"), // midtrans/xendit/stripe/etc
    paymentRef: text("payment_ref"),

    createdAt: ts("created_at").notNull(),
    paidAt: ts("paid_at"),
  },
  (t) => [
    index("orders_user_idx").on(t.userId),
    index("orders_status_idx").on(t.status),
    index("orders_created_idx").on(t.createdAt),
  ],
);

export const orderItemsTable = sqliteTable(
  "order_items",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => ordersTable.id, { onDelete: "cascade" }),

    itemType: text("item_type").notNull(), // course/bundle
    itemId: text("item_id").notNull(), // courseId / bundleId

    price: integer("price").notNull().default(0),
    discount: integer("discount").notNull().default(0),
    finalPrice: integer("final_price").notNull().default(0),
  },
  (t) => [index("order_items_order_idx").on(t.orderId), index("order_items_item_idx").on(t.itemType, t.itemId)],
);

export const couponsTable = sqliteTable(
  "coupons",
  {
    id: text("id").primaryKey(),
    code: text("code").notNull(),
    type: text("type").notNull(), // percent/amount
    value: integer("value").notNull(),

    startsAt: ts("starts_at"),
    endsAt: ts("ends_at"),

    usageLimit: integer("usage_limit"),
    usageCount: integer("usage_count").notNull().default(0),

    scope: text("scope").notNull().default("global"), // global/course
    createdAt: ts("created_at").notNull(),
  },
  (t) => [uniqueIndex("coupons_code_uidx").on(t.code), index("coupons_scope_idx").on(t.scope)],
);

export const couponCoursesTable = sqliteTable(
  "coupon_courses",
  {
    couponId: text("coupon_id")
      .notNull()
      .references(() => couponsTable.id, { onDelete: "cascade" }),
    courseId: text("course_id")
      .notNull()
      .references(() => coursesTable.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.couponId, t.courseId] }), index("coupon_courses_course_idx").on(t.courseId)],
);

export const refundsTable = sqliteTable(
  "refunds",
  {
    id: text("id").primaryKey(),
    orderId: text("order_id")
      .notNull()
      .references(() => ordersTable.id, { onDelete: "cascade" }),
    amount: integer("amount").notNull().default(0),
    reason: text("reason"),
    status: text("status").notNull().default("pending"), // pending/approved/rejected/paid
    createdAt: ts("created_at").notNull(),
  },
  (t) => [index("refunds_order_idx").on(t.orderId), index("refunds_status_idx").on(t.status)],
);

// =========================
// Reviews
// =========================
export const courseReviewsTable = sqliteTable(
  "course_reviews",
  {
    id: text("id").primaryKey(),
    courseId: text("course_id")
      .notNull()
      .references(() => coursesTable.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    rating: integer("rating").notNull(), // 1..5
    title: text("title"),
    body: text("body"),

    isPublic: bool("is_public"),
    isFlagged: bool("is_flagged"),

    createdAt: ts("created_at").notNull(),
    updatedAt: ts("updated_at").notNull(),
  },
  (t) => [
    uniqueIndex("reviews_user_course_uidx").on(t.userId, t.courseId),
    index("reviews_course_idx").on(t.courseId),
    index("reviews_rating_idx").on(t.rating),
  ],
);

// =========================
// Q&A / Discussion
// =========================
export const courseQuestionsTable = sqliteTable(
  "course_questions",
  {
    id: text("id").primaryKey(),
    courseId: text("course_id")
      .notNull()
      .references(() => coursesTable.id, { onDelete: "cascade" }),
    lectureId: text("lecture_id").references(() => courseLecturesTable.id, { onDelete: "set null" }),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    title: text("title").notNull(),
    body: text("body").notNull(),
    status: text("status").notNull().default("open"), // open/answered/archived

    createdAt: ts("created_at").notNull(),
    updatedAt: ts("updated_at").notNull(),
  },
  (t) => [
    index("questions_course_idx").on(t.courseId),
    index("questions_lecture_idx").on(t.lectureId),
    index("questions_status_idx").on(t.status),
    index("questions_created_idx").on(t.createdAt),
  ],
);

export const courseAnswersTable = sqliteTable(
  "course_answers",
  {
    id: text("id").primaryKey(),
    questionId: text("question_id")
      .notNull()
      .references(() => courseQuestionsTable.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    body: text("body").notNull(),
    isInstructor: bool("is_instructor"),

    createdAt: ts("created_at").notNull(),
    updatedAt: ts("updated_at").notNull(),
  },
  (t) => [index("answers_question_idx").on(t.questionId), index("answers_created_idx").on(t.createdAt)],
);

export const questionVotesTable = sqliteTable(
  "question_votes",
  {
    questionId: text("question_id")
      .notNull()
      .references(() => courseQuestionsTable.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    value: integer("value").notNull(), // +1 / -1
    createdAt: ts("created_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.questionId, t.userId] }), index("question_votes_question_idx").on(t.questionId)],
);

// =========================
// Quiz
// =========================
export const quizzesTable = sqliteTable(
  "quizzes",
  {
    id: text("id").primaryKey(),
    lectureId: text("lecture_id")
      .notNull()
      .references(() => courseLecturesTable.id, { onDelete: "cascade" }),
    title: text("title").notNull(),
    passingScore: integer("passing_score").notNull().default(70),
  },
  (t) => [uniqueIndex("quizzes_lecture_uidx").on(t.lectureId)],
);

export const quizQuestionsTable = sqliteTable(
  "quiz_questions",
  {
    id: text("id").primaryKey(),
    quizId: text("quiz_id")
      .notNull()
      .references(() => quizzesTable.id, { onDelete: "cascade" }),
    type: text("type").notNull().default("mcq"), // mcq/multi/truefalse
    prompt: text("prompt").notNull(),
    sortOrder: integer("sort_order").notNull().default(0),
  },
  (t) => [index("quiz_questions_quiz_idx").on(t.quizId)],
);

export const quizOptionsTable = sqliteTable(
  "quiz_options",
  {
    id: text("id").primaryKey(),
    questionId: text("question_id")
      .notNull()
      .references(() => quizQuestionsTable.id, { onDelete: "cascade" }),
    text: text("text").notNull(),
    isCorrect: bool("is_correct"),
  },
  (t) => [index("quiz_options_question_idx").on(t.questionId)],
);

export const quizAttemptsTable = sqliteTable(
  "quiz_attempts",
  {
    id: text("id").primaryKey(),
    quizId: text("quiz_id")
      .notNull()
      .references(() => quizzesTable.id, { onDelete: "cascade" }),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),

    score: integer("score").notNull().default(0),
    passed: bool("passed"),
    startedAt: ts("started_at").notNull(),
    submittedAt: ts("submitted_at"),
  },
  (t) => [index("quiz_attempts_quiz_user_idx").on(t.quizId, t.userId), index("quiz_attempts_user_idx").on(t.userId)],
);

export const quizAttemptAnswersTable = sqliteTable(
  "quiz_attempt_answers",
  {
    attemptId: text("attempt_id")
      .notNull()
      .references(() => quizAttemptsTable.id, { onDelete: "cascade" }),
    questionId: text("question_id")
      .notNull()
      .references(() => quizQuestionsTable.id, { onDelete: "cascade" }),

    // SQLite: simpan array optionId sebagai JSON string
    selectedOptionIdsJson: text("selected_option_ids_json").notNull().default("[]"),
  },
  (t) => [
    primaryKey({ columns: [t.attemptId, t.questionId] }),
    index("quiz_attempt_answers_attempt_idx").on(t.attemptId),
  ],
);

// =========================
// Certificates
// =========================
export const certificatesTable = sqliteTable(
  "certificates",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    courseId: text("course_id")
      .notNull()
      .references(() => coursesTable.id, { onDelete: "cascade" }),

    issuedAt: ts("issued_at").notNull(),
    certificateNo: text("certificate_no").notNull(),
    pdfUrl: text("pdf_url"),
    templateDataJson: text("template_data_json"),
  },
  (t) => [
    uniqueIndex("certificates_no_uidx").on(t.certificateNo),
    uniqueIndex("certificates_user_course_uidx").on(t.userId, t.courseId),
  ],
);

// =========================
// Wishlist / Cart
// =========================
export const wishlistsTable = sqliteTable(
  "wishlists",
  {
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    courseId: text("course_id")
      .notNull()
      .references(() => coursesTable.id, { onDelete: "cascade" }),
    createdAt: ts("created_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.userId, t.courseId] }), index("wishlists_course_idx").on(t.courseId)],
);

export const cartsTable = sqliteTable(
  "carts",
  {
    id: text("id").primaryKey(),
    userId: text("user_id")
      .notNull()
      .references(() => usersTable.id, { onDelete: "cascade" }),
    updatedAt: ts("updated_at").notNull(),
  },
  (t) => [uniqueIndex("carts_user_uidx").on(t.userId)],
);

export const cartItemsTable = sqliteTable(
  "cart_items",
  {
    cartId: text("cart_id")
      .notNull()
      .references(() => cartsTable.id, { onDelete: "cascade" }),
    itemType: text("item_type").notNull(), // course/bundle
    itemId: text("item_id").notNull(),
    createdAt: ts("created_at").notNull(),
  },
  (t) => [primaryKey({ columns: [t.cartId, t.itemType, t.itemId] }), index("cart_items_cart_idx").on(t.cartId)],
);

// =========================
// Bundles
// =========================
export const bundlesTable = sqliteTable(
  "bundles",
  {
    id: text("id").primaryKey(),
    title: text("title").notNull(),
    slug: text("slug").notNull(),
    currency: text("currency").notNull().default("IDR"),
    priceCurrent: integer("price_current").notNull().default(0),
    status: text("status").notNull().default("draft"), // draft/published/archived
    createdAt: ts("created_at").notNull(),
    updatedAt: ts("updated_at").notNull(),
    publishedAt: ts("published_at"),
  },
  (t) => [uniqueIndex("bundles_slug_uidx").on(t.slug), index("bundles_status_idx").on(t.status)],
);

export const bundleCoursesTable = sqliteTable(
  "bundle_courses",
  {
    bundleId: text("bundle_id")
      .notNull()
      .references(() => bundlesTable.id, { onDelete: "cascade" }),
    courseId: text("course_id")
      .notNull()
      .references(() => coursesTable.id, { onDelete: "cascade" }),
  },
  (t) => [primaryKey({ columns: [t.bundleId, t.courseId] }), index("bundle_courses_course_idx").on(t.courseId)],
);
