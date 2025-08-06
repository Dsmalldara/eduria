import { betterAuth } from "better-auth"
import  {prismaAdapter } from "better-auth/adapters/prisma"
import { db } from "./prisma"


 

export const auth = betterAuth({
      cookies: {
    sessionToken: {
      name: "better-auth.session_token",
      options: {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
      },
    },
  },
    database:prismaAdapter(db, {
    provider:"postgresql"
    }),
    emailAndPassword:{
        enabled:true,
        minPasswordLength:6,
        maxPasswordLength:12,
        autoSignIn:true
    },
    account:{
        accountLinking:{
            enabled:true
        }
    },
    socialProviders:{
        google:{
            clientId:process.env.GOOGLE_CLIENT_ID as string,
            clientSecret:process.env.GOOGLE_CLIENT_SECRET as string
        }
    }
})
