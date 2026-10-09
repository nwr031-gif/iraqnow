import { cn } from '@/lib/utils'

interface IshtarStarProps {
  className?: string
  size?: number
  animated?: boolean
}

/**
 * نجمة عشتار الثمانية - رمز الإلهة عشتار في بلاد الرافدين
 * The Eight-Pointed Star of Ishtar - Mesopotamian symbol
 */
export function IshtarStar({ className, size = 32, animated = false }: IshtarStarProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn(className, animated && 'animate-spin-slow')}
      aria-hidden="true"
    >
      <defs>
        <linearGradient id="ishtar-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#e2ad31" />
          <stop offset="50%" stopColor="#d4af37" />
          <stop offset="100%" stopColor="#b8860b" />
        </linearGradient>
      </defs>
      <path
        d="M50 0 L58 42 L100 50 L58 58 L50 100 L42 58 L0 50 L42 42 Z"
        fill="url(#ishtar-gold)"
      />
      <path
        d="M50 22 L55.5 44.5 L78 50 L55.5 55.5 L50 78 L44.5 55.5 L22 50 L44.5 44.5 Z"
        fill="var(--color-lapis-900, #0f2140)"
        opacity="0.92"
      />
      <circle cx="50" cy="50" r="9" fill="url(#ishtar-gold)" />
      <circle cx="50" cy="50" r="3.5" fill="var(--color-lapis-950, #081428)" />
    </svg>
  )
}

/**
 * شعار المنصة الكامل
 */
interface LogoProps {
  locale?: 'ar' | 'ku' | 'en'
  variant?: 'default' | 'light' | 'dark' | 'compact'
  className?: string
  showTagline?: boolean
}

const BRAND_NAMES = {
  ar: { main: 'العراق الآن', sub: 'IQ' },
  ku: { main: 'عێراق ئێستا', sub: 'IQ' },
  en: { main: 'IRAQ NOW', sub: 'العراق الآن' },
}

export function Logo({ locale = 'ar', variant = 'default', className, showTagline = false }: LogoProps) {
  const brand = BRAND_NAMES[locale]
  const isLight = variant === 'light'

  return (
    <div className={cn('flex items-center gap-3', className)} dir={locale === 'en' ? 'ltr' : 'rtl'}>
      <div className="relative shrink-0">
        <div
          className={cn(
            'flex h-11 w-11 items-center justify-center rounded-xl shadow-lg',
            'bg-gradient-to-br from-lapis-700 via-lapis-800 to-lapis-950',
            'ring-1 ring-gold-500/40'
          )}
        >
          <IshtarStar size={30} />
        </div>
        <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-gradient-to-br from-gold-400 to-gold-600 ring-2 ring-[var(--background)]" />
      </div>
      <div className="flex flex-col">
        <span
          className={cn(
            'font-kufi font-bold leading-none tracking-tight',
            locale === 'en' ? 'text-xl tracking-[0.15em]' : 'text-2xl',
            isLight ? 'text-white' : 'text-[var(--foreground)]'
          )}
        >
          {brand.main}
        </span>
        <span
          className={cn(
            'mt-1 text-[10px] font-medium tracking-wider',
            isLight ? 'text-gold-300' : 'text-gold-600'
          )}
          dir={locale === 'en' ? 'rtl' : 'ltr'}
        >
          {showTagline ? (locale === 'en' ? 'العراق الآن' : 'IRAQ NOW') : brand.sub}
        </span>
      </div>
    </div>
  )
}

/**
 * فاصل مسماري - مستوحى من الكتابة المسمارية
 */
export function CuneiformDivider({ className, variant = 'wedge' }: { className?: string; variant?: 'wedge' | 'star' | 'line' }) {
  if (variant === 'star') {
    return (
      <div className={cn('flex items-center justify-center gap-4 py-8', className)}>
        <span className="h-px w-16 bg-gradient-to-r from-transparent to-gold-500/50" />
        <IshtarStar size={18} />
        <span className="h-px w-16 bg-gradient-to-l from-transparent to-gold-500/50" />
      </div>
    )
  }

  if (variant === 'line') {
    return (
      <div className={cn('flex items-center gap-3', className)}>
        <span className="h-px flex-1 bg-gradient-to-r from-transparent via-gold-500/40 to-gold-500/60" />
        <svg width="24" height="12" viewBox="0 0 24 12" fill="none" aria-hidden="true">
          <path d="M2 10 L8 2 M10 10 L16 2 M18 10 L24 2" stroke="#d4af37" strokeWidth="2" strokeLinecap="round" />
        </svg>
        <span className="h-px flex-1 bg-gradient-to-l from-transparent via-gold-500/40 to-gold-500/60" />
      </div>
    )
  }

  return (
    <div className={cn('flex items-center justify-center gap-2 py-6 text-gold-500', className)} aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <svg key={i} width="18" height="14" viewBox="0 0 18 14" fill="none" className="opacity-70">
          <path d="M2 12 L9 3 L16 12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" fill="none" />
          <path d="M6 12 L9 7.5 L12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        </svg>
      ))}
    </div>
  )
}

/**
 * خط مسماري زخرفي
 */
export function CuneiformBand({ className, position = 'top' }: { className?: string; position?: 'top' | 'bottom' }) {
  return (
    <div
      className={cn('h-2 w-full overflow-hidden', className)}
      style={{
        backgroundImage: `repeating-linear-gradient(90deg, 
          transparent 0px, transparent 6px,
          #d4af37 6px, #d4af37 8px,
          transparent 8px, transparent 14px,
          transparent 14px, transparent 20px,
          #b8860b 20px, #b8860b 24px,
          transparent 24px, transparent 32px)`,
        opacity: 0.5,
      }}
      aria-hidden="true"
    />
  )
}
