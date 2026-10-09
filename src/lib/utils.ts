import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatDate(date: Date | string, locale: 'ar' | 'ku' | 'en' = 'ar') {
  const d = new Date(date)
  return d.toLocaleDateString(locale === 'ar' ? 'ar-IQ' : locale === 'ku' ? 'ckb-IQ' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function formatRelativeTime(date: Date | string, locale: 'ar' | 'ku' | 'en' = 'ar') {
  const d = new Date(date)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  const labels = {
    ar: { min: 'دقيقة', mins: 'دقائق', hour: 'ساعة', hours: 'ساعات', day: 'يوم', days: 'أيام', now: 'الآن' },
    ku: { min: 'چرکە', mins: 'چرکەکان', hour: 'کاتژمێر', hours: 'کاتژمێرەکان', day: 'ڕۆژ', days: 'ڕۆژەکان', now: 'ئێستا' },
    en: { min: 'min', mins: 'mins', hour: 'hr', hours: 'hrs', day: 'day', days: 'days', now: 'now' },
  }

  const l = labels[locale]

  if (diffMins < 1) return l.now
  if (diffMins < 60) return `${diffMins} ${diffMins === 1 ? l.min : l.mins}`
  if (diffHours < 24) return `${diffHours} ${diffHours === 1 ? l.hour : l.hours}`
  if (diffDays < 7) return `${diffDays} ${diffDays === 1 ? l.day : l.days}`
  return formatDate(date, locale)
}

export function generateSlug(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function truncate(text: string, length: number) {
  if (text.length <= length) return text
  return text.slice(0, length).trim() + '...'
}

export function getReadingTime(content: string): number {
  const wordsPerMinute = 200
  const words = content.trim().split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}

export const LOCALES = ['ar', 'ku', 'en'] as const
export type Locale = (typeof LOCALES)[number]

export const LOCALE_NAMES: Record<Locale, string> = {
  ar: 'العربية',
  ku: 'کوردی',
  en: 'English',
}

export const LOCALE_DIR: Record<Locale, 'rtl' | 'ltr'> = {
  ar: 'rtl',
  ku: 'rtl',
  en: 'ltr',
}

export function getLocaleDirection(locale: Locale) {
  return LOCALE_DIR[locale]
}

export function getDefaultLocale(): Locale {
  return 'ar'
}