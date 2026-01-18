// server/db/relations.ts
import { relations } from "drizzle-orm";
import {
  usersTable,
  rolesTable,
  userRolesTable,
  categoriesTable,
  courseLevelsTable,
  coursesTable,
  courseTagsTable,
  courseRequirementsTable,
  courseOutcomesTable,
  courseTargetAudienceTable,
  courseSectionsTable,
  courseLecturesTable,
  lectureAssetsTable,
  enrollmentsTable,
  lectureProgressTable,
  courseProgressSnapshotTable,
  ordersTable,
  orderItemsTable,
  couponsTable,
  couponCoursesTable,
  refundsTable,
  courseReviewsTable,
  courseQuestionsTable,
  courseAnswersTable,
  questionVotesTable,
  quizzesTable,
  quizQuestionsTable,
  quizOptionsTable,
  quizAttemptsTable,
  quizAttemptAnswersTable,
  certificatesTable,
  wishlistsTable,
  cartsTable,
  cartItemsTable,
  bundlesTable,
  bundleCoursesTable,
} from "./schema.js";

// =========================
// Users / Roles
// =========================
export const usersRelations = relations(usersTable, ({ many }) => ({
  roles: many(userRolesTable),

  teachingCourses: many(coursesTable),

  enrollments: many(enrollmentsTable),
  lectureProgress: many(lectureProgressTable),
  courseProgressSnapshots: many(courseProgressSnapshotTable),

  orders: many(ordersTable),
  reviews: many(courseReviewsTable),

  questions: many(courseQuestionsTable),
  answers: many(courseAnswersTable),
  questionVotes: many(questionVotesTable),

  quizAttempts: many(quizAttemptsTable),
  certificates: many(certificatesTable),

  wishlists: many(wishlistsTable),
  carts: many(cartsTable),
}));

export const rolesRelations = relations(rolesTable, ({ many }) => ({
  users: many(userRolesTable),
}));

export const userRolesRelations = relations(userRolesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [userRolesTable.userId],
    references: [usersTable.id],
  }),
  role: one(rolesTable, {
    fields: [userRolesTable.roleId],
    references: [rolesTable.id],
  }),
}));

// =========================
// Categories / Levels / Courses
// =========================
export const categoriesRelations = relations(categoriesTable, ({ one, many }) => ({
  parent: one(categoriesTable, {
    fields: [categoriesTable.parentId],
    references: [categoriesTable.id],
  }),
  children: many(categoriesTable),

  courses: many(coursesTable),
}));

export const courseLevelsRelations = relations(courseLevelsTable, ({ many }) => ({
  courses: many(coursesTable),
}));

export const coursesRelations = relations(coursesTable, ({ one, many }) => ({
  instructor: one(usersTable, {
    fields: [coursesTable.instructorId],
    references: [usersTable.id],
  }),
  category: one(categoriesTable, {
    fields: [coursesTable.categoryId],
    references: [categoriesTable.id],
  }),
  level: one(courseLevelsTable, {
    fields: [coursesTable.levelId],
    references: [courseLevelsTable.id],
  }),

  tags: many(courseTagsTable),
  requirements: many(courseRequirementsTable),
  outcomes: many(courseOutcomesTable),
  targetAudience: many(courseTargetAudienceTable),

  sections: many(courseSectionsTable),
  lectures: many(courseLecturesTable),

  enrollments: many(enrollmentsTable),
  reviews: many(courseReviewsTable),

  questions: many(courseQuestionsTable),

  lectureProgress: many(lectureProgressTable),
  courseProgressSnapshots: many(courseProgressSnapshotTable),

  certificates: many(certificatesTable),
  wishlists: many(wishlistsTable),

  couponCourses: many(couponCoursesTable),
  bundleCourses: many(bundleCoursesTable),
}));

export const courseTagsRelations = relations(courseTagsTable, ({ one }) => ({
  course: one(coursesTable, {
    fields: [courseTagsTable.courseId],
    references: [coursesTable.id],
  }),
}));

export const courseRequirementsRelations = relations(courseRequirementsTable, ({ one }) => ({
  course: one(coursesTable, {
    fields: [courseRequirementsTable.courseId],
    references: [coursesTable.id],
  }),
}));

export const courseOutcomesRelations = relations(courseOutcomesTable, ({ one }) => ({
  course: one(coursesTable, {
    fields: [courseOutcomesTable.courseId],
    references: [coursesTable.id],
  }),
}));

