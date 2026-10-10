'use client'

import { useEffect, useState, useCallback } from 'react'
import { X, ChevronRight, ChevronLeft, Share2, Link2, Check, Copy } from 'lucide-react'
import { cn } from '@/lib/utils'

/* ═══════════ شريط تقدم القراءة ═══════════ */
export function ReadingProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const total = el.scrollHeight - el.clientHeight
      setProgress(total > 0 ? Math.min(100, (el.scrollTop / total) * 100) : 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-1 bg-transparent" aria-hidden="true">
      <div
        className="h-full bg-gradient-to-l rtl:bg-gradient-to-r from-gold-400 via-gold-500 to-gold-600 transition-[width] duration-150"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}

/* ═══════════ معرض الصور مع Lightbox ═══════════ */
export function ArticleGallery({ images, alt }: { images: string[]; alt: string }) {
  const [lightbox, setLightbox] = useState<number | null>(null)

  const close = useCallback(() => setLightbox(null), [])
  const next = useCallback(() => setLightbox((p) => (p === null ? null : (p + 1) % images.length)), [images.length])
  const prev = useCallback(() => setLightbox((p) => (p === null ? null : (p - 1 + images.length) % images.length)), [images.length])

  useEffect(() => {
    if (lightbox === null) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close()
      if (e.key === 'ArrowRight') next()
      if (e.key === 'ArrowLeft') prev()
    }
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [lightbox, close, next, prev])

  if (!images || images.length === 0) return null

  return (
    <>
      <section aria-label="معرض الصور" className="my-8">
        <div className={cn('grid gap-3', images.length >= 3 ? 'grid-cols-2 sm:grid-cols-3' : 'grid-cols-2')}>
          {images.slice(0, 6).map((img, i) => (
            <button
              key={i}
              onClick={() => setLightbox(i)}
              className={cn(
                'group relative overflow-hidden rounded-2xl border border-[var(--border)]',
                i === 0 && images.length >= 3 && 'col-span-2 row-span-2 sm:col-span-2'
              )}
              aria-label={`عرض الصورة ${i + 1}`}
            >
              <img
                src={img}
                alt={`${alt} — ${i + 1}`}
                loading="lazy"
                className={cn(
                  'w-full object-cover transition-transform duration-700 group-hover:scale-105',
                  i === 0 && images.length >= 3 ? 'aspect-[16/10]' : 'aspect-[4/3]'
                )}
              />
              <span className="absolute inset-0 flex items-center justify-center bg-lapis-950/0 opacity-0 transition-all duration-300 group-hover:bg-lapis-950/30 group-hover:opacity-100">
                <span className="rounded-full bg-gold-500 px-4 py-1.5 text-xs font-bold text-lapis-950">
                  تكبير 🔍
                </span>
              </span>
            </button>
          ))}
        </div>
      </section>

      {/* Lightbox */}
      {lightbox !== null && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center bg-black/95 backdrop-blur-sm" onClick={close}>
          <button className="absolute end-5 top-5 z-10 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-white/20" onClick={close} aria-label="إغلاق">
            <X className="h-6 w-6" />
          </button>

          <button className="absolute start-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-gold-500 hover:text-lapis-950" onClick={(e) => { e.stopPropagation(); prev() }} aria-label="السابق">
            <ChevronRight className="h-7 w-7" />
          </button>

          <img src={images[lightbox]} alt="" className="max-h-[85vh] max-w-[92vw] rounded-2xl object-contain shadow-2xl" onClick={(e) => e.stopPropagation()} />

          <button className="absolute end-4 top-1/2 z-10 -translate-y-1/2 rounded-full bg-white/10 p-3 text-white transition-colors hover:bg-gold-500 hover:text-lapis-950" onClick={(e) => { e.stopPropagation(); next() }} aria-label="التالي">
            <ChevronLeft className="h-7 w-7" />
          </button>

          <div className="absolute bottom-6 start-1/2 -translate-x-1/2 rounded-full bg-black/60 px-4 py-1.5 text-xs font-bold text-white/80 backdrop-blur-sm rtl:translate-x-1/2">
            {lightbox + 1} / {images.length}
          </div>
        </div>
      )}
    </>
  )
}

/* ═══════════ أزرار المشاركة ═══════════ */
export function ShareButtons({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch { /* ignore */ }
  }

  const shareNative = async () => {
    if (typeof navigator !== 'undefined' && (navigator as any).share) {
      try { await (navigator as any).share({ title, url }) } catch { /* ignore */ }
    } else {
      copyLink()
    }
  }

  return (
    <div className="flex items-center gap-2">
      <a
        href={`https://x.com/intent/tweet?text=${encodeURIComponent(title)}&url=${encodeURIComponent(url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-[var(--muted)] transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:text-gold-600"
        aria-label="X"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
      </a>
      <a
        href={`https://wa.me/?text=${encodeURIComponent(title + ' ' + url)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-[var(--muted)] transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:text-gold-600"
        aria-label="WhatsApp"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" /></svg>
      </a>
      <button
        onClick={copyLink}
        className="flex h-10 w-10 items-center justify-center rounded-xl border border-[var(--border)] bg-[var(--card-bg)] text-[var(--muted)] transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:text-gold-600"
        aria-label="نسخ الرابط"
      >
        {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
      </button>
      <button
        onClick={shareNative}
        className="flex h-10 items-center gap-2 rounded-xl border border-gold-500/40 px-4 text-xs font-semibold text-gold-600 transition-all duration-300 hover:-translate-y-1 hover:bg-gold-500 hover:text-lapis-950"
      >
        <Share2 className="h-4 w-4" />
        مشاركة
      </button>
    </div>
  )
}
