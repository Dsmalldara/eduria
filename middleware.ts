import { NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  console.log("🔍 Middleware running for:", request.nextUrl.pathname)
  
  // Check for auth token in cookies or headers
  const cookieToken = request.cookies.get("better-auth.session_token")?.value
  const authHeader = request.headers.get("x-auth-token")
  
  console.log("🍪 Cookie token exists:", !!cookieToken)
  console.log("📱 Auth header exists:", !!authHeader)
  
  const hasAuth = cookieToken || authHeader

  // If accessing root and has auth, redirect to home
  if (request.nextUrl.pathname === "/" && hasAuth) {
    console.log("🏠 Redirecting from root to home")
    return NextResponse.redirect(new URL("/home", request.url))
  }

  // Protected routes
  const protectedRoutes = ["/home", "/scheduler", "/assignments", "/wallet", "/profile", "/onboarding"]
  const isProtectedRoute = protectedRoutes.some(route => 
    request.nextUrl.pathname === route || request.nextUrl.pathname.startsWith(route + "/")
  )

  console.log("🛡️ Is protected route:", isProtectedRoute)
  console.log("🔐 Has auth:", hasAuth)

  // If accessing protected route without auth, redirect to login
  if (isProtectedRoute && !hasAuth) {
    console.log("❌ No auth for protected route, redirecting to login")
    return NextResponse.redirect(new URL("/auth/signup", request.url))
  }

  console.log("✅ Allowing access")
  return NextResponse.next()
}

export const config = {
  matcher: ["/", "/home/:path*", "/scheduler/:path*", "/assignments/:path*", "/wallet/:path*", "/profile/:path*", "/onboarding"],
}