export const courseTargetAudienceRelations = relations(courseTargetAudienceTable, ({ one }) => ({
  course: one(coursesTable, {
    fields: [courseTargetAudienceTable.courseId],
    references: [coursesTable.id],
  }),
}));

// =========================
// Curriculum
// =========================
export const courseSectionsRelations = relations(courseSectionsTable, ({ one, many }) => ({
  course: one(coursesTable, {
    fields: [courseSectionsTable.courseId],
    references: [coursesTable.id],
  }),
  lectures: many(courseLecturesTable),
}));

export const courseLecturesRelations = relations(courseLecturesTable, ({ one, many }) => ({
  course: one(coursesTable, {
    fields: [courseLecturesTable.courseId],
    references: [coursesTable.id],
  }),
  section: one(courseSectionsTable, {
    fields: [courseLecturesTable.sectionId],
    references: [courseSectionsTable.id],
  }),
  assets: many(lectureAssetsTable),

  progress: many(lectureProgressTable),

  questions: many(courseQuestionsTable),

  quiz: many(quizzesTable), // (dibuat many karena di schema quiz unique by lecture; secara logika bisa 0..1)
}));

export const lectureAssetsRelations = relations(lectureAssetsTable, ({ one }) => ({
  lecture: one(courseLecturesTable, {
    fields: [lectureAssetsTable.lectureId],
    references: [courseLecturesTable.id],
  }),
}));

// =========================
// Enrollment & Progress
// =========================
export const enrollmentsRelations = relations(enrollmentsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [enrollmentsTable.userId],
    references: [usersTable.id],
  }),
  course: one(coursesTable, {
    fields: [enrollmentsTable.courseId],
    references: [coursesTable.id],
  }),
}));

export const lectureProgressRelations = relations(lectureProgressTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [lectureProgressTable.userId],
    references: [usersTable.id],
  }),
  lecture: one(courseLecturesTable, {
    fields: [lectureProgressTable.lectureId],
    references: [courseLecturesTable.id],
  }),
  course: one(coursesTable, {
    fields: [lectureProgressTable.courseId],
    references: [coursesTable.id],
  }),
}));

export const courseProgressSnapshotRelations = relations(courseProgressSnapshotTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [courseProgressSnapshotTable.userId],
    references: [usersTable.id],
  }),
  course: one(coursesTable, {
    fields: [courseProgressSnapshotTable.courseId],
    references: [coursesTable.id],
  }),
}));

// =========================
// Orders / Items / Coupons / Refunds
// =========================
export const ordersRelations = relations(ordersTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [ordersTable.userId],
    references: [usersTable.id],
  }),
  items: many(orderItemsTable),
  refunds: many(refundsTable),
}));

export const orderItemsRelations = relations(orderItemsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [orderItemsTable.orderId],
    references: [ordersTable.id],
  }),
  // itemType/itemId polymorphic -> tidak bisa FK langsung
}));

export const couponsRelations = relations(couponsTable, ({ many }) => ({
  courses: many(couponCoursesTable),
}));

export const couponCoursesRelations = relations(couponCoursesTable, ({ one }) => ({
  coupon: one(couponsTable, {
    fields: [couponCoursesTable.couponId],
    references: [couponsTable.id],
  }),
  course: one(coursesTable, {
    fields: [couponCoursesTable.courseId],
    references: [coursesTable.id],
  }),
}));

export const refundsRelations = relations(refundsTable, ({ one }) => ({
  order: one(ordersTable, {
    fields: [refundsTable.orderId],
    references: [ordersTable.id],
  }),
}));

// =========================
// Reviews
// =========================
export const courseReviewsRelations = relations(courseReviewsTable, ({ one }) => ({
  course: one(coursesTable, {
    fields: [courseReviewsTable.courseId],
    references: [coursesTable.id],
  }),
  user: one(usersTable, {
    fields: [courseReviewsTable.userId],
    references: [usersTable.id],
  }),
}));

// =========================
// Q&A / Votes
// =========================
export const courseQuestionsRelations = relations(courseQuestionsTable, ({ one, many }) => ({
  course: one(coursesTable, {
    fields: [courseQuestionsTable.courseId],
    references: [coursesTable.id],
  }),
  lecture: one(courseLecturesTable, {
    fields: [courseQuestionsTable.lectureId],
    references: [courseLecturesTable.id],
  }),
  user: one(usersTable, {
    fields: [courseQuestionsTable.userId],
    references: [usersTable.id],
  }),

  answers: many(courseAnswersTable),
  votes: many(questionVotesTable),
}));

