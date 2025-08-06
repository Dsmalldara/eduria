import { config } from "dotenv"
import { neon } from "@neondatabase/serverless"

config({ path: ".env.local" })
const sql = neon(process.env.DATABASE_URL)

async function setupDatabase() {
  try {
    console.log("🚀 Setting up Better Auth + App database tables...")

    // --- Better Auth Tables ---
    await sql`CREATE TABLE IF NOT EXISTS "user" (
      "id" TEXT PRIMARY KEY,
      "name" TEXT NOT NULL,
      "email" TEXT UNIQUE NOT NULL,
      "emailVerified" BOOLEAN NOT NULL DEFAULT false,
      "image" TEXT,
      "role" TEXT NOT NULL DEFAULT 'user',
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`

    await sql`CREATE TABLE IF NOT EXISTS "session" (
      "id" TEXT PRIMARY KEY,
      "expiresAt" TIMESTAMP NOT NULL,
      "token" TEXT UNIQUE NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "ipAddress" TEXT,
      "userAgent" TEXT,
      "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE
    )`

    await sql`CREATE TABLE IF NOT EXISTS "account" (
      "id" TEXT PRIMARY KEY,
      "accountId" TEXT NOT NULL,
      "providerId" TEXT NOT NULL,
      "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      "accessToken" TEXT,
      "refreshToken" TEXT,
      "idToken" TEXT,
      "accessTokenExpiresAt" TIMESTAMP,
      "refreshTokenExpiresAt" TIMESTAMP,
      "scope" TEXT,
      "password" TEXT,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`

    await sql`CREATE TABLE IF NOT EXISTS "verification" (
      "id" TEXT PRIMARY KEY,
      "identifier" TEXT NOT NULL,
      "value" TEXT NOT NULL,
      "expiresAt" TIMESTAMP NOT NULL,
      "createdAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP
    )`

    await sql`CREATE INDEX IF NOT EXISTS "user_email_idx" ON "user"("email")`
    await sql`CREATE INDEX IF NOT EXISTS "session_token_idx" ON "session"("token")`
    await sql`CREATE INDEX IF NOT EXISTS "session_user_id_idx" ON "session"("userId")`
    await sql`CREATE INDEX IF NOT EXISTS "account_user_id_idx" ON "account"("userId")`
    await sql`CREATE INDEX IF NOT EXISTS "account_provider_idx" ON "account"("providerId", "accountId")`

    // --- App-Specific Tables ---
    await sql`CREATE TABLE IF NOT EXISTS "profile" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT UNIQUE NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      "bio" TEXT,
      "subjects" TEXT[],
      "certified" BOOLEAN DEFAULT false,
      "experience" TEXT,
      "assessmentScore" INTEGER,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

    await sql`CREATE TABLE IF NOT EXISTS "class" (
      "id" TEXT PRIMARY KEY,
      "subject" TEXT NOT NULL,
      "tutorId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      "studentId" TEXT REFERENCES "user"(id),
      "scheduleAt" TIMESTAMP NOT NULL,
      "status" TEXT NOT NULL DEFAULT 'scheduled',
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

    await sql`CREATE TABLE IF NOT EXISTS "assignment" (
      "id" TEXT PRIMARY KEY,
      "classId" TEXT NOT NULL REFERENCES "class"(id) ON DELETE CASCADE,
      "title" TEXT NOT NULL,
      "description" TEXT,
      "resourceUrl" TEXT,
      "submittedUrl" TEXT,
      "submittedAt" TIMESTAMP,
      "grade" INTEGER,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

    await sql`CREATE TABLE IF NOT EXISTS "notification" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      "title" TEXT NOT NULL,
      "message" TEXT,
      "seen" BOOLEAN DEFAULT false,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

    await sql`CREATE TABLE IF NOT EXISTS "wallet" (
      "id" TEXT PRIMARY KEY,
      "userId" TEXT UNIQUE NOT NULL REFERENCES "user"(id) ON DELETE CASCADE,
      "balance" REAL NOT NULL DEFAULT 0,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

    await sql`CREATE TABLE IF NOT EXISTS "transaction" (
      "id" TEXT PRIMARY KEY,
      "walletId" TEXT NOT NULL REFERENCES "wallet"(id) ON DELETE CASCADE,
      "amount" REAL NOT NULL,
      "type" TEXT NOT NULL,
      "description" TEXT,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

    await sql`CREATE TABLE IF NOT EXISTS "attendance" (
      "id" TEXT PRIMARY KEY,
      "classId" TEXT NOT NULL REFERENCES "class"(id) ON DELETE CASCADE,
      "studentId" TEXT NOT NULL REFERENCES "user"(id),
      "status" TEXT DEFAULT 'present',
      "checkedInAt" TIMESTAMP,
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

    await sql`CREATE TABLE IF NOT EXISTS "class_summary" (
      "id" TEXT PRIMARY KEY,
      "classId" TEXT UNIQUE NOT NULL REFERENCES "class"(id) ON DELETE CASCADE,
      "summary" TEXT,
      "generatedBy" TEXT DEFAULT 'ai',
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`

    await sql`CREATE INDEX IF NOT EXISTS "profile_user_idx" ON "profile"("userId")`
    await sql`CREATE INDEX IF NOT EXISTS "class_tutor_idx" ON "class"("tutorId")`
    await sql`CREATE INDEX IF NOT EXISTS "class_student_idx" ON "class"("studentId")`
    await sql`CREATE INDEX IF NOT EXISTS "wallet_user_idx" ON "wallet"("userId")`
    await sql`CREATE INDEX IF NOT EXISTS "transaction_wallet_idx" ON "transaction"("walletId")`
    await sql`CREATE INDEX IF NOT EXISTS "notification_user_idx" ON "notification"("userId")`
    await sql`CREATE INDEX IF NOT EXISTS "attendance_class_idx" ON "attendance"("classId")`

    console.log("✅ Database setup completed successfully!")
  } catch (error) {
    console.error("❌ Database setup failed:", error)
    process.exit(1)
  }
}

setupDatabase()
