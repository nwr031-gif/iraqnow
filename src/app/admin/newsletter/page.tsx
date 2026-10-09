'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Mail, Download, Trash2, Loader2, CheckCircle2, AlertCircle, RefreshCw, Users, Search,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Subscriber {
  id: string
  email: string
  locale: string
  active: boolean
  createdAt: string
}

const LOCALE_FLAGS: Record<string, string> = { ar: 'عربي', ku: 'کوردی', en: 'EN' }

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)

  const loadSubscribers = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/newsletter')
    if (res.ok) {
      const data = await res.json()
      setSubscribers(data.subscribers || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadSubscribers()
  }, [loadSubscribers])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const removeSubscriber = async (sub: Subscriber) => {
    if (!confirm(`حذف المشترك ${sub.email}؟`)) return
    setActionId(sub.id)
    const res = await fetch(`/api/admin/newsletter?id=${sub.id}`, { method: 'DELETE' })
    if (res.ok) {
      setSubscribers((prev) => prev.filter((s) => s.id !== sub.id))
      showToast('success', 'تم حذف المشترك')
    } else {
      showToast('error', 'فشل الحذف')
    }
    setActionId(null)
  }

  const exportCsv = () => {
    window.open('/api/admin/newsletter?format=csv', '_blank')
    showToast('success', 'جاري تحميل ملف CSV...')
  }

  const filtered = subscribers.filter((s) => !search || s.email.toLowerCase().includes(search.toLowerCase()))
  const activeCount = subscribers.filter((s) => s.active).length

  return (
    <div className="space-y-6">
      {toast && (
        <div className={cn(
          'fixed bottom-6 start-6 z-[100] flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl animate-fade-up',
          toast.type === 'success' ? 'border-green-500/30 bg-green-950/95 text-green-300' : 'border-red-500/30 bg-red-950/95 text-red-300'
        )}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-kufi text-2xl font-bold text-white">النشرة البريدية</h1>
          <p className="mt-1 text-sm text-sand-100/50">
            {activeCount} مشترك نشط من أصل {subscribers.length}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadSubscribers}
            className="rounded-xl border border-white/10 p-2.5 text-sand-100/60 transition-colors hover:border-gold-500/40 hover:text-gold-400"
            aria-label="تحديث"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </button>
          <button onClick={exportCsv} className="btn-primary !rounded-xl !px-5 !py-2.5 text-xs font-kufi">
            <Download className="h-4 w-4" />
            تصدير CSV
          </button>
        </div>
      </div>

      {/* إحصائيات سريعة */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'إجمالي المشتركين', value: subscribers.length, icon: Users },
          { label: 'نشطون', value: activeCount, icon: CheckCircle2 },
          { label: 'غير مفعّلون', value: subscribers.length - activeCount, icon: AlertCircle },
        ].map((stat, i) => (
          <div key={i} className="flex items-center gap-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-gold-500/15 text-gold-400">
              <stat.icon className="h-5 w-5" />
            </span>
            <div>
              <p className="font-kufi text-2xl font-bold text-white">{stat.value.toLocaleString('ar-IQ')}</p>
              <p className="text-xs text-sand-100/50">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="relative">
        <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-100/30" />
        <input
          type="search"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث بالبريد الإلكتروني..."
          className="w-full max-w-md rounded-xl border border-white/[0.07] bg-white/[0.03] py-2.5 pe-4 ps-10 text-sm text-sand-100 placeholder:text-sand-100/30 focus:border-gold-500/50 focus:outline-none"
        />
      </div>

      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03]">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-sand-100/50">
            <Loader2 className="h-5 w-5 animate-spin text-gold-400" />
            جاري التحميل...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <Mail className="h-10 w-10 text-sand-100/20" />
            <p className="text-sm text-sand-100/50">لا يوجد مشتركون مطابقون</p>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {filtered.map((sub) => (
              <div key={sub.id} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.02]">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-lapis-700/40 text-gold-400">
                  <Mail className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-sand-100/85" dir="ltr">{sub.email}</p>
                  <p className="text-[11px] text-sand-100/40">
                    {new Date(sub.createdAt).toLocaleDateString('ar-IQ')}
                  </p>
                </div>
                <span className="rounded-lg bg-white/[0.06] px-2.5 py-1 text-[10px] font-bold text-sand-100/50">
                  {LOCALE_FLAGS[sub.locale] || sub.locale}
                </span>
                <span className={cn(
                  'rounded-lg px-2.5 py-1 text-[10px] font-bold',
                  sub.active ? 'bg-green-500/15 text-green-400' : 'bg-white/10 text-sand-100/40'
                )}>
                  {sub.active ? 'نشط' : 'غير مفعّل'}
                </span>
                <button
                  onClick={() => removeSubscriber(sub)}
                  disabled={actionId === sub.id}
                  className="rounded-lg p-2 text-sand-100/35 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                  aria-label="حذف"
                >
                  {actionId === sub.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
