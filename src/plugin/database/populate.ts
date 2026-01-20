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

// Helper function to get past timestamp (days ago)
function daysAgo(days: number) {
  return Math.floor(new Date(Date.now() - days * 24 * 60 * 60 * 1000).getTime() / 1000);
}

// Helper function to get future timestamp (days from now)
function daysFromNow(days: number) {
  return Math.floor(new Date(Date.now() + days * 24 * 60 * 60 * 1000).getTime() / 1000);
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
        name: "Dr. Ahmad Fauzi",
        username: "ahmad_fauzi",
        email: "ahmad.fauzi@instructor.com",
        password: await Bun.password.hash("password123", { algorithm: "bcrypt" }),
        avatar: "https://i.pravatar.cc/150?img=12",
        bio: "Dosen senior bidang pemrograman web dengan pengalaman 15 tahun. Penulis 5 buku tentang web development.",
        phone: "+628123456789",
        location: "Jakarta, Indonesia",
        status: "active",
        createdAt: daysAgo(365),
        updatedAt: now(),
        lastLoginAt: now(),
      },
      {
        id: generateId(),
        name: "Siti Nurhaliza",
        username: "siti_nurhaliza",
        email: "siti.nurhaliza@instructor.com",
        password: await Bun.password.hash("password123", { algorithm: "bcrypt" }),
        avatar: "https://i.pravatar.cc/150?img=45",
        bio: "Full-stack developer & tech educator. Spesialisasi di React, Node.js, dan cloud computing. Mantan senior engineer di startup unicorn.",
        phone: "+628234567890",
        location: "Bandung, Indonesia",
        status: "active",
        createdAt: daysAgo(300),
        updatedAt: now(),
        lastLoginAt: daysAgo(1),
      },
      {
        id: generateId(),
        name: "Budi Santoso",
        username: "budi_santoso",
        email: "budi.santoso@instructor.com",
        password: await Bun.password.hash("password123", { algorithm: "bcrypt" }),
        avatar: "https://i.pravatar.cc/150?img=33",
        bio: "Mobile app developer dengan 10 tahun pengalaman. Pernah mengembangkan aplikasi dengan 5+ juta downloads.",
        phone: "+628345678901",
        location: "Surabaya, Indonesia",
        status: "active",
        createdAt: daysAgo(280),
        updatedAt: now(),
        lastLoginAt: daysAgo(2),
      },
      {
        id: generateId(),
        name: "Dewi Lestari",
        username: "dewi_lestari",
        email: "dewi.lestari@instructor.com",
        password: await Bun.password.hash("password123", { algorithm: "bcrypt" }),
        avatar: "https://i.pravatar.cc/150?img=47",
        bio: "Data scientist & machine learning engineer. PhD in Computer Science. Berpengalaman di industri fintech dan e-commerce.",
        phone: "+628456789012",
        location: "Yogyakarta, Indonesia",
        status: "active",
        createdAt: daysAgo(200),
        updatedAt: now(),
        lastLoginAt: now(),
      },
      {
        id: generateId(),
        name: "Rizki Pratama",
        username: "rizki_pratama",
        email: "rizki.pratama@student.com",
        password: await Bun.password.hash("password123", { algorithm: "bcrypt" }),
        avatar: "https://i.pravatar.cc/150?img=15",
        bio: "Mahasiswa IT semester 6, passionate about web development dan UI/UX design.",
        phone: "+628567890123",
        location: "Malang, Indonesia",
        status: "active",
        createdAt: daysAgo(180),
        updatedAt: now(),
        lastLoginAt: now(),
      },
      {
        id: generateId(),
        name: "Ani Wijaya",
        username: "ani_wijaya",
        email: "ani.wijaya@student.com",
        password: await Bun.password.hash("password123", { algorithm: "bcrypt" }),
        avatar: "https://i.pravatar.cc/150?img=48",
        bio: "Career switcher dari akuntansi ke programming. Currently learning full-stack development.",
        phone: "+628678901234",
        location: "Semarang, Indonesia",
        status: "active",
        createdAt: daysAgo(150),
        updatedAt: now(),
        lastLoginAt: daysAgo(1),
      },
      {
        id: generateId(),
        name: "Eko Prasetyo",
        username: "eko_prasetyo",
        email: "eko.prasetyo@student.com",
        password: await Bun.password.hash("password123", { algorithm: "bcrypt" }),
        avatar: "https://i.pravatar.cc/150?img=51",
        bio: "Fresh graduate mencari karir di bidang software development. Fokus pada backend engineering.",
        phone: "+628789012345",
        location: "Medan, Indonesia",
        status: "active",
        createdAt: daysAgo(120),
        updatedAt: now(),
        lastLoginAt: daysAgo(3),
      },
      {
        id: generateId(),
        name: "Fitri Handayani",
        username: "fitri_handayani",
        email: "fitri.handayani@student.com",
        password: await Bun.password.hash("password123", { algorithm: "bcrypt" }),
        avatar: "https://i.pravatar.cc/150?img=49",
        bio: "Freelance designer yang ingin belajar coding untuk menjadi full-stack designer.",
        phone: "+628890123456",
        location: "Bali, Indonesia",
        status: "active",
        createdAt: daysAgo(90),
        updatedAt: now(),
        lastLoginAt: now(),
      },
      {
        id: generateId(),
        name: "Hendra Gunawan",
        username: "hendra_gunawan",
        email: "hendra.gunawan@student.com",
        password: await Bun.password.hash("password123", { algorithm: "bcrypt" }),
        avatar: "https://i.pravatar.cc/150?img=52",
        bio: "Entrepreneur yang ingin membangun startup teknologi sendiri.",
        phone: "+628901234567",
        location: "Jakarta, Indonesia",
        status: "active",
        createdAt: daysAgo(60),
        updatedAt: now(),
        lastLoginAt: daysAgo(2),
      },
      {
        id: generateId(),
        name: "Ika Putri",
        username: "ika_putri",
        email: "ika.putri@student.com",
        password: await Bun.password.hash("password123", { algorithm: "bcrypt" }),
        avatar: "https://i.pravatar.cc/150?img=44",
        bio: "Siswa SMK jurusan RPL yang ingin mendalami programming lebih lanjut.",
        phone: "+629012345678",
        location: "Bandung, Indonesia",
        status: "active",
        createdAt: daysAgo(45),
        updatedAt: now(),
        lastLoginAt: now(),
      },
    ];

    const insertedUsers = await db.insert(schema.usersTable).values(users).returning();
    console.log(`✅ Inserted ${insertedUsers.length} users\n`);

    const [
      instructorId1,
      instructorId2,
      instructorId3,
      instructorId4,
      studentId1,
      studentId2,
      studentId3,
      studentId4,
      studentId5,
      studentId6,
    ] = insertedUsers.map((u) => u.id);

    // ===== 2. ROLES TABLE =====
    console.log("📝 Inserting roles...");
    const roles = [
      {
        id: generateId(),
        name: "instructor",
        createdAt: daysAgo(400),
      },
      {
        id: generateId(),
        name: "student",
        createdAt: daysAgo(400),
      },
      {
        id: generateId(),
        name: "admin",
        createdAt: daysAgo(400),
      },
    ];

    const insertedRoles = await db.insert(schema.rolesTable).values(roles).returning();
    console.log(`✅ Inserted ${insertedRoles.length} roles\n`);

    const [instructorRoleId, studentRoleId, adminRoleId] = insertedRoles.map((r) => r.id);

    // ===== 3. USER ROLES TABLE =====
    console.log("📝 Inserting user roles...");
    const userRoles = [
      { userId: instructorId1, roleId: instructorRoleId, createdAt: daysAgo(365) },
      { userId: instructorId1, roleId: studentRoleId, createdAt: daysAgo(365) },
      { userId: instructorId2, roleId: instructorRoleId, createdAt: daysAgo(300) },
      { userId: instructorId3, roleId: instructorRoleId, createdAt: daysAgo(280) },
      { userId: instructorId4, roleId: instructorRoleId, createdAt: daysAgo(200) },
      { userId: studentId1, roleId: studentRoleId, createdAt: daysAgo(180) },
      { userId: studentId2, roleId: studentRoleId, createdAt: daysAgo(150) },
      { userId: studentId3, roleId: studentRoleId, createdAt: daysAgo(120) },
      { userId: studentId4, roleId: studentRoleId, createdAt: daysAgo(90) },
      { userId: studentId5, roleId: studentRoleId, createdAt: daysAgo(60) },
      { userId: studentId6, roleId: studentRoleId, createdAt: daysAgo(45) },
    ];

    await db.insert(schema.userRolesTable).values(userRoles);
    console.log(`✅ Inserted ${userRoles.length} user role assignments\n`);

    // ===== 4. CATEGORIES TABLE =====
    console.log("📝 Inserting categories...");
    const categories = [
      {
        id: generateId(),
        parentId: null,
        name: "Pemrograman",
        slug: "pemrograman",
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
      {
        id: generateId(),
        parentId: null,
        name: "Machine Learning",
        slug: "machine-learning",
        sortOrder: 5,
      },
      {
        id: generateId(),
        parentId: null,
        name: "DevOps & Cloud",
        slug: "devops-cloud",
        sortOrder: 6,
      },
      {
        id: generateId(),
        parentId: null,
        name: "UI/UX Design",
        slug: "ui-ux-design",
        sortOrder: 7,
      },
      {
        id: generateId(),
        parentId: null,
        name: "Database",
        slug: "database",
        sortOrder: 8,
      },
      {
        id: generateId(),
        parentId: null,
        name: "Bahasa Inggris",
        slug: "bahasa-inggris",
        sortOrder: 9,
      },
      {
        id: generateId(),
        parentId: null,
        name: "Bahasa Indonesia",
        slug: "bahasa-indonesia",
        sortOrder: 10,
      },
      {
        id: generateId(),
        parentId: null,
        name: "Matematika",
        slug: "matematika",
        sortOrder: 11,
      },
      {
        id: generateId(),
        parentId: null,
        name: "Seni & Desain",
        slug: "seni-desain",
        sortOrder: 12,
      },
      {
        id: generateId(),
        parentId: null,
        name: "Musik",
        slug: "musik",
        sortOrder: 13,
      },
      {
        id: generateId(),
        parentId: null,
        name: "Bisnis & Kewirausahaan",
        slug: "bisnis-kewirausahaan",
        sortOrder: 14,
      },
    ];

    const insertedCategories = await db.insert(schema.categoriesTable).values(categories).returning();
    console.log(`✅ Inserted ${insertedCategories.length} categories\n`);

    const [
      programmingCategoryId,
      webDevCategoryId,
      mobileDevCategoryId,
      dataScienceCategoryId,
      mlCategoryId,
      devopsCategoryId,
      designCategoryId,
      databaseCategoryId,
      englishCategoryId,
      indonesiaCategoryId,
      mathCategoryId,
      artCategoryId,
      musicCategoryId,
      businessCategoryId,
    ] = insertedCategories.map((c) => c.id);

    // ===== 5. COURSE LEVELS TABLE =====
    console.log("📝 Inserting course levels...");
    const courseLevels = [
      { id: generateId(), name: "Beginner" },
      { id: generateId(), name: "Intermediate" },
      { id: generateId(), name: "Advanced" },
      { id: generateId(), name: "All Levels" },
    ];

    const insertedLevels = await db.insert(schema.courseLevelsTable).values(courseLevels).returning();
    console.log(`✅ Inserted ${insertedLevels.length} course levels\n`);

    const [beginnerLevelId, intermediateLevelId, advancedLevelId, allLevelsId] = insertedLevels.map((l) => l.id);

    // ===== 6. COURSES TABLE =====
    console.log("📝 Inserting courses...");
    const courses = [
      {
        id: generateId(),
        instructorId: instructorId1,
        categoryId: webDevCategoryId,
        levelId: beginnerLevelId,
        title: "Bootcamp Web Development Lengkap 2026",
        slug: "bootcamp-web-development-lengkap-2026",
        subtitle: "Belajar HTML, CSS, JavaScript, React, dan Node.js dari nol hingga mahir",
        description:
          "Kursus komprehensif yang mencakup semua aspek modern web development. Anda akan belajar dari dasar HTML/CSS hingga membangun aplikasi full-stack dengan React dan Node.js. Kursus ini dirancang untuk pemula yang ingin menjadi web developer profesional.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/webdev1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        currency: "IDR",
        priceBase: 699000,
        priceCurrent: 499000,
        status: "published",
        ratingAvg: 4.8,
        ratingCount: 1245,
        studentCount: 5680,
        createdAt: daysAgo(300),
        updatedAt: daysAgo(5),
        publishedAt: daysAgo(290),
      },
      {
        id: generateId(),
        instructorId: instructorId2,
        categoryId: webDevCategoryId,
        levelId: intermediateLevelId,
        title: "Master React & Next.js - Build Modern Web Apps",
        slug: "master-react-nextjs-modern-web-apps",
        subtitle: "Kuasai React Hooks, Context API, Next.js 14, dan deployment ke production",
        description:
          "Deep dive ke dalam ekosistem React modern. Pelajari advanced patterns, performance optimization, state management, dan cara membangun aplikasi production-ready dengan Next.js 14. Termasuk materi tentang Server Components dan App Router.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/react1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        currency: "IDR",
        priceBase: 599000,
        priceCurrent: 399000,
        status: "published",
        ratingAvg: 4.9,
        ratingCount: 876,
        studentCount: 3420,
        createdAt: daysAgo(250),
        updatedAt: daysAgo(3),
        publishedAt: daysAgo(240),
      },
      {
        id: generateId(),
        instructorId: instructorId3,
        categoryId: mobileDevCategoryId,
        levelId: beginnerLevelId,
        title: "Flutter untuk Pemula - Build Apps untuk iOS & Android",
        slug: "flutter-pemula-build-apps-ios-android",
        subtitle: "Belajar Flutter dan Dart dari nol, build dan publish aplikasi mobile pertama Anda",
        description:
          "Kursus lengkap Flutter untuk pemula. Mulai dari instalasi, belajar Dart programming, widget system, state management dengan Provider & Riverpod, hingga integrasi dengan Firebase. Di akhir kursus, Anda akan membangun dan publish aplikasi mobile ke App Store dan Play Store.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/flutter1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        currency: "IDR",
        priceBase: 549000,
        priceCurrent: 349000,
        status: "published",
        ratingAvg: 4.7,
        ratingCount: 654,
        studentCount: 2890,
        createdAt: daysAgo(200),
        updatedAt: daysAgo(10),
        publishedAt: daysAgo(190),
      },
      {
        id: generateId(),
        instructorId: instructorId4,
        categoryId: dataScienceCategoryId,
        levelId: intermediateLevelId,
        title: "Data Science dengan Python - Analisis Data Profesional",
        slug: "data-science-python-analisis-profesional",
        subtitle: "Pandas, NumPy, Matplotlib, Seaborn, dan teknik analisis data untuk profesional",
        description:
          "Pelajari cara mengolah, menganalisis, dan memvisualisasikan data menggunakan Python. Kursus ini mencakup Pandas untuk data manipulation, NumPy untuk komputasi numerik, serta Matplotlib dan Seaborn untuk visualisasi data. Bonus: studi kasus analisis data real-world.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/datascience1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        currency: "IDR",
        priceBase: 799000,
        priceCurrent: 549000,
        status: "published",
        ratingAvg: 4.9,
        ratingCount: 432,
        studentCount: 1876,
        createdAt: daysAgo(180),
        updatedAt: daysAgo(7),
        publishedAt: daysAgo(170),
      },
      {
        id: generateId(),
        instructorId: instructorId4,
        categoryId: mlCategoryId,
        levelId: advancedLevelId,
        title: "Machine Learning A-Z: Dari Theory hingga Deployment",
        slug: "machine-learning-theory-deployment",
        subtitle: "Supervised Learning, Deep Learning, Neural Networks, dan deploy ML models ke production",
        description:
          "Kursus machine learning komprehensif yang mencakup algoritma supervised & unsupervised learning, deep learning dengan TensorFlow & PyTorch, computer vision, NLP, dan cara mendeploy model ke production menggunakan Docker dan cloud services.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/ml1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        currency: "IDR",
        priceBase: 999000,
        priceCurrent: 699000,
        status: "published",
        ratingAvg: 4.8,
        ratingCount: 298,
        studentCount: 1245,
        createdAt: daysAgo(150),
        updatedAt: daysAgo(4),
        publishedAt: daysAgo(145),
      },
      {
        id: generateId(),
        instructorId: instructorId1,
        categoryId: webDevCategoryId,
        levelId: advancedLevelId,
        title: "Microservices Architecture dengan Node.js & Docker",
        slug: "microservices-architecture-nodejs-docker",
        subtitle: "Build scalable applications dengan microservices, Docker, Kubernetes, dan message queues",
        description:
          "Pelajari cara membangun aplikasi scalable menggunakan arsitektur microservices. Kursus ini mencakup Node.js, Express, Docker, Kubernetes, RabbitMQ, Redis, dan best practices untuk distributed systems. Cocok untuk yang ingin menjadi senior backend engineer.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/microservices1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        currency: "IDR",
        priceBase: 899000,
        priceCurrent: 599000,
        status: "published",
        ratingAvg: 4.9,
        ratingCount: 187,
        studentCount: 876,
        createdAt: daysAgo(120),
        updatedAt: daysAgo(6),
        publishedAt: daysAgo(115),
      },
      {
        id: generateId(),
        instructorId: instructorId2,
        categoryId: devopsCategoryId,
        levelId: intermediateLevelId,
        title: "DevOps Engineer Bootcamp - CI/CD, AWS, Kubernetes",
        slug: "devops-engineer-bootcamp-cicd-aws-kubernetes",
        subtitle: "Master DevOps practices: Git, Docker, Jenkins, GitHub Actions, AWS, dan Kubernetes",
        description:
          "Kursus lengkap untuk menjadi DevOps Engineer. Pelajari version control dengan Git, containerization dengan Docker, CI/CD dengan Jenkins & GitHub Actions, cloud computing dengan AWS, dan container orchestration dengan Kubernetes. Termasuk hands-on projects.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/devops1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        currency: "IDR",
        priceBase: 849000,
        priceCurrent: 599000,
        status: "published",
        ratingAvg: 4.7,
        ratingCount: 321,
        studentCount: 1543,
        createdAt: daysAgo(100),
        updatedAt: daysAgo(8),
        publishedAt: daysAgo(95),
      },
      {
        id: generateId(),
        instructorId: instructorId3,
        categoryId: mobileDevCategoryId,
        levelId: intermediateLevelId,
        title: "React Native - Build Native Mobile Apps",
        slug: "react-native-build-native-mobile-apps",
        subtitle: "Bangun aplikasi mobile iOS dan Android dengan satu codebase menggunakan React Native",
        description:
          "Pelajari React Native untuk membangun aplikasi mobile native. Kursus ini mencakup React Native fundamentals, navigation dengan React Navigation, state management dengan Redux Toolkit, API integration, push notifications, dan deployment ke App Store & Play Store.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/reactnative1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        currency: "IDR",
        priceBase: 649000,
        priceCurrent: 449000,
        status: "published",
        ratingAvg: 4.6,
        ratingCount: 234,
        studentCount: 1123,
        createdAt: daysAgo(90),
        updatedAt: daysAgo(12),
        publishedAt: daysAgo(85),
      },
      {
        id: generateId(),
        instructorId: instructorId1,
        categoryId: databaseCategoryId,
        levelId: beginnerLevelId,
        title: "Database Design & SQL Mastery",
        slug: "database-design-sql-mastery",
        subtitle: "Dari ERD, normalisasi, hingga complex queries dengan PostgreSQL dan MongoDB",
        description:
          "Kursus komprehensif tentang database design dan SQL. Pelajari Entity Relationship Diagram, database normalization, SQL queries (joins, subqueries, window functions), indexing, transactions, dan juga NoSQL dengan MongoDB. Termasuk best practices dan optimization techniques.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/database1/800/450",
        promoVideoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        currency: "IDR",
        priceBase: 499000,
        priceCurrent: 299000,
        status: "published",
        ratingAvg: 4.8,
        ratingCount: 567,
        studentCount: 2345,
        createdAt: daysAgo(80),
        updatedAt: daysAgo(9),
        publishedAt: daysAgo(75),
      },
      {
        id: generateId(),
        instructorId: instructorId2,
        categoryId: designCategoryId,
        levelId: beginnerLevelId,
        title: "UI/UX Design Fundamentals - Figma & Design Thinking",
        slug: "uiux-design-fundamentals-figma-design-thinking",
        subtitle: "Belajar user research, wireframing, prototyping, dan design systems dengan Figma",
        description:
          "Kursus lengkap UI/UX Design untuk pemula. Pelajari design thinking process, user research methods, information architecture, wireframing, prototyping dengan Figma, dan cara membangun design systems. Bonus: portfolio project dan tips interview untuk UI/UX Designer.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/uiux1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        currency: "IDR",
        priceBase: 549000,
        priceCurrent: 349000,
        status: "published",
        ratingAvg: 4.7,
        ratingCount: 445,
        studentCount: 1987,
        createdAt: daysAgo(70),
        updatedAt: daysAgo(11),
        publishedAt: daysAgo(65),
      },
      {
        id: generateId(),
        instructorId: instructorId1,
        categoryId: programmingCategoryId,
        levelId: beginnerLevelId,
        title: "Python Programming untuk Pemula",
        slug: "python-programming-pemula",
        subtitle: "Belajar Python dari nol: syntax, OOP, file handling, dan project-based learning",
        description:
          "Kursus Python untuk absolute beginners. Mulai dari instalasi, syntax dasar, data types, control flow, functions, OOP, file I/O, error handling, hingga working dengan libraries populer. Termasuk 10+ hands-on projects untuk memperkuat pemahaman.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/python1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/VolkswagenGTIReview.mp4",
        currency: "IDR",
        priceBase: 449000,
        priceCurrent: 249000,
        status: "published",
        ratingAvg: 4.9,
        ratingCount: 1876,
        studentCount: 7654,
        createdAt: daysAgo(365),
        updatedAt: daysAgo(2),
        publishedAt: daysAgo(360),
      },
      {
        id: generateId(),
        instructorId: instructorId3,
        categoryId: webDevCategoryId,
        levelId: intermediateLevelId,
        title: "Full-Stack JavaScript - MERN Stack Developer",
        slug: "fullstack-javascript-mern-stack",
        subtitle: "MongoDB, Express, React, Node.js - Build dan deploy full-stack applications",
        description:
          "Menjadi full-stack developer dengan MERN stack. Kursus ini mencakup MongoDB database design, RESTful API dengan Express.js, modern React dengan hooks, authentication & authorization, payment integration, dan deployment ke AWS/Vercel. Termasuk 3 real-world projects.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/mern1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/WeAreGoingOnBullrun.mp4",
        currency: "IDR",
        priceBase: 749000,
        priceCurrent: 499000,
        status: "published",
        ratingAvg: 4.8,
        ratingCount: 765,
        studentCount: 3210,
        createdAt: daysAgo(220),
        updatedAt: daysAgo(5),
        publishedAt: daysAgo(215),
      },
      {
        id: generateId(),
        instructorId: instructorId2,
        categoryId: englishCategoryId,
        levelId: beginnerLevelId,
        title: "English for Beginners - Belajar Bahasa Inggris dari Nol",
        slug: "english-for-beginners",
        subtitle: "Grammar dasar, vocabulary, conversation, dan pronunciation untuk pemula",
        description:
          "Kursus bahasa Inggris lengkap untuk pemula. Pelajari grammar dasar (tenses, parts of speech), vocabulary sehari-hari, cara berbicara dengan percaya diri, pronunciation yang benar, serta listening dan reading comprehension. Cocok untuk yang ingin belajar bahasa Inggris dari nol.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/english1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        currency: "IDR",
        priceBase: 399000,
        priceCurrent: 249000,
        status: "published",
        ratingAvg: 4.7,
        ratingCount: 892,
        studentCount: 4521,
        createdAt: daysAgo(240),
        updatedAt: daysAgo(8),
        publishedAt: daysAgo(235),
      },
      {
        id: generateId(),
        instructorId: instructorId2,
        categoryId: englishCategoryId,
        levelId: intermediateLevelId,
        title: "TOEFL & IELTS Preparation - Persiapan Tes Bahasa Inggris",
        slug: "toefl-ielts-preparation",
        subtitle: "Strategi dan latihan lengkap untuk mendapatkan skor tinggi TOEFL & IELTS",
        description:
          "Persiapkan diri Anda untuk tes TOEFL dan IELTS dengan kursus komprehensif ini. Pelajari strategi untuk setiap section (Listening, Reading, Writing, Speaking), tips dan trik mengerjakan soal, latihan soal authentic, dan simulasi tes lengkap. Termasuk feedback untuk speaking dan writing.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/toefl1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        currency: "IDR",
        priceBase: 599000,
        priceCurrent: 399000,
        status: "published",
        ratingAvg: 4.9,
        ratingCount: 543,
        studentCount: 2187,
        createdAt: daysAgo(210),
        updatedAt: daysAgo(6),
        publishedAt: daysAgo(205),
      },
      {
        id: generateId(),
        instructorId: instructorId1,
        categoryId: mathCategoryId,
        levelId: beginnerLevelId,
        title: "Matematika Dasar - SD & SMP",
        slug: "matematika-dasar-sd-smp",
        subtitle: "Kuasai matematika dasar: aritmatika, aljabar, geometri, dan statistika",
        description:
          "Kursus matematika dasar untuk siswa SD dan SMP. Materi mencakup operasi bilangan, pecahan, persentase, aljabar dasar, persamaan linear, geometri (luas dan volume), serta statistika dasar. Dijelaskan dengan cara yang mudah dipahami dan banyak contoh soal.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/math1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        currency: "IDR",
        priceBase: 349000,
        priceCurrent: 199000,
        status: "published",
        ratingAvg: 4.8,
        ratingCount: 1234,
        studentCount: 5678,
        createdAt: daysAgo(280),
        updatedAt: daysAgo(4),
        publishedAt: daysAgo(275),
      },
      {
        id: generateId(),
        instructorId: instructorId1,
        categoryId: mathCategoryId,
        levelId: advancedLevelId,
        title: "Kalkulus untuk Mahasiswa & Profesional",
        slug: "kalkulus-mahasiswa-profesional",
        subtitle: "Differential calculus, integral calculus, dan aplikasinya dalam dunia nyata",
        description:
          "Kursus kalkulus lengkap yang mencakup limit, turunan (derivatives), integral, aplikasi turunan dan integral, serta kalkulus multivariabel. Cocok untuk mahasiswa teknik, sains, ekonomi, atau profesional yang membutuhkan pemahaman kalkulus untuk pekerjaan mereka.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/calculus1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        currency: "IDR",
        priceBase: 499000,
        priceCurrent: 349000,
        status: "published",
        ratingAvg: 4.7,
        ratingCount: 456,
        studentCount: 1876,
        createdAt: daysAgo(190),
        updatedAt: daysAgo(7),
        publishedAt: daysAgo(185),
      },
      {
        id: generateId(),
        instructorId: instructorId3,
        categoryId: artCategoryId,
        levelId: beginnerLevelId,
        title: "Belajar Menggambar untuk Pemula",
        slug: "belajar-menggambar-pemula",
        subtitle: "Teknik dasar menggambar: sketsa, shading, perspektif, dan komposisi",
        description:
          "Kursus menggambar lengkap untuk pemula. Pelajari teknik dasar seperti membuat sketsa, shading untuk memberi dimensi, perspektif untuk menggambar objek 3D, komposisi yang baik, dan cara menggambar berbagai objek (manusia, hewan, landscape). Tidak perlu bakat khusus, semua orang bisa belajar menggambar!",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/drawing1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        currency: "IDR",
        priceBase: 449000,
        priceCurrent: 299000,
        status: "published",
        ratingAvg: 4.9,
        ratingCount: 678,
        studentCount: 3456,
        createdAt: daysAgo(160),
        updatedAt: daysAgo(9),
        publishedAt: daysAgo(155),
      },
      {
        id: generateId(),
        instructorId: instructorId3,
        categoryId: artCategoryId,
        levelId: intermediateLevelId,
        title: "Melukis dengan Cat Air (Watercolor Painting)",
        slug: "melukis-cat-air-watercolor",
        subtitle: "Teknik watercolor dari dasar: wet-on-wet, dry brush, layering, dan color mixing",
        description:
          "Pelajari seni melukis dengan cat air dari instruktur berpengalaman. Kursus ini mencakup pemilihan alat dan bahan, teknik dasar (wet-on-wet, wet-on-dry, dry brush), color mixing dan color theory, layering untuk depth, serta cara melukis berbagai subjek (landscape, portrait, still life). Termasuk 15+ painting projects.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/watercolor1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        currency: "IDR",
        priceBase: 549000,
        priceCurrent: 379000,
        status: "published",
        ratingAvg: 4.8,
        ratingCount: 345,
        studentCount: 1654,
        createdAt: daysAgo(140),
        updatedAt: daysAgo(10),
        publishedAt: daysAgo(135),
      },
      {
        id: generateId(),
        instructorId: instructorId4,
        categoryId: indonesiaCategoryId,
        levelId: allLevelsId,
        title: "Bahasa Indonesia yang Baik dan Benar",
        slug: "bahasa-indonesia-baik-benar",
        subtitle: "EYD, tata bahasa, penulisan ilmiah, dan komunikasi efektif dalam bahasa Indonesia",
        description:
          "Tingkatkan kemampuan berbahasa Indonesia Anda. Kursus ini mencakup Ejaan Yang Disempurnakan (EYD), tata bahasa yang benar, pembentukan kalimat efektif, penulisan akademis dan ilmiah, serta keterampilan komunikasi lisan dan tertulis. Cocok untuk pelajar, mahasiswa, dan profesional.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/indonesian1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        currency: "IDR",
        priceBase: 299000,
        priceCurrent: 199000,
        status: "published",
        ratingAvg: 4.6,
        ratingCount: 567,
        studentCount: 2890,
        createdAt: daysAgo(170),
        updatedAt: daysAgo(12),
        publishedAt: daysAgo(165),
      },
      {
        id: generateId(),
        instructorId: instructorId2,
        categoryId: musicCategoryId,
        levelId: beginnerLevelId,
        title: "Belajar Gitar untuk Pemula",
        slug: "belajar-gitar-pemula",
        subtitle: "Chord dasar, strumming patterns, fingerstyle, dan mainkan lagu favorit Anda",
        description:
          "Kursus gitar lengkap untuk pemula. Mulai dari cara memegang gitar yang benar, tuning, chord-chord dasar (C, G, D, Am, Em, dll), strumming patterns, baca tablature, hingga cara memainkan lagu-lagu populer. Tidak perlu punya gitar mahal, gitar apa saja bisa untuk belajar!",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/guitar1/800/450",
        promoVideoUrl: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        currency: "IDR",
        priceBase: 399000,
        priceCurrent: 249000,
        status: "published",
        ratingAvg: 4.9,
        ratingCount: 1123,
        studentCount: 5234,
        createdAt: daysAgo(200),
        updatedAt: daysAgo(5),
        publishedAt: daysAgo(195),
      },
      {
        id: generateId(),
        instructorId: instructorId1,
        categoryId: businessCategoryId,
        levelId: beginnerLevelId,
        title: "Memulai Bisnis Online dari Nol",
        slug: "memulai-bisnis-online-dari-nol",
        subtitle: "Ide bisnis, market research, branding, marketing digital, dan scaling business",
        description:
          "Panduan lengkap memulai bisnis online dari nol. Pelajari cara menemukan ide bisnis yang profitable, melakukan market research, membangun brand, strategi marketing digital (social media, SEO, ads), customer acquisition, dan cara scaling bisnis. Termasuk study kasus bisnis online sukses di Indonesia.",
        language: "id",
        thumbnailUrl: "https://picsum.photos/seed/business1/800/450",
        promoVideoUrl:
          "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        currency: "IDR",
        priceBase: 549000,
        priceCurrent: 349000,
        status: "published",
        ratingAvg: 4.8,
        ratingCount: 789,
        studentCount: 3567,
        createdAt: daysAgo(180),
        updatedAt: daysAgo(6),
        publishedAt: daysAgo(175),
      },
    ];

    const insertedCourses = await db.insert(schema.coursesTable).values(courses).returning();
    console.log(`✅ Inserted ${insertedCourses.length} courses\n`);

    const courseIds = insertedCourses.map((c) => c.id);
    const [
      courseId1,
      courseId2,
      courseId3,
      courseId4,
      courseId5,
      courseId6,
      courseId7,
      courseId8,
      courseId9,
      courseId10,
      courseId11,
      courseId12,
      courseId13,
      courseId14,
      courseId15,
      courseId16,
      courseId17,
      courseId18,
      courseId19,
      courseId20,
      courseId21,
    ] = courseIds;

    // ===== 7. COURSE TAGS TABLE =====
    console.log("📝 Inserting course tags...");
    const courseTags = [
      { courseId: courseId1, tag: "javascript" },
      { courseId: courseId1, tag: "react" },
      { courseId: courseId1, tag: "nodejs" },
      { courseId: courseId1, tag: "html" },
      { courseId: courseId1, tag: "css" },
      { courseId: courseId2, tag: "react" },
      { courseId: courseId2, tag: "nextjs" },
      { courseId: courseId2, tag: "typescript" },
      { courseId: courseId2, tag: "performance" },
      { courseId: courseId3, tag: "flutter" },
      { courseId: courseId3, tag: "dart" },
      { courseId: courseId3, tag: "mobile" },
      { courseId: courseId3, tag: "firebase" },
      { courseId: courseId4, tag: "python" },
      { courseId: courseId4, tag: "pandas" },
      { courseId: courseId4, tag: "data-analysis" },
      { courseId: courseId4, tag: "visualization" },
      { courseId: courseId5, tag: "machine-learning" },
      { courseId: courseId5, tag: "tensorflow" },
      { courseId: courseId5, tag: "deep-learning" },
      { courseId: courseId5, tag: "python" },
      { courseId: courseId6, tag: "microservices" },
      { courseId: courseId6, tag: "docker" },
      { courseId: courseId6, tag: "kubernetes" },
      { courseId: courseId6, tag: "nodejs" },
      { courseId: courseId7, tag: "devops" },
      { courseId: courseId7, tag: "aws" },
      { courseId: courseId7, tag: "kubernetes" },
      { courseId: courseId7, tag: "cicd" },
      { courseId: courseId8, tag: "react-native" },
      { courseId: courseId8, tag: "mobile" },
      { courseId: courseId8, tag: "redux" },
      { courseId: courseId9, tag: "sql" },
      { courseId: courseId9, tag: "postgresql" },
      { courseId: courseId9, tag: "mongodb" },
      { courseId: courseId9, tag: "database" },
      { courseId: courseId10, tag: "ui-design" },
      { courseId: courseId10, tag: "ux-design" },
      { courseId: courseId10, tag: "figma" },
      { courseId: courseId11, tag: "python" },
      { courseId: courseId11, tag: "programming" },
      { courseId: courseId11, tag: "beginner" },
      { courseId: courseId12, tag: "mern" },
      { courseId: courseId12, tag: "fullstack" },
      { courseId: courseId12, tag: "mongodb" },
      { courseId: courseId12, tag: "express" },
    ];

    await db.insert(schema.courseTagsTable).values(courseTags);
    console.log(`✅ Inserted ${courseTags.length} course tags\n`);

    // ===== 8. COURSE REQUIREMENTS TABLE =====
    console.log("📝 Inserting course requirements...");
    const requirements = [
      // Course 1 - Web Dev Bootcamp
      {
        id: generateId(),
        courseId: courseId1,
        text: "Komputer/laptop dengan spesifikasi minimal RAM 4GB",
        sortOrder: 1,
      },
      { id: generateId(), courseId: courseId1, text: "Koneksi internet yang stabil", sortOrder: 2 },
      { id: generateId(), courseId: courseId1, text: "Tidak perlu pengalaman programming sebelumnya", sortOrder: 3 },
      { id: generateId(), courseId: courseId1, text: "Motivasi tinggi untuk belajar dan berlatih", sortOrder: 4 },

      // Course 2 - React & Next.js
      { id: generateId(), courseId: courseId2, text: "Pemahaman solid tentang JavaScript ES6+", sortOrder: 1 },
      { id: generateId(), courseId: courseId2, text: "Pengalaman dasar dengan React", sortOrder: 2 },
      { id: generateId(), courseId: courseId2, text: "Familiar dengan HTML dan CSS", sortOrder: 3 },
      { id: generateId(), courseId: courseId2, text: "Node.js dan npm terinstall di komputer", sortOrder: 4 },

      // Course 3 - Flutter
      {
        id: generateId(),
        courseId: courseId3,
        text: "Laptop dengan RAM minimal 8GB (untuk Android Studio)",
        sortOrder: 1,
      },
      { id: generateId(), courseId: courseId3, text: "Pemahaman dasar tentang programming (opsional)", sortOrder: 2 },
      {
        id: generateId(),
        courseId: courseId3,
        text: "Akun Google Play Developer dan Apple Developer (untuk deployment)",
        sortOrder: 3,
      },

      // Course 4 - Data Science
      { id: generateId(), courseId: courseId4, text: "Pemahaman dasar Python programming", sortOrder: 1 },
      { id: generateId(), courseId: courseId4, text: "Konsep matematika dasar (statistik sederhana)", sortOrder: 2 },
      { id: generateId(), courseId: courseId4, text: "Python 3.8+ terinstall di komputer", sortOrder: 3 },

      // Course 5 - Machine Learning
      { id: generateId(), courseId: courseId5, text: "Python programming intermediate level", sortOrder: 1 },
      {
        id: generateId(),
        courseId: courseId5,
        text: "Matematika: aljabar linear, kalkulus, dan statistik",
        sortOrder: 2,
      },
      { id: generateId(), courseId: courseId5, text: "Pengalaman dengan NumPy dan Pandas", sortOrder: 3 },
      {
        id: generateId(),
        courseId: courseId5,
        text: "GPU untuk training (opsional, bisa pakai Google Colab)",
        sortOrder: 4,
      },
    ];

    await db.insert(schema.courseRequirementsTable).values(requirements);
    console.log(`✅ Inserted ${requirements.length} course requirements\n`);

    // ===== 9. COURSE OUTCOMES TABLE =====
    console.log("📝 Inserting course outcomes...");
    const outcomes = [
      // Course 1 - Web Dev Bootcamp
      {
        id: generateId(),
        courseId: courseId1,
        text: "Membangun website responsive dengan HTML, CSS, dan JavaScript",
        sortOrder: 1,
      },
      {
        id: generateId(),
        courseId: courseId1,
        text: "Membuat aplikasi web modern dengan React dan React Hooks",
        sortOrder: 2,
      },
      {
        id: generateId(),
        courseId: courseId1,
        text: "Mengembangkan RESTful API dengan Node.js dan Express",
        sortOrder: 3,
      },
      {
        id: generateId(),
        courseId: courseId1,
        text: "Deploy aplikasi ke production (Vercel, Netlify, Heroku)",
        sortOrder: 4,
      },
      { id: generateId(), courseId: courseId1, text: "Menggunakan Git dan GitHub untuk version control", sortOrder: 5 },

      // Course 2 - React & Next.js
      {
        id: generateId(),
        courseId: courseId2,
        text: "Menguasai React Hooks (useState, useEffect, useContext, dll)",
        sortOrder: 1,
      },
      { id: generateId(), courseId: courseId2, text: "Membangun aplikasi dengan Next.js 14 App Router", sortOrder: 2 },
      {
        id: generateId(),
        courseId: courseId2,
        text: "Implementasi Server Components dan Client Components",
        sortOrder: 3,
      },
      { id: generateId(), courseId: courseId2, text: "Optimasi performa aplikasi React", sortOrder: 4 },
      { id: generateId(), courseId: courseId2, text: "State management dengan Zustand dan React Query", sortOrder: 5 },

      // Course 3 - Flutter
      {
        id: generateId(),
        courseId: courseId3,
        text: "Membangun aplikasi mobile cross-platform dengan Flutter",
        sortOrder: 1,
      },
      { id: generateId(), courseId: courseId3, text: "Menguasai Dart programming language", sortOrder: 2 },
      {
        id: generateId(),
        courseId: courseId3,
        text: "Implementasi state management dengan Provider dan Riverpod",
        sortOrder: 3,
      },
      {
        id: generateId(),
        courseId: courseId3,
        text: "Integrasi dengan Firebase (Auth, Firestore, Storage)",
        sortOrder: 4,
      },
      {
        id: generateId(),
        courseId: courseId3,
        text: "Publish aplikasi ke Google Play Store dan Apple App Store",
        sortOrder: 5,
      },

      // Course 4 - Data Science
      { id: generateId(), courseId: courseId4, text: "Mengolah dan membersihkan data dengan Pandas", sortOrder: 1 },
      { id: generateId(), courseId: courseId4, text: "Melakukan exploratory data analysis (EDA)", sortOrder: 2 },
      {
        id: generateId(),
        courseId: courseId4,
        text: "Membuat visualisasi data yang menarik dan informatif",
        sortOrder: 3,
      },
      {
        id: generateId(),
        courseId: courseId4,
        text: "Menganalisis dataset real-world untuk insight bisnis",
        sortOrder: 4,
      },

      // Course 5 - Machine Learning
      {
        id: generateId(),
        courseId: courseId5,
        text: "Memahami algoritma supervised dan unsupervised learning",
        sortOrder: 1,
      },
      {
        id: generateId(),
        courseId: courseId5,
        text: "Membangun model machine learning dengan Scikit-learn",
        sortOrder: 2,
      },
      {
        id: generateId(),
        courseId: courseId5,
        text: "Implementasi neural networks dengan TensorFlow dan PyTorch",
        sortOrder: 3,
      },
      {
        id: generateId(),
        courseId: courseId5,
        text: "Deploy model ML ke production dengan Docker dan FastAPI",
        sortOrder: 4,
      },
      { id: generateId(), courseId: courseId5, text: "Mengerjakan project computer vision dan NLP", sortOrder: 5 },
    ];

    await db.insert(schema.courseOutcomesTable).values(outcomes);
    console.log(`✅ Inserted ${outcomes.length} course outcomes\n`);

    // ===== 10. COURSE TARGET AUDIENCE TABLE =====
    console.log("📝 Inserting course target audience...");
    const targetAudience = [
      // Course 1
      {
        id: generateId(),
        courseId: courseId1,
        text: "Pemula yang ingin belajar web development dari nol",
        sortOrder: 1,
      },
      {
        id: generateId(),
        courseId: courseId1,
        text: "Career switchers yang ingin menjadi web developer",
        sortOrder: 2,
      },
      { id: generateId(), courseId: courseId1, text: "Mahasiswa IT yang ingin skill tambahan", sortOrder: 3 },
      {
        id: generateId(),
        courseId: courseId1,
        text: "Freelancer yang ingin menawarkan jasa web development",
        sortOrder: 4,
      },

      // Course 2
      { id: generateId(), courseId: courseId2, text: "React developers yang ingin upgrade ke Next.js", sortOrder: 1 },
      {
        id: generateId(),
        courseId: courseId2,
        text: "Full-stack developers yang ingin mendalami frontend",
        sortOrder: 2,
      },
      {
        id: generateId(),
        courseId: courseId2,
        text: "Software engineers yang ingin memahami modern React patterns",
        sortOrder: 3,
      },

      // Course 3
      { id: generateId(), courseId: courseId3, text: "Pemula yang ingin belajar mobile app development", sortOrder: 1 },
      {
        id: generateId(),
        courseId: courseId3,
        text: "Web developers yang ingin pindah ke mobile development",
        sortOrder: 2,
      },
      {
        id: generateId(),
        courseId: courseId3,
        text: "Entrepreneurs yang ingin build aplikasi mobile sendiri",
        sortOrder: 3,
      },

      // Course 4
      { id: generateId(), courseId: courseId4, text: "Data analysts yang ingin upgrade skill Python", sortOrder: 1 },
      {
        id: generateId(),
        courseId: courseId4,
        text: "Business analysts yang ingin belajar data science",
        sortOrder: 2,
      },
      {
        id: generateId(),
        courseId: courseId4,
        text: "Python developers yang ingin masuk ke data science",
        sortOrder: 3,
      },
    ];

    await db.insert(schema.courseTargetAudienceTable).values(targetAudience);
    console.log(`✅ Inserted ${targetAudience.length} target audience entries\n`);

    // ===== 11. COURSE SECTIONS TABLE =====
    console.log("📝 Inserting course sections...");
    const sections = [
      // Course 1 - Web Dev Bootcamp
      { id: generateId(), courseId: courseId1, title: "Pengenalan & Setup Environment", sortOrder: 1 },
      { id: generateId(), courseId: courseId1, title: "HTML Fundamentals", sortOrder: 2 },
      { id: generateId(), courseId: courseId1, title: "CSS & Responsive Design", sortOrder: 3 },
      { id: generateId(), courseId: courseId1, title: "JavaScript Basics", sortOrder: 4 },
      { id: generateId(), courseId: courseId1, title: "JavaScript Advanced & DOM Manipulation", sortOrder: 5 },
      { id: generateId(), courseId: courseId1, title: "React Fundamentals", sortOrder: 6 },
      { id: generateId(), courseId: courseId1, title: "Node.js & Backend Development", sortOrder: 7 },
      { id: generateId(), courseId: courseId1, title: "Final Project & Deployment", sortOrder: 8 },

      // Course 2 - React & Next.js
      { id: generateId(), courseId: courseId2, title: "Review React Fundamentals", sortOrder: 1 },
      { id: generateId(), courseId: courseId2, title: "Advanced React Hooks", sortOrder: 2 },
      { id: generateId(), courseId: courseId2, title: "Next.js 14 Introduction", sortOrder: 3 },
      { id: generateId(), courseId: courseId2, title: "Server Components & Client Components", sortOrder: 4 },
      { id: generateId(), courseId: courseId2, title: "Data Fetching & Caching Strategies", sortOrder: 5 },
      { id: generateId(), courseId: courseId2, title: "Performance Optimization", sortOrder: 6 },

      // Course 3 - Flutter
      { id: generateId(), courseId: courseId3, title: "Flutter Setup & Introduction", sortOrder: 1 },
      { id: generateId(), courseId: courseId3, title: "Dart Programming Language", sortOrder: 2 },
      { id: generateId(), courseId: courseId3, title: "Flutter Widgets & Layouts", sortOrder: 3 },
      { id: generateId(), courseId: courseId3, title: "State Management dengan Provider", sortOrder: 4 },
      { id: generateId(), courseId: courseId3, title: "Firebase Integration", sortOrder: 5 },
      { id: generateId(), courseId: courseId3, title: "Deployment to App Stores", sortOrder: 6 },
    ];

    const insertedSections = await db.insert(schema.courseSectionsTable).values(sections).returning();
    console.log(`✅ Inserted ${insertedSections.length} course sections\n`);

    const sectionIds = insertedSections.map((s) => s.id);

    // ===== 12. COURSE LECTURES TABLE =====
    console.log("📝 Inserting course lectures...");
    const lectures = [
      // Course 1 - Section 1
      {
        id: generateId(),
        courseId: courseId1,
        sectionId: sectionIds[0],
        type: "video",
        title: "Selamat Datang di Bootcamp Web Development",
        description: "Pengenalan kursus dan overview materi yang akan dipelajari",
        durationSeconds: 480,
        isPreview: true,
        sortOrder: 1,
        status: "published",
        publishedAt: daysAgo(290),
      },
      {
        id: generateId(),
        courseId: courseId1,
        sectionId: sectionIds[0],
        type: "video",
        title: "Setup Development Environment",
        description: "Install VS Code, browser, dan tools yang diperlukan",
        durationSeconds: 720,
        isPreview: true,
        sortOrder: 2,
        status: "published",
        publishedAt: daysAgo(290),
      },
      {
        id: generateId(),
        courseId: courseId1,
        sectionId: sectionIds[0],
        type: "video",
        title: "Cara Kerja Web & Internet",
        description: "Memahami client-server, HTTP, dan DNS",
        durationSeconds: 900,
        isPreview: false,
        sortOrder: 3,
        status: "published",
        publishedAt: daysAgo(290),
      },

      // Course 1 - Section 2
      {
        id: generateId(),
        courseId: courseId1,
        sectionId: sectionIds[1],
        type: "video",
        title: "HTML Basics - Tags & Elements",
        description: "Belajar tag-tag HTML dasar dan struktur dokumen",
        durationSeconds: 1200,
        isPreview: false,
        sortOrder: 1,
        status: "published",
        publishedAt: daysAgo(285),
      },
      {
        id: generateId(),
        courseId: courseId1,
        sectionId: sectionIds[1],
        type: "video",
        title: "HTML Forms & Input Types",
        description: "Membuat form interaktif dengan berbagai input",
        durationSeconds: 1500,
        isPreview: false,
        sortOrder: 2,
        status: "published",
        publishedAt: daysAgo(285),
      },
      {
        id: generateId(),
        courseId: courseId1,
        sectionId: sectionIds[1],
        type: "video",
        title: "Semantic HTML & Accessibility",
        description: "Best practices HTML untuk SEO dan accessibility",
        durationSeconds: 1080,
        isPreview: false,
        sortOrder: 3,
        status: "published",
        publishedAt: daysAgo(285),
      },
      {
        id: generateId(),
        courseId: courseId1,
        sectionId: sectionIds[1],
        type: "quiz",
        title: "Quiz: HTML Fundamentals",
        description: "Test pemahaman Anda tentang HTML basics",
        durationSeconds: 1200,
        isPreview: false,
        sortOrder: 4,
        status: "published",
        publishedAt: daysAgo(285),
      },

      // Course 1 - Section 3
      {
        id: generateId(),
        courseId: courseId1,
        sectionId: sectionIds[2],
        type: "video",
        title: "CSS Basics - Selectors & Properties",
        description: "Belajar CSS selectors, colors, fonts, dan spacing",
        durationSeconds: 1350,
        isPreview: false,
        sortOrder: 1,
        status: "published",
        publishedAt: daysAgo(280),
      },
      {
        id: generateId(),
        courseId: courseId1,
        sectionId: sectionIds[2],
        type: "video",
        title: "CSS Flexbox Layout",
        description: "Master flexbox untuk layout modern",
        durationSeconds: 1620,
        isPreview: false,
        sortOrder: 2,
        status: "published",
        publishedAt: daysAgo(280),
      },
      {
        id: generateId(),
        courseId: courseId1,
        sectionId: sectionIds[2],
        type: "video",
        title: "CSS Grid Layout",
        description: "Membuat complex layouts dengan CSS Grid",
        durationSeconds: 1800,
        isPreview: false,
        sortOrder: 3,
        status: "published",
        publishedAt: daysAgo(280),
      },
      {
        id: generateId(),
        courseId: courseId1,
        sectionId: sectionIds[2],
        type: "video",
        title: "Responsive Design & Media Queries",
        description: "Membuat website yang responsive di semua device",
        durationSeconds: 1440,
        isPreview: false,
        sortOrder: 4,
        status: "published",
        publishedAt: daysAgo(280),
      },

      // Course 2 - Section 1
      {
        id: generateId(),
        courseId: courseId2,
        sectionId: sectionIds[8],
        type: "video",
        title: "React Quick Review",
        description: "Review cepat konsep-konsep penting React",
        durationSeconds: 900,
        isPreview: true,
        sortOrder: 1,
        status: "published",
        publishedAt: daysAgo(240),
      },
      {
        id: generateId(),
        courseId: courseId2,
        sectionId: sectionIds[8],
        type: "video",
        title: "Modern JavaScript for React",
        description: "ES6+ features yang sering digunakan di React",
        durationSeconds: 1080,
        isPreview: false,
        sortOrder: 2,
        status: "published",
        publishedAt: daysAgo(240),
      },

      // Course 2 - Section 2
      {
        id: generateId(),
        courseId: courseId2,
        sectionId: sectionIds[9],
        type: "video",
        title: "useCallback Hook Deep Dive",
        description: "Kapan dan bagaimana menggunakan useCallback",
        durationSeconds: 1500,
        isPreview: false,
        sortOrder: 1,
        status: "published",
        publishedAt: daysAgo(235),
      },
      {
        id: generateId(),
        courseId: courseId2,
        sectionId: sectionIds[9],
        type: "video",
        title: "useMemo for Performance",
        description: "Optimasi performa dengan useMemo hook",
        durationSeconds: 1350,
        isPreview: false,
        sortOrder: 2,
        status: "published",
        publishedAt: daysAgo(235),
      },
      {
        id: generateId(),
        courseId: courseId2,
        sectionId: sectionIds[9],
        type: "video",
        title: "Custom Hooks Best Practices",
        description: "Membuat dan menggunakan custom hooks dengan benar",
        durationSeconds: 1620,
        isPreview: false,
        sortOrder: 3,
        status: "published",
        publishedAt: daysAgo(235),
      },

      // Course 2 - Section 3
      {
        id: generateId(),
        courseId: courseId2,
        sectionId: sectionIds[10],
        type: "video",
        title: "Next.js 14 Overview & Setup",
        description: "Pengenalan Next.js 14 dan setup project",
        durationSeconds: 1200,
        isPreview: true,
        sortOrder: 1,
        status: "published",
        publishedAt: daysAgo(230),
      },
      {
        id: generateId(),
        courseId: courseId2,
        sectionId: sectionIds[10],
        type: "video",
        title: "App Router vs Pages Router",
        description: "Perbedaan dan kapan menggunakan masing-masing",
        durationSeconds: 960,
        isPreview: false,
        sortOrder: 2,
        status: "published",
        publishedAt: daysAgo(230),
      },
      {
        id: generateId(),
        courseId: courseId2,
        sectionId: sectionIds[10],
        type: "video",
        title: "File-based Routing System",
        description: "Memahami routing di Next.js 14",
        durationSeconds: 1440,
        isPreview: false,
        sortOrder: 3,
        status: "published",
        publishedAt: daysAgo(230),
      },

      // Course 3 - Section 1
      {
        id: generateId(),
        courseId: courseId3,
        sectionId: sectionIds[14],
        type: "video",
        title: "Apa itu Flutter?",
        description: "Pengenalan Flutter dan keuntungan menggunakan Flutter",
        durationSeconds: 720,
        isPreview: true,
        sortOrder: 1,
        status: "published",
        publishedAt: daysAgo(190),
      },
      {
        id: generateId(),
        courseId: courseId3,
        sectionId: sectionIds[14],
        type: "video",
        title: "Install Flutter & Android Studio",
        description: "Setup development environment untuk Flutter",
        durationSeconds: 1800,
        isPreview: true,
        sortOrder: 2,
        status: "published",
        publishedAt: daysAgo(190),
      },
      {
        id: generateId(),
        courseId: courseId3,
        sectionId: sectionIds[14],
        type: "video",
        title: "Aplikasi Flutter Pertama",
        description: "Membuat dan menjalankan aplikasi Flutter pertama",
        durationSeconds: 1200,
        isPreview: false,
        sortOrder: 3,
        status: "published",
        publishedAt: daysAgo(190),
      },

      // Course 3 - Section 2
      {
        id: generateId(),
        courseId: courseId3,
        sectionId: sectionIds[15],
        type: "video",
        title: "Dart Syntax & Variables",
        description: "Belajar syntax dasar dan variables di Dart",
        durationSeconds: 1350,
        isPreview: false,
        sortOrder: 1,
        status: "published",
        publishedAt: daysAgo(185),
      },
      {
        id: generateId(),
        courseId: courseId3,
        sectionId: sectionIds[15],
        type: "video",
        title: "Dart Functions & Classes",
        description: "Memahami functions dan OOP di Dart",
        durationSeconds: 1620,
        isPreview: false,
        sortOrder: 2,
        status: "published",
        publishedAt: daysAgo(185),
      },
      {
        id: generateId(),
        courseId: courseId3,
        sectionId: sectionIds[15],
        type: "quiz",
        title: "Quiz: Dart Fundamentals",
        description: "Test pemahaman Dart programming",
        durationSeconds: 900,
        isPreview: false,
        sortOrder: 3,
        status: "published",
        publishedAt: daysAgo(185),
      },
    ];

    const insertedLectures = await db.insert(schema.courseLecturesTable).values(lectures).returning();
    console.log(`✅ Inserted ${insertedLectures.length} course lectures\n`);

    const lectureIds = insertedLectures.map((l) => l.id);

    // ===== 13. LECTURE ASSETS TABLE =====
    console.log("📝 Inserting lecture assets...");
    const lectureAssets = [
      // Video assets (using sample videos from Google)
      {
        id: generateId(),
        lectureId: lectureIds[0],
        assetType: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
        filename: "welcome-video.mp4",
        sizeBytes: 8946123,
        metaJson: JSON.stringify({ resolution: "720p", duration: 480, codec: "h264" }),
      },
      {
        id: generateId(),
        lectureId: lectureIds[1],
        assetType: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4",
        filename: "setup-environment.mp4",
        sizeBytes: 15824512,
        metaJson: JSON.stringify({ resolution: "1080p", duration: 720, codec: "h264" }),
      },
      {
        id: generateId(),
        lectureId: lectureIds[2],
        assetType: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
        filename: "how-web-works.mp4",
        sizeBytes: 21456789,
        metaJson: JSON.stringify({ resolution: "1080p", duration: 900, codec: "h264" }),
      },
      {
        id: generateId(),
        lectureId: lectureIds[3],
        assetType: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
        filename: "html-basics.mp4",
        sizeBytes: 28945123,
        metaJson: JSON.stringify({ resolution: "1080p", duration: 1200, codec: "h264" }),
      },
      {
        id: generateId(),
        lectureId: lectureIds[4],
        assetType: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4",
        filename: "html-forms.mp4",
        sizeBytes: 35687412,
        metaJson: JSON.stringify({ resolution: "1080p", duration: 1500, codec: "h264" }),
      },

      // PDF materials (using placeholder PDFs)
      {
        id: generateId(),
        lectureId: lectureIds[0],
        assetType: "pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        filename: "course-overview.pdf",
        sizeBytes: 2456789,
        metaJson: JSON.stringify({ pages: 15, title: "Course Overview & Syllabus" }),
      },
      {
        id: generateId(),
        lectureId: lectureIds[1],
        assetType: "pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        filename: "setup-guide.pdf",
        sizeBytes: 3245678,
        metaJson: JSON.stringify({ pages: 20, title: "Complete Setup Guide" }),
      },
      {
        id: generateId(),
        lectureId: lectureIds[3],
        assetType: "pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        filename: "html-cheatsheet.pdf",
        sizeBytes: 1895432,
        metaJson: JSON.stringify({ pages: 8, title: "HTML Tags Cheatsheet" }),
      },
      {
        id: generateId(),
        lectureId: lectureIds[7],
        assetType: "pdf",
        url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        filename: "css-selectors-guide.pdf",
        sizeBytes: 2134567,
        metaJson: JSON.stringify({ pages: 12, title: "CSS Selectors Reference" }),
      },

      // Code files
      {
        id: generateId(),
        lectureId: lectureIds[3],
        assetType: "code",
        url: "https://gist.githubusercontent.com/placeholder/code.html",
        filename: "example-page.html",
        sizeBytes: 5432,
        metaJson: JSON.stringify({ language: "html", lines: 45 }),
      },
      {
        id: generateId(),
        lectureId: lectureIds[8],
        assetType: "code",
        url: "https://gist.githubusercontent.com/placeholder/styles.css",
        filename: "styles-example.css",
        sizeBytes: 8765,
        metaJson: JSON.stringify({ language: "css", lines: 120 }),
      },

      // More video assets for other courses
      {
        id: generateId(),
        lectureId: lectureIds[11],
        assetType: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
        filename: "react-review.mp4",
        sizeBytes: 18945123,
        metaJson: JSON.stringify({ resolution: "1080p", duration: 900, codec: "h264" }),
      },
      {
        id: generateId(),
        lectureId: lectureIds[14],
        assetType: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4",
        filename: "usecallback-deep-dive.mp4",
        sizeBytes: 32456789,
        metaJson: JSON.stringify({ resolution: "1080p", duration: 1500, codec: "h264" }),
      },
      {
        id: generateId(),
        lectureId: lectureIds[17],
        assetType: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4",
        filename: "nextjs-overview.mp4",
        sizeBytes: 28945678,
        metaJson: JSON.stringify({ resolution: "1080p", duration: 1200, codec: "h264" }),
      },
      {
        id: generateId(),
        lectureId: lectureIds[20],
        assetType: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutbackOnStreetAndDirt.mp4",
        filename: "what-is-flutter.mp4",
        sizeBytes: 16784512,
        metaJson: JSON.stringify({ resolution: "720p", duration: 720, codec: "h264" }),
      },
      {
        id: generateId(),
        lectureId: lectureIds[21],
        assetType: "video",
        url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4",
        filename: "flutter-installation.mp4",
        sizeBytes: 42567891,
        metaJson: JSON.stringify({ resolution: "1080p", duration: 1800, codec: "h264" }),
      },
    ];

    await db.insert(schema.lectureAssetsTable).values(lectureAssets);
    console.log(`✅ Inserted ${lectureAssets.length} lecture assets\n`);

    // ===== 14. ENROLLMENTS TABLE =====
    console.log("📝 Inserting enrollments...");
    const enrollments = [
      // Course 1 enrollments
      {
        id: generateId(),
        userId: studentId1,
        courseId: courseId1,
        source: "purchase",
        enrolledAt: daysAgo(170),
        accessExpiresAt: daysFromNow(195),
        status: "active",
      },
      {
        id: generateId(),
        userId: studentId2,
        courseId: courseId1,
        source: "purchase",
        enrolledAt: daysAgo(140),
        accessExpiresAt: daysFromNow(225),
        status: "active",
      },
      {
        id: generateId(),
        userId: studentId3,
        courseId: courseId1,
        source: "purchase",
        enrolledAt: daysAgo(110),
        accessExpiresAt: daysFromNow(255),
        status: "active",
      },
      {
        id: generateId(),
        userId: studentId4,
        courseId: courseId1,
        source: "gift",
        enrolledAt: daysAgo(80),
        accessExpiresAt: daysFromNow(285),
        status: "active",
      },

      // Course 2 enrollments
      {
        id: generateId(),
        userId: studentId1,
        courseId: courseId2,
        source: "purchase",
        enrolledAt: daysAgo(150),
        accessExpiresAt: daysFromNow(215),
        status: "active",
      },
      {
        id: generateId(),
        userId: studentId3,
        courseId: courseId2,
        source: "purchase",
        enrolledAt: daysAgo(100),
        accessExpiresAt: daysFromNow(265),
        status: "active",
      },
      {
        id: generateId(),
        userId: studentId5,
        courseId: courseId2,
        source: "purchase",
        enrolledAt: daysAgo(50),
        accessExpiresAt: daysFromNow(315),
        status: "active",
      },

      // Course 3 enrollments
      {
        id: generateId(),
        userId: studentId2,
        courseId: courseId3,
        source: "purchase",
        enrolledAt: daysAgo(130),
        accessExpiresAt: daysFromNow(235),
        status: "active",
      },
      {
        id: generateId(),
        userId: studentId4,
        courseId: courseId3,
        source: "purchase",
        enrolledAt: daysAgo(75),
        accessExpiresAt: daysFromNow(290),
        status: "active",
      },
      {
        id: generateId(),
        userId: studentId6,
        courseId: courseId3,
        source: "purchase",
        enrolledAt: daysAgo(40),
        accessExpiresAt: daysFromNow(325),
        status: "active",
      },

      // Course 4 enrollments
      {
        id: generateId(),
        userId: studentId1,
        courseId: courseId4,
        source: "purchase",
        enrolledAt: daysAgo(120),
        accessExpiresAt: daysFromNow(245),
        status: "active",
      },
      {
        id: generateId(),
        userId: studentId3,
        courseId: courseId4,
        source: "purchase",
        enrolledAt: daysAgo(95),
        accessExpiresAt: daysFromNow(270),
        status: "active",
      },

      // Course 11 enrollments (Python for beginners - popular course)
      {
        id: generateId(),
        userId: studentId2,
        courseId: courseId11,
        source: "purchase",
        enrolledAt: daysAgo(200),
        accessExpiresAt: daysFromNow(165),
        status: "active",
      },
      {
        id: generateId(),
        userId: studentId5,
        courseId: courseId11,
        source: "purchase",
        enrolledAt: daysAgo(55),
        accessExpiresAt: daysFromNow(310),
        status: "active",
      },
      {
        id: generateId(),
        userId: studentId6,
        courseId: courseId11,
        source: "coupon",
        enrolledAt: daysAgo(42),
        accessExpiresAt: daysFromNow(323),
        status: "active",
      },
    ];

    const insertedEnrollments = await db.insert(schema.enrollmentsTable).values(enrollments).returning();
    console.log(`✅ Inserted ${insertedEnrollments.length} enrollments\n`);

    // ===== 15. LECTURE PROGRESS TABLE =====
    console.log("📝 Inserting lecture progress...");
    const lectureProgress = [
      // Student 1 progress in Course 1
      {
        userId: studentId1,
        lectureId: lectureIds[0],
        courseId: courseId1,
        status: "completed",
        lastPositionSeconds: 480,
        completedAt: daysAgo(169),
        updatedAt: daysAgo(169),
      },
      {
        userId: studentId1,
        lectureId: lectureIds[1],
        courseId: courseId1,
        status: "completed",
        lastPositionSeconds: 720,
        completedAt: daysAgo(168),
        updatedAt: daysAgo(168),
      },
      {
        userId: studentId1,
        lectureId: lectureIds[2],
        courseId: courseId1,
        status: "completed",
        lastPositionSeconds: 900,
        completedAt: daysAgo(167),
        updatedAt: daysAgo(167),
      },
      {
        userId: studentId1,
        lectureId: lectureIds[3],
        courseId: courseId1,
        status: "completed",
        lastPositionSeconds: 1200,
        completedAt: daysAgo(165),
        updatedAt: daysAgo(165),
      },
      {
        userId: studentId1,
        lectureId: lectureIds[4],
        courseId: courseId1,
        status: "in_progress",
        lastPositionSeconds: 850,
        completedAt: null,
        updatedAt: daysAgo(2),
      },

      // Student 2 progress in Course 1
      {
        userId: studentId2,
        lectureId: lectureIds[0],
        courseId: courseId1,
        status: "completed",
        lastPositionSeconds: 480,
        completedAt: daysAgo(139),
        updatedAt: daysAgo(139),
      },
      {
        userId: studentId2,
        lectureId: lectureIds[1],
        courseId: courseId1,
        status: "completed",
        lastPositionSeconds: 720,
        completedAt: daysAgo(138),
        updatedAt: daysAgo(138),
      },
      {
        userId: studentId2,
        lectureId: lectureIds[2],
        courseId: courseId1,
        status: "in_progress",
        lastPositionSeconds: 450,
        completedAt: null,
        updatedAt: daysAgo(5),
      },

      // Student 3 progress in Course 1
      {
        userId: studentId3,
        lectureId: lectureIds[0],
        courseId: courseId1,
        status: "completed",
        lastPositionSeconds: 480,
        completedAt: daysAgo(109),
        updatedAt: daysAgo(109),
      },
      {
        userId: studentId3,
        lectureId: lectureIds[1],
        courseId: courseId1,
        status: "not_started",
        lastPositionSeconds: 0,
        completedAt: null,
        updatedAt: daysAgo(109),
      },

      // Student 1 progress in Course 2
      {
        userId: studentId1,
        lectureId: lectureIds[11],
        courseId: courseId2,
        status: "completed",
        lastPositionSeconds: 900,
        completedAt: daysAgo(149),
        updatedAt: daysAgo(149),
      },
      {
        userId: studentId1,
        lectureId: lectureIds[12],
        courseId: courseId2,
        status: "completed",
        lastPositionSeconds: 1080,
        completedAt: daysAgo(148),
        updatedAt: daysAgo(148),
      },
      {
        userId: studentId1,
        lectureId: lectureIds[14],
        courseId: courseId2,
        status: "completed",
        lastPositionSeconds: 1500,
        completedAt: daysAgo(145),
        updatedAt: daysAgo(145),
      },
      {
        userId: studentId1,
        lectureId: lectureIds[15],
        courseId: courseId2,
        status: "in_progress",
        lastPositionSeconds: 780,
        completedAt: null,
        updatedAt: daysAgo(1),
      },

      // Student 2 progress in Course 3
      {
        userId: studentId2,
        lectureId: lectureIds[20],
        courseId: courseId3,
        status: "completed",
        lastPositionSeconds: 720,
        completedAt: daysAgo(129),
        updatedAt: daysAgo(129),
      },
      {
        userId: studentId2,
        lectureId: lectureIds[21],
        courseId: courseId3,
        status: "completed",
        lastPositionSeconds: 1800,
        completedAt: daysAgo(127),
        updatedAt: daysAgo(127),
      },
      {
        userId: studentId2,
        lectureId: lectureIds[22],
        courseId: courseId3,
        status: "completed",
        lastPositionSeconds: 1200,
        completedAt: daysAgo(125),
        updatedAt: daysAgo(125),
      },
      {
        userId: studentId2,
        lectureId: lectureIds[23],
        courseId: courseId3,
        status: "in_progress",
        lastPositionSeconds: 650,
        completedAt: null,
        updatedAt: daysAgo(4),
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
        percent: 40,
        completedLectures: 4,
        totalLectures: 10,
        updatedAt: daysAgo(2),
      },
      {
        userId: studentId2,
        courseId: courseId1,
        percent: 20,
        completedLectures: 2,
        totalLectures: 10,
        updatedAt: daysAgo(5),
      },
      {
        userId: studentId3,
        courseId: courseId1,
        percent: 10,
        completedLectures: 1,
        totalLectures: 10,
        updatedAt: daysAgo(109),
      },
      {
        userId: studentId1,
        courseId: courseId2,
        percent: 60,
        completedLectures: 9,
        totalLectures: 15,
        updatedAt: daysAgo(1),
      },
      {
        userId: studentId2,
        courseId: courseId3,
        percent: 45,
        completedLectures: 5,
        totalLectures: 11,
        updatedAt: daysAgo(4),
      },
    ];

    await db.insert(schema.courseProgressSnapshotTable).values(progressSnapshots);
    console.log(`✅ Inserted ${progressSnapshots.length} progress snapshots\n`);

    // ===== 17. COUPONS TABLE =====
    console.log("📝 Inserting coupons...");
    const coupons = [
      {
        id: generateId(),
        code: "WELCOME2026",
        type: "percentage",
        value: 50,
        startsAt: daysAgo(100),
        endsAt: daysFromNow(265),
        usageLimit: 1000,
        usageCount: 234,
        scope: "global",
        createdAt: daysAgo(100),
      },
      {
        id: generateId(),
        code: "NEWYEAR50",
        type: "percentage",
        value: 50,
        startsAt: daysAgo(20),
        endsAt: daysFromNow(10),
        usageLimit: 500,
        usageCount: 123,
        scope: "global",
        createdAt: daysAgo(20),
      },
      {
        id: generateId(),
        code: "DISCOUNT100K",
        type: "fixed",
        value: 100000,
        startsAt: daysAgo(60),
        endsAt: daysFromNow(305),
        usageLimit: 200,
        usageCount: 67,
        scope: "global",
        createdAt: daysAgo(60),
      },
      {
        id: generateId(),
        code: "FIRSTCOURSE30",
        type: "percentage",
        value: 30,
        startsAt: daysAgo(150),
        endsAt: daysFromNow(215),
        usageLimit: 2000,
        usageCount: 876,
        scope: "global",
        createdAt: daysAgo(150),
      },
      {
        id: generateId(),
        code: "WEBDEV2026",
        type: "percentage",
        value: 40,
        startsAt: daysAgo(90),
        endsAt: daysFromNow(275),
        usageLimit: 100,
        usageCount: 45,
        scope: "specific",
        createdAt: daysAgo(90),
      },
    ];

    const insertedCoupons = await db.insert(schema.couponsTable).values(coupons).returning();
    console.log(`✅ Inserted ${insertedCoupons.length} coupons\n`);

    // ===== 18. COUPON COURSES TABLE =====
    console.log("📝 Inserting coupon courses...");
    const couponCourses = [
      { couponId: insertedCoupons[4].id, courseId: courseId1 },
      { couponId: insertedCoupons[4].id, courseId: courseId2 },
      { couponId: insertedCoupons[4].id, courseId: courseId12 },
    ];

    await db.insert(schema.couponCoursesTable).values(couponCourses);
    console.log(`✅ Inserted ${couponCourses.length} coupon course associations\n`);

    // ===== 19. ORDERS TABLE =====
    console.log("📝 Inserting orders...");
    const orders = [
      {
        id: generateId(),
        userId: studentId1,
        subtotal: 499000,
        discountTotal: 249500,
        taxTotal: 0,
        total: 249500,
        currency: "IDR",
        status: "completed",
        paymentProvider: "midtrans",
        paymentRef: "TXN20260115001",
        createdAt: daysAgo(170),
        paidAt: daysAgo(170),
      },
      {
        id: generateId(),
        userId: studentId2,
        subtotal: 499000,
        discountTotal: 149700,
        taxTotal: 0,
        total: 349300,
        currency: "IDR",
        status: "completed",
        paymentProvider: "midtrans",
        paymentRef: "TXN20260120002",
        createdAt: daysAgo(140),
        paidAt: daysAgo(140),
      },
      {
        id: generateId(),
        userId: studentId3,
        subtotal: 499000,
        discountTotal: 0,
        taxTotal: 0,
        total: 499000,
        currency: "IDR",
        status: "completed",
        paymentProvider: "xendit",
        paymentRef: "XND20260125003",
        createdAt: daysAgo(110),
        paidAt: daysAgo(110),
      },
      {
        id: generateId(),
        userId: studentId1,
        subtotal: 399000,
        discountTotal: 0,
        taxTotal: 0,
        total: 399000,
        currency: "IDR",
        status: "completed",
        paymentProvider: "midtrans",
        paymentRef: "TXN20260128004",
        createdAt: daysAgo(150),
        paidAt: daysAgo(150),
      },
      {
        id: generateId(),
        userId: studentId2,
        subtotal: 349000,
        discountTotal: 0,
        taxTotal: 0,
        total: 349000,
        currency: "IDR",
        status: "completed",
        paymentProvider: "midtrans",
        paymentRef: "TXN20260205005",
        createdAt: daysAgo(130),
        paidAt: daysAgo(130),
      },
      {
        id: generateId(),
        userId: studentId1,
        subtotal: 549000,
        discountTotal: 100000,
        taxTotal: 0,
        total: 449000,
        currency: "IDR",
        status: "completed",
        paymentProvider: "xendit",
        paymentRef: "XND20260208006",
        createdAt: daysAgo(120),
        paidAt: daysAgo(120),
      },
      {
        id: generateId(),
        userId: studentId5,
        subtotal: 399000,
        discountTotal: 199500,
        taxTotal: 0,
        total: 199500,
        currency: "IDR",
        status: "completed",
        paymentProvider: "midtrans",
        paymentRef: "TXN20260212007",
        createdAt: daysAgo(50),
        paidAt: daysAgo(50),
      },
      {
        id: generateId(),
        userId: studentId6,
        subtotal: 249000,
        discountTotal: 0,
        taxTotal: 0,
        total: 249000,
        currency: "IDR",
        status: "completed",
        paymentProvider: "midtrans",
        paymentRef: "TXN20260215008",
        createdAt: daysAgo(42),
        paidAt: daysAgo(42),
      },
      {
        id: generateId(),
        userId: studentId4,
        subtotal: 349000,
        discountTotal: 0,
        taxTotal: 0,
        total: 349000,
        currency: "IDR",
        status: "completed",
        paymentProvider: "xendit",
        paymentRef: "XND20260218009",
        createdAt: daysAgo(75),
        paidAt: daysAgo(75),
      },
      {
        id: generateId(),
        userId: studentId6,
        subtotal: 349000,
        discountTotal: 0,
        taxTotal: 0,
        total: 349000,
        currency: "IDR",
        status: "completed",
        paymentProvider: "midtrans",
        paymentRef: "TXN20260220010",
        createdAt: daysAgo(40),
        paidAt: daysAgo(40),
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
        price: 499000,
        discount: 249500,
        finalPrice: 249500,
      },
      {
        id: generateId(),
        orderId: insertedOrders[1].id,
        itemType: "course",
        itemId: courseId1,
        price: 499000,
        discount: 149700,
        finalPrice: 349300,
      },
      {
        id: generateId(),
        orderId: insertedOrders[2].id,
        itemType: "course",
        itemId: courseId1,
        price: 499000,
        discount: 0,
        finalPrice: 499000,
      },
      {
        id: generateId(),
        orderId: insertedOrders[3].id,
        itemType: "course",
        itemId: courseId2,
        price: 399000,
        discount: 0,
        finalPrice: 399000,
      },
      {
        id: generateId(),
        orderId: insertedOrders[4].id,
        itemType: "course",
        itemId: courseId3,
        price: 349000,
        discount: 0,
        finalPrice: 349000,
      },
      {
        id: generateId(),
        orderId: insertedOrders[5].id,
        itemType: "course",
        itemId: courseId4,
        price: 549000,
        discount: 100000,
        finalPrice: 449000,
      },
      {
        id: generateId(),
        orderId: insertedOrders[6].id,
        itemType: "course",
        itemId: courseId2,
        price: 399000,
        discount: 199500,
        finalPrice: 199500,
      },
      {
        id: generateId(),
        orderId: insertedOrders[7].id,
        itemType: "course",
        itemId: courseId11,
        price: 249000,
        discount: 0,
        finalPrice: 249000,
      },
      {
        id: generateId(),
        orderId: insertedOrders[8].id,
        itemType: "course",
        itemId: courseId3,
        price: 349000,
        discount: 0,
        finalPrice: 349000,
      },
      {
        id: generateId(),
        orderId: insertedOrders[9].id,
        itemType: "course",
        itemId: courseId3,
        price: 349000,
        discount: 0,
        finalPrice: 349000,
      },
    ];

    await db.insert(schema.orderItemsTable).values(orderItems);
    console.log(`✅ Inserted ${orderItems.length} order items\n`);

    // ===== 21. COURSE REVIEWS TABLE =====
    console.log("📝 Inserting course reviews...");
    const reviews = [
      // Course 1 reviews
      {
        id: generateId(),
        courseId: courseId1,
        userId: studentId1,
        rating: 5,
        title: "Kursus Terbaik untuk Pemula!",
        body: "Kursus ini sangat cocok untuk pemula yang ingin belajar web development. Materinya lengkap, dijelaskan dengan detail, dan mudah dipahami. Saya yang tadinya tidak tahu apa-apa tentang coding, sekarang sudah bisa membuat website sendiri. Terima kasih!",
        isPublic: true,
        isFlagged: false,
        createdAt: daysAgo(160),
        updatedAt: daysAgo(160),
      },
      {
        id: generateId(),
        courseId: courseId1,
        userId: studentId2,
        rating: 4,
        title: "Bagus tapi bisa lebih baik",
        body: "Materinya bagus dan lengkap, tapi beberapa video agak terlalu cepat dijelaskannya. Mungkin bisa ditambahkan lebih banyak latihan praktis. Overall tetap recommended!",
        isPublic: true,
        isFlagged: false,
        createdAt: daysAgo(135),
        updatedAt: daysAgo(135),
      },
      {
        id: generateId(),
        courseId: courseId1,
        userId: studentId3,
        rating: 5,
        title: "Worth the investment!",
        body: "Harga yang saya bayar sangat sebanding dengan ilmu yang didapat. Instruktur menjelaskan dengan sangat baik, bahkan konsep yang rumit pun jadi mudah dimengerti. Highly recommended!",
        isPublic: true,
        isFlagged: false,
        createdAt: daysAgo(100),
        updatedAt: daysAgo(100),
      },
      {
        id: generateId(),
        courseId: courseId1,
        userId: studentId4,
        rating: 5,
        title: "Career changer disini!",
        body: "Saya career switcher dari accounting ke programming. Kursus ini membantu saya memulai karir baru saya sebagai web developer. Sekarang sudah kerja di startup! Terima kasih banyak!",
        isPublic: true,
        isFlagged: false,
        createdAt: daysAgo(70),
        updatedAt: daysAgo(70),
      },

      // Course 2 reviews
      {
        id: generateId(),
        courseId: courseId2,
        userId: studentId1,
        rating: 5,
        title: "Next.js 14 explained perfectly",
        body: "Penjelasan tentang App Router dan Server Components sangat jelas. Setelah mengikuti kursus ini, saya jadi lebih percaya diri menggunakan Next.js 14 di project production.",
        isPublic: true,
        isFlagged: false,
        createdAt: daysAgo(140),
        updatedAt: daysAgo(140),
      },
      {
        id: generateId(),
        courseId: courseId2,
        userId: studentId3,
        rating: 4,
        title: "Advanced tapi tetap mudah dipahami",
        body: "Walaupun materinya advanced, cara pengajarannya membuat saya tetap bisa mengikuti. Beberapa bagian perlu diulang berkali-kali, tapi itu normal untuk materi advanced.",
        isPublic: true,
        isFlagged: false,
        createdAt: daysAgo(95),
        updatedAt: daysAgo(95),
      },
      {
        id: generateId(),
        courseId: courseId2,
        userId: studentId5,
        rating: 5,
        title: "Performance optimization mantap!",
        body: "Section tentang performance optimization sangat membantu. Website yang saya develop sekarang jadi jauh lebih cepat. Great course!",
        isPublic: true,
        isFlagged: false,
        createdAt: daysAgo(45),
        updatedAt: daysAgo(45),
      },

      // Course 3 reviews
      {
        id: generateId(),
        courseId: courseId3,
        userId: studentId2,
        rating: 5,
        title: "Dari nol sampai publish app!",
        body: "Sekarang aplikasi saya sudah live di Play Store dan App Store! Kursus ini benar-benar step by step dan sangat membantu. Instrukturnya juga responsif menjawab pertanyaan.",
        isPublic: true,
        isFlagged: false,
        createdAt: daysAgo(120),
        updatedAt: daysAgo(120),
      },
      {
        id: generateId(),
        courseId: courseId3,
        userId: studentId4,
        rating: 4,
        title: "Flutter made easy",
        body: "Flutter awalnya terlihat rumit, tapi setelah kursus ini jadi terasa mudah. Material tentang state management sangat membantu. Recommended untuk yang mau belajar mobile dev!",
        isPublic: true,
        isFlagged: false,
        createdAt: daysAgo(68),
        updatedAt: daysAgo(68),
      },
      {
        id: generateId(),
        courseId: courseId3,
        userId: studentId6,
        rating: 5,
        title: "Project akhir sangat bermanfaat",
        body: "Project akhir di kursus ini sangat real-world dan applicable. Setelah selesai, saya punya portfolio yang bagus untuk apply kerja.",
        isPublic: true,
        isFlagged: false,
        createdAt: daysAgo(35),
        updatedAt: daysAgo(35),
      },

      // Course 4 reviews
      {
        id: generateId(),
        courseId: courseId4,
        userId: studentId1,
        rating: 5,
        title: "Data Science jadi lebih clear",
        body: "Pandas dan NumPy yang tadinya membingungkan, sekarang jadi lebih jelas. Visualisasi data yang diajarin juga sangat praktis untuk pekerjaan sehari-hari.",
        isPublic: true,
        isFlagged: false,
        createdAt: daysAgo(115),
        updatedAt: daysAgo(115),
      },
      {
        id: generateId(),
        courseId: courseId4,
        userId: studentId3,
        rating: 5,
        title: "Real-world case studies!",
        body: "Suka banget sama case studies nya yang pakai dataset real-world. Jadi bisa langsung praktik untuk kasus yang mirip dengan pekerjaan.",
        isPublic: true,
        isFlagged: false,
        createdAt: daysAgo(90),
        updatedAt: daysAgo(90),
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
        lectureId: lectureIds[1],
        userId: studentId1,
        title: "Error saat install Node.js di Windows",
        body: "Saya mengalami error 'permission denied' ketika install Node.js di Windows 11. Sudah coba run as administrator tapi tetap error. Ada solusi?",
        status: "open",
        createdAt: daysAgo(168),
        updatedAt: daysAgo(167),
      },
      {
        id: generateId(),
        courseId: courseId1,
        lectureId: lectureIds[3],
        userId: studentId2,
        title: "Perbedaan div dan span?",
        body: "Masih bingung kapan harus pakai div dan kapan harus pakai span. Bisa dijelaskan lebih detail? Terima kasih!",
        status: "open",
        createdAt: daysAgo(138),
        updatedAt: daysAgo(137),
      },
      {
        id: generateId(),
        courseId: courseId1,
        lectureId: lectureIds[8],
        userId: studentId3,
        title: "Flexbox vs Grid, mana yang lebih baik?",
        body: "Untuk layout modern, lebih baik pakai Flexbox atau Grid? Atau kedua-duanya bisa dipakai bersamaan? Mohon pencerahannya.",
        status: "open",
        createdAt: daysAgo(108),
        updatedAt: daysAgo(108),
      },
      {
        id: generateId(),
        courseId: courseId1,
        lectureId: lectureIds[4],
        userId: studentId4,
        title: "Form validation dengan JavaScript",
        body: "Apakah ada library yang recommended untuk form validation? Atau lebih baik buat sendiri dari scratch?",
        status: "open",
        createdAt: daysAgo(78),
        updatedAt: daysAgo(77),
      },
      {
        id: generateId(),
        courseId: courseId2,
        lectureId: lectureIds[14],
        userId: studentId1,
        title: "useCallback vs useMemo confusion",
        body: "Masih agak bingung kapan harus pakai useCallback dan kapan harus pakai useMemo. Bisa diberikan contoh use case yang lebih spesifik?",
        status: "open",
        createdAt: daysAgo(147),
        updatedAt: daysAgo(146),
      },
      {
        id: generateId(),
        courseId: courseId2,
        lectureId: lectureIds[17],
        userId: studentId3,
        title: "Server Components best practices",
        body: "Apa saja best practices untuk menggunakan Server Components? Ada pitfall yang harus dihindari?",
        status: "open",
        createdAt: daysAgo(97),
        updatedAt: daysAgo(97),
      },
      {
        id: generateId(),
        courseId: courseId3,
        lectureId: lectureIds[21],
        userId: studentId2,
        title: "Android Studio sangat lambat",
        body: "Android Studio di laptop saya sangat lambat (RAM 8GB). Ada tips untuk optimasi atau alternatif lain?",
        status: "open",
        createdAt: daysAgo(128),
        updatedAt: daysAgo(127),
      },
      {
        id: generateId(),
        courseId: courseId3,
        lectureId: lectureIds[23],
        userId: studentId4,
        title: "Dart vs JavaScript differences",
        body: "Saya sudah familiar dengan JavaScript. Apa saja perbedaan utama Dart dengan JavaScript yang harus saya perhatikan?",
        status: "open",
        createdAt: daysAgo(73),
        updatedAt: daysAgo(73),
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
        userId: instructorId1,
        body: "Coba solusi ini:\n1. Uninstall Node.js yang ada\n2. Disable antivirus sementara\n3. Download installer terbaru dari nodejs.org\n4. Run installer as administrator\n5. Pilih 'Automatically install necessary tools'\n\nKalau masih error, bisa coba pakai nvm (Node Version Manager) sebagai alternatif.",
        isInstructor: true,
        createdAt: daysAgo(167),
        updatedAt: daysAgo(167),
      },
      {
        id: generateId(),
        questionId: insertedQuestions[1].id,
        userId: instructorId1,
        body: "Great question! Perbedaan utamanya:\n\n**<div>** (block-level element):\n- Mengambil full width yang tersedia\n- Selalu dimulai di line baru\n- Dipakai untuk grouping elements yang lebih besar\n- Contoh: sections, containers, layout wrappers\n\n**<span>** (inline element):\n- Hanya mengambil width sesuai content\n- Tidak break ke line baru\n- Dipakai untuk styling text atau small elements\n- Contoh: highlighting text, icons dalam paragraph\n\nRule of thumb: Kalau mau wrap block of content, pakai div. Kalau cuma mau style bagian kecil inline, pakai span.",
        isInstructor: true,
        createdAt: daysAgo(137),
        updatedAt: daysAgo(137),
      },
      {
        id: generateId(),
        questionId: insertedQuestions[2].id,
        userId: instructorId1,
        body: "Keduanya bagus dan bisa dipakai bersamaan!\n\n**Flexbox**: Best untuk one-dimensional layouts (row atau column)\n- Navigation bars\n- Card layouts\n- Aligning items in one direction\n\n**Grid**: Best untuk two-dimensional layouts (rows AND columns)\n- Complex page layouts\n- Image galleries\n- Dashboard layouts\n\nTips: Pakai Grid untuk overall page layout, lalu pakai Flexbox untuk components di dalamnya. Kombinasi keduanya sangat powerful!",
        isInstructor: true,
        createdAt: daysAgo(108),
        updatedAt: daysAgo(108),
      },
      {
        id: generateId(),
        questionId: insertedQuestions[3].id,
        userId: instructorId1,
        body: 'Untuk form validation, saya recommend:\n\n**Built-in HTML5 validation** (untuk simple cases):\n- required, type="email", pattern, dll\n- Gratis dan native browser support\n\n**React Hook Form** (untuk React projects):\n- Lightweight dan performant\n- Built-in validation atau pakai Zod/Yup\n- Best choice untuk production apps\n\n**Zod** (untuk type-safe validation):\n- TypeScript-first\n- Bisa di frontend & backend\n- Great DX\n\nUntuk learning purpose, coba buat sendiri dulu untuk pahami konsepnya. Untuk production, pakai library yang sudah tested.',
        isInstructor: true,
        createdAt: daysAgo(77),
        updatedAt: daysAgo(77),
      },
      {
        id: generateId(),
        questionId: insertedQuestions[4].id,
        userId: instructorId2,
        body: "Mudahnya:\n\n**useCallback**: Memoize FUNCTION\n- Pakai ketika pass function sebagai prop ke child component\n- Prevents unnecessary re-renders karena function reference berubah\n- Contoh: onClick handlers yang di-pass ke child\n\n**useMemo**: Memoize VALUE (hasil computation)\n- Pakai untuk expensive calculations\n- Returns computed value, bukan function\n- Contoh: filtered/sorted array, complex mathematical operations\n\nJangan over-optimize! Pakai hanya kalau benar-benar ada performance issue.",
        isInstructor: true,
        createdAt: daysAgo(146),
        updatedAt: daysAgo(146),
      },
      {
        id: generateId(),
        questionId: insertedQuestions[5].id,
        userId: instructorId2,
        body: "Server Components best practices:\n\n✅ DO:\n- Fetch data langsung di component\n- Keep logic di server side\n- Import server-only packages\n- Use async/await freely\n\n❌ DON'T:\n- Pakai useState, useEffect, atau browser APIs\n- Add event listeners (onClick, dll)\n- Import client-only libraries\n\n**Pitfalls to avoid**:\n1. Mixing server dan client logic tanpa 'use client'\n2. Pass non-serializable props (functions, dll) dari server ke client\n3. Forget to handle loading states di client components\n\nWill make a separate video about this! 🎥",
        isInstructor: true,
        createdAt: daysAgo(97),
        updatedAt: daysAgo(97),
      },
    ];

    await db.insert(schema.courseAnswersTable).values(answers);
    console.log(`✅ Inserted ${answers.length} course answers\n`);

    // ===== 24. QUESTION VOTES TABLE =====
    console.log("📝 Inserting question votes...");
    const votes = [
      { questionId: insertedQuestions[0].id, userId: studentId2, value: 1, createdAt: daysAgo(167) },
      { questionId: insertedQuestions[0].id, userId: studentId3, value: 1, createdAt: daysAgo(166) },
      { questionId: insertedQuestions[1].id, userId: studentId1, value: 1, createdAt: daysAgo(137) },
      { questionId: insertedQuestions[1].id, userId: studentId3, value: 1, createdAt: daysAgo(136) },
      { questionId: insertedQuestions[1].id, userId: studentId4, value: 1, createdAt: daysAgo(135) },
      { questionId: insertedQuestions[2].id, userId: studentId1, value: 1, createdAt: daysAgo(107) },
      { questionId: insertedQuestions[2].id, userId: studentId2, value: 1, createdAt: daysAgo(107) },
      { questionId: insertedQuestions[4].id, userId: studentId3, value: 1, createdAt: daysAgo(146) },
      { questionId: insertedQuestions[4].id, userId: studentId5, value: 1, createdAt: daysAgo(145) },
    ];

    await db.insert(schema.questionVotesTable).values(votes);
    console.log(`✅ Inserted ${votes.length} question votes\n`);

    // ===== 25. QUIZZES TABLE =====
    console.log("📝 Inserting quizzes...");
    const quizzes = [
      { id: generateId(), lectureId: lectureIds[6], title: "HTML Fundamentals Quiz", passingScore: 70 },
      { id: generateId(), lectureId: lectureIds[10], title: "CSS & Responsive Design Quiz", passingScore: 70 },
      { id: generateId(), lectureId: lectureIds[16], title: "Advanced React Hooks Quiz", passingScore: 75 },
      { id: generateId(), lectureId: lectureIds[24], title: "Flutter Development Quiz", passingScore: 70 },
    ];

    const insertedQuizzes = await db.insert(schema.quizzesTable).values(quizzes).returning();
    console.log(`✅ Inserted ${insertedQuizzes.length} quizzes\n`);

    // ===== 26. QUIZ QUESTIONS TABLE =====
    console.log("📝 Inserting quiz questions...");
    const quizQuestions = [
      // Quiz 1 - HTML Fundamentals
      {
        id: generateId(),
        quizId: insertedQuizzes[0].id,
        type: "mcq",
        prompt: "Apa kepanjangan dari HTML?",
        sortOrder: 1,
      },
      {
        id: generateId(),
        quizId: insertedQuizzes[0].id,
        type: "mcq",
        prompt: "Tag mana yang digunakan untuk heading terbesar?",
        sortOrder: 2,
      },
      {
        id: generateId(),
        quizId: insertedQuizzes[0].id,
        type: "mcq",
        prompt: "Bagaimana cara membuat link di HTML?",
        sortOrder: 3,
      },
      {
        id: generateId(),
        quizId: insertedQuizzes[0].id,
        type: "mcq",
        prompt: "Atribut apa yang digunakan untuk menambahkan gambar?",
        sortOrder: 4,
      },

      // Quiz 2 - CSS & Responsive
      {
        id: generateId(),
        quizId: insertedQuizzes[1].id,
        type: "mcq",
        prompt: "Property CSS apa yang digunakan untuk mengubah warna teks?",
        sortOrder: 1,
      },
      {
        id: generateId(),
        quizId: insertedQuizzes[1].id,
        type: "mcq",
        prompt: "Apa fungsi dari media queries?",
        sortOrder: 2,
      },
      {
        id: generateId(),
        quizId: insertedQuizzes[1].id,
        type: "mcq",
        prompt: "Display property mana yang digunakan untuk Flexbox?",
        sortOrder: 3,
      },

      // Quiz 3 - React Hooks
      {
        id: generateId(),
        quizId: insertedQuizzes[2].id,
        type: "mcq",
        prompt: "Apa fungsi dari useMemo hook?",
        sortOrder: 1,
      },
      {
        id: generateId(),
        quizId: insertedQuizzes[2].id,
        type: "mcq",
        prompt: "Kapan useCallback hook sebaiknya digunakan?",
        sortOrder: 2,
      },
      {
        id: generateId(),
        quizId: insertedQuizzes[2].id,
        type: "mcq",
        prompt: "Apa perbedaan useEffect dan useLayoutEffect?",
        sortOrder: 3,
      },
    ];

    const insertedQuizQuestions = await db.insert(schema.quizQuestionsTable).values(quizQuestions).returning();
    console.log(`✅ Inserted ${insertedQuizQuestions.length} quiz questions\n`);

    // ===== 27. QUIZ OPTIONS TABLE =====
    console.log("📝 Inserting quiz options...");
    const quizOptions = [
      // Question 1 options
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
        questionId: insertedQuizQuestions[0].id,
        text: "Hyperlinks and Text Markup Language",
        isCorrect: false,
      },

      // Question 2 options
      { id: generateId(), questionId: insertedQuizQuestions[1].id, text: "<h1>", isCorrect: true },
      { id: generateId(), questionId: insertedQuizQuestions[1].id, text: "<h6>", isCorrect: false },
      { id: generateId(), questionId: insertedQuizQuestions[1].id, text: "<heading>", isCorrect: false },
      { id: generateId(), questionId: insertedQuizQuestions[1].id, text: "<head>", isCorrect: false },

      // Question 3 options
      { id: generateId(), questionId: insertedQuizQuestions[2].id, text: '<a href="url">text</a>', isCorrect: true },
      { id: generateId(), questionId: insertedQuizQuestions[2].id, text: "<link>url</link>", isCorrect: false },
      { id: generateId(), questionId: insertedQuizQuestions[2].id, text: "<url>text</url>", isCorrect: false },
      { id: generateId(), questionId: insertedQuizQuestions[2].id, text: "<href>text</href>", isCorrect: false },

      // Question 4 options
      { id: generateId(), questionId: insertedQuizQuestions[3].id, text: "src", isCorrect: true },
      { id: generateId(), questionId: insertedQuizQuestions[3].id, text: "href", isCorrect: false },
      { id: generateId(), questionId: insertedQuizQuestions[3].id, text: "img", isCorrect: false },
      { id: generateId(), questionId: insertedQuizQuestions[3].id, text: "link", isCorrect: false },

      // Question 5 options
      { id: generateId(), questionId: insertedQuizQuestions[4].id, text: "color", isCorrect: true },
      { id: generateId(), questionId: insertedQuizQuestions[4].id, text: "text-color", isCorrect: false },
      { id: generateId(), questionId: insertedQuizQuestions[4].id, text: "font-color", isCorrect: false },
      { id: generateId(), questionId: insertedQuizQuestions[4].id, text: "text-style", isCorrect: false },

      // Question 6 options
      {
        id: generateId(),
        questionId: insertedQuizQuestions[5].id,
        text: "Untuk membuat responsive design berdasarkan screen size",
        isCorrect: true,
      },
      {
        id: generateId(),
        questionId: insertedQuizQuestions[5].id,
        text: "Untuk menambahkan animasi",
        isCorrect: false,
      },
      {
        id: generateId(),
        questionId: insertedQuizQuestions[5].id,
        text: "Untuk membuat website lebih cepat",
        isCorrect: false,
      },
      { id: generateId(), questionId: insertedQuizQuestions[5].id, text: "Untuk mengubah font size", isCorrect: false },

      // Question 7 options
      { id: generateId(), questionId: insertedQuizQuestions[6].id, text: "display: flex", isCorrect: true },
      { id: generateId(), questionId: insertedQuizQuestions[6].id, text: "display: flexbox", isCorrect: false },
      { id: generateId(), questionId: insertedQuizQuestions[6].id, text: "display: block", isCorrect: false },
      { id: generateId(), questionId: insertedQuizQuestions[6].id, text: "flex: true", isCorrect: false },

      // Question 8 options
      {
        id: generateId(),
        questionId: insertedQuizQuestions[7].id,
        text: "Untuk memoize expensive computations",
        isCorrect: true,
      },
      {
        id: generateId(),
        questionId: insertedQuizQuestions[7].id,
        text: "Untuk membuat code lebih pendek",
        isCorrect: false,
      },
      {
        id: generateId(),
        questionId: insertedQuizQuestions[7].id,
        text: "Untuk menggantikan useState",
        isCorrect: false,
      },
      {
        id: generateId(),
        questionId: insertedQuizQuestions[7].id,
        text: "Untuk mengingat user preferences",
        isCorrect: false,
      },

      // Question 9 options
      {
        id: generateId(),
        questionId: insertedQuizQuestions[8].id,
        text: "Ketika passing function sebagai prop ke child component",
        isCorrect: true,
      },
      {
        id: generateId(),
        questionId: insertedQuizQuestions[8].id,
        text: "Di setiap function component",
        isCorrect: false,
      },
      {
        id: generateId(),
        questionId: insertedQuizQuestions[8].id,
        text: "Hanya untuk async functions",
        isCorrect: false,
      },
      {
        id: generateId(),
        questionId: insertedQuizQuestions[8].id,
        text: "Untuk event handlers di parent component",
        isCorrect: false,
      },

      // Question 10 options
      {
        id: generateId(),
        questionId: insertedQuizQuestions[9].id,
        text: "useLayoutEffect fires synchronously before browser paint",
        isCorrect: true,
      },
      {
        id: generateId(),
        questionId: insertedQuizQuestions[9].id,
        text: "useEffect lebih cepat dari useLayoutEffect",
        isCorrect: false,
      },
      { id: generateId(), questionId: insertedQuizQuestions[9].id, text: "Tidak ada perbedaan", isCorrect: false },
      {
        id: generateId(),
        questionId: insertedQuizQuestions[9].id,
        text: "useLayoutEffect hanya untuk class components",
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
        passed: true,
        startedAt: daysAgo(165),
        submittedAt: daysAgo(165),
      },
      {
        id: generateId(),
        quizId: insertedQuizzes[0].id,
        userId: studentId2,
        score: 75,
        passed: true,
        startedAt: daysAgo(138),
        submittedAt: daysAgo(138),
      },
      {
        id: generateId(),
        quizId: insertedQuizzes[0].id,
        userId: studentId3,
        score: 50,
        passed: false,
        startedAt: daysAgo(109),
        submittedAt: daysAgo(109),
      },
      {
        id: generateId(),
        quizId: insertedQuizzes[0].id,
        userId: studentId3,
        score: 75,
        passed: true,
        startedAt: daysAgo(108),
        submittedAt: daysAgo(108),
      },
      {
        id: generateId(),
        quizId: insertedQuizzes[2].id,
        userId: studentId1,
        score: 90,
        passed: true,
        startedAt: daysAgo(145),
        submittedAt: daysAgo(145),
      },
      {
        id: generateId(),
        quizId: insertedQuizzes[2].id,
        userId: studentId3,
        score: 80,
        passed: true,
        startedAt: daysAgo(97),
        submittedAt: daysAgo(97),
      },
    ];

    const insertedQuizAttempts = await db.insert(schema.quizAttemptsTable).values(quizAttempts).returning();
    console.log(`✅ Inserted ${insertedQuizAttempts.length} quiz attempts\n`);

    // ===== 29. QUIZ ATTEMPT ANSWERS TABLE =====
    console.log("📝 Inserting quiz attempt answers...");
    const attemptAnswers = [
      // Student 1, Quiz 1 - Perfect score
      {
        attemptId: insertedQuizAttempts[0].id,
        questionId: insertedQuizQuestions[0].id,
        selectedOptionIdsJson: JSON.stringify([quizOptions[0].id]),
      },
      {
        attemptId: insertedQuizAttempts[0].id,
        questionId: insertedQuizQuestions[1].id,
        selectedOptionIdsJson: JSON.stringify([quizOptions[4].id]),
      },
      {
        attemptId: insertedQuizAttempts[0].id,
        questionId: insertedQuizQuestions[2].id,
        selectedOptionIdsJson: JSON.stringify([quizOptions[8].id]),
      },
      {
        attemptId: insertedQuizAttempts[0].id,
        questionId: insertedQuizQuestions[3].id,
        selectedOptionIdsJson: JSON.stringify([quizOptions[12].id]),
      },

      // Student 2, Quiz 1 - 75% score
      {
        attemptId: insertedQuizAttempts[1].id,
        questionId: insertedQuizQuestions[0].id,
        selectedOptionIdsJson: JSON.stringify([quizOptions[0].id]),
      },
      {
        attemptId: insertedQuizAttempts[1].id,
        questionId: insertedQuizQuestions[1].id,
        selectedOptionIdsJson: JSON.stringify([quizOptions[4].id]),
      },
      {
        attemptId: insertedQuizAttempts[1].id,
        questionId: insertedQuizQuestions[2].id,
        selectedOptionIdsJson: JSON.stringify([quizOptions[9].id]),
      },
      {
        attemptId: insertedQuizAttempts[1].id,
        questionId: insertedQuizQuestions[3].id,
        selectedOptionIdsJson: JSON.stringify([quizOptions[12].id]),
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
        issuedAt: daysAgo(100),
        certificateNo: "CERT-WEB-2026-001",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        templateDataJson: JSON.stringify({
          studentName: "Rizki Pratama",
          courseName: "Bootcamp Web Development Lengkap 2026",
          completionDate: "15 Oktober 2025",
          instructorName: "Dr. Ahmad Fauzi",
        }),
      },
      {
        id: generateId(),
        userId: studentId2,
        courseId: courseId3,
        issuedAt: daysAgo(80),
        certificateNo: "CERT-FLU-2026-002",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        templateDataJson: JSON.stringify({
          studentName: "Ani Wijaya",
          courseName: "Flutter untuk Pemula",
          completionDate: "02 November 2025",
          instructorName: "Budi Santoso",
        }),
      },
      {
        id: generateId(),
        userId: studentId1,
        courseId: courseId2,
        issuedAt: daysAgo(60),
        certificateNo: "CERT-REA-2026-003",
        pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf",
        templateDataJson: JSON.stringify({
          studentName: "Rizki Pratama",
          courseName: "Master React & Next.js",
          completionDate: "22 November 2025",
          instructorName: "Siti Nurhaliza",
        }),
      },
    ];

    await db.insert(schema.certificatesTable).values(certificates);
    console.log(`✅ Inserted ${certificates.length} certificates\n`);

    // ===== 31. WISHLISTS TABLE =====
    console.log("📝 Inserting wishlists...");
    const wishlists = [
      { userId: studentId1, courseId: courseId5, createdAt: daysAgo(30) },
      { userId: studentId1, courseId: courseId6, createdAt: daysAgo(25) },
      { userId: studentId2, courseId: courseId2, createdAt: daysAgo(50) },
      { userId: studentId2, courseId: courseId4, createdAt: daysAgo(45) },
      { userId: studentId3, courseId: courseId3, createdAt: daysAgo(60) },
      { userId: studentId3, courseId: courseId5, createdAt: daysAgo(55) },
      { userId: studentId4, courseId: courseId11, createdAt: daysAgo(40) },
      { userId: studentId4, courseId: courseId12, createdAt: daysAgo(35) },
      { userId: studentId5, courseId: courseId1, createdAt: daysAgo(20) },
      { userId: studentId5, courseId: courseId3, createdAt: daysAgo(18) },
      { userId: studentId6, courseId: courseId2, createdAt: daysAgo(15) },
      { userId: studentId6, courseId: courseId4, createdAt: daysAgo(10) },
    ];

    await db.insert(schema.wishlistsTable).values(wishlists);
    console.log(`✅ Inserted ${wishlists.length} wishlist items\n`);

    // ===== 32. REFUNDS TABLE =====
    console.log("📝 Inserting refunds...");
    const refunds = [
      {
        id: generateId(),
        orderId: insertedOrders[2].id,
        amount: 499000,
        reason: "Kursus tidak sesuai ekspektasi, materinya terlalu basic untuk saya",
        status: "completed",
        createdAt: daysAgo(105),
        processedAt: daysAgo(103),
        completedAt: daysAgo(102),
      },
      {
        id: generateId(),
        orderId: insertedOrders[5].id,
        amount: 225000,
        reason: "Laptop saya tidak cukup powerful untuk menjalankan tools yang dibutuhkan",
        status: "completed",
        createdAt: daysAgo(115),
        processedAt: daysAgo(113),
        completedAt: daysAgo(112),
      },
      {
        id: generateId(),
        orderId: insertedOrders[8].id,
        amount: 349000,
        reason: "Mendapat kursus yang sama dari program beasiswa kampus",
        status: "pending",
        createdAt: daysAgo(5),
        processedAt: null,
        completedAt: null,
      },
    ];

    await db.insert(schema.refundsTable).values(refunds);
    console.log(`✅ Inserted ${refunds.length} refunds\n`);

    console.log("\n✨ Database population completed successfully!");
    console.log("\n📊 Summary:");
    console.log(`   - ${insertedUsers.length} users created`);
    console.log(`   - ${insertedCourses.length} courses created`);
    console.log(`   - ${insertedSections.length} sections created`);
    console.log(`   - ${insertedLectures.length} lectures created`);
    console.log(`   - ${lectureAssets.length} lecture assets added`);
    console.log(`   - ${insertedEnrollments.length} enrollments created`);
    console.log(`   - ${reviews.length} course reviews added`);
    console.log(`   - ${insertedQuestions.length} Q&A questions added`);
    console.log(`   - ${insertedOrders.length} orders processed`);
    console.log(`   - ${certificates.length} certificates issued`);
  } catch (error) {
    console.error("❌ Error populating database:", error);
    throw error;
  }
}

// Run the population script
await populateDatabase();
