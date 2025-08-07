// app/api/auth/signin/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { APIError } from "better-auth/api"
import { auth } from "../../../../lib/auth"
import { prisma } from "../../../../lib/prisma"
import { headers } from "next/headers"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  console.log("=== SignIn API Route Start ===")
  
  try {
    const formData = await request.formData()
    
    const rawFormData = {
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    console.log("Email received:", rawFormData.email ? "present" : "missing")

    const errors: { email?: string[]; password?: string[] } = {}

    if (!rawFormData.email || !rawFormData.email.includes("@")) {
      errors.email = ["Please enter a valid email address"]
    }

    if (!rawFormData.password || rawFormData.password.length === 0) {
      errors.password = ["Password is required"]
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    const { email, password } = rawFormData

    try {
      console.log("Attempting Better Auth signInEmail...")
      
      const signInResult = await auth.api.signInEmail({
        body: {
          email,
          password,
        },
        headers: await headers()
      })

      console.log("Better Auth signInEmail successful")

      // Set a simple auth token in cookies
      const cookieStore = cookies()
      ;(await cookieStore).set("better-auth.session_token", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      console.log("Cookie set successfully")

    } catch (error: any) {
      console.error("=== Better Auth Error ===")
      console.error("Error type:", error.constructor.name)
      console.error("Error message:", error.message)
      console.error("Error stack:", error.stack)
      console.error("=== End Better Auth Error ===")

      if (error instanceof APIError) {
        switch (error.status) {
          case "UNAUTHORIZED":
            return NextResponse.json({
              message: "Invalid email or password. Please try again.",
            }, { status: 401 })
          case "BAD_REQUEST":
            return NextResponse.json({
              errors: { email: ["Invalid email address"] },
            }, { status: 400 })
          default:
            return NextResponse.json({
              message: "Something went wrong. Please try again.",
            }, { status: 500 })
        }
      }

      return NextResponse.json({
        message: "An unexpected error occurred. Please try again.",
      }, { status: 500 })
    }

    try {
      console.log("Attempting database query for user:", email)
      
      // Check if user has a profile
      const user = await prisma.user.findUnique({
        where: { email }
      })

      console.log("User found:", user ? "yes" : "no")

      if (user) {
        console.log("Checking for user profile...")
        // Check if user has a profile
        const profile = await prisma.profile.findUnique({
          where: { userId: user.id }
        })

        console.log("Profile found:", profile ? "yes" : "no")

        if (profile) {
          // User has completed onboarding, redirect to dashboard
          return NextResponse.json({ 
            success: true, 
            redirectTo: "/home" 
          }, { status: 200 })
        } else {
          // User hasn't completed onboarding, redirect to onboarding
          return NextResponse.json({ 
            success: true, 
            redirectTo: "/onboarding" 
          }, { status: 200 })
        }
      } else {
        // User not found, redirect to onboarding
        return NextResponse.json({ 
          success: true, 
          redirectTo: "/onboarding" 
        }, { status: 200 })
      }
    } catch (dbError) {
      console.error("=== Database Error ===")
      console.error("DB Error:", dbError)
      console.error("=== End Database Error ===")
      
      return NextResponse.json({
        message: "Database connection error. Please try again.",
      }, { status: 503 })
    }

  } catch (error) {
    console.error('Outer SignIn error:', error)
    return NextResponse.json({
      message: "An unexpected error occurred. Please try again.",
    }, { status: 500 })
  }
}