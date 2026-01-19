import { drizzle } from "drizzle-orm/libsql/web";
import { reset } from "drizzle-seed";
import * as schema from "./schema.js";
import { randomUUID } from "crypto";

// Initialize database connection
function initializeDB() {
  return drizzle({
    connection: {
      url: process.env.TURSO_DATABASE_URL!,
      authToken: process.env.TURSO_AUTH_TOKEN!,
    },
    schema,
  });
}

// Reset database
async function resetDB() {
  await reset(
    drizzle({
      connection: {
        url: process.env.TURSO_DATABASE_URL!,
        authToken: process.env.TURSO_AUTH_TOKEN!,
      },
    }),
    schema,
  );
}

// Helper function to generate IDs
function generateId(): string {
  return randomUUID();
}

// Helper function to get current timestamp
function now() {
  return Math.floor(Date.now() / 1000);
}

// Helper function to get expires at
function expiresAt() {
  return Math.floor(new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).getTime() / 1000);
}

// Populate database with sample data
async function populateDatabase() {
  const db = initializeDB();

  // Reset database
  console.log("🌱 Resetting database...");
  await resetDB();

  console.log("🌱 Starting database population...\n");

  try {
    // ===== 1. USERS TABLE =====
    console.log("📝 Inserting users...");
    const users = [
      {
        id: generateId(),
        name: "John Instructor",
        username: "john_instructor",
        email: "john@example.com",
        password: await Bun.password.hash("password", {
          algorithm: "bcrypt",
        }),
        avatar: "https://example.com/avatars/john.jpg",
        bio: "Experienced web development instructor",
        phone: "+62812345678",
        location: "Jakarta, Indonesia",
        status: "active",
        createdAt: now(),
        updatedAt: now(),
        lastLoginAt: now(),
      },
      {
        id: generateId(),
        name: "Sarah Developer",
        username: "sarah_dev",
        email: "sarah@example.com",
        password: await Bun.password.hash("password", {
          algorithm: "bcrypt",
        }),
        avatar: "https://example.com/avatars/sarah.jpg",
        bio: "Full-stack developer and educator",
        phone: "+62823456789",
        location: "Bandung, Indonesia",
        status: "active",
        createdAt: now(),
        updatedAt: now(),
        lastLoginAt: now(),
      },
      {
        id: generateId(),
        name: "Mike Student",
        username: "mike_student",
        email: "mike@example.com",
        password: await Bun.password.hash("password", {
          algorithm: "bcrypt",
        }),
        avatar: "https://example.com/avatars/mike.jpg",
        bio: "Learning web development",
        phone: "+62834567890",
        location: "Surabaya, Indonesia",
        status: "active",
        createdAt: now(),
        updatedAt: now(),
        lastLoginAt: now(),
      },
      {
        id: generateId(),
        name: "Emma Student",
        username: "emma_student",
        email: "emma@example.com",
        password: await Bun.password.hash("password", {
          algorithm: "bcrypt",
        }),
        avatar: "https://example.com/avatars/emma.jpg",
        bio: "Beginner programmer",
        phone: "+62845678901",
        location: "Yogyakarta, Indonesia",
        status: "active",
        createdAt: now(),
        updatedAt: now(),
        lastLoginAt: now(),
      },
    ];

    const insertedUsers = await db.insert(schema.usersTable).values(users).returning();
    console.log(`✅ Inserted ${insertedUsers.length} users\n`);

    const [instructorId, , studentId1, studentId2] = insertedUsers.map((u) => u.id);

    // ===== 2. ROLES TABLE =====
    console.log("📝 Inserting roles...");
    const roles = [
      {
        id: generateId(),
        name: "instructor",
        createdAt: now(),
      },
      {
        id: generateId(),
        name: "student",
        createdAt: now(),
      },
      {
        id: generateId(),
        name: "admin",
        createdAt: now(),
      },
    ];

    const insertedRoles = await db.insert(schema.rolesTable).values(roles).returning();
    console.log(`✅ Inserted ${insertedRoles.length} roles\n`);

    const [instructorRoleId, studentRoleId, adminRoleId] = insertedRoles.map((r) => r.id);

    // ===== 3. USER ROLES TABLE =====
    console.log("📝 Inserting user roles...");
    const userRoles = [
      { userId: instructorId, roleId: instructorRoleId, createdAt: now() },
      { userId: instructorId, roleId: studentRoleId, createdAt: now() },
      { userId: studentId1, roleId: studentRoleId, createdAt: now() },
      { userId: studentId2, roleId: studentRoleId, createdAt: now() },
    ];

    await db.insert(schema.userRolesTable).values(userRoles);
    console.log(`✅ Inserted ${userRoles.length} user role assignments\n`);

    // ===== 4. CATEGORIES TABLE =====
    console.log("📝 Inserting categories...");
    const categories = [
      {
        id: generateId(),
        parentId: null,
        name: "Programming",
        slug: "programming",
        sortOrder: 1,
      },
      {
        id: generateId(),
        parentId: null,
        name: "Web Development",
        slug: "web-development",
        sortOrder: 2,
      },
      {
        id: generateId(),
        parentId: null,
        name: "Mobile Development",
        slug: "mobile-development",
        sortOrder: 3,
      },
      {
        id: generateId(),
        parentId: null,
        name: "Data Science",
        slug: "data-science",
        sortOrder: 4,
      },
    ];

    const insertedCategories = await db.insert(schema.categoriesTable).values(categories).returning();
    console.log(`✅ Inserted ${insertedCategories.length} categories\n`);

    const [webDevCategoryId, , ,] = insertedCategories.map((c) => c.id);

    // ===== 5. COURSE LEVELS TABLE =====
    console.log("📝 Inserting course levels...");
    const courseLevels = [
      { id: generateId(), name: "Beginner" },
      { id: generateId(), name: "Intermediate" },
      { id: generateId(), name: "Advanced" },
    ];

    const insertedLevels = await db.insert(schema.courseLevelsTable).values(courseLevels).returning();
    console.log(`✅ Inserted ${insertedLevels.length} course levels\n`);

    const [beginnerLevelId, intermediateLevelId] = insertedLevels.map((l) => l.id);

    // ===== 6. COURSES TABLE =====
    console.log("📝 Inserting courses...");
    const courses = [
      {
        id: generateId(),
        instructorId,
        categoryId: webDevCategoryId,
        levelId: beginnerLevelId,
        title: "Complete Web Development Bootcamp",
        slug: "complete-web-development-bootcamp",
        subtitle: "Learn HTML, CSS, JavaScript, and React from scratch",
        description: "A comprehensive course covering all aspects of modern web development.",
        language: "id",
        thumbnailUrl: "https://example.com/thumbnails/web-dev.jpg",
        promoVideoUrl: "https://example.com/videos/promo-web-dev.mp4",
        currency: "IDR",
        priceBase: 500000,
        priceCurrent: 350000,
        status: "published",
        ratingAvg: 4.8,
        ratingCount: 245,
        studentCount: 1250,
        createdAt: now(),
        updatedAt: now(),
        publishedAt: now(),
      },
      {
        id: generateId(),
        instructorId,
        categoryId: webDevCategoryId,
        levelId: intermediateLevelId,
        title: "Advanced React Patterns and Performance",
        slug: "advanced-react-patterns",
        subtitle: "Master advanced React concepts and optimization techniques",
        description: "Deep dive into React patterns, hooks, and performance optimization.",
        language: "id",
        thumbnailUrl: "https://example.com/thumbnails/react-advanced.jpg",
        promoVideoUrl: "https://example.com/videos/promo-react.mp4",
        currency: "IDR",
        priceBase: 400000,
        priceCurrent: 300000,
        status: "published",
        ratingAvg: 4.9,
        ratingCount: 156,
        studentCount: 890,
        createdAt: now(),
        updatedAt: now(),
        publishedAt: now(),
      },
    ];

    const insertedCourses = await db.insert(schema.coursesTable).values(courses).returning();
    console.log(`✅ Inserted ${insertedCourses.length} courses\n`);

    const [courseId1, courseId2] = insertedCourses.map((c) => c.id);

    // ===== 7. COURSE TAGS TABLE =====
    console.log("📝 Inserting course tags...");
    const courseTags = [
      { courseId: courseId1, tag: "javascript" },
      { courseId: courseId1, tag: "react" },
      { courseId: courseId1, tag: "web" },
      { courseId: courseId2, tag: "react" },
      { courseId: courseId2, tag: "performance" },
      { courseId: courseId2, tag: "advanced" },
    ];

    await db.insert(schema.courseTagsTable).values(courseTags);
    console.log(`✅ Inserted ${courseTags.length} course tags\n`);

    // ===== 8. COURSE REQUIREMENTS TABLE =====
    console.log("📝 Inserting course requirements...");
    const requirements = [
      {
        id: generateId(),
        courseId: courseId1,
        text: "Basic understanding of HTML and CSS",
        sortOrder: 1,
      },
      {
        id: generateId(),
        courseId: courseId1,
        text: "Familiarity with command line basics",
        sortOrder: 2,
      },
      {
        id: generateId(),
        courseId: courseId2,
        text: "Strong JavaScript fundamentals",
        sortOrder: 1,
      },
      {
        id: generateId(),
        courseId: courseId2,
        text: "Experience with React basics",
        sortOrder: 2,
      },
    ];

    await db.insert(schema.courseRequirementsTable).values(requirements);
    console.log(`✅ Inserted ${requirements.length} course requirements\n`);

    // ===== 9. COURSE OUTCOMES TABLE =====
    console.log("📝 Inserting course outcomes...");
    const outcomes = [
      {
        id: generateId(),
        courseId: courseId1,
        text: "Build fully functional websites with HTML, CSS, and JavaScript",
        sortOrder: 1,
      },
      {
        id: generateId(),
        courseId: courseId1,
        text: "Master React for building modern single-page applications",
        sortOrder: 2,
      },
      {
        id: generateId(),
        courseId: courseId1,
        text: "Deploy applications to production",
        sortOrder: 3,
      },
      {
        id: generateId(),
        courseId: courseId2,
        text: "Implement advanced React patterns",
        sortOrder: 1,
      },
      {
        id: generateId(),
        courseId: courseId2,
        text: "Optimize React application performance",
        sortOrder: 2,
      },
    ];

    await db.insert(schema.courseOutcomesTable).values(outcomes);
    console.log(`✅ Inserted ${outcomes.length} course outcomes\n`);

    // ===== 10. COURSE TARGET AUDIENCE TABLE =====
    console.log("📝 Inserting course target audience...");
    const targetAudience = [
      {
        id: generateId(),
        courseId: courseId1,
        text: "Beginners interested in web development",
        sortOrder: 1,
      },
      {
        id: generateId(),
        courseId: courseId1,
        text: "Career changers looking to learn coding",
        sortOrder: 2,
      },
      {
        id: generateId(),
        courseId: courseId2,
        text: "React developers wanting to advance their skills",
        sortOrder: 1,
      },
    ];

    await db.insert(schema.courseTargetAudienceTable).values(targetAudience);
    console.log(`✅ Inserted ${targetAudience.length} target audience entries\n`);

    // ===== 11. COURSE SECTIONS TABLE =====
    console.log("📝 Inserting course sections...");
    const sections = [
      {
        id: generateId(),
        courseId: courseId1,
        title: "Introduction to Web Development",
        sortOrder: 1,
      },
      {
        id: generateId(),
        courseId: courseId1,
        title: "HTML Fundamentals",
        sortOrder: 2,
      },
      {
        id: generateId(),
        courseId: courseId1,
        title: "CSS Styling and Layout",
        sortOrder: 3,
      },
      {
        id: generateId(),
        courseId: courseId1,
        title: "JavaScript Basics",
        sortOrder: 4,
      },
      {
        id: generateId(),
        courseId: courseId2,
        title: "Advanced Hooks",
        sortOrder: 1,
      },
      {
        id: generateId(),
        courseId: courseId2,
        title: "State Management Patterns",
        sortOrder: 2,
      },
    ];

    const insertedSections = await db.insert(schema.courseSectionsTable).values(sections).returning();
    console.log(`✅ Inserted ${insertedSections.length} course sections\n`);

    const [sectionId1, sectionId2, , , ,] = insertedSections.map((s) => s.id);

    // ===== 12. COURSE LECTURES TABLE =====
    console.log("📝 Inserting course lectures...");
    const lectures = [
      {
        id: generateId(),
        courseId: courseId1,
        sectionId: sectionId1,
        type: "video",
        title: "Welcome and Course Overview",
        description: "Get started with the course and understand what you'll learn",
        durationSeconds: 600,
        isPreview: true,
        sortOrder: 1,
        status: "published",
        publishedAt: now(),
      },
      {
        id: generateId(),
        courseId: courseId1,
        sectionId: sectionId1,
        type: "video",
        title: "Setting Up Your Development Environment",
        description: "Learn how to set up your coding environment for web development",
        durationSeconds: 1200,
        isPreview: false,
        sortOrder: 2,
        status: "published",
        publishedAt: now(),
      },
      {
        id: generateId(),
        courseId: courseId1,
        sectionId: sectionId2,
        type: "video",
        title: "HTML Tags and Elements",
        description: "Master the fundamental HTML tags",
        durationSeconds: 900,
        isPreview: false,
        sortOrder: 1,
        status: "published",
        publishedAt: now(),
      },
      {
        id: generateId(),
        courseId: courseId1,
        sectionId: sectionId2,
        type: "quiz",
        title: "HTML Basics Quiz",
        description: "Test your knowledge of HTML",
        durationSeconds: 1800,
        isPreview: false,
        sortOrder: 2,
        status: "published",
        publishedAt: now(),
      },
      {
        id: generateId(),
        courseId: courseId2,
        sectionId: sectionId1,
        type: "video",
        title: "useCallback and useMemo Hooks",
        description: "Learn about performance optimization hooks",
        durationSeconds: 1500,
        isPreview: false,
        sortOrder: 1,
        status: "published",
        publishedAt: now(),
      },
    ];

    const insertedLectures = await db.insert(schema.courseLecturesTable).values(lectures).returning();
    console.log(`✅ Inserted ${insertedLectures.length} course lectures\n`);

    const [lectureId1, lectureId2, , , lectureId5] = insertedLectures.map((l) => l.id);

    // ===== 13. LECTURE ASSETS TABLE =====
    console.log("📝 Inserting lecture assets...");
    const lectureAssets = [
      {
        id: generateId(),
        lectureId: lectureId1,
        assetType: "video",
        url: "https://example.com/videos/lecture1.mp4",
        filename: "lecture1.mp4",
        sizeBytes: 500000000,
        metaJson: JSON.stringify({ resolution: "1080p", duration: 600 }),
      },
      {
        id: generateId(),
        lectureId: lectureId1,
        assetType: "pdf",
        url: "https://example.com/materials/lecture1-notes.pdf",
        filename: "lecture1-notes.pdf",
        sizeBytes: 5000000,
        metaJson: JSON.stringify({ pages: 10 }),
      },
      {
        id: generateId(),
        lectureId: lectureId2,
        assetType: "video",
        url: "https://example.com/videos/lecture2.mp4",
        filename: "lecture2.mp4",
        sizeBytes: 600000000,
        metaJson: JSON.stringify({ resolution: "1080p", duration: 1200 }),
      },
    ];

    await db.insert(schema.lectureAssetsTable).values(lectureAssets);
    console.log(`✅ Inserted ${lectureAssets.length} lecture assets\n`);

    // ===== 14. ENROLLMENTS TABLE =====
    console.log("📝 Inserting enrollments...");
    const enrollments = [
      {
        id: generateId(),
        userId: studentId1,
        courseId: courseId1,
        source: "purchase",
        enrolledAt: now(),
        accessExpiresAt: expiresAt(),
        status: "active",
      },
      {
        id: generateId(),
        userId: studentId2,
        courseId: courseId1,
        source: "purchase",
        enrolledAt: now(),
        accessExpiresAt: expiresAt(),
        status: "active",
      },
      {
        id: generateId(),
        userId: studentId1,
        courseId: courseId2,
        source: "purchase",
        enrolledAt: now(),
        accessExpiresAt: expiresAt(),
        status: "active",
      },
    ];

    const insertedEnrollments = await db.insert(schema.enrollmentsTable).values(enrollments).returning();
    console.log(`✅ Inserted ${insertedEnrollments.length} enrollments\n`);

    // ===== 15. LECTURE PROGRESS TABLE =====
    console.log("📝 Inserting lecture progress...");
    const lectureProgress = [
      {
        userId: studentId1,
        lectureId: lectureId1,
        courseId: courseId1,
        status: "completed",
        lastPositionSeconds: 600,
        completedAt: now(),
        updatedAt: now(),
      },
      {
        userId: studentId1,
        lectureId: lectureId2,
        courseId: courseId1,
        status: "in_progress",
        lastPositionSeconds: 450,
        completedAt: null,
        updatedAt: now(),
      },
      {
        userId: studentId2,
        lectureId: lectureId1,
        courseId: courseId1,
        status: "completed",
        lastPositionSeconds: 600,
        completedAt: now(),
        updatedAt: now(),
      },
    ];

    await db.insert(schema.lectureProgressTable).values(lectureProgress);
    console.log(`✅ Inserted ${lectureProgress.length} lecture progress records\n`);

    // ===== 16. COURSE PROGRESS SNAPSHOT TABLE =====
    console.log("📝 Inserting course progress snapshots...");
    const progressSnapshots = [
      {
        userId: studentId1,
        courseId: courseId1,
        percent: 50,
        completedLectures: 2,
        totalLectures: 4,
        updatedAt: now(),
      },
      {
        userId: studentId2,
        courseId: courseId1,
        percent: 25,
        completedLectures: 1,
        totalLectures: 4,
        updatedAt: now(),
      },
    ];

    await db.insert(schema.courseProgressSnapshotTable).values(progressSnapshots);
    console.log(`✅ Inserted ${progressSnapshots.length} progress snapshots\n`);

    // ===== 17. COUPONS TABLE =====
    console.log("📝 Inserting coupons...");
    const coupons = [
      {
        id: generateId(),
        code: "WELCOME50",
        type: "percentage",
        value: 50,
        startsAt: now(),
        endsAt: expiresAt(),
        usageLimit: 100,
        usageCount: 25,
        scope: "global",
        createdAt: now(),
      },
      {
        id: generateId(),
        code: "FLATOFF200K",
        type: "fixed",
        value: 200000,
        startsAt: now(),
        endsAt: expiresAt(),
        usageLimit: 50,
        usageCount: 5,
        scope: "global",
        createdAt: now(),
      },
    ];

    const insertedCoupons = await db.insert(schema.couponsTable).values(coupons).returning();
    console.log(`✅ Inserted ${insertedCoupons.length} coupons\n`);

    // ===== 18. COUPON COURSES TABLE =====
    console.log("📝 Inserting coupon courses...");
    const couponCourses = [
      { couponId: insertedCoupons[0].id, courseId: courseId1 },
      { couponId: insertedCoupons[1].id, courseId: courseId1 },
      { couponId: insertedCoupons[1].id, courseId: courseId2 },
    ];

    await db.insert(schema.couponCoursesTable).values(couponCourses);
    console.log(`✅ Inserted ${couponCourses.length} coupon course associations\n`);

    // ===== 19. ORDERS TABLE =====
    console.log("📝 Inserting orders...");
    const orders = [
      {
        id: generateId(),
        userId: studentId1,
        subtotal: 350000,
        discountTotal: 175000,
        taxTotal: 0,
        total: 175000,
        currency: "IDR",
        status: "completed",
        paymentProvider: "midtrans",
        paymentRef: "TXN001",
        createdAt: now(),
        paidAt: now(),
      },
      {
        id: generateId(),
        userId: studentId2,
        subtotal: 350000,
        discountTotal: 0,
        taxTotal: 0,
        total: 350000,
        currency: "IDR",
        status: "completed",
        paymentProvider: "midtrans",
        paymentRef: "TXN002",
        createdAt: now(),
        paidAt: now(),
      },
    ];

    const insertedOrders = await db.insert(schema.ordersTable).values(orders).returning();
    console.log(`✅ Inserted ${insertedOrders.length} orders\n`);

    // ===== 20. ORDER ITEMS TABLE =====
    console.log("📝 Inserting order items...");
    const orderItems = [
      {
        id: generateId(),
        orderId: insertedOrders[0].id,
        itemType: "course",
        itemId: courseId1,
        price: 350000,
        discount: 175000,
        finalPrice: 175000,
      },
      {
        id: generateId(),
        orderId: insertedOrders[1].id,
        itemType: "course",
        itemId: courseId1,
        price: 350000,
        discount: 0,
        finalPrice: 350000,
      },
    ];

    await db.insert(schema.orderItemsTable).values(orderItems);
    console.log(`✅ Inserted ${orderItems.length} order items\n`);

    // ===== 21. COURSE REVIEWS TABLE =====
    console.log("📝 Inserting course reviews...");
    const reviews = [
      {
        id: generateId(),
        courseId: courseId1,
        userId: studentId1,
        rating: 5,
        title: "Excellent Course!",
        body: "This course is comprehensive and well-structured. Highly recommended for beginners.",
        isPublic: true,
        isFlagged: false,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: generateId(),
        courseId: courseId1,
        userId: studentId2,
        rating: 4,
        title: "Great Learning Experience",
        body: "Good course, though some sections could use more practical examples.",
        isPublic: true,
        isFlagged: false,
        createdAt: now(),
        updatedAt: now(),
      },
    ];

    await db.insert(schema.courseReviewsTable).values(reviews);
    console.log(`✅ Inserted ${reviews.length} course reviews\n`);

    // ===== 22. COURSE QUESTIONS TABLE =====
    console.log("📝 Inserting course questions...");
    const questions = [
      {
        id: generateId(),
        courseId: courseId1,
        lectureId: lectureId1,
        userId: studentId1,
        title: "How do I set up a local development server?",
        body: "Can you explain how to set up a local development server for testing?",
        status: "open",
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: generateId(),
        courseId: courseId1,
        lectureId: lectureId2,
        userId: studentId2,
        title: "What's the best practice for organizing CSS?",
        body: "I'm confused about BEM and other CSS methodologies. Which one should I use?",
        status: "open",
        createdAt: now(),
        updatedAt: now(),
      },
    ];

    const insertedQuestions = await db.insert(schema.courseQuestionsTable).values(questions).returning();
    console.log(`✅ Inserted ${insertedQuestions.length} course questions\n`);

    // ===== 23. COURSE ANSWERS TABLE =====
    console.log("📝 Inserting course answers...");
    const answers = [
      {
        id: generateId(),
        questionId: insertedQuestions[0].id,
        userId: instructorId,
        body: "Great question! You can use Node.js with Express for a local development server. Here's how...",
        isInstructor: true,
        createdAt: now(),
        updatedAt: now(),
      },
      {
        id: generateId(),
        questionId: insertedQuestions[1].id,
        userId: instructorId,
        body: "BEM (Block Element Modifier) is an excellent choice for larger projects. Here's why...",
        isInstructor: true,
        createdAt: now(),
        updatedAt: now(),
      },
    ];

    await db.insert(schema.courseAnswersTable).values(answers);
    console.log(`✅ Inserted ${answers.length} course answers\n`);

    // ===== 24. QUESTION VOTES TABLE =====
    console.log("📝 Inserting question votes...");
    const votes = [
      { questionId: insertedQuestions[0].id, userId: studentId2, value: 1, createdAt: now() },
      { questionId: insertedQuestions[1].id, userId: studentId1, value: 1, createdAt: now() },
    ];

    await db.insert(schema.questionVotesTable).values(votes);
    console.log(`✅ Inserted ${votes.length} question votes\n`);

    // ===== 25. QUIZZES TABLE =====
    console.log("📝 Inserting quizzes...");
    const quizzes = [
      {
        id: generateId(),
        lectureId: lectureId1,
        title: "HTML Basics Quiz",
        passingScore: 70,
      },
      {
        id: generateId(),
        lectureId: lectureId5,
        title: "Advanced React Hooks Quiz",
        passingScore: 75,
      },
    ];

    const insertedQuizzes = await db.insert(schema.quizzesTable).values(quizzes).returning();
    console.log(`✅ Inserted ${insertedQuizzes.length} quizzes\n`);

    // ===== 26. QUIZ QUESTIONS TABLE =====
    console.log("📝 Inserting quiz questions...");
    const quizQuestions = [
      {
        id: generateId(),
        quizId: insertedQuizzes[0].id,
        type: "mcq",
        prompt: "What does HTML stand for?",
        sortOrder: 1,
      },
      {
        id: generateId(),
        quizId: insertedQuizzes[0].id,
        type: "mcq",
        prompt: "Which tag is used for the largest heading?",
        sortOrder: 2,
      },
      {
        id: generateId(),
        quizId: insertedQuizzes[1].id,
        type: "mcq",
        prompt: "What is the purpose of useMemo hook?",
        sortOrder: 1,
      },
    ];

    const insertedQuizQuestions = await db.insert(schema.quizQuestionsTable).values(quizQuestions).returning();
    console.log(`✅ Inserted ${insertedQuizQuestions.length} quiz questions\n`);

    // ===== 27. QUIZ OPTIONS TABLE =====
    console.log("📝 Inserting quiz options...");
    const quizOptions = [
      {
        id: generateId(),
        questionId: insertedQuizQuestions[0].id,
        text: "Hyper Text Markup Language",
        isCorrect: true,
      },
      {
        id: generateId(),
        questionId: insertedQuizQuestions[0].id,
        text: "High Tech Modern Language",
        isCorrect: false,
      },
      {
        id: generateId(),
        questionId: insertedQuizQuestions[0].id,
        text: "Home Tool Markup Language",
        isCorrect: false,
      },
      {
        id: generateId(),
        questionId: insertedQuizQuestions[1].id,
        text: "<h1>",
        isCorrect: true,
      },
      {
        id: generateId(),
        questionId: insertedQuizQuestions[1].id,
        text: "<h6>",
        isCorrect: false,
      },
      {
        id: generateId(),
        questionId: insertedQuizQuestions[2].id,
        text: "To memoize expensive computations",
        isCorrect: true,
      },
      {
        id: generateId(),
        questionId: insertedQuizQuestions[2].id,
        text: "To make code shorter",
        isCorrect: false,
      },
    ];

    await db.insert(schema.quizOptionsTable).values(quizOptions);
    console.log(`✅ Inserted ${quizOptions.length} quiz options\n`);

    // ===== 28. QUIZ ATTEMPTS TABLE =====
    console.log("📝 Inserting quiz attempts...");
    const quizAttempts = [
      {
        id: generateId(),
        quizId: insertedQuizzes[0].id,
        userId: studentId1,
        score: 100,
        passed: false,
        startedAt: now(),
        submittedAt: Math.floor(new Date(Date.now() + 10 * 60 * 1000).getTime() / 1000),
      },
      {
        id: generateId(),
        quizId: insertedQuizzes[0].id,
        userId: studentId2,
        score: 50,
        passed: false,
        startedAt: now(),
        submittedAt: Math.floor(new Date(Date.now() + 15 * 60 * 1000).getTime() / 1000),
      },
    ];

    const insertedQuizAttempts = await db.insert(schema.quizAttemptsTable).values(quizAttempts).returning();
    console.log(`✅ Inserted ${insertedQuizAttempts.length} quiz attempts\n`);

    // ===== 29. QUIZ ATTEMPT ANSWERS TABLE =====
    console.log("📝 Inserting quiz attempt answers...");
    const attemptAnswers = [
      {
        attemptId: insertedQuizAttempts[0].id,
        questionId: insertedQuizQuestions[0].id,
        selectedOptionIdsJson: JSON.stringify([quizOptions[0].id]),
      },
      {
        attemptId: insertedQuizAttempts[0].id,
        questionId: insertedQuizQuestions[1].id,
        selectedOptionIdsJson: JSON.stringify([quizOptions[3].id]),
      },
    ];

    await db.insert(schema.quizAttemptAnswersTable).values(attemptAnswers);
    console.log(`✅ Inserted ${attemptAnswers.length} quiz attempt answers\n`);

    // ===== 30. CERTIFICATES TABLE =====
    console.log("📝 Inserting certificates...");
    const certificates = [
      {
        id: generateId(),
        userId: studentId1,
        courseId: courseId1,
        issuedAt: now(),
        certificateNo: "CERT-2024-001",
        pdfUrl: "https://example.com/certificates/cert-001.pdf",
        templateDataJson: JSON.stringify({
          studentName: "Mike Student",
          courseName: "Complete Web Development Bootcamp",
          completionDate: new Date().toLocaleDateString(),
        }),
      },
    ];

    await db.insert(schema.certificatesTable).values(certificates);
    console.log(`✅ Inserted ${certificates.length} certificates\n`);

    // ===== 31. WISHLISTS TABLE =====
    console.log("📝 Inserting wishlists...");
    const wishlists = [
      { userId: studentId1, courseId: courseId2, createdAt: now() },
      { userId: studentId2, courseId: courseId2, createdAt: now() },
    ];

    await db.insert(schema.wishlistsTable).values(wishlists);
    console.log(`✅ Inserted ${wishlists.length} wishlist items\n`);

    // ===== 32. REFUNDS TABLE =====
    console.log("📝 Inserting refunds...");
    const refunds = [
      {
        id: generateId(),
        orderId: insertedOrders[0].id,
        amount: 50000,
        reason: "Course not as expected",
        status: "completed",
        createdAt: now(),
      },
    ];

    await db.insert(schema.refundsTable).values(refunds);
    console.log(`✅ Inserted ${refunds.length} refunds\n`);

    console.log("\n✨ Database population completed successfully!");
  } catch (error) {
    console.error("❌ Error populating database:", error);
    throw error;
  }
}

// Run the population script
await populateDatabase();
