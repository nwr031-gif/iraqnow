'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import {
  Search, Filter, Eye, Pencil, Trash2, CheckCircle2, Archive,
  Clock, MoreVertical, Loader2, AlertCircle, RefreshCw, PenSquare,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminArticle {
  id: string
  slug: string
  status: string
  breaking: boolean
  featured: boolean
  publishedAt: string
  updatedAt: string
  viewCount: number
  categorySlug: string
  image: string
  translations: { locale: string; title: string; excerpt: string; content: string }[]
}

const STATUS_TABS = [
  { value: 'all', label: 'الكل' },
  { value: 'PUBLISHED', label: 'منشور' },
  { value: 'DRAFT', label: 'مسودة' },
  { value: 'IN_REVIEW', label: 'قيد المراجعة' },
  { value: 'SCHEDULED', label: 'مجدول' },
  { value: 'ARCHIVED', label: 'مؤرشف' },
]

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'مسودة', color: 'bg-sand-500/15 text-sand-600 border-sand-500/30' },
  IN_REVIEW: { label: 'قيد المراجعة', color: 'bg-gold-500/15 text-gold-600 border-gold-500/30' },
  SCHEDULED: { label: 'مجدول', color: 'bg-lapis-500/15 text-lapis-500 border-lapis-500/30' },
  PUBLISHED: { label: 'منشور', color: 'bg-green-500/15 text-green-600 border-green-500/30' },
  ARCHIVED: { label: 'مؤرشف', color: 'bg-ink-500/15 text-ink-500 border-ink-500/30' },
}

const CATEGORY_NAMES: Record<string, string> = {
  politics: 'السياسة', economy: 'الاقتصاد', security: 'الأمن', society: 'المجتمع',
  culture: 'الثقافة', sports: 'الرياضة', technology: 'التكنولوجيا', health: 'الصحة',
  education: 'التعليم', environment: 'البيئة', local: 'محليات', world: 'العالم',
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `منذ ${mins} د`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `منذ ${hours} س`
  return `منذ ${Math.floor(hours / 24)} ي`
}

