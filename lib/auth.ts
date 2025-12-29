import { NextAuthOptions } from "next-auth"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import GoogleProvider from "next-auth/providers/google"
import CredentialsProvider from "next-auth/providers/credentials"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email) {
          return null
        }

        // Always find existing user by email (whether created via Google or credentials)
        // This ensures users get the same account regardless of sign-in method
        let user = await prisma.user.findUnique({
          where: { email: credentials.email.toLowerCase().trim() },
        })

        // Only create if user doesn't exist at all
        if (!user) {
          user = await prisma.user.create({
            data: {
              email: credentials.email.toLowerCase().trim(),
              name: credentials.email.split("@")[0],
            },
          })
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/signin",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, account }) {
      // When user signs in, store their ID in the token
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      // If using Google OAuth, ensure we get the user ID from the database
      if (account?.provider === 'google' && user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: user.email },
        })
        if (dbUser) {
          token.id = dbUser.id
        }
      }
      return token
    },
    async session({ token, session }) {
      // Ensure user ID is always available in session
      if (token && session.user) {
        session.user.id = token.id as string
        if (token.email) {
          session.user.email = token.email as string
        }
      }
      return session
    },
  },
}
