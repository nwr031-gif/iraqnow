'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect, useRef } from 'react'
import {
  Menu, X, Search, ChevronDown, Map, Database, Mic, Globe, Check,
  TrendingUp, Landmark, Play, Sparkles, Shield, Users, Palette,
  Trophy, Cpu, HeartPulse, GraduationCap, Leaf, MapPin,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Logo, IshtarStar } from '@/components/brand/Brand'
import { NAV_CATEGORIES } from '@/lib/constants'

type Locale = 'ar' | 'en'

const CATEGORY_ICONS: Record<string, any> = {
  politics: Landmark, economy: TrendingUp, security: Shield, society: Users,
  culture: Palette, sports: Trophy, technology: Cpu, health: HeartPulse,
  education: GraduationCap, environment: Leaf, local: MapPin, world: Globe,
}

const CATEGORY_LABELS: Record<Locale, Record<string, string>> = {
  ar: {
    politics: 'السياسة', economy: 'الاقتصاد', security: 'الأمن', society: 'المجتمع',
    culture: 'الثقافة', sports: 'الرياضة', technology: 'التكنولوجيا', health: 'الصحة',
    education: 'التعليم', environment: 'البيئة', local: 'محليات', world: 'العالم',
  },
  en: {
    politics: 'Politics', economy: 'Economy', security: 'Security', society: 'Society',
    culture: 'Culture', sports: 'Sports', technology: 'Technology', health: 'Health',
    education: 'Education', environment: 'Environment', local: 'Local', world: 'World',
  },
}

const UI_TEXT: Record<Locale, Record<string, string>> = {
  ar: {
    home: 'الرئيسية', sections: 'الأقسام', map: 'الخريطة', data: 'البيانات',
    podcasts: 'بودكاست', live: 'مباشر', search: 'بحث',
    latest: 'آخر الأخبار', searchPlaceholder: 'ابحث في العراق الآن...',
    suggestions: 'الأكثر بحثاً', all: 'عرض الكل', menu: 'القائمة',
  },
  en: {
    home: 'Home', sections: 'Sections', map: 'Map', data: 'Data',
    podcasts: 'Podcasts', live: 'Live', search: 'Search',
    latest: 'Latest News', searchPlaceholder: 'Search Iraq Now...',
    suggestions: 'Trending Searches', all: 'View All', menu: 'Menu',
  },
}

const LOCALES: { code: Locale; name: string }[] = [
  { code: 'ar', name: 'العربية' },
  { code: 'en', name: 'English' },
]

