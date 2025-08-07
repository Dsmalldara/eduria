"use server"

import { APIError } from "better-auth/api"
import { auth } from "./auth"
import { prisma } from "./prisma"
import { redirect } from "next/navigation"
import { headers } from "next/headers"
import { cookies } from "next/headers"
export type FormState =
  | {
      errors?: {
        name?: string[]
        email?: string[]
        password?: string[]
      }
      message?: string
    }
  | undefined

export async function signUp(state: FormState, formData: FormData): Promise<FormState> {
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
    return { errors }
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

    // Log the response to debug (remove in production)
    console.log('SignUp API response:', result)

    // Check if the API returned an error in the response body
    // The success response has { token, user }, so check if we got the expected structure
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
        return {
          errors: { email: ["An account with this email already exists"] },
        }
      }

      return {
        message: "Unable to create account. Please try again.",
      }
    } else if (result && typeof result === 'object' && 'success' in result && !(result as any).success) {
      // Handle success: false pattern
      return {
        message: "Unable to create account. Please try again.",
      }
    }

    // Only set cookie if signup was successful
    const cookieStore = cookies()
    ;(await cookieStore).set("better-auth.session_token", "authenticated", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

  } catch (error: unknown) {
    // Log the error to debug (remove in production)
    console.log('SignUp API error caught:', error)

    if (error instanceof APIError) {
      switch (error.status) {
        case "UNPROCESSABLE_ENTITY":
          return {
            errors: { email: ["An account with this email already exists"] },
          }
        case "BAD_REQUEST":
          return {
            errors: { email: ["Invalid email address"] },
          }
        case "CONFLICT":
          return {
            errors: { email: ["An account with this email already exists"] },
          }
        default:
          return {
            message: "Something went wrong. Please try again.",
          }
      }
    }

    // Handle network errors, timeout errors, etc.
    if (error instanceof Error) {
      // Check if it's a network error
      if (error.message.includes("fetch") || error.message.includes("network")) {
        return {
          message: "Network error. Please check your connection and try again.",
        }
      }
      
      // Check if it's a duplicate/exists error disguised as a regular Error
      if (
        error.message.toLowerCase().includes("exists") ||
        error.message.toLowerCase().includes("already") ||
        error.message.toLowerCase().includes("duplicate") ||
        error.message.toLowerCase().includes("conflict")
      ) {
        return {
          errors: { email: ["An account with this email already exists"] },
        }
      }

      // Check if it's a validation error
      if (
        error.message.toLowerCase().includes("invalid") ||
        error.message.toLowerCase().includes("validation")
      ) {
        return {
          message: "Invalid information provided. Please check your details and try again.",
        }
      }

      // Check if it's a database connection error
      if (
        error.message?.includes("Can't reach database") ||
        error.message?.includes("PrismaClientInitializationError") ||
        error.message?.includes("database server") ||
        error.name === "PrismaClientInitializationError"
      ) {
        return {
          message: "Database connection error. Please try again in a moment.",
        }
      }
    }

    return {
      message: "An unexpected error occurred. Please try again.",
    }
  }

  // Only redirect if we reach this point (successful signup)
  redirect("/home")
}

export async function signIn(state: FormState, formData: FormData): Promise<FormState> {
  const rawFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  const errors: { email?: string[]; password?: string[] } = {}

  if (!rawFormData.email || !rawFormData.email.includes("@")) {
    errors.email = ["Please enter a valid email address"]
  }

  if (!rawFormData.password || rawFormData.password.length === 0) {
    errors.password = ["Password is required"]
  }

  if (Object.keys(errors).length > 0) {
    return { errors }
  }

  const { email, password } = rawFormData

  try {
    await auth.api.signInEmail({
      body: {
        email,
        password,
      },
      headers: await headers()
    })

    // Set a simple auth token in cookies
    const cookieStore = cookies()
    ;(await cookieStore).set("better-auth.session_token", "authenticated", {
      httpOnly: true,
      secure: true,
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

  } catch (error) {
    if (error instanceof APIError) {
      switch (error.status) {
        case "UNAUTHORIZED":
          return {
            message: "Invalid email or password. Please try again.",
          }
        case "BAD_REQUEST":
          return {
            errors: { email: ["Invalid email address"] },
          }
        default:
          return {
            message: "Something went wrong. Please try again.",
          }
      }
    }

    return {
      message: "An unexpected error occurred. Please try again.",
    }
  }
  // Check if user has a profile
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (user) {
      // Check if user has a profile
      const profile = await prisma.profile.findUnique({
        where: { userId: user.id }
      })

      if (profile) {
        // User has completed onboarding, redirect to dashboard
        redirect("/home")
      } else {
        // User hasn't completed onboarding, redirect to onboarding
        redirect("/onboarding")
      }
    } else {
      // User not found, redirect to onboarding
      redirect("/onboarding")
    }
}
export async function signOut() {
  const cookieStore = cookies()
  ;(await cookieStore).delete("better-auth.session_token")
  redirect("/auth/login")
}

export async function signInWithGoogle() {
  await auth.api.signInSocial({
    body: {
      provider: "google",
      callbackURL: "/home",
    },
    headers: await headers()
  })
}


export async function saveOnboardingData(userType: string, subjects: string[], email: string) {
  try {
    console.log("Looking for user with email:", email)
    
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    console.log("Found user:", user)

    if (!user) {
      throw new Error(`User not found with email: ${email}`)
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
      data: { role: userType },
    })

    console.log("Onboarding data saved successfully")

  } catch (error) {
    console.error("Error saving onboarding data:", error)
    throw new Error("Failed to save onboarding data")
  }

  // Redirect after successful save (outside try/catch)
  redirect("/home")
}

