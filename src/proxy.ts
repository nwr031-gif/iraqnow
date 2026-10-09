import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LOCALES = ['ar', 'ku', 'en']
const DEFAULT_LOCALE = 'ar'
const ADMIN_ALLOWED_ROLES = ['JOURNALIST', 'EDITOR', 'ADMIN']

function getLocaleFromPath(pathname: string) {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  if (LOCALES.includes(potentialLocale)) {
    return potentialLocale
  }
  return null
}

const SESSION_COOKIE_NAMES = [
  'authjs.session-token',
  '__Secure-authjs.session-token',
  'next-auth.session-token',
  '__Secure-next-auth.session-token',
]

function hasSessionCookie(request: NextRequest): boolean {
  return SESSION_COOKIE_NAMES.some((name) => !!request.cookies.get(name)?.value)
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  /* ───── حماية لوحة التحكم /admin ─────
     ملاحظة: NextAuth v5 يشفّر الجلسة (JWE)، لذا نتحقق هنا من وجود الكوكي فقط.
     التحقق الفعلي من الدور يتم في admin/layout.tsx وفي مسارات API عبر requirePermission */
  if (pathname.startsWith('/admin')) {
    if (!hasSessionCookie(request)) {
      const loginUrl = new URL(`/${DEFAULT_LOCALE}/auth/signin`, request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }

    return NextResponse.next()
  }

  /* ───── منطق اللغات ───── */
  const locale = getLocaleFromPath(pathname)

  if (locale) {
    const response = NextResponse.next()
    response.headers.set('x-locale', locale)
    return response
  }

  const acceptLanguage = request.headers.get('accept-language') || ''
  let detectedLocale = DEFAULT_LOCALE

  for (const loc of LOCALES) {
    if (acceptLanguage.startsWith(loc)) {
      detectedLocale = loc
      break
    }
  }

  const url = request.nextUrl.clone()
  url.pathname = `/${detectedLocale}${pathname}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: [
    '/((?!api|uploads|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.[a-zA-Z0-9]+$).*)',
  ],
}

