// app/api/auth/signup/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { APIError } from "better-auth/api"
import { auth } from "../../../../lib/auth"
import { prisma } from "../../../../lib/prisma"
import { headers } from "next/headers"
import { cookies } from "next/headers"

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    
    const rawFormData = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
    }

    const errors: { name?: string[]; email?: string[]; password?: string[] } = {}

    if (!rawFormData.name || rawFormData.name.trim().length < 2) {
      errors.name = ["Name must be at least 2 characters long"]
    }

    if (!rawFormData.email || !rawFormData.email.includes("@")) {
      errors.email = ["Please enter a valid email address"]
    }

    if (!rawFormData.password || rawFormData.password.length < 8) {
      errors.password = ["Password must be at least 8 characters long"]
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json({ errors }, { status: 400 })
    }

    const { email, password, name } = rawFormData

    try {
      const result = await auth.api.signUpEmail({
        body: {
          name,
          email,
          password,
        },
        headers: await headers()
      })

      // Log the response to debug
      console.log('SignUp API response:', result)

      // Check if the API returned an error in the response body
      if (result && typeof result === 'object' && 'user' in result && result.user) {
        // This is a successful response, continue with the flow
      } else if (result && typeof result === 'object' && 'error' in result) {
        // This handles error responses that have an error property
        const errorResult = result as { error?: string };
        if (
          errorResult.error?.toLowerCase().includes("exists") ||
          errorResult.error?.toLowerCase().includes("already") ||
          errorResult.error?.toLowerCase().includes("duplicate")
        ) {
          return NextResponse.json({
            errors: { email: ["An account with this email already exists"] },
          }, { status: 409 })
        }

        return NextResponse.json({
          message: "Unable to create account. Please try again.",
        }, { status: 400 })
      } else if (result && typeof result === 'object' && 'success' in result && !(result as any).success) {
        // Handle success: false pattern
        return NextResponse.json({
          message: "Unable to create account. Please try again.",
        }, { status: 400 })
      }

      // Only set cookie if signup was successful
      const cookieStore = cookies()
      ;(await cookieStore).set("better-auth.session_token", "authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      })

      return NextResponse.json({ 
        success: true, 
        redirectTo: "/home" 
      }, { status: 200 })

    } catch (error: unknown) {
      // Log the error to debug
      console.log('SignUp API error caught:', error)

      if (error instanceof APIError) {
        switch (error.status) {
          case "UNPROCESSABLE_ENTITY":
            return NextResponse.json({
              errors: { email: ["An account with this email already exists"] },
            }, { status: 422 })
          case "BAD_REQUEST":
            return NextResponse.json({
              errors: { email: ["Invalid email address"] },
            }, { status: 400 })
          case "CONFLICT":
            return NextResponse.json({
              errors: { email: ["An account with this email already exists"] },
            }, { status: 409 })
          default:
            return NextResponse.json({
              message: "Something went wrong. Please try again.",
            }, { status: 500 })
        }
      }

      // Handle network errors, timeout errors, etc.
      if (error instanceof Error) {
        // Check if it's a network error
        if (error.message.includes("fetch") || error.message.includes("network")) {
          return NextResponse.json({
            message: "Network error. Please check your connection and try again.",
          }, { status: 503 })
        }
        
        // Check if it's a duplicate/exists error disguised as a regular Error
        if (
          error.message.toLowerCase().includes("exists") ||
          error.message.toLowerCase().includes("already") ||
          error.message.toLowerCase().includes("duplicate") ||
          error.message.toLowerCase().includes("conflict")
        ) {
          return NextResponse.json({
            errors: { email: ["An account with this email already exists"] },
          }, { status: 409 })
        }

        // Check if it's a validation error
        if (
          error.message.toLowerCase().includes("invalid") ||
          error.message.toLowerCase().includes("validation")
        ) {
          return NextResponse.json({
            message: "Invalid information provided. Please check your details and try again.",
          }, { status: 400 })
        }

        // Check if it's a database connection error
        if (
          error.message?.includes("Can't reach database") ||
          error.message?.includes("PrismaClientInitializationError") ||
          error.message?.includes("database server") ||
          error.name === "PrismaClientInitializationError"
        ) {
          return NextResponse.json({
            message: "Database connection error. Please try again in a moment.",
          }, { status: 503 })
        }
      }

      return NextResponse.json({
        message: "An unexpected error occurred. Please try again.",
      }, { status: 500 })
    }

  } catch (error) {
    console.error('Outer SignUp error:', error)
    return NextResponse.json({
      message: "An unexpected error occurred. Please try again.",
    }, { status: 500 })
  }
}