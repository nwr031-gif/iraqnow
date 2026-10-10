'use client'

import { useEffect, useRef, useState } from 'react'
import { MessageCircle, ExternalLink } from 'lucide-react'

/**
 * نظام التعليقات عبر Giscus (GitHub Discussions) — مجاني، يدعم العربية وRTL
 * يُفعّل عند ضبط المتغيرات: NEXT_PUBLIC_GISCUS_REPO, NEXT_PUBLIC_GISCUS_REPO_ID,
 * NEXT_PUBLIC_GISCUS_CATEGORY, NEXT_PUBLIC_GISCUS_CATEGORY_ID
 */
export function GiscusComments({ locale, title }: { locale: 'ar' | 'ku' | 'en'; title?: string }) {
  const ref = useRef<HTMLDivElement>(null)
  const loaded = useRef(false)
  const [Theme] = [() => 'noborder_dark'] as const

  const repo = process.env.NEXT_PUBLIC_GISCUS_REPO
  const repoId = process.env.NEXT_PUBLIC_GISCUS_REPO_ID
  const category = process.env.NEXT_PUBLIC_GISCUS_CATEGORY
  const categoryId = process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID

  const configured = repo && repoId && category && categoryId

  useEffect(() => {
    if (!configured || !ref.current || loaded.current) return
    loaded.current = true

    const script = document.createElement('script')
    script.src = 'https://giscus.app/client.js'
    script.async = true
    script.crossOrigin = 'anonymous'
    script.setAttribute('data-repo', repo)
    script.setAttribute('data-repo-id', repoId)
    script.setAttribute('data-category', category)
    script.setAttribute('data-category-id', categoryId)
    script.setAttribute('data-mapping', 'pathname')
    script.setAttribute('data-strict', '0')
    script.setAttribute('data-reactions-enabled', '1')
    script.setAttribute('data-emit-metadata', '0')
    script.setAttribute('data-input-position', 'top')
    script.setAttribute('data-theme', 'noborder_dark')
    script.setAttribute('data-lang', locale === 'en' ? 'en' : 'ar')
    script.setAttribute('data-loading', 'lazy')
    ref.current.appendChild(script)
  }, [configured, repo, repoId, category, categoryId, locale])

  if (!configured) return null

  return (
    <section className="mt-12 border-t border-[var(--border)] pt-8" aria-label="التعليقات">
      <h2 className="mb-6 flex items-center gap-2 font-kufi text-lg font-bold text-[var(--foreground)]">
        <MessageCircle className="h-5 w-5 text-gold-500" />
        {locale === 'en' ? 'Comments' : 'التعليقات'}
      </h2>
      <div ref={ref} className="min-h-40" />
      <p className="mt-4 flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
        <ExternalLink className="h-3 w-3" />
        التعليقات مدعومة بواسطة GitHub Discussions
      </p>
    </section>
  )
}
