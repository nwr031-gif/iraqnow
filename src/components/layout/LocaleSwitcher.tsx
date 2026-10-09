'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useUIStore } from '@/lib/store'
import { Globe, ChevronDown, Check } from 'lucide-react'
import { useState } from 'react'
import { cn } from '@/lib/utils'

const LOCALES = [
  { code: 'ar', name: 'العربية', nativeName: 'العربية', flag: '🇮🇶', dir: 'rtl' },
  { code: 'ku', name: 'Kurdish', nativeName: 'کوردی', flag: '🇮🇶', dir: 'rtl' },
  { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', dir: 'ltr' },
] as const

export function LocaleSwitcher() {
  const { locale, setLocale } = useUIStore()
  const pathname = usePathname()
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const currentLocale = LOCALES.find((l) => l.code === locale) || LOCALES[0]

  const switchLocale = (newLocale: string) => {
    setLocale(newLocale as 'ar' | 'ku' | 'en')
    const segments = pathname.split('/')
    segments[1] = newLocale
    router.push(segments.join('/'))
    setOpen(false)
  }

  return (
    <div className="fixed top-16 left-4 z-40" dir="ltr">
      <div className="relative">
        <button
          onClick={() => setOpen(!open)}
          className="flex items-center gap-2 rounded-lg bg-white border border-gray-200 px-3 py-2 text-sm font-medium text-gray-700 shadow-lg hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-800"
          aria-label="Change language"
          aria-expanded={open}
        >
          <span className="text-lg">{currentLocale.flag}</span>
          <span className="hidden sm:inline">{currentLocale.nativeName}</span>
          <ChevronDown className={cn('h-4 w-4 transition-transform', open && 'rotate-180')} />
        </button>

        {open && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute left-0 top-full z-20 mt-2 w-40 rounded-lg border border-gray-200 bg-white py-1 shadow-lg dark:border-gray-700 dark:bg-gray-900">
              {LOCALES.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => switchLocale(loc.code)}
                  className={cn(
                    'flex w-full items-center gap-3 px-4 py-2 text-sm transition-colors',
                    locale === loc.code
                      ? 'bg-accent/10 text-accent'
                      : 'text-gray-700 hover:bg-gray-50 dark:text-gray-200 dark:hover:bg-gray-800'
                  )}
                >
                  <span className="text-lg">{loc.flag}</span>
                  <span className="flex-1 text-left">{loc.nativeName}</span>
                  {locale === loc.code && <Check className="h-4 w-4 text-accent" />}
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}