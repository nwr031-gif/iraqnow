'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useUIStore } from '@/lib/store'
import { NAV_CATEGORIES } from '@/lib/constants'
import { Menu, X, Search, Bell, User, LogOut, LayoutDashboard, Bookmark } from 'lucide-react'
import { useState } from 'react'
import { signOut, useSession } from 'next-auth/react'
import { cn } from '@/lib/utils'

const categoryLabels = {
  ar: {
    politics: 'السياسة',
    economy: 'الاقتصاد',
    security: 'الأمن',
    society: 'المجتمع',
    culture: 'الثقافة',
    sports: 'الرياضة',
    technology: 'التكنولوجيا',
    health: 'الصحة',
    education: 'التعليم',
    environment: 'البيئة',
    local: 'محليات',
    world: 'العالم',
  },
  ku: {
    politics: 'سیاسەت',
    economy: 'أپووری',
    security: 'ئاسایش',
    society: 'کۆمەڵگە',
    culture: 'چанд',
    sports: 'وەرزش',
    technology: 'تەکنەلۆژی',
    health: 'تەندروستی',
    education: 'پەروەردە',
    environment: 'ژینگە',
    local: 'ناوخۆ',
    world: ' جیھان',
  },
  en: {
    politics: 'Politics',
    economy: 'Economy',
    security: 'Security',
    society: 'Society',
    culture: 'Culture',
    sports: 'Sports',
    technology: 'Technology',
    health: 'Health',
    education: 'Education',
    environment: 'Environment',
    local: 'Local',
    world: 'World',
  },
}

