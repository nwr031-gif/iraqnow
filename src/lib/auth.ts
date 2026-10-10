import NextAuth from 'next-auth'
import Google from 'next-auth/providers/google'
import Facebook from 'next-auth/providers/facebook'
import Credentials from 'next-auth/providers/credentials'
import { compare } from 'bcryptjs'
import { getPrisma } from '@/lib/prisma'

/* حسابات تجريبية تعمل عندما لا تكون قاعدة البيانات متاحة */
const DEMO_ACCOUNTS: Record<string, { password: string; name: string; role: string; id: string }> = {
  'admin@iraqnow.com': { password: 'admin123', name: 'مدير التحرير', role: 'ADMIN', id: 'user-admin' },
  'editor@iraqnow.com': { password: 'editor123', name: 'زينب الموسوي', role: 'EDITOR', id: 'user-editor' },
  'ahmed@iraqnow.com': { password: 'journo123', name: 'أحمد الزبيدي', role: 'JOURNALIST', id: 'user-journo-1' },
}

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
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

        const email = credentials.email as string
        const password = credentials.password as string

        try {
          const db = await getPrisma()
          if (db) {
            const user = await db.user.findUnique({ where: { email } })

            if (user?.passwordHash && user.isActive) {
              const isValid = await compare(password, user.passwordHash)
              if (isValid) {
                return {
                  id: user.id,
                  email: user.email,
                  name: user.name,
                  image: user.avatar,
                  role: user.role,
                }
              }
              return null
            }
          }
        } catch {
          /* قاعدة البيانات غير متاحة — التابع للحسابات التجريبية */
        }

        /* الحسابات التجريبية */
        const demo = DEMO_ACCOUNTS[email]
        if (demo && password === demo.password) {
          return { id: demo.id, email, name: demo.name, role: demo.role } as any
        }

        return null
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
