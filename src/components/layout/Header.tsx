'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import { signOut, useSession } from 'next-auth/react'
import {
  Menu, X, Search, Bell, User, LogOut, LayoutDashboard, Bookmark,
  ChevronDown, Map, Database, Mic, Globe, Check, Sun, Moon,
  TrendingUp, Landmark, Play, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo, CuneiformBand, IshtarStar } from '@/components/brand/Brand'
import { NAV_CATEGORIES } from '@/lib/constants'

type Locale = 'ar' | 'ku' | 'en'

const CATEGORY_ICONS: Record<string, any> = {
  politics: Landmark,
  economy: TrendingUp,
  security: Sparkles,
  society: Globe,
  culture: Play,
  sports: Sparkles,
  technology: Sparkles,
  health: Sparkles,
  education: Sparkles,
  environment: Sparkles,
  local: Map,
  world: Globe,
}

const CATEGORY_LABELS: Record<Locale, Record<string, string>> = {
  ar: {
    politics: 'السياسة', economy: 'الاقتصاد', security: 'الأمن', society: 'المجتمع',
    culture: 'الثقافة', sports: 'الرياضة', technology: 'التكنولوجيا', health: 'الصحة',
    education: 'التعليم', environment: 'البيئة', local: 'محليات', world: 'العالم',
  },
  ku: {
    politics: 'سیاسەت', economy: 'أپووری', security: 'ئاسایش', society: 'کۆمەڵگە',
    culture: 'چاند', sports: 'وەرزش', technology: 'تەکنەلۆژی', health: 'تەندروستی',
    education: 'پەروەردە', environment: 'ژینگە', local: 'ناوخۆ', world: 'جیھان',
  },
  en: {
    politics: 'Politics', economy: 'Economy', security: 'Security', society: 'Society',
    culture: 'Culture', sports: 'Sports', technology: 'Technology', health: 'Health',
    education: 'Education', environment: 'Environment', local: 'Local', world: 'World',
  },
}

const UI_TEXT: Record<Locale, Record<string, string>> = {
  ar: {
    home: 'الرئيسية', sections: 'الأقسام', map: 'الخريطة التفاعلية', data: 'صحافة البيانات',
    podcasts: 'بودكاست', live: 'بث مباشر', search: 'بحث', signIn: 'دخول',
    latest: 'آخر الأخبار', trending: 'الأكثر قراءة', newsletter: 'النشرة البريدية',
    profile: 'الملف الشخصي', bookmarks: 'المحفوظات', dashboard: 'لوحة التحكم',
    signOut: 'تسجيل الخروج', notifications: 'الإشعارات', searchPlaceholder: 'ابحث في العراق الآن...',
    suggestions: 'الأكثر بحثاً', all: 'عرض الكل', menu: 'القائمة',
  },
  ku: {
    home: 'سەرەکی', sections: 'بەشەکان', map: 'نەخشەی بەراوەر', data: 'رۆژنامەوانی داتا',
    podcasts: 'پۆدکاست', live: 'پەخش', search: 'گەڕان', signIn: 'چوونەژوورەوە',
    latest: 'دوایین هەواڵەکان', trending: 'زۆرترین خوێندنەوە', newsletter: 'نامەی هەواڵ',
    profile: 'پڕۆفایل', bookmarks: 'نیشانەکان', dashboard: 'داشبۆرد',
    signOut: 'چوونەدەرەوە', notifications: 'ئاگادارییەکان', searchPlaceholder: 'گەڕان لە عێراق ئێستا...',
    suggestions: 'زۆرترین گەڕان', all: 'هەموو پیشان بدە', menu: 'لیستە',
  },
  en: {
    home: 'Home', sections: 'Sections', map: 'Interactive Map', data: 'Data Journalism',
    podcasts: 'Podcasts', live: 'Live', search: 'Search', signIn: 'Sign In',
    latest: 'Latest News', trending: 'Most Read', newsletter: 'Newsletter',
    profile: 'Profile', bookmarks: 'Bookmarks', dashboard: 'Dashboard',
    signOut: 'Sign Out', notifications: 'Notifications', searchPlaceholder: 'Search Iraq Now...',
    suggestions: 'Trending Searches', all: 'View All', menu: 'Menu',
  },
}

