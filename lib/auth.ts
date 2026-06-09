import { NextAuthOptions } from 'next-auth'
import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import Credentials from 'next-auth/providers/credentials'

import { PrismaAdapter } from '@next-auth/prisma-adapter'
import prisma from './prisma'
import bcrypt from 'bcrypt'

const googleConfigured = Boolean(
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
)

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma as any),
  providers: [
    ...(googleConfigured
      ? [
          GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
          }),
        ]
      : []),
    Credentials({
      name: 'Email & Password',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        otp: { label: 'OTP', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email) return null

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        })
        if (!user) return null

        // --- OTP-based login ---
        // The client first calls /api/auth/register {action:'verify'} which marks
        // the EmailVerification row verified:true. Here we confirm a recent verified
        // row exists, then consume it so the code cannot be reused.
        if (credentials.otp) {
          const verification = await prisma.emailVerification.findFirst({
            where: { email: credentials.email, verified: true },
            orderBy: { createdAt: 'desc' },
          })

          if (!verification) return null

          // Verified row must be recent (within 10 minutes of creation)
          const ageMs = Date.now() - new Date(verification.createdAt).getTime()
          if (ageMs > 10 * 60 * 1000) return null

          // Consume the verification so it cannot be replayed
          await prisma.emailVerification.delete({ where: { id: verification.id } })

          // Ensure the account is marked verified
          if (!user.emailVerified) {
            await prisma.user.update({
              where: { id: user.id },
              data: { emailVerified: new Date() },
            })
          }

          return { id: user.id, name: user.name || undefined, email: user.email }
        }

        // --- Password-based login ---
        if (!credentials.password || !user.hashedPassword) return null

        if (!user.emailVerified) {
          throw new Error('Please verify your email before signing in')
        }

        const isValid = await bcrypt.compare(credentials.password, user.hashedPassword)
        if (!isValid) return null

        return { id: user.id, name: user.name || undefined, email: user.email }
      },
    }),
  ],
  // Credentials provider REQUIRES the JWT session strategy. With 'database',
  // credentials logins never persist a session (a silent, total auth failure).
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as any).id
      }
      // Resolve admin status from DB role or ADMIN_EMAILS env list
      if (token.email) {
        const adminEmails = (process.env.ADMIN_EMAILS || '')
          .split(',')
          .map((e) => e.trim().toLowerCase())
          .filter(Boolean)
        let isAdmin = adminEmails.includes(String(token.email).toLowerCase())
        if (!isAdmin && token.id) {
          try {
            const dbUser = await prisma.user.findUnique({ where: { id: String(token.id) } })
            isAdmin = dbUser?.role === 'admin'
          } catch {
            // ignore DB hiccups; default non-admin
          }
        }
        ;(token as any).isAdmin = isAdmin
      }
      return token
    },
    async session({ session, token }) {
      if (session.user && token) {
        ;(session.user as any).id = token.id
        ;(session.user as any).isAdmin = (token as any).isAdmin || false
      }
      return session
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
}

export const nextAuthHandler = NextAuth(authOptions)
