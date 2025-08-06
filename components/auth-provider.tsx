"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"

import type { User, Session } from "@/lib/auth"
interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  session: null,
  loading: true,
})

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const getSession = async () => {
      try {
        const { data } = await authClient.getSession()
        setUser(data?.user || null)
        setSession(data?.session || null)
      } catch (error) {
        console.error("Failed to get session:", error)
      } finally {
        setLoading(false)
      }
    }

    getSession()
  }, [])

  return <AuthContext.Provider value={{ user, session, loading }}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
