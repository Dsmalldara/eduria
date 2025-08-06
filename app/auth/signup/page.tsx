"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import Link from "next/link"
import { signUp } from "@/lib/actions"
import { useActionState } from "react"

export default function SignUpPage() {
  const [state, action, pending] = useActionState(signUp, undefined)

  return (
    <section className="flex min-h-screen bg-zinc-50 px-4 py-16 md:py-32 dark:bg-transparent">
      <form
        action={action}
        className="bg-muted m-auto h-fit w-full max-w-sm overflow-hidden rounded-[calc(var(--radius)+.125rem)] border shadow-md shadow-zinc-950/5 dark:[--color-muted:var(--color-zinc-900)]"
      >
        <div className="bg-card -m-px rounded-[calc(var(--radius)+.125rem)] border p-8 pb-6">
          <div className="text-center">
            <Link href="/" aria-label="go home" className="mx-auto block w-fit">
              Eduria
            </Link>
            <h1 className="mb-1 mt-4 text-xl font-semibold">Create Account</h1>
            <p className="text-sm">Welcome! Sign up to get started</p>
          </div>

          {state?.message && (
            <div className="mt-4 p-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-md dark:bg-red-950 dark:text-red-400 dark:border-red-800">
              {state.message}
            </div>
          )}

          <div className="mt-6 space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name" className="block text-sm">
                Full Name
              </Label>
              <Input
                type="text"
                required
                name="name"
                id="name"
                placeholder="Enter your full name"
                className={state?.errors?.name ? "border-red-500" : ""}
              />
              {state?.errors?.name && <p className="text-sm text-red-600">{state.errors.name[0]}</p>}
            </div>

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
                placeholder="Create a password"
                className={state?.errors?.password ? "border-red-500" : ""}
              />
              {state?.errors?.password && <p className="text-sm text-red-600">{state.errors.password[0]}</p>}
            </div>

            <Button type="submit" className="w-full" disabled={pending}>
              {pending ? "Creating Account..." : "Create Account"}
            </Button>
          </div>

          <div className="my-6 grid grid-cols-[1fr_auto_1fr] items-center gap-3">
            <hr className="border-dashed" />
            <span className="text-muted-foreground text-xs">Or continue With</span>
            <hr className="border-dashed" />
          </div>

          <div className="grid grid-cols">
            <Button type="button" variant="outline" disabled={pending}>
              <svg xmlns="http://www.w3.org/2000/svg" width="0.98em" height="1em" viewBox="0 0 256 262">
                <path
                  fill="#4285f4"
                  d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
                />
                <path
                  fill="#34a853"
                  d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
                />
                <path
                  fill="#fbbc05"
                  d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
                />
                <path
                  fill="#eb4335"
                  d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
                />
              </svg>
              <span>Google</span>
            </Button>
          </div>
        </div>

        <div className="p-3">
          <p className="text-accent-foreground text-center text-sm">
            Already have an account?
            <Button asChild variant="link" className="px-2">
              <Link href="/auth/login">Sign In</Link>
            </Button>
          </p>
        </div>
      </form>
    </section>
  )
}
