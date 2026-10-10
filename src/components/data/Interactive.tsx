'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { Download, Newspaper } from 'lucide-react'

type Locale = 'ar' | 'ku' | 'en'

/* ═══════════ فهرس المحافظات التفاعلي ═══════════ */
export function GovernorateIndex({
  governorates,
  locale,
  labels,
}: {
  governorates: { slug: string; ar: string; ku: string; en: string; articles: number; hot?: boolean }[]
  locale: Locale
  labels: { allGovs: string; articles: string }
}) {
  const router = useRouter()
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5" dir={dir}>
      {governorates.map((gov, i) => (
        <Link
          key={gov.slug}
          href={`/${locale}/governorate/${gov.slug}`}
          className="group relative flex items-center gap-3 overflow-hidden rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-4 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40 hover:shadow-xl"
        >
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-lapis-700 to-lapis-950 font-kufi text-[10px] font-bold text-gold-400">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-kufi text-sm font-bold text-[var(--foreground)] transition-colors group-hover:text-gold-600">
              {gov[locale]}
            </p>
            <p className="flex items-center gap-1 text-[11px] text-[var(--muted)]">
              <Newspaper className="h-3 w-3" />
              {gov.articles} {labels.articles}
            </p>
          </div>
          {gov.hot && <span className="h-2 w-2 shrink-0 rounded-full bg-terra-500" />}
          <span className="absolute bottom-0 start-0 h-0.5 w-0 bg-gradient-to-r from-gold-400 to-gold-600 transition-all duration-400 group-hover:w-full" />
        </Link>
      ))}
    </div>
  )
}

/* ═══════════ بطاقة تحميل قاعدة بيانات ═══════════ */
export function DatasetDownload({
  name,
  rows,
  size,
  locale,
}: {
  name: string
  rows: number
  size: string
  locale: Locale
}) {
  const [done, setDone] = useState(false)
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const numLocale = locale === 'ar' ? 'ar-IQ' : 'en-US'

  const download = (e: React.MouseEvent) => {
    e.preventDefault()
    const csv = `dataset,note\n${name},demo-export-iraqnow`
    const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${name}.csv`
    a.click()
    URL.revokeObjectURL(url)
    setDone(true)
    setTimeout(() => setDone(false), 2500)
  }

  return (
    <div
      className="group flex items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-5 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/40"
      dir={dir}
    >
      <div className="flex items-center gap-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-lapis-700 to-lapis-950 text-gold-400">
          <Download className="h-5 w-5" />
        </span>
        <div>
          <p className="font-kufi text-sm font-bold text-[var(--foreground)]">{name}</p>
          <p className="text-[11px] text-[var(--muted)]">
            {rows.toLocaleString(numLocale)} {locale === 'en' ? 'rows' : 'صف'} · {size}
          </p>
        </div>
      </div>
      <button
        onClick={download}
        className="flex items-center gap-1.5 rounded-xl border border-gold-500/40 px-3.5 py-2 text-[11px] font-bold text-gold-600 transition-all hover:bg-gold-500 hover:text-lapis-950"
      >
        <Download className="h-3.5 w-3.5" />
        {done ? (locale === 'en' ? 'Done ✓' : 'تم ✓') : 'CSV'}
      </button>
    </div>
  )
}