export function Header({ locale: rawLocale }: { locale: 'ar' | 'ku' | 'en' }) {
  const locale: Locale = rawLocale === 'en' ? 'en' : 'ar'
  const pathname = usePathname()
  const router = useRouter()
  const t = UI_TEXT[locale]
  const labels = CATEGORY_LABELS[locale]

  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [megaOpen, setMegaOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [langOpen, setLangOpen] = useState(false)
  const [query, setQuery] = useState('')
  const megaTimeout = useRef<NodeJS.Timeout | null>(null)
  const searchInput = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInput.current?.focus(), 100)
  }, [searchOpen])

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

  const submitSearch = (e?: React.FormEvent) => {
    e?.preventDefault()
    const q = query.trim()
    if (!q) return
    setSearchOpen(false)
    setQuery('')
    router.push(`/${locale}/search?q=${encodeURIComponent(q)}`)
  }

  const navLink = (path: string, label: string, exact = false) => {
    const active = exact ? pathname === path : isActive(path)
    return (
      <Link
        key={path}
        href={path}
        className={cn(
          'relative px-3.5 py-2 text-sm font-medium transition-colors',
          active ? 'text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'
        )}
      >
        {label}
        {active && <span className="absolute inset-x-3.5 -bottom-[19px] h-0.5 rounded-full bg-[var(--foreground)]" />}
      </Link>
    )
  }

  return (
    <header className="sticky top-0 z-50 w-full">
      {/* الشريط العلوي */}
      <div className="hidden lg:block border-b border-line bg-cream-deep">
        <div className="container-main flex h-9 items-center justify-between text-xs text-[var(--muted)]">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5 font-medium text-[var(--foreground)]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--foreground)] opacity-50" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-[var(--foreground)]" />
              </span>
              {t.live}
            </span>
            <span className="h-3 w-px bg-line-strong" />
            <span>
              {new Date().toLocaleDateString(locale === 'ar' ? 'ar-IQ' : 'en-US', {
                weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              })}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <div className="relative">
              <button
                onClick={() => setLangOpen(!langOpen)}
                className="flex items-center gap-1.5 rounded-md px-2 py-1.5 transition-colors hover:bg-white hover:text-[var(--foreground)]"
                aria-expanded={langOpen}
              >
                <Globe className="h-3.5 w-3.5" />
                <span className="font-medium">{LOCALES.find((l) => l.code === locale)?.name}</span>
                <ChevronDown className={cn('h-3 w-3 transition-transform', langOpen && 'rotate-180')} />
              </button>
              {langOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setLangOpen(false)} />
                  <div className="absolute end-0 top-full z-20 mt-1.5 w-36 overflow-hidden rounded-xl border border-line bg-[var(--card-bg)] py-1 shadow-lg shadow-ink-900/5">
                    {LOCALES.map((loc) => (
                      <button
                        key={loc.code}
                        onClick={() => switchLocale(loc.code)}
                        className={cn(
                          'flex w-full items-center justify-between px-3.5 py-2 text-xs transition-colors',
                          locale === loc.code
                            ? 'font-semibold text-[var(--foreground)]'
                            : 'text-[var(--muted)] hover:bg-cream-deep hover:text-[var(--foreground)]'
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
            <span className="h-3 w-px bg-line-strong" />
            <Link href={`/${locale}/about`} className="rounded-md px-2 py-1.5 transition-colors hover:bg-white hover:text-[var(--foreground)]">
              {locale === 'en' ? 'About' : 'عن المنصة'}
            </Link>
          </div>
        </div>
      </div>

      {/* الشريط الرئيسي */}
      <div
        className={cn(
          'w-full border-b transition-all duration-300',
          scrolled
            ? 'border-line bg-[var(--overlay)] backdrop-blur-xl'
            : 'border-transparent bg-[var(--background)]'
        )}
      >
        <div className="container-main flex h-[68px] items-center justify-between gap-4">
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden rounded-full p-2 text-[var(--foreground)] transition-colors hover:bg-cream-deep"
              aria-label={t.menu}
            >
              <Menu className="h-5 w-5" />
            </button>

            <Link href={`/${locale}`} aria-label="Iraq Now">
              <Logo locale={locale} />
            </Link>
          </div>

          {/* التنقل - سطح المكتب */}
          <nav className="hidden lg:flex items-center">
            {navLink(`/${locale}`, t.home, true)}

            <div className="relative" onMouseEnter={openMega} onMouseLeave={closeMega}>
              <button
                className={cn(
                  'flex items-center gap-1 px-3.5 py-2 text-sm font-medium transition-colors',
                  megaOpen ? 'text-[var(--foreground)]' : 'text-[var(--muted)] hover:text-[var(--foreground)]'
                )}
                aria-expanded={megaOpen}
              >
                {t.sections}
                <ChevronDown className={cn('h-3.5 w-3.5 transition-transform duration-300', megaOpen && 'rotate-180')} />
              </button>

              {/* Mega Menu */}
              <div
                className={cn(
                  'absolute top-full start-0 z-40 mt-3 w-[560px] overflow-hidden rounded-2xl border border-line bg-[var(--card-bg)] shadow-xl shadow-ink-900/5 transition-all duration-200',
                  megaOpen ? 'visible translate-y-0 opacity-100' : 'invisible -translate-y-1 opacity-0'
                )}
              >
                <div className="grid grid-cols-3 gap-0.5 p-2.5">
                  {NAV_CATEGORIES.map((cat) => {
                    const Icon = CATEGORY_ICONS[cat.slug] || Globe
                    return (
                      <Link
                        key={cat.slug}
                        href={`/${locale}/category/${cat.slug}`}
                        className="group flex items-center gap-2.5 rounded-xl px-3 py-2.5 transition-colors hover:bg-cream-deep"
                        onClick={() => setMegaOpen(false)}
                      >
                        <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-cream-deep text-[var(--foreground)] transition-colors group-hover:bg-[var(--card-bg)]">
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="text-sm font-medium text-[var(--foreground)] transition-opacity group-hover:opacity-80">
                          {labels[cat.slug]}
                        </span>
                      </Link>
                    )
                  })}
                </div>
                <div className="flex items-center justify-between border-t border-line bg-cream px-4 py-2.5">
                  <div className="flex items-center gap-2 text-xs text-[var(--muted)]">
                    <IshtarStar size={12} />
                    <span>{locale === 'en' ? 'Coverage across all 18 governorates' : 'تغطية في جميع المحافظات الـ 18'}</span>
                  </div>
                  <Link
                    href={`/${locale}/latest`}
                    className="text-xs font-semibold text-[var(--foreground)] transition-opacity hover:opacity-70"
                    onClick={() => setMegaOpen(false)}
                  >
                    {t.all} →
                  </Link>
                </div>
              </div>
            </div>

            {navLink(`/${locale}/latest`, t.latest)}
            {navLink(`/${locale}/map`, t.map)}
            {navLink(`/${locale}/data`, t.data)}
            {navLink(`/${locale}/podcasts`, t.podcasts)}
          </nav>

          {/* الأدوات */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-full text-[var(--muted)] transition-colors hover:bg-cream-deep hover:text-[var(--foreground)] sm:w-auto sm:gap-2 sm:px-3.5 sm:rounded-full sm:border sm:border-line"
              aria-label={t.search}
            >
              <Search className="h-4 w-4" />
              <span className="hidden text-xs sm:inline">{t.search}</span>
            </button>
          </div>
        </div>
      </div>

      {/* البحث */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center bg-ink-950/40 p-4 pt-24 backdrop-blur-sm animate-fade-in"
          onClick={() => setSearchOpen(false)}
        >
          <form
            onSubmit={submitSearch}
            className="w-full max-w-2xl overflow-hidden rounded-2xl border border-line bg-[var(--card-bg)] shadow-2xl animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border-b border-line px-5 py-4">
              <Search className="h-5 w-5 text-[var(--muted)]" />
              <input
                ref={searchInput}
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t.searchPlaceholder}
                className="flex-1 bg-transparent text-lg outline-none placeholder:text-[var(--muted)]"
                dir={locale === 'en' ? 'ltr' : 'rtl'}
              />
              <kbd className="hidden rounded-md border border-line bg-cream px-2 py-1 text-[10px] font-bold text-[var(--muted)] sm:block">
                ESC
              </kbd>
            </div>
            <div className="p-4">
              <p className="mb-3 flex items-center gap-2 text-xs font-semibold text-[var(--muted)]">
                <TrendingUp className="h-3.5 w-3.5" />
                {t.suggestions}
              </p>
              <div className="flex flex-wrap gap-2">
                {(locale === 'ar'
                  ? ['أسعار الدولار', 'الموازنة 2027', 'مترو بغداد', 'انتخابات المحافظات', 'كأس آسيا']
                  : ['Dollar rate', '2027 Budget', 'Baghdad Metro', 'Elections']
                ).map((sug) => (
                  <button
                    key={sug}
                    type="button"
                    onClick={() => { setSearchOpen(false); router.push(`/${locale}/search?q=${encodeURIComponent(sug)}`) }}
                    className="rounded-full border border-line bg-cream px-3 py-1.5 text-xs text-[var(--foreground)] transition-colors hover:border-line-strong hover:bg-[var(--card-bg)]"
                  >
                    {sug}
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>
      )}

      {/* قائمة الجوال */}
      {mobileOpen && (
        <div className="fixed inset-0 z-[70] lg:hidden">
          <div className="absolute inset-0 bg-ink-950/40 backdrop-blur-sm animate-fade-in" onClick={() => setMobileOpen(false)} />
          <div className="absolute top-0 start-0 h-full w-[85%] max-w-sm overflow-y-auto border-e border-line bg-[var(--card-bg)] shadow-2xl animate-fade-in">
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-[var(--card-bg)] px-5 py-4">
              <Logo locale={locale} />
              <button
                onClick={() => setMobileOpen(false)}
                className="rounded-full p-2 text-[var(--muted)] transition-colors hover:bg-cream-deep hover:text-[var(--foreground)]"
                aria-label="Close menu"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="p-4">
              <button
                onClick={() => { setMobileOpen(false); setSearchOpen(true) }}
                className="flex w-full items-center gap-2 rounded-full border border-line bg-cream px-4 py-3 text-sm text-[var(--muted)]"
              >
                <Search className="h-4 w-4" />
                {t.searchPlaceholder}
              </button>

              <nav className="mt-5 space-y-0.5">
                {[
                  { href: `/${locale}`, label: t.home },
                  { href: `/${locale}/latest`, label: t.latest },
                  { href: `/${locale}/map`, label: t.map },
                  { href: `/${locale}/data`, label: t.data },
                  { href: `/${locale}/podcasts`, label: t.podcasts },
                ].map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center rounded-xl px-4 py-3 text-sm font-medium text-[var(--foreground)] transition-colors hover:bg-cream-deep"
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>

              <div className="mt-6">
                <p className="mb-3 px-2 text-xs font-bold text-[var(--muted)]">
                  {t.sections}
                </p>
                <div className="grid grid-cols-2 gap-1.5">
                  {NAV_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.slug}
                      href={`/${locale}/category/${cat.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="rounded-xl border border-line bg-cream px-3 py-2.5 text-center text-xs font-medium text-[var(--foreground)] transition-colors hover:border-line-strong hover:bg-[var(--card-bg)]"
                    >
                      {labels[cat.slug]}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="mt-6 border-t border-line pt-4">
                <p className="mb-3 px-2 text-xs font-bold text-[var(--muted)]">
                  {locale === 'en' ? 'Language' : 'اللغة'}
                </p>
                <div className="flex gap-2">
                  {LOCALES.map((loc) => (
                    <button
                      key={loc.code}
                      onClick={() => { switchLocale(loc.code); setMobileOpen(false) }}
                      className={cn(
                        'flex-1 rounded-full border px-3 py-2.5 text-xs font-semibold transition-all',
                        locale === loc.code
                          ? 'border-[var(--foreground)] bg-[var(--foreground)] text-[var(--background)]'
                          : 'border-line text-[var(--muted)] hover:border-line-strong'
                      )}
                    >
                      {loc.name}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
