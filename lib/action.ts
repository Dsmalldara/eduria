import { redirect } from "next/navigation"
import { APIError } from "@/lib/api"
import { auth } from "@/lib/auth"

interface FormState {
  errors?: { email?: string[]; password?: string[] }
  message?: string
}

export async function signIn(state: FormState, formData: FormData): Promise<FormState> {
  const rawFormData = {
    email: formData.get("email") as string,
    password: formData.get("password") as string,
  }

  // Basic validation
  const errors: { email?: string[]; password?: string[] } = {}

  if (!rawFormData.email || !rawFormData.email.includes("@")) {
    errors.email = ["Please enter a valid email address"]
  }

  if (!rawFormData.password || rawFormData.password.length === 0) {
    errors.password = ["Password is required"]
  }

  // Return early if validation fails
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

  // Only redirect on successful sign in
  redirect("/dashboard/home")
}
