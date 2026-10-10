'use client'

import { useEffect, useState } from 'react'
import { Download, X } from 'lucide-react'
import { cn } from '@/lib/utils'

/**
 * مزود PWA — تسجيل Service Worker + زر تثبيت التطبيق + Web Vitals
 */
export function PWAProvider() {
  const [installPrompt, setInstallPrompt] = useState<any>(null)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    /* تسجيل Service Worker — فقط في الإنتاج (ليس localhost) */
    if ('serviceWorker' in navigator && !window.location.hostname.includes('localhost')) {
      navigator.serviceWorker.register('/sw.js').catch(() => {})
    }

    /* التقاط حدث التثبيت */
    const onBeforeInstall = (e: Event) => {
      e.preventDefault()
      setInstallPrompt(e)
    }
    window.addEventListener('beforeinstallprompt', onBeforeInstall)

    /* Web Vitals — قياس الأداء الحقيقي */
    import('web-vitals').then(({ onCLS, onINP, onLCP, onTTFB, onFCP }) => {
      const report = (metric: any) => {
        try {
          const payload = JSON.stringify({
            name: metric.name,
            value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
            rating: metric.rating,
            path: window.location.pathname,
          })
          if (navigator.sendBeacon) {
            navigator.sendBeacon('/api/vitals', payload)
          } else {
            fetch('/api/vitals', { method: 'POST', body: payload, keepalive: true })
          }
        } catch { /* تجاهل */ }
      }
      onCLS(report)
      onINP(report)
      onLCP(report)
      onTTFB(report)
      onFCP(report)
    }).catch(() => {})

    return () => window.removeEventListener('beforeinstallprompt', onBeforeInstall)
  }, [])

  const install = async () => {
    if (!installPrompt) return
    installPrompt.prompt()
    await installPrompt.userChoice
    setInstallPrompt(null)
  }

  if (!installPrompt || dismissed) return null

  return (
    <div
      className={cn(
        'fixed bottom-4 start-4 z-[90] flex items-center gap-3 rounded-2xl border border-gold-500/30',
        'bg-lapis-950/95 px-4 py-3 text-white shadow-2xl backdrop-blur-xl animate-fade-up'
      )}
      dir="rtl"
    >
      <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lapis-600 to-lapis-900 ring-1 ring-gold-500/40">
        <Download className="h-5 w-5 text-gold-400" />
      </span>
      <div className="me-2">
        <p className="font-kufi text-xs font-bold">ثبّت تطبيق العراق الآن</p>
        <p className="text-[10px] text-sand-100/50">وصول أسرع + قراءة أوفلاين</p>
      </div>
      <button onClick={install} className="btn-primary !rounded-xl !px-4 !py-2 text-[11px] font-kufi">
        تثبيت
      </button>
      <button
        onClick={() => setDismissed(true)}
        className="rounded-lg p-1.5 text-sand-100/40 transition-colors hover:bg-white/10 hover:text-white"
        aria-label="إغلاق"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  )
}
