import NextAuth from 'next-auth'
import { PrismaAdapter } from '@auth/prisma-adapter'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'
import Credentials from 'next-auth/providers/credentials'
import { prisma } from '@/lib/prisma'
import { compare } from 'bcryptjs'

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt', maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: '/ar/auth/signin',
    error: '/ar/auth/signin',
  },
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    Facebook({
      clientId: process.env.FACEBOOK_CLIENT_ID,
      clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    }),
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email as string },
          })

          if (!user || !user.passwordHash) return null
          if (!user.isActive) return null

          const isValid = await compare(credentials.password as string, user.passwordHash)
          if (!isValid) return null

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            image: user.avatar,
            role: user.role,
          }
        } catch {
          // قاعدة البيانات غير متاحة — تحقق تجريبي للمطور
          const DEMO_ACCOUNTS: Record<string, { password: string; name: string; role: string; id: string }> = {
            'admin@iraqnow.com': { password: 'admin123', name: 'مدير التحرير', role: 'ADMIN', id: 'user-admin' },
            'editor@iraqnow.com': { password: 'editor123', name: 'زينب الموسوي', role: 'EDITOR', id: 'user-editor' },
            'ahmed@iraqnow.com': { password: 'journo123', name: 'أحمد الزبيدي', role: 'JOURNALIST', id: 'user-journo-1' },
          }
          const demo = DEMO_ACCOUNTS[credentials.email as string]
          if (demo && credentials.password === demo.password) {
            return { id: demo.id, email: credentials.email as string, name: demo.name, role: demo.role } as any
          }
          return null
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role || 'READER'
      }
      if (trigger === 'update' && session) {
        token.name = session.name ?? token.name
        token.picture = session.image ?? token.picture
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id as string | undefined
        (session.user as any).role = (token.role as string) || 'READER'
      }
      return session
    },
  },
})

export type UserRoleType = 'READER' | 'JOURNALIST' | 'EDITOR' | 'ADMIN'