export const courseAnswersRelations = relations(courseAnswersTable, ({ one }) => ({
  question: one(courseQuestionsTable, {
    fields: [courseAnswersTable.questionId],
    references: [courseQuestionsTable.id],
  }),
  user: one(usersTable, {
    fields: [courseAnswersTable.userId],
    references: [usersTable.id],
  }),
}));

export const questionVotesRelations = relations(questionVotesTable, ({ one }) => ({
  question: one(courseQuestionsTable, {
    fields: [questionVotesTable.questionId],
    references: [courseQuestionsTable.id],
  }),
  user: one(usersTable, {
    fields: [questionVotesTable.userId],
    references: [usersTable.id],
  }),
}));

// =========================
// Quiz
// =========================
export const quizzesRelations = relations(quizzesTable, ({ one, many }) => ({
  lecture: one(courseLecturesTable, {
    fields: [quizzesTable.lectureId],
    references: [courseLecturesTable.id],
  }),
  questions: many(quizQuestionsTable),
  attempts: many(quizAttemptsTable),
}));

export const quizQuestionsRelations = relations(quizQuestionsTable, ({ one, many }) => ({
  quiz: one(quizzesTable, {
    fields: [quizQuestionsTable.quizId],
    references: [quizzesTable.id],
  }),
  options: many(quizOptionsTable),
  attemptAnswers: many(quizAttemptAnswersTable),
}));

export const quizOptionsRelations = relations(quizOptionsTable, ({ one }) => ({
  question: one(quizQuestionsTable, {
    fields: [quizOptionsTable.questionId],
    references: [quizQuestionsTable.id],
  }),
}));

export const quizAttemptsRelations = relations(quizAttemptsTable, ({ one, many }) => ({
  quiz: one(quizzesTable, {
    fields: [quizAttemptsTable.quizId],
    references: [quizzesTable.id],
  }),
  user: one(usersTable, {
    fields: [quizAttemptsTable.userId],
    references: [usersTable.id],
  }),
  answers: many(quizAttemptAnswersTable),
}));

export const quizAttemptAnswersRelations = relations(quizAttemptAnswersTable, ({ one }) => ({
  attempt: one(quizAttemptsTable, {
    fields: [quizAttemptAnswersTable.attemptId],
    references: [quizAttemptsTable.id],
  }),
  question: one(quizQuestionsTable, {
    fields: [quizAttemptAnswersTable.questionId],
    references: [quizQuestionsTable.id],
  }),
}));

// =========================
// Certificates
// =========================
export const certificatesRelations = relations(certificatesTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [certificatesTable.userId],
    references: [usersTable.id],
  }),
  course: one(coursesTable, {
    fields: [certificatesTable.courseId],
    references: [coursesTable.id],
  }),
}));

// =========================
// Wishlist / Cart
// =========================
export const wishlistsRelations = relations(wishlistsTable, ({ one }) => ({
  user: one(usersTable, {
    fields: [wishlistsTable.userId],
    references: [usersTable.id],
  }),
  course: one(coursesTable, {
    fields: [wishlistsTable.courseId],
    references: [coursesTable.id],
  }),
}));

export const cartsRelations = relations(cartsTable, ({ one, many }) => ({
  user: one(usersTable, {
    fields: [cartsTable.userId],
    references: [usersTable.id],
  }),
  items: many(cartItemsTable),
}));

export const cartItemsRelations = relations(cartItemsTable, ({ one }) => ({
  cart: one(cartsTable, {
    fields: [cartItemsTable.cartId],
    references: [cartsTable.id],
  }),
  // itemType/itemId polymorphic -> tidak bisa FK langsung
}));

// =========================
// Bundles
// =========================
export const bundlesRelations = relations(bundlesTable, ({ many }) => ({
  courses: many(bundleCoursesTable),
}));

export const bundleCoursesRelations = relations(bundleCoursesTable, ({ one }) => ({
  bundle: one(bundlesTable, {
    fields: [bundleCoursesTable.bundleId],
    references: [bundlesTable.id],
  }),
  course: one(coursesTable, {
    fields: [bundleCoursesTable.courseId],
    references: [coursesTable.id],
  }),
}));
