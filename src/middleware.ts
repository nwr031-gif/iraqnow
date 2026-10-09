import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@/lib/supabase/server'

const LOCALES = ['ar', 'ku', 'en']
const DEFAULT_LOCALE = 'ar'

function getLocaleFromPath(pathname: string) {
  const segments = pathname.split('/')
  const potentialLocale = segments[1]
  if (LOCALES.includes(potentialLocale)) {
    return potentialLocale
  }
  return null
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const locale = getLocaleFromPath(pathname)

  if (locale) {
    const response = NextResponse.next()
    response.headers.set('x-locale', locale)
    response.headers.set('x-pathname', pathname.slice(3 + locale.length) || '/')
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
    '/((?!api|_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|.*\\.png$).*)',
  ],
}