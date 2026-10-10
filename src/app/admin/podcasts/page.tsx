'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Mic, Plus, Trash2, X, Loader2, CheckCircle2, AlertCircle, RefreshCw,
  Play, Clock, Eye, Star, Upload,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminPodcast {
  id: string
  slug: string
  episodeNumber: number
  season: number
  duration: string
  audioUrl: string
  coverUrl: string
  publishedAt: string
  isPublished: boolean
  isFeatured: boolean
  views: number
  guest: { ar: string; ku: string; en: string }
  translations: { locale: 'ar' | 'ku' | 'en'; title: string; description: string; showNotes: string }[]
}

export default function AdminPodcastsPage() {
  const [podcasts, setPodcasts] = useState<AdminPodcast[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [actionId, setActionId] = useState<string | null>(null)

  const loadPodcasts = useCallback(async () => {
    setLoading(true)
    const res = await fetch('/api/admin/podcasts/list')
    if (res.ok) {
      const data = await res.json()
      setPodcasts(data.podcasts || [])
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadPodcasts()
  }, [loadPodcasts])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const removePodcast = async (pod: AdminPodcast) => {
    if (!confirm(`حذف الحلقة "${pod.translations.find((t) => t.locale === 'ar')?.title}"؟`)) return
    setActionId(pod.id)
    const res = await fetch(`/api/admin/podcasts?id=${pod.id}`, { method: 'DELETE' })
    if (res.ok) {
      setPodcasts((prev) => prev.filter((p) => p.id !== pod.id))
      showToast('success', 'تم حذف الحلقة')
    } else {
      showToast('error', 'فشل الحذف')
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
          <h1 className="font-kufi text-2xl font-bold text-white">إدارة البودكاست</h1>
          <p className="mt-1 text-sm text-sand-100/50">{podcasts.length} حلقة — صوت العراق</p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadPodcasts}
            className="rounded-xl border border-white/10 p-2.5 text-sand-100/60 transition-colors hover:border-gold-500/40 hover:text-gold-400"
            aria-label="تحديث"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </button>
          <button onClick={() => setShowCreate(true)} className="btn-primary !rounded-xl !px-5 !py-2.5 text-xs font-kufi">
            <Plus className="h-4 w-4" />
            حلقة جديدة
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-20 text-sand-100/50">
          <Loader2 className="h-5 w-5 animate-spin text-gold-400" />
          جاري التحميل...
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {podcasts.map((pod) => {
            const ar = pod.translations.find((t) => t.locale === 'ar')
            return (
              <div
                key={pod.id}
                className="group overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03] transition-all duration-300 hover:border-gold-500/30"
              >
                <div className="relative aspect-video overflow-hidden">
                  <img
                    src={pod.coverUrl || `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=600&fit=crop&q=80&sig=${pod.slug}/600/340`}
                    alt=""
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-lapis-950 via-transparent to-transparent" />
                  <span className="absolute start-3 top-3 rounded-lg bg-lapis-950/80 px-2.5 py-1 text-[10px] font-bold text-gold-400 backdrop-blur-sm">
                    الحلقة {pod.episodeNumber}
                  </span>
                  {pod.isFeatured && (
                    <span className="absolute end-3 top-3 flex items-center gap-1 rounded-lg bg-gold-500 px-2 py-1 text-[10px] font-bold text-lapis-950">
                      <Star className="h-2.5 w-2.5" />
                      مميزة
                    </span>
                  )}
                  <div className="absolute bottom-3 start-3 flex items-center gap-3 text-[10px] text-sand-100/70">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {pod.duration}
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" />
                      {pod.views.toLocaleString('ar-IQ')}
                    </span>
                  </div>
                </div>

                <div className="p-4">
                  <h3 className="font-kufi text-sm font-bold text-white line-clamp-2">
                    {ar?.title || 'بدون عنوان'}
                  </h3>
                  <p className="mt-1.5 text-[11px] text-sand-100/45 line-clamp-1">
                    {pod.guest.ar || 'بدون ضيف'}
                  </p>

                  <div className="mt-3.5 flex items-center gap-2 border-t border-white/[0.06] pt-3.5">
                    <a
                      href={pod.audioUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1.5 rounded-lg bg-lapis-500/15 px-3 py-1.5 text-[10px] font-bold text-lapis-400 transition-colors hover:bg-lapis-500/25"
                    >
                      <Play className="h-3 w-3" />
                      تشغيل
                    </a>
                    <span className={cn(
                      'rounded-lg px-2 py-1 text-[10px] font-bold',
                      pod.isPublished ? 'bg-green-500/15 text-green-400' : 'bg-white/10 text-sand-100/50'
                    )}>
                      {pod.isPublished ? 'منشورة' : 'مسودة'}
                    </span>
                    <button
                      onClick={() => removePodcast(pod)}
                      disabled={actionId === pod.id}
                      className="ms-auto rounded-lg p-2 text-sand-100/35 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                      aria-label="حذف"
                    >
                      {actionId === pod.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Trash2 className="h-3.5 w-3.5" />}
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showCreate && (
        <CreatePodcastModal
          nextNumber={Math.max(0, ...podcasts.map((p) => p.episodeNumber)) + 1}
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false)
            loadPodcasts()
            showToast('success', 'تمت إضافة الحلقة بنجاح')
          }}
          onError={(msg) => showToast('error', msg)}
        />
      )}
    </div>
  )
}

function CreatePodcastModal({
  nextNumber,
  onClose,
  onCreated,
  onError,
}: {
  nextNumber: number
  onClose: () => void
  onCreated: () => void
  onError: (msg: string) => void
}) {
  const [form, setForm] = useState({
    episodeNumber: nextNumber,
    season: 3,
    duration: '30:00',
    audioUrl: '',
    coverUrl: '',
    guest: '',
    titleAr: '',
    descriptionAr: '',
    showNotesAr: '',
  })
  const [saving, setSaving] = useState(false)
  const [uploadingAudio, setUploadingAudio] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/podcasts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeNumber: form.episodeNumber,
          season: form.season,
          duration: form.duration,
          audioUrl: form.audioUrl,
          coverUrl: form.coverUrl,
          guest: { ar: form.guest, ku: form.guest, en: form.guest },
          translations: [
            { locale: 'ar', title: form.titleAr, description: form.descriptionAr, showNotes: form.showNotesAr },
            { locale: 'ku', title: form.titleAr, description: '', showNotes: '' },
            { locale: 'en', title: form.titleAr, description: '', showNotes: '' },
          ],
        }),
      })
      const data = await res.json()
      if (res.ok) onCreated()
      else onError(data.error || 'فشل الإنشاء')
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
            <Mic className="h-5 w-5 text-gold-400" />
            حلقة بودكاست جديدة
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-sand-100/50 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">رقم الحلقة</label>
              <input
                type="number"
                value={form.episodeNumber}
                onChange={(e) => setForm({ ...form, episodeNumber: parseInt(e.target.value) || 1 })}
                className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 text-sm text-sand-100 focus:border-gold-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">الموسم</label>
              <input
                type="number"
                value={form.season}
                onChange={(e) => setForm({ ...form, season: parseInt(e.target.value) || 1 })}
                className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 text-sm text-sand-100 focus:border-gold-500/50 focus:outline-none"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">المدة</label>
              <input
                type="text"
                value={form.duration}
                onChange={(e) => setForm({ ...form, duration: e.target.value })}
                placeholder="30:00"
                dir="ltr"
                className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 text-sm text-sand-100 focus:border-gold-500/50 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">عنوان الحلقة (عربي) *</label>
            <input
              type="text"
              required
              value={form.titleAr}
              onChange={(e) => setForm({ ...form, titleAr: e.target.value })}
              placeholder="مثال: مستقبل الشباب العراقي"
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">الضيف</label>
            <input
              type="text"
              value={form.guest}
              onChange={(e) => setForm({ ...form, guest: e.target.value })}
              placeholder="اسم الضيف ومسماه"
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-sand-100/70">
              <Mic className="h-3.5 w-3.5" />
              رفع الملف الصوتي (MP3)
            </label>
            <div className="flex gap-2">
              <label className="flex flex-1 cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed border-white/10 py-3 text-xs text-sand-100/50 transition-colors hover:border-gold-500/40 hover:text-gold-400">
                {uploadingAudio ? (
                  <><Loader2 className="h-4 w-4 animate-spin text-gold-400" /> جاري الرفع...</>
                ) : (
                  <><Upload className="h-4 w-4" /> اضغط لرفع ملف صوتي (MP3, M4A, WAV)</>
                )}
                <input
                  type="file"
                  accept="audio/*,.mp3,.m4a,.wav"
                  className="hidden"
                  disabled={uploadingAudio}
                  onChange={async (e) => {
                    const file = e.target.files?.[0]
                    if (!file) return
                    setUploadingAudio(true)
                    try {
                      const fd = new FormData()
                      fd.append('file', file)
                      const res = await fetch('/api/upload', { method: 'POST', body: fd })
                      const data = await res.json()
                      if (res.ok) setForm((prev) => ({ ...prev, audioUrl: data.url }))
                    } catch { /* ignore */ }
                    setUploadingAudio(false)
                  }}
                />
              </label>
            </div>
            {form.audioUrl && (
              <div className="mt-2 flex items-center gap-2 rounded-lg bg-green-500/10 px-3 py-2">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-green-400" />
                <span className="truncate text-[10px] text-green-300" dir="ltr">{form.audioUrl}</span>
              </div>
            )}
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">أو الصق رابط الملف الصوتي</label>
            <input
              type="url"
              value={form.audioUrl}
              onChange={(e) => setForm({ ...form, audioUrl: e.target.value })}
              placeholder="https://.../episode.mp3"
              dir="ltr"
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">رابط صورة الغلاف</label>
            <input
              type="url"
              value={form.coverUrl}
              onChange={(e) => setForm({ ...form, coverUrl: e.target.value })}
              placeholder="https://..."
              dir="ltr"
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">وصف الحلقة</label>
            <textarea
              rows={2}
              value={form.descriptionAr}
              onChange={(e) => setForm({ ...form, descriptionAr: e.target.value })}
              className="w-full resize-none rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">ملاحظات الحلقة (Show Notes)</label>
            <textarea
              rows={3}
              value={form.showNotesAr}
              onChange={(e) => setForm({ ...form, showNotesAr: e.target.value })}
              placeholder="محاور الحلقة، الطوابع الزمنية..."
              className="w-full resize-none rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-sand-100/60 transition-colors hover:bg-white/5">
              إلغاء
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 !rounded-xl !py-3 text-sm font-kufi">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Mic className="h-4 w-4" />}
              {saving ? 'جاري النشر...' : 'نشر الحلقة'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