export function Header({ locale }: { locale: 'ar' | 'ku' | 'en' }) {
  const { locale: uiLocale, setLocale } = useUIStore()
  const { data: session } = useSession()
  const pathname = usePathname()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [userMenuOpen, setUserMenuOpen] = useState(false)

  const labels = categoryLabels[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-950/95">
      <div className="container-main">
        <div className="flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>

            <Link href={`/${locale}`} className="flex items-center gap-2" aria-label="IraqNow Home">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-accent">
                <span className="text-lg font-bold text-white">IQ</span>
              </div>
              <span className="hidden font-kufi font-bold text-xl text-primary sm:block">IraqNow</span>
            </Link>
          </div>

          <nav className="hidden lg:flex lg:items-center lg:gap-6" role="navigation" aria-label="Main navigation">
            <Link
              href={`/${locale}`}
              className={cn(
                'text-sm font-medium transition-colors',
                pathname === `/${locale}` ? 'text-accent' : 'text-gray-600 hover:text-accent dark:text-gray-300 dark:hover:text-accent'
              )}
            >
              {locale === 'ar' ? 'الرئيسية' : locale === 'ku' ? 'سەرەکی' : 'Home'}
            </Link>
            <div className="relative group">
              <button className="flex items-center gap-1 text-sm font-medium text-gray-600 hover:text-accent dark:text-gray-300 dark:hover:text-accent">
                {locale === 'ar' ? 'الأقسام' : locale === 'ku' ? 'بەشەکان' : 'Sections'}
                <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" /></svg>
              </button>
              <div className="absolute left-0 top-full z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-900 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                {NAV_CATEGORIES.map((cat) => (
                  <Link
                    key={cat.slug}
                    href={`/${locale}/category/${cat.slug}`}
                    className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                  >
                    {labels[cat.slug as keyof typeof labels]}
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href={`/${locale}/map`}
              className="text-sm font-medium text-gray-600 hover:text-accent dark:text-gray-300 dark:hover:text-accent"
            >
              {locale === 'ar' ? 'خريطة تفاعلية' : locale === 'ku' ? 'نەخشەی بەراوەر' : 'Interactive Map'}
            </Link>
            <Link
              href={`/${locale}/data`}
              className="text-sm font-medium text-gray-600 hover:text-accent dark:text-gray-300 dark:hover:text-accent"
            >
              {locale === 'ar' ? 'صحافة البيانات' : locale === 'ku' ? 'رۆژنامەوانی داتا' : 'Data Journalism'}
            </Link>
            <Link
              href={`/${locale}/podcasts`}
              className="text-sm font-medium text-gray-600 hover:text-accent dark:text-gray-300 dark:hover:text-accent"
            >
              {locale === 'ar' ? 'بودكاست' : locale === 'ku' ? 'پۆدکاست' : 'Podcasts'}
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="hidden sm:flex items-center gap-2 rounded-lg border border-gray-200 bg-gray-50 px-4 py-2 text-sm text-gray-500 transition-colors hover:border-accent hover:bg-white dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400"
            >
              <Search className="h-4 w-4" />
              <span>{locale === 'ar' ? 'بحث...' : locale === 'ku' ? 'گەڕان...' : 'Search...'}</span>
            </button>

            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs text-white">3</span>
              </button>
              {userMenuOpen && (
                <div className="absolute right-0 top-full z-50 mt-2 w-72 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                  <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                    <p className="text-sm font-medium text-gray-900 dark:text-white">الإشعارات</p>
                    <p className="text-xs text-gray-500">3 إشعارات جديدة</p>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    <a href="#" className="flex items-start gap-3 p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent">
                        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" /></svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 dark:text-white">خبر عاجل: عنوان الخبر العاجل هنا</p>
                        <p className="text-xs text-gray-500 mt-1">منذ 5 دقائق</p>
                      </div>
                    </a>
                  </div>
                  <button className="w-full px-4 py-2 text-center text-sm text-accent hover:bg-gray-50 dark:hover:bg-gray-800">عرض الكل</button>
                </div>
              )}
            </div>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center gap-2 rounded-lg p-1.5 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-800"
                >
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" className="h-8 w-8 rounded-full" />
                  ) : (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-accent/10 text-accent font-medium">
                      {session.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                  )}
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 rounded-lg border border-gray-200 bg-white py-2 shadow-lg dark:border-gray-700 dark:bg-gray-900">
                    <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{session.user?.name}</p>
                      <p className="text-xs text-gray-500 truncate">{session.user?.email}</p>
                    </div>
                    <Link
                      href={`/${locale}/profile`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <User className="h-4 w-4" />
                      {locale === 'ar' ? 'الملف الشخصي' : locale === 'ku' ? 'پڕۆفایل' : 'Profile'}
                    </Link>
                    <Link
                      href={`/${locale}/bookmarks`}
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    >
                      <Bookmark className="h-4 w-4" />
                      {locale === 'ar' ? 'الإشارات المرجعية' : locale === 'ku' ? 'نیشانەکان' : 'Bookmarks'}
                    </Link>
                    {(session.user as any).role !== 'READER' && (
                      <Link
                        href={`/${locale}/dashboard`}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                      >
                        <LayoutDashboard className="h-4 w-4" />
                        {locale === 'ar' ? 'لوحة التحكم' : locale === 'ku' ? 'داشبۆرد' : 'Dashboard'}
                      </Link>
                    )}
                    <hr className="my-2 border-gray-200 dark:border-gray-700" />
                    <button
                      onClick={() => signOut({ callbackUrl: `/${locale}` })}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-error hover:bg-gray-50 dark:hover:bg-gray-800"
                    >
                      <LogOut className="h-4 w-4" />
                      {locale === 'ar' ? 'تسجيل الخروج' : locale === 'ku' ? 'چوونەدەرەوە' : 'Sign Out'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={`/${locale}/auth/signin`}
                className="btn-primary text-sm"
              >
                {locale === 'ar' ? 'دخول' : locale === 'ku' ? 'چوونەژوورەوە' : 'Sign In'}
              </Link>
            )}
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-gray-200 py-4 dark:border-gray-800">
            <nav className="flex flex-col gap-2">
              <Link
                href={`/${locale}`}
                className="px-2 py-2 text-sm font-medium text-gray-600 hover:text-accent dark:text-gray-300 dark:hover:text-accent"
              >
                {locale === 'ar' ? 'الرئيسية' : locale === 'ku' ? 'سەرەکی' : 'Home'}
              </Link>
              {NAV_CATEGORIES.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/${locale}/category/${cat.slug}`}
                  className="px-2 py-2 text-sm text-gray-600 hover:text-accent dark:text-gray-300 dark:hover:text-accent"
                >
                  {labels[cat.slug as keyof typeof labels]}
                </Link>
              ))}
              <Link
                href={`/${locale}/map`}
                className="px-2 py-2 text-sm text-gray-600 hover:text-accent dark:text-gray-300 dark:hover:text-accent"
              >
                {locale === 'ar' ? 'خريطة تفاعلية' : locale === 'ku' ? 'نەخشەی بەراوەر' : 'Interactive Map'}
              </Link>
              <Link
                href={`/${locale}/data`}
                className="px-2 py-2 text-sm text-gray-600 hover:text-accent dark:text-gray-300 dark:hover:text-accent"
              >
                {locale === 'ar' ? 'صحافة البيانات' : locale === 'ku' ? 'رۆژنامەوانی داتا' : 'Data Journalism'}
              </Link>
              <Link
                href={`/${locale}/podcasts`}
                className="px-2 py-2 text-sm text-gray-600 hover:text-accent dark:text-gray-300 dark:hover:text-accent"
              >
                {locale === 'ar' ? 'بودكاست' : locale === 'ku' ? 'پۆدکاست' : 'Podcasts'}
              </Link>
            </nav>
          </div>
        )}
      </div>

      {searchOpen && (
        <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/50 p-8 pt-20 sm:pt-32" onClick={() => setSearchOpen(false)}>
          <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl dark:bg-gray-900" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {locale === 'ar' ? 'بحث' : locale === 'ku' ? 'گەڕان' : 'Search'}
              </h2>
              <button
                onClick={() => setSearchOpen(false)}
                className="p-1 rounded-lg text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4">
              <form className="flex gap-2">
                <input
                  type="search"
                  placeholder={locale === 'ar' ? 'ابحث عن أخبار، مواضيع، مؤلفين...' : locale === 'ku' ? 'هەوڵ بدە بۆ هەواڵ، بابەت، نووسەر...' : 'Search news, topics, authors...'}
                  className="flex-1 input"
                  autoFocus
                />
                <button type="submit" className="btn-primary">
                  {locale === 'ar' ? 'بحث' : locale === 'ku' ? 'گەڕان' : 'Search'}
                </button>
              </form>
              <div className="mt-4 flex flex-wrap gap-2">
                <span className="text-sm text-gray-500">{locale === 'ar' ? 'اقتراحات:' : locale === 'ku' ? 'پێشنیارەکان:' : 'Suggestions:'}</span>
                ['العراق', 'بغداد', 'كردستان', 'الانتخابات', 'الاقتصاد'].map((sug, i) => (
                  <button
                    key={i}
                    type="button"
                    className="badge-primary text-xs"
                    onClick={() => {}}
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}