export default function AdminArticlesPage() {
  const [articles, setArticles] = useState<AdminArticle[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [menuOpen, setMenuOpen] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const loadArticles = useCallback(async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (tab !== 'all') params.set('status', tab)
      const res = await fetch(`/api/admin/articles/list?${params}`)
      if (res.ok) {
        const data = await res.json()
        setArticles(data.articles || [])
      }
    } catch {
      /* ignore */
    }
    setLoading(false)
  }, [tab])

  useEffect(() => {
    loadArticles()
  }, [loadArticles])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const changeStatus = async (id: string, status: string) => {
    setActionLoading(id)
    try {
      const res = await fetch('/api/admin/articles', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'status', id, status }),
      })
      if (res.ok) {
        showToast('success', 'تم تحديث حالة المقال')
        setArticles((prev) => prev.map((a) => (a.id === id ? { ...a, status } : a)))
      } else {
        const data = await res.json()
        showToast('error', data.error || 'فشل التحديث')
      }
    } catch {
      showToast('error', 'حدث خطأ في الاتصال')
    }
    setActionLoading(null)
    setMenuOpen(null)
  }

  const deleteArticle = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا المقال؟ لا يمكن التراجع عن هذا الإجراء.')) return
    setActionLoading(id)
    try {
      const res = await fetch(`/api/admin/articles?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        showToast('success', 'تم حذف المقال')
        setArticles((prev) => prev.filter((a) => a.id !== id))
      } else {
        const data = await res.json()
        showToast('error', data.error || 'فشل الحذف')
      }
    } catch {
      showToast('error', 'حدث خطأ في الاتصال')
    }
    setActionLoading(null)
    setMenuOpen(null)
  }

  const filtered = articles.filter((a) => {
    if (!search) return true
    const ar = a.translations.find((t) => t.locale === 'ar')
    return ar?.title.toLowerCase().includes(search.toLowerCase())
  })

  return (
    <div className="space-y-6">
      {toast && (
        <div className={cn(
          'fixed bottom-6 start-6 z-[100] flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl animate-fade-up',
          toast.type === 'success'
            ? 'border-green-500/30 bg-green-950/95 text-green-300'
            : 'border-red-500/30 bg-red-950/95 text-red-300'
        )}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      {/* الرأس */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-kufi text-2xl font-bold text-white">إدارة المقالات</h1>
          <p className="mt-1 text-sm text-sand-100/50">
            {articles.length} مقال — تحكم كامل بالمحتوى التحريري
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadArticles}
            className="rounded-xl border border-white/10 p-2.5 text-sand-100/60 transition-colors hover:border-gold-500/40 hover:text-gold-400"
            aria-label="تحديث"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </button>
          <Link href="/admin/articles/new" className="btn-primary !rounded-xl !px-5 !py-2.5 text-xs font-kufi">
            <PenSquare className="h-4 w-4" />
            مقال جديد
          </Link>
        </div>
      </div>

      {/* الفلاتر */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/[0.07] bg-white/[0.03] p-1.5">
          {STATUS_TABS.map((t) => (
            <button
              key={t.value}
              onClick={() => setTab(t.value)}
              className={cn(
                'rounded-lg px-3.5 py-1.5 text-xs font-medium transition-all',
                tab === t.value
                  ? 'bg-gold-500 text-lapis-950 shadow-lg shadow-gold-500/20'
                  : 'text-sand-100/60 hover:bg-white/[0.05] hover:text-sand-100'
              )}
            >
              {t.label}
            </button>
          ))}
        </div>

        <div className="relative flex-1 sm:min-w-64 sm:flex-none">
          <Search className="absolute start-3 top-1/2 h-4 w-4 -translate-y-1/2 text-sand-100/30" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="ابحث في العناوين..."
            className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] py-2.5 pe-4 ps-10 text-sm text-sand-100 placeholder:text-sand-100/30 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
          />
        </div>
      </div>

      {/* الجدول */}
      <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03]">
        {loading ? (
          <div className="flex items-center justify-center gap-3 py-20 text-sand-100/50">
            <Loader2 className="h-5 w-5 animate-spin text-gold-400" />
            جاري تحميل المقالات...
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-20 text-center">
            <Filter className="h-10 w-10 text-sand-100/20" />
            <p className="text-sm text-sand-100/50">لا توجد مقالات مطابقة</p>
            <Link href="/admin/articles/new" className="text-xs font-medium text-gold-400 hover:text-gold-300">
              + إنشاء مقال جديد
            </Link>
          </div>
        ) : (
          <div className="divide-y divide-white/[0.05]">
            {filtered.map((article) => {
              const ar = article.translations.find((t) => t.locale === 'ar')
              const status = STATUS_LABELS[article.status] || STATUS_LABELS.DRAFT
              const hasAllLocales = ['ar', 'ku', 'en'].every((l) =>
                article.translations.find((t) => t.locale === l && t.title)
              )
              return (
                <div key={article.id} className="group flex items-center gap-4 px-5 py-4 transition-colors hover:bg-white/[0.02]">
                  {article.image ? (
                    <img src={article.image} alt="" className="h-14 w-20 shrink-0 rounded-lg object-cover" />
                  ) : (
                    <span className="flex h-14 w-20 shrink-0 items-center justify-center rounded-lg bg-white/[0.05] text-sand-100/20">
                      <PenSquare className="h-5 w-5" />
                    </span>
                  )}

                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="truncate text-sm font-semibold text-sand-100/90">{ar?.title || 'بدون عنوان'}</p>
                      {article.breaking && (
                        <span className="rounded-md bg-red-500/15 px-1.5 py-0.5 text-[9px] font-bold text-red-400">عاجل</span>
                      )}
                      {article.featured && (
                        <span className="rounded-md bg-gold-500/15 px-1.5 py-0.5 text-[9px] font-bold text-gold-500">مميز</span>
                      )}
                    </div>
                    <div className="mt-1.5 flex flex-wrap items-center gap-3 text-[11px] text-sand-100/40">
                      <span className="rounded-md bg-white/[0.05] px-2 py-0.5">{CATEGORY_NAMES[article.categorySlug] || article.categorySlug}</span>
                      <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{timeAgo(article.updatedAt)}</span>
                      <span className="flex items-center gap-1"><Eye className="h-3 w-3" />{article.viewCount.toLocaleString('ar-IQ')}</span>
                      <span className={cn(
                        'flex items-center gap-1',
                        hasAllLocales ? 'text-green-500/70' : 'text-gold-500/70'
                      )}>
                        {hasAllLocales ? '3/3 لغات ✓' : `${article.translations.filter((t) => t.title).length}/3 لغات`}
                      </span>
                    </div>
                  </div>

                  <span className={`hidden shrink-0 rounded-lg border px-2.5 py-1 text-[10px] font-bold sm:block ${status.color}`}>
                    {status.label}
                  </span>

                  <div className="relative shrink-0">
                    <button
                      onClick={() => setMenuOpen(menuOpen === article.id ? null : article.id)}
                      className="rounded-lg p-2 text-sand-100/40 transition-colors hover:bg-white/[0.07] hover:text-sand-100"
                      aria-label="خيارات"
                      disabled={actionLoading === article.id}
                    >
                      {actionLoading === article.id ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <MoreVertical className="h-4 w-4" />
                      )}
                    </button>

                    {menuOpen === article.id && (
                      <>
                        <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(null)} />
                        <div className="absolute end-0 top-full z-20 mt-1 w-48 overflow-hidden rounded-xl border border-gold-500/20 bg-lapis-900 shadow-2xl">
                          <Link
                            href={`/admin/articles/${article.id}/edit`}
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-sand-100/80 transition-colors hover:bg-white/5 hover:text-gold-300"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            تعديل
                          </Link>
                          <Link
                            href={`/ar/article/${article.slug}`}
                            target="_blank"
                            className="flex items-center gap-2.5 px-4 py-2.5 text-xs text-sand-100/80 transition-colors hover:bg-white/5 hover:text-gold-300"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            معاينة
                          </Link>
                          {article.status !== 'PUBLISHED' && (
                            <button
                              onClick={() => changeStatus(article.id, 'PUBLISHED')}
                              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs text-green-400 transition-colors hover:bg-green-500/10"
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                              نشر الآن
                            </button>
                          )}
                          {article.status === 'PUBLISHED' && (
                            <button
                              onClick={() => changeStatus(article.id, 'ARCHIVED')}
                              className="flex w-full items-center gap-2.5 px-4 py-2.5 text-xs text-sand-100/60 transition-colors hover:bg-white/5"
                            >
                              <Archive className="h-3.5 w-3.5" />
                              أرشفة
                            </button>
                          )}
                          <button
                            onClick={() => deleteArticle(article.id)}
                            className="flex w-full items-center gap-2.5 border-t border-white/[0.07] px-4 py-2.5 text-xs text-red-400 transition-colors hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            حذف نهائي
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
