import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const LOCALES = ['ar', 'en']
const DEFAULT_LOCALE = 'ar'

function getLocaleFromPath(pathname: string) {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  if (LOCALES.includes(potentialLocale)) return potentialLocale
  return null
}

/* التحقق من كوكي admin — نفس خوارزمية lib/admin-auth بدون استيراد (edge) */
async function isAdminCookieValid(request: NextRequest): Promise<boolean> {
  const token = request.cookies.get('iqn_admin')?.value
  if (!token) return false
  const salt = process.env.ADMIN_COOKIE_SECRET || 'iraqnow-admin-v1'
  const password = process.env.ADMIN_PASSWORD || 'Noor07813415176@@'
  const data = new TextEncoder().encode(`${salt}::${password}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  const expected = Array.from(new Uint8Array(digest)).map((b) => b.toString(16).padStart(2, '0')).join('')
  return token === expected
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  /* ═══ حماية واجهات API الخاصة بالإدارة ═══ */
  if (pathname.startsWith('/api/admin/')) {
    const valid = await isAdminCookieValid(request)
    if (!valid) {
      return NextResponse.json({ error: 'غير مصرح بالوصول', code: 'UNAUTHORIZED' }, { status: 401 })
    }
    return NextResponse.next()
  }

  /* ═══ /admin — الصفحة الرئيسية تعرض نموذج الدخول، والبقية محمية ═══ */
  if (pathname === '/admin' || pathname === '/admin/') {
    return NextResponse.next()
  }
  if (pathname.startsWith('/admin')) {
    const valid = await isAdminCookieValid(request)
    if (!valid) {
      const loginUrl = new URL('/admin', request.url)
      return NextResponse.redirect(loginUrl)
    }
    return NextResponse.next()
  }

  /* ═══ توجيه اللغة الكردية إلى العربية ═══ */
  if (pathname === '/ku' || pathname.startsWith('/ku/')) {
    const url = request.nextUrl.clone()
    url.pathname = pathname.replace(/^\/ku/, '/ar') || '/ar'
    return NextResponse.redirect(url)
  }

  /* ═══ توجيه المسارات بدون لغة ═══ */
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
    '/((?!api|rss|uploads|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.[a-zA-Z0-9]+$).*)',
    '/api/admin/:path*',
  ],
}
