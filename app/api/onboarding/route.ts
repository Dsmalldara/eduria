// app/api/onboarding/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from "../../../lib/prisma"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userType, subjects, email } = body

    // Validate required fields
    if (!userType || !subjects || !email) {
      return NextResponse.json({
        error: "Missing required fields: userType, subjects, or email"
      }, { status: 400 })
    }

    if (!Array.isArray(subjects) || subjects.length === 0) {
      return NextResponse.json({
        error: "Subjects must be a non-empty array"
      }, { status: 400 })
    }

    console.log("Looking for user with email:", email)
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    console.log("Found user:", user)
    
    if (!user) {
      return NextResponse.json({
        error: `User not found with email: ${email}`
      }, { status: 404 })
    }

    // Save to profile table
    await prisma.profile.upsert({
      where: { userId: user.id },
      update: {
        subjects: subjects,
      },
      create: {
        id: `profile_${Date.now()}`,
        userId: user.id,
        subjects: subjects,
      },
    })

    // Update user role
    await prisma.user.update({
      where: { id: user.id },
      data: {
        role: userType,
      },
    })

    console.log("Onboarding data saved successfully")

    return NextResponse.json({
      success: true,
      message: "Onboarding data saved successfully",
      redirectTo: "/home"
    }, { status: 200 })

  } catch (error: unknown) {
    console.error("Error saving onboarding data:", error)

    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; message: string }
      
      if (prismaError.code === 'P2002') {
        return NextResponse.json({
          error: "A profile already exists for this user"
        }, { status: 409 })
      }
      
      if (prismaError.code === 'P2025') {
        return NextResponse.json({
          error: "User not found"
        }, { status: 404 })
      }
    }

    // Handle database connection errors
    if (error instanceof Error) {
      if (
        error.message?.includes("Can't reach database") ||
        error.message?.includes("PrismaClientInitializationError") ||
        error.message?.includes("database server") ||
        error.name === "PrismaClientInitializationError"
      ) {
        return NextResponse.json({
          error: "Database connection error. Please try again in a moment."
        }, { status: 503 })
      }
    }

    return NextResponse.json({
      error: "Failed to save onboarding data"
    }, { status: 500 })
  }
}