const LOCALES: { code: Locale; name: string; flag: string }[] = [
  { code: 'ar', name: 'العربية', flag: 'عراق' },
  { code: 'ku', name: 'کوردی', flag: 'کورد' },
  { code: 'en', name: 'English', flag: 'EN' },
]

export function Header({ locale }: { locale: Locale }) {
  const { data: session } = useSession()
  const pathname = usePathname()
  const router = useRouter()
  const t = UI_TEXT[locale]
  const labels = CATEGORY_LABELS[locale]

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [notifOpen, setNotifOpen] = useState(false)
  const [userOpen, setUserOpen] = useState(false)
  const [theme, setTheme] = useState<'light' | 'dark'>('light')
  const megaTimeout = useRef<NodeJS.Timeout | null>(null)
  const searchInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const stored = localStorage.getItem('theme')
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
    const isDark = stored === 'dark' || (!stored && prefersDark)
    setTheme(isDark ? 'dark' : 'light')
    document.documentElement.classList.toggle('dark', isDark)
  }, [])

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInput.current?.focus(), 100)
  }, [searchOpen])

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light'
    setTheme(next)
    document.documentElement.classList.toggle('dark', next === 'light' ? false : true)
    localStorage.setItem('theme', next)
  }

  const switchLocale = (code: Locale) => {
    const segments = pathname.split('/')
    segments[1] = code
    router.push(segments.join('/'))
    setLangOpen(false)
  }

  const openMega = () => {
    if (megaTimeout.current) clearTimeout(megaTimeout.current)
    setMegaOpen(true)
  }

  const closeMega = () => {
    megaTimeout.current = setTimeout(() => setMegaOpen(false), 180)
  }

  const isActive = (path: string) => pathname === path || pathname.startsWith(path + '/')

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* الشريط العلوي */}
      <div className="hidden lg:block bg-lapis-950 text-sand-100">
        <div className="container-main flex h-9 items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 text-gold-400 font-medium">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500" />
              </span>
              {t.live}
            </span>
            <span className="h-3 w-px bg-sand-100/20" />
            <span className="text-sand-100/70">
              {new Date().toLocaleDateString(locale === 'ar' ? 'ar-IQ' : locale === 'ku' ? 'ckb-IQ' : 'en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={toggleTheme}
              className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sand-100/70 transition-colors hover:bg-white/10 hover:text-gold-400"
              aria-label="Toggle theme"
            >
              {theme === 'light' ? <Moon className="h-3.5 w-3.5" /> : <Sun className="h-3.5 w-3.5" />}
            </button>

            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 rounded-md px-2.5 py-1 text-sand-100/70 transition-colors hover:bg-white/10 hover:text-gold-400"
                aria-expanded={langOpen}
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="font-medium">{LOCALES.find((l) => l.code === locale)?.name}</span>
                <ChevronDown className={cn('h-3 w-3 transition-transform', langOpen && 'rotate-180')} />
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div className="absolute end-0 top-full z-20 mt-1 w-40 overflow-hidden rounded-lg border border-gold-500/20 bg-lapis-900 shadow-xl">
                    {LOCALES.map((loc) => (
                      <button
                        key={loc.code}
                        onClick={() => switchLocale(loc.code)}
                        className={cn(
                          'flex w-full items-center justify-between px-3 py-2 text-xs transition-colors',
                          locale === loc.code
                            ? 'bg-gold-500/15 text-gold-400'
                            : 'text-sand-100/80 hover:bg-white/5 hover:text-white'
                        )}
                      >
                        <span>{loc.name}</span>
                        {locale === loc.code && <Check className="h-3 w-3" />}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>

            <span className="h-3 w-px bg-sand-100/20" />
            <Link href={`/${locale}/newsletter`} className="rounded-md px-2.5 py-1 text-sand-100/70 transition-colors hover:bg-white/10 hover:text-gold-400">
              {t.newsletter}
            </Link>
          </div>
        </div>
      </div>

      <CuneiformBand />

      {/* الشريط الرئيسي */}
      <div
        className={cn(
          'w-full border-b transition-all duration-500',
          scrolled
            ? 'border-gold-500/15 bg-[var(--overlay)] backdrop-blur-xl shadow-lg shadow-lapis-950/5'
            : 'border-transparent bg-[var(--background)]'
        )}
      >
        <div className="container-main flex h-[70px] items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden rounded-lg p-2 text-[var(--foreground)] transition-colors hover:bg-gold-500/10"
              aria-label={t.menu}
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link href={`/${locale}`} aria-label="Iraq Now">
              <Logo locale={locale} />
            </Link>
          </div>

          {/* التنقل - سطح المكتب */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main">
            <Link
              href={`/${locale}`}
              className={cn(
                'relative rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-300',
                isActive(`/${locale}`) && pathname === `/${locale}`
                  ? 'text-gold-600'
                  : 'text-[var(--foreground)] hover:text-gold-600'
              )}
            >
              {t.home}
            </Link>

            <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
              <button
                className={cn(
                  'flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                  megaOpen ? 'text-gold-600' : 'text-[var(--foreground)] hover:text-gold-600'
                )}
                aria-expanded={megaOpen}
              >
                {t.sections}
                <ChevronDown className={cn('h-4 w-4 transition-transform duration-300', megaOpen && 'rotate-180')} />
              </button>

              {/* Mega Menu */}
              <div
                className={cn(
                  'absolute top-full start-0 z-40 mt-2 w-[720px] overflow-hidden rounded-2xl border border-gold-500/20 bg-[var(--card-bg)] shadow-2xl shadow-lapis-950/20 transition-all duration-300',
                  megaOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-2 opacity-0'
                )}
              >
                <div className="grid grid-cols-4 gap-1 p-4">
                  {NAV_CATEGORIES.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.slug] || Globe
                    return (
                      <Link
                        key={cat.slug}
                        href={`/${locale}/category/${cat.slug}`}
                        className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-200 hover:bg-gold-500/10"
                        onClick={() => setMegaOpen(false)}
                      >
                        <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lapis-900 text-gold-400 transition-transform duration-300 group-hover:scale-110">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-medium text-[var(--foreground)] transition-colors group-hover:text-gold-600">
                          {labels[cat.slug]}
                        </span>
                      </Link>
                    )
                  })}
                </div>
                <div className="flex items-center justify-between border-t border-gold-500/10 bg-lapis-950/95 px-6 py-3">
                  <div className="flex items-center gap-2 text-xs text-sand-100/60">
                    <IshtarStar size={14} />
                    <span>{locale === 'en' ? 'Coverage across all 18 governorates' : 'تغطية في جميع المحافظات الـ 18'}</span>
                  </div>
                  <Link
                    href={`/${locale}/latest`}
                    className="text-xs font-semibold text-gold-400 transition-colors hover:text-gold-300"
                  >
                    {t.all} →
                  </Link>
                </div>
              </div>
            </div>

            <Link
              href={`/${locale}/map`}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                isActive(`/${locale}/map`) ? 'text-gold-600' : 'text-[var(--foreground)] hover:text-gold-600'
              )}
            >
              {t.map}
            </Link>

            <Link
              href={`/${locale}/data`}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                isActive(`/${locale}/data`) ? 'text-gold-600' : 'text-[var(--foreground)] hover:text-gold-600'
              )}
            >
              {t.data}
            </Link>

            <Link
              href={`/${locale}/podcasts`}
              className={cn(
                'flex items-center gap-1.5 rounded-lg px-4 py-2 text-sm font-semibold transition-colors',
                isActive(`/${locale}/podcasts`) ? 'text-gold-600' : 'text-[var(--foreground)] hover:text-gold-600'
              )}
            >
              <Mic className="h-4 w-4" />
              {t.podcasts}
            </Link>
          </nav>

          {/* الأدوات */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex items-center gap-2 rounded-xl border border-[var(--border)] bg-[var(--card-bg)] px-3 py-2 text-sm text-[var(--muted)] transition-all duration-300 hover:border-gold-500/50 hover:text-gold-600 lg:w-48"
              aria-label={t.search}
            >
              <Search className="h-4 w-4 shrink-0" />
              <span className="hidden lg:inline text-xs">{t.search}...</span>
            </button>

            {/* الإشعارات */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false) }}
                className="relative rounded-xl p-2.5 text-[var(--foreground)] transition-colors hover:bg-gold-500/10"
                aria-label={t.notifications}
                aria-expanded={notifOpen}
              >
                <Bell className="h-5 w-5" />
                <span className="absolute end-1.5 top-1.5 flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-500" />
                </span>
              </button>
              {notifOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} />
                  <div className="absolute end-0 top-full z-20 mt-2 w-80 overflow-hidden rounded-2xl border border-gold-500/20 bg-[var(--card-bg)] shadow-2xl">
                    <div className="flex items-center justify-between border-b border-gold-500/10 px-4 py-3">
                      <span className="flex items-center gap-2 text-sm font-bold">
                        <Bell className="h-4 w-4 text-gold-500" />
                        {t.notifications}
                      </span>
                      <span className="badge badge-live text-[10px]">3</span>
                    </div>
                    <div className="max-h-72 overflow-y-auto">
                      {[
                        { title: 'عاجل: جلسة استثنائية لمجلس الوزراء', time: 'منذ 5 دقائق', hot: true },
                        { title: 'البنك المركزي يعلن عن حزمة إجراءات جديدة', time: 'منذ 22 دقيقة', hot: false },
                        { title: 'افتتاح معرض بغداد الدولي للكتاب', time: 'منذ ساعة', hot: false },
                      ].map((n, i) => (
                        <button
                          key={i}
                          className="flex w-full items-start gap-3 border-b border-gold-500/5 px-4 py-3 text-start transition-colors last:border-0 hover:bg-gold-500/5"
                        >
                          <span className={cn(
                            'mt-1 h-2 w-2 shrink-0 rounded-full',
                            n.hot ? 'bg-red-500 animate-pulse' : 'bg-gold-500/50'
                          )} />
                          <span className="flex-1">
                            <span className="block text-xs font-medium leading-relaxed">{n.title}</span>
                            <span className="mt-1 block text-[10px] text-[var(--muted)]">{n.time}</span>
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            {session ? (
              <div className="relative">
                <button
                  onClick={() => { setUserOpen(!userOpen); setNotifOpen(false) }}
                  className="flex items-center gap-2 rounded-xl p-1.5 transition-colors hover:bg-gold-500/10"
                  aria-expanded={userOpen}
                >
                  {session.user?.image ? (
                    <img src={session.user.image} alt="" className="h-8 w-8 rounded-lg object-cover ring-2 ring-gold-500/40" />
                  ) : (
                    <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-lapis-700 to-lapis-950 font-kufi text-sm font-bold text-gold-400 ring-2 ring-gold-500/40">
                      {session.user?.name?.charAt(0) || 'U'}
                    </span>
                  )}
                </button>
                {userOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setUserOpen(false)} />
                    <div className="absolute end-0 top-full z-20 mt-2 w-56 overflow-hidden rounded-2xl border border-gold-500/20 bg-[var(--card-bg)] shadow-2xl">
                      <div className="border-b border-gold-500/10 bg-gradient-to-br from-lapis-900 to-lapis-950 px-4 py-3">
                        <p className="font-kufi text-sm font-bold text-white">{session.user?.name}</p>
                        <p className="truncate text-[11px] text-sand-100/60">{session.user?.email}</p>
                      </div>
                      <div className="p-1.5">
                        {[
                          { href: `/${locale}/profile`, icon: User, label: t.profile },
                          { href: `/${locale}/bookmarks`, icon: Bookmark, label: t.bookmarks },
                          ...((session.user as any).role !== 'READER' ? [{ href: `/admin`, icon: LayoutDashboard, label: t.dashboard }] : []),
                        ].map((item) => (
                          <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-gold-500/10 hover:text-gold-600"
                            onClick={() => setUserOpen(false)}
                          >
                            <item.icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        ))}
                        <button
                          onClick={() => signOut({ callbackUrl: `/${locale}` })}
                          className="flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm text-error transition-colors hover:bg-error/10"
                        >
                          <LogOut className="h-4 w-4" />
                          {t.signOut}
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <Link href={`/${locale}/auth/signin`} className="btn-primary !px-4 !py-2 text-xs">
                {t.signIn}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* البحث */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-lapis-950/80 p-4 pt-24 backdrop-blur-sm animate-fade-in"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-gold-500/30 bg-[var(--card-bg)] shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-gold-500/15 px-5 py-4">
              <Search className="h-5 w-5 text-gold-500" />
              <input
                ref={searchInput}
                type="search"
                placeholder={t.searchPlaceholder}
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-[var(--muted)]"
                dir={locale === 'en' ? 'ltr' : 'rtl'}
              />
              <kbd className="hidden rounded-md border border-gold-500/30 bg-gold-500/10 px-2 py-1 text-[10px] font-bold text-gold-600 sm:block">
                ESC
              </kbd>
            </div>
            <div className="p-4">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
                <TrendingUp className="h-3.5 w-3.5 text-gold-500" />
                {t.suggestions}
              </p>
              <div className="flex flex-wrap gap-2">
                {(locale === 'ar'
                  ? ['أسعار الدولار', 'الموازنة 2027', 'مترو بغداد', 'انتخابات المحافظات', 'كأس آسيا']
                  : locale === 'ku'
                    ? ['نرخی دۆلار', 'بودجەی ٢٠٢٧', 'مێترۆی بەغداد']
                    : ['Dollar rate', '2027 Budget', 'Baghdad Metro', 'Elections']
                ).map((sug) => (
                  <button key={sug} className="badge badge-gold transition-transform hover:scale-105">
                    <Search className="h-3 w-3" />
                    {sug}
                  </button>
                ))}
              </div>
            </div>
            <div className="border-t border-gold-500/10 bg-lapis-950/95 px-5 py-2.5 text-[11px] text-sand-100/50">
              {locale === 'en' ? 'Press Enter to search all articles' : 'اضغط Enter للبحث في جميع المقالات'}
            </div>
          </div>
        </div>
      )}

      {/* قائمة الجوال */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-lapis-950/70 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div
            className={cn(
              'absolute top-0 start-0 h-full w-[85%] max-w-sm overflow-y-auto bg-[var(--card-bg)] shadow-2xl animate-fade-in',
              locale === 'en' ? 'border-r' : 'border-l',
              'border-gold-500/20'
            )}
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-gold-500/15 bg-lapis-950 px-5 py-4">
              <Logo locale={locale} variant="light" />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-lg p-2 text-sand-100/70 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <div className="flex gap-2">
                <button
                  onClick={() => setSearchOpen(true)}
                  className="flex flex-1 items-center gap-2 rounded-xl border border-gold-500/20 bg-[var(--background)] px-4 py-3 text-sm text-[var(--muted)]"
                >
                  <Search className="h-4 w-4" />
                  {t.searchPlaceholder}
                </button>
                <button
                  onClick={toggleTheme}
                  className="rounded-xl border border-gold-500/20 p-3 text-[var(--foreground)]"
                  aria-label="Toggle theme"
                >
                  {theme === 'light' ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
                </button>
              </div>

              <nav className="mt-5 space-y-1">
                {[
                  { href: `/${locale}`, label: t.home, icon: Globe },
                  { href: `/${locale}/map`, label: t.map, icon: Map },
                  { href: `/${locale}/data`, label: t.data, icon: Database },
                  { href: `/${locale}/podcasts`, label: t.podcasts, icon: Mic },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition-colors hover:bg-gold-500/10 hover:text-gold-600"
                  >
                    <item.icon className="h-4 w-4 text-gold-500" />
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-6">
                <p className="mb-3 flex items-center gap-2 px-2 text-xs font-bold text-gold-600">
                  <IshtarStar size={14} />
                  {t.sections}
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {NAV_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/${locale}/category/${cat.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-lg border border-gold-500/10 bg-[var(--background)] px-3 py-2.5 text-center text-xs font-medium transition-colors hover:border-gold-500/40 hover:text-gold-600"
                    >
                      {labels[cat.slug]}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-gold-500/10 pt-4">
                <p className="mb-3 px-2 text-xs font-bold text-gold-600">
                  {locale === 'en' ? 'Language' : 'اللغة'}
                </p>
                <div className="flex gap-2">
                  {LOCALES.map((loc) => (
                    <button
                      key={loc.code}
                      onClick={() => { switchLocale(loc.code); setMobileOpen(false) }}
                      className={cn(
                        'flex-1 rounded-lg border px-3 py-2.5 text-xs font-semibold transition-all',
                        locale === loc.code
                          ? 'border-gold-500 bg-gold-500/15 text-gold-600'
                          : 'border-gold-500/15 text-[var(--muted)]'
                      )}
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
              </div>

              {!session && (
                <Link
                  href={`/${locale}/auth/signin`}
                  onClick={() => setMobileOpen(false)}
                  className="btn-primary mt-5 w-full"
                >
                  {t.signIn}
                </Link>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}

