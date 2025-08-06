/* eslint-disable react/no-unescaped-entities */
"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signIn } from "@/lib/actions"
import { useActionState } from "react"

export default function LoginPage() {
  const [state, action, pending] = useActionState(signIn, undefined)

  const handleSubmit = async (formData: FormData) => {
    const email = formData.get("email") as string
    
    // Store email in localStorage before submitting
    if (email && email.trim()) {
      localStorage.setItem("userEmail", email.trim())
      console.log("Stored email in localStorage:", email.trim())
    }
    
    // Call the original action
    return action(formData)
  }

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        action={handleSubmit}
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              Eduria
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">Welcome Back</h1>
            <p className="text-sm">Sign in to your account</p>
          </div>

          {state?.message && (
            <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-950 dark:text-red-400 dark:border-red-800">
              {state.message}
            </div>
          )}

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="block text-sm">
                Email Address
              </Label>
              <Input
                type="email"
                required
                name="email"
                id="email"
                placeholder="Enter your email"
                className={state?.errors?.email ? "border-red-500" : ""}
              />
              {state?.errors?.email && <p className="text-sm text-red-600">{state.errors.email[0]}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-title text-sm">
                Password
              </Label>
              <Input
                type="password"
                required
                name="password"
                id="password"
                placeholder="Enter your password"
                className={state?.errors?.password ? "border-red-500" : ""}
              />
              {state?.errors?.password && <p className="text-sm text-red-600">{state.errors.password[0]}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Signing In..." : "Sign In"}
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Don't have an account?
            <Button asChild variant="link" className="px-2">
              <Link href="/auth/signup">Sign Up</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  )
}