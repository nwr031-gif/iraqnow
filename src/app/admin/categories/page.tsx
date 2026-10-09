'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  FolderTree, Plus, Pencil, Trash2, X, Loader2, CheckCircle2, AlertCircle, RefreshCw,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminCategory {
  id: string
  slug: string
  order: number
  articleCount: number
  translations: { locale: 'ar' | 'ku' | 'en'; name: string; description: string }[]
}

const LOCALE_LABELS = { ar: 'العربية', ku: 'کوردی', en: 'English' }

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<AdminCategory[]>([])
  const [loading, setLoading] = useState(true)
  const [modal, setModal] = useState<{ mode: 'create' } | { mode: 'edit'; category: AdminCategory } | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)

  const loadCategories = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/categories/list')
    if (res.ok) {
      const data = await res.json()
      setCategories(data.categories || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadCategories()
  }, [loadCategories])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const removeCategory = async (cat: AdminCategory) => {
    if (!confirm(`حذف قسم "${cat.translations[0]?.name}"؟`)) return
    setActionId(cat.id)
    const res = await fetch(`/api/admin/categories?id=${cat.id}`, { method: 'DELETE' })
    if (res.ok) {
      setCategories((prev) => prev.filter((c) => c.id !== cat.id))
      showToast('success', 'تم حذف القسم')
    } else {
      const data = await res.json()
      showToast('error', data.error || 'فشل الحذف')
    }
    setActionId(null)
  }

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
          <h1 className="font-kufi text-2xl font-bold text-white">إدارة الأقسام</h1>
          <p className="mt-1 text-sm text-sand-100/50">{categories.length} قسم — بأسماء مترجمة لثلاث لغات</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadCategories}
            className="rounded-xl border border-white/10 p-2.5 text-sand-100/60 transition-colors hover:border-gold-500/40 hover:text-gold-400"
            aria-label="تحديث"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </button>
          <button onClick={() => setModal({ mode: 'create' })} className="btn-primary !rounded-xl !px-5 !py-2.5 text-xs font-kufi">
            <Plus className="h-4 w-4" />
            قسم جديد
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-20 text-sand-100/50">
          <Loader2 className="h-5 w-5 animate-spin text-gold-400" />
          جاري التحميل...
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {categories.map((cat) => {
            const ar = cat.translations.find((t) => t.locale === 'ar')
            const ku = cat.translations.find((t) => t.locale === 'ku')
            const en = cat.translations.find((t) => t.locale === 'en')
            return (
              <div
                key={cat.id}
                className="group rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 transition-all duration-300 hover:border-gold-500/30"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-lapis-600 to-lapis-900 text-gold-400">
                    <FolderTree className="h-4.5 w-4.5" />
                  </span>
                  <span className="rounded-lg bg-white/[0.06] px-2.5 py-1 text-[10px] font-bold text-sand-100/50">
                    {cat.articleCount} مقال
                  </span>
                </div>

                <h3 className="mt-3 font-kufi text-base font-bold text-white">{ar?.name}</h3>
                <p className="mt-0.5 text-[11px] text-sand-100/40" dir="ltr">/{cat.slug}</p>

                <div className="mt-3 space-y-1 text-[11px] text-sand-100/50">
                  <p>کوردی: {ku?.name || '—'}</p>
                  <p dir="ltr" className="text-start">English: {en?.name || '—'}</p>
                </div>

                <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-3.5">
                  <button
                    onClick={() => setModal({ mode: 'edit', category: cat })}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-gold-500/10 py-2 text-[11px] font-bold text-gold-400 transition-colors hover:bg-gold-500/20"
                  >
                    <Pencil className="h-3 w-3" />
                    تعديل
                  </button>
                  <button
                    onClick={() => removeCategory(cat)}
                    disabled={actionId === cat.id}
                    className="flex items-center justify-center gap-1.5 rounded-lg bg-red-500/10 px-4 py-2 text-[11px] font-bold text-red-400 transition-colors hover:bg-red-500/20 disabled:opacity-50"
                  >
                    {actionId === cat.id ? <Loader2 className="h-3 w-3 animate-spin" /> : <Trash2 className="h-3 w-3" />}
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {modal && (
        <CategoryModal
          category={modal.mode === 'edit' ? modal.category : undefined}
          onClose={() => setModal(null)}
          onSaved={() => {
            setModal(null)
            loadCategories()
            showToast('success', 'تم حفظ القسم بنجاح')
          }}
          onError={(msg) => showToast('error', msg)}
        />
      )}
    </div>
  )
}

function CategoryModal({
  category,
  onClose,
  onSaved,
  onError,
}: {
  category?: AdminCategory
  onClose: () => void
  onSaved: () => void
  onError: (msg: string) => void
}) {
  const isEdit = !!category
  const [slug, setSlug] = useState(category?.slug || '')
  const [translations, setTranslations] = useState(
    (['ar', 'ku', 'en'] as const).map((locale) => ({
      locale,
      name: category?.translations.find((t) => t.locale === locale)?.name || '',
      description: category?.translations.find((t) => t.locale === locale)?.description || '',
    }))
  )
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/categories', {
        method: isEdit ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(isEdit ? { id: category!.id, slug, translations } : { slug, translations }),
      })
      const data = await res.json()
      if (res.ok) onSaved()
      else onError(data.error || 'فشل الحفظ')
    } catch {
      onError('حدث خطأ في الاتصال')
    }
    setSaving(false)
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gold-500/20 bg-gradient-to-b from-lapis-900 to-ink-950 p-6 shadow-2xl animate-scale-in">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-kufi text-lg font-bold text-white">
            <FolderTree className="h-5 w-5 text-gold-400" />
            {isEdit ? 'تعديل القسم' : 'قسم جديد'}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-sand-100/50 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">
              المعرف (Slug) * <span className="text-sand-100/35">— بالإنكليزية، بدون مسافات</span>
            </label>
            <input
              type="text"
              required
              value={slug}
              onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''))}
              placeholder="politics"
              dir="ltr"
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none"
            />
          </div>

          {translations.map((tr, i) => (
            <div key={tr.locale} className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
              <p className="mb-3 text-xs font-bold text-gold-400">{LOCALE_LABELS[tr.locale]}</p>
              <div className="space-y-3">
                <input
                  type="text"
                  value={tr.name}
                  onChange={(e) => {
                    const next = [...translations]
                    next[i] = { ...next[i], name: e.target.value }
                    setTranslations(next)
                  }}
                  placeholder={`اسم القسم بـ${LOCALE_LABELS[tr.locale]}`}
                  required={tr.locale === 'ar'}
                  dir={tr.locale === 'en' ? 'ltr' : 'rtl'}
                  className="w-full rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 text-sm text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none"
                />
                <input
                  type="text"
                  value={tr.description}
                  onChange={(e) => {
                    const next = [...translations]
                    next[i] = { ...next[i], description: e.target.value }
                    setTranslations(next)
                  }}
                  placeholder={`وصف مختصر (اختياري)`}
                  dir={tr.locale === 'en' ? 'ltr' : 'rtl'}
                  className="w-full rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none"
                />
              </div>
            </div>
          ))}

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-sand-100/60 transition-colors hover:bg-white/5">
              إلغاء
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 !rounded-xl !py-3 text-sm font-kufi">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {saving ? 'جاري الحفظ...' : 'حفظ'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
