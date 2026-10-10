'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Save, Eye, ArrowRight, Loader2, AlertCircle, CheckCircle2, Globe,
  Image as ImageIcon, Upload, X, Flame, Star, MapPin, Tag, Clock,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface Translation {
  locale: 'ar' | 'ku' | 'en'
  title: string
  excerpt: string
  content: string
  seoTitle?: string
  seoDesc?: string
}

interface ArticleFormData {
  id?: string
  slug?: string
  status: string
  breaking: boolean
  featured: boolean
  categorySlug: string
  governorateSlug: string
  image: string
  gallery: string[]
  readingTime: number
  tagSlugs: string[]
  authorId: string
  translations: Translation[]
}

const LOCALES: { code: 'ar' | 'ku' | 'en'; label: string; flag: string }[] = [
  { code: 'ar', label: 'العربية', flag: 'ا' },
  { code: 'ku', label: 'کوردی', flag: 'ک' },
  { code: 'en', label: 'English', flag: 'E' },
]

const CATEGORIES = [
  { slug: 'politics', name: 'السياسة' },
  { slug: 'economy', name: 'الاقتصاد' },
  { slug: 'security', name: 'الأمن' },
  { slug: 'society', name: 'المجتمع' },
  { slug: 'culture', name: 'الثقافة' },
  { slug: 'sports', name: 'الرياضة' },
  { slug: 'technology', name: 'التكنولوجيا' },
  { slug: 'health', name: 'الصحة' },
  { slug: 'education', name: 'التعليم' },
  { slug: 'environment', name: 'البيئة' },
  { slug: 'local', name: 'محليات' },
  { slug: 'world', name: 'العالم' },
]

const GOVERNORATES = [
  { slug: 'baghdad', name: 'بغداد' },
  { slug: 'basra', name: 'البصرة' },
  { slug: 'mosul', name: 'الموصل' },
  { slug: 'erbil', name: 'أربيل' },
  { slug: 'sulaymaniyah', name: 'السليمانية' },
  { slug: 'duhok', name: 'دهوك' },
  { slug: 'najaf', name: 'النجف' },
  { slug: 'karbala', name: 'كربلاء' },
  { slug: 'kirkuk', name: 'كركوك' },
  { slug: 'anbar', name: 'الأنبار' },
  { slug: 'dhi-qar', name: 'ذي قار' },
  { slug: 'wasit', name: 'واسط' },
]

const EMPTY_TRANSLATIONS: Translation[] = [
  { locale: 'ar', title: '', excerpt: '', content: '', seoTitle: '', seoDesc: '' },
  { locale: 'ku', title: '', excerpt: '', content: '', seoTitle: '', seoDesc: '' },
  { locale: 'en', title: '', excerpt: '', content: '', seoTitle: '', seoDesc: '' },
]

export function ArticleForm({
  initialData,
  currentUserId,
}: {
  initialData?: ArticleFormData
  currentUserId: string
}) {
  const router = useRouter()
  const [form, setForm] = useState<ArticleFormData>(
    initialData || {
      status: 'DRAFT',
      breaking: false,
      featured: false,
      categorySlug: 'politics',
      governorateSlug: 'baghdad',
      image: '',
      gallery: [],
      readingTime: 5,
      tagSlugs: [],
      authorId: currentUserId,
      translations: EMPTY_TRANSLATIONS,
    }
  )
  const [activeLocale, setActiveLocale] = useState<'ar' | 'ku' | 'en'>('ar')
  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState(false)
  const [uploadingGallery, setUploadingGallery] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [tagInput, setTagInput] = useState('')

  const t = form.translations.find((tr) => tr.locale === activeLocale) || form.translations[0]

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3500)
  }

  const updateTranslation = (locale: string, field: keyof Translation, value: string) => {
    setForm((prev) => ({
      ...prev,
      translations: prev.translations.map((tr) =>
        tr.locale === locale ? { ...tr, [field]: value } : tr
      ),
    }))
  }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        setForm((prev) => ({ ...prev, image: data.url }))
        showToast('success', 'تم رفع الصورة بنجاح')
      } else {
        showToast('error', data.error || 'فشل رفع الصورة')
      }
    } catch {
      showToast('error', 'فشل رفع الصورة')
    }
    setUploading(false)
  }

  const addTag = () => {
    const tag = tagInput.trim()
    if (tag && !form.tagSlugs.includes(tag)) {
      setForm((prev) => ({ ...prev, tagSlugs: [...prev.tagSlugs, tag] }))
      setTagInput('')
    }
  }

  const handleSave = async (status?: string) => {
    const ar = form.translations.find((tr) => tr.locale === 'ar')
    if (!ar?.title?.trim()) {
      setActiveLocale('ar')
      showToast('error', 'العنوان العربي مطلوب — أكمل الترجمة العربية أولاً')
      return
    }

    setSaving(true)
    try {
      const payload = {
        ...(form.id ? { id: form.id } : {}),
        translations: form.translations.map((tr) => ({
          locale: tr.locale,
          title: tr.title,
          excerpt: tr.excerpt,
          content: tr.content,
          seoTitle: tr.seoTitle,
          seoDesc: tr.seoDesc,
        })),
        categorySlug: form.categorySlug,
        governorateSlug: form.governorateSlug,
        authorId: form.authorId,
        status: status || form.status,
        breaking: form.breaking,
        featured: form.featured,
        image: form.image,
        gallery: form.gallery,
        tagSlugs: form.tagSlugs,
        readingTime: form.readingTime,
      }

      const res = await fetch('/api/admin/articles', {
        method: form.id ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form.id ? { id: form.id, data: payload } : payload),
      })

      const data = await res.json()
      if (res.ok) {
        showToast('success', status === 'PUBLISHED' ? 'تم نشر المقال بنجاح! 🎉' : 'تم حفظ المقال')
        setTimeout(() => router.push('/admin/articles'), 1200)
      } else {
        showToast('error', data.error || 'فشل الحفظ')
      }
    } catch {
      showToast('error', 'حدث خطأ في الاتصال')
    }
    setSaving(false)
  }

  const wordCount = t.content.trim().split(/\s+/).filter(Boolean).length
  const completionAr = form.translations[0].title && form.translations[0].content ? 100 : 0

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
        <div className="flex items-center gap-4">
          <Link
            href="/admin/articles"
            className="rounded-xl border border-white/10 p-2.5 text-sand-100/60 transition-colors hover:border-gold-500/40 hover:text-gold-400"
          >
            <ArrowRight className="h-4 w-4" />
          </Link>
          <div>
            <h1 className="font-kufi text-xl font-bold text-white">
              {form.id ? 'تعديل المقال' : 'مقال جديد'}
            </h1>
            <div className="mt-0.5 flex items-center gap-2 text-[11px] text-sand-100/40">
              <span className={cn(
                'rounded-md px-2 py-0.5',
                completionAr ? 'bg-green-500/15 text-green-400' : 'bg-gold-500/15 text-gold-400'
              )}>
                الترجمة العربية {completionAr ? 'مكتملة ✓' : 'غير مكتملة'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => handleSave('DRAFT')}
            disabled={saving}
            className="rounded-xl border border-white/15 px-4 py-2.5 text-xs font-medium text-sand-100/70 transition-colors hover:border-gold-500/40 hover:text-gold-400 disabled:opacity-50"
          >
            حفظ كمسودة
          </button>
          <button
            onClick={() => handleSave('PUBLISHED')}
            disabled={saving}
            className="btn-primary !rounded-xl !px-5 !py-2.5 text-xs font-kufi"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            نشر المقال
          </button>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* المحرر */}
        <div className="space-y-4 xl:col-span-2">
          {/* تبويبات اللغات */}
          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-2">
              <div className="flex gap-1">
                {LOCALES.map((loc) => {
                  const tr = form.translations.find((x) => x.locale === loc.code)
                  const done = !!(tr?.title && tr?.content)
                  return (
                    <button
                      key={loc.code}
                      onClick={() => setActiveLocale(loc.code)}
                      className={cn(
                        'relative flex items-center gap-2 rounded-lg px-4 py-2 text-xs font-semibold transition-all',
                        activeLocale === loc.code
                          ? 'bg-gold-500 text-lapis-950'
                          : 'text-sand-100/60 hover:bg-white/[0.05]'
                      )}
                    >
                      <Globe className="h-3.5 w-3.5" />
                      {loc.label}
                      {done && <CheckCircle2 className={cn('h-3 w-3', activeLocale === loc.code ? 'text-lapis-950' : 'text-green-500')} />}
                    </button>
                  )
                })}
              </div>
              <span className="hidden items-center gap-1.5 text-[10px] text-sand-100/30 sm:flex">
                <Clock className="h-3 w-3" />
                {wordCount} كلمة
              </span>
            </div>

            <div className="space-y-4 p-5">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">
                  العنوان <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={t.title}
                  onChange={(e) => updateTranslation(activeLocale, 'title', e.target.value)}
                  placeholder={activeLocale === 'ar' ? 'عنوان الخبر الرئيسي...' : 'Headline...'}
                  dir={activeLocale === 'en' ? 'ltr' : 'rtl'}
                  className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">المقتطف (Excerpt)</label>
                <textarea
                  value={t.excerpt}
                  onChange={(e) => updateTranslation(activeLocale, 'excerpt', e.target.value)}
                  rows={2}
                  placeholder="ملخص قصير يظهر في البطاقات ونتائج البحث..."
                  dir={activeLocale === 'en' ? 'ltr' : 'rtl'}
                  className="w-full resize-none rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">المحتوى الكامل</label>
                <textarea
                  value={t.content}
                  onChange={(e) => updateTranslation(activeLocale, 'content', e.target.value)}
                  rows={16}
                  placeholder="اكتب محتوى المقال هنا... (يدعم الفقرات المتعددة)"
                  dir={activeLocale === 'en' ? 'ltr' : 'rtl'}
                  className="w-full resize-y rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
                />
              </div>

              <details className="rounded-xl border border-white/[0.07] bg-white/[0.02] p-4">
                <summary className="cursor-pointer text-xs font-semibold text-sand-100/60 hover:text-gold-400">
                  تحسين محركات البحث (SEO) — {LOCALES.find((l) => l.code === activeLocale)?.label}
                </summary>
                <div className="mt-3 space-y-3">
                  <input
                    type="text"
                    value={t.seoTitle || ''}
                    onChange={(e) => updateTranslation(activeLocale, 'seoTitle', e.target.value)}
                    placeholder="عنوان SEO (اختياري)"
                    className="w-full rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none"
                  />
                  <textarea
                    value={t.seoDesc || ''}
                    onChange={(e) => updateTranslation(activeLocale, 'seoDesc', e.target.value)}
                    placeholder="وصف SEO (اختياري)"
                    rows={2}
                    className="w-full resize-none rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none"
                  />
                </div>
              </details>
            </div>
          </div>
        </div>

        {/* الشريط الجانبي */}
        <div className="space-y-4">
          {/* الصورة */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-bold text-sand-100/70">
              <ImageIcon className="h-4 w-4 text-gold-400" />
              الصورة الرئيسية
            </h3>

            {form.image ? (
              <div className="relative overflow-hidden rounded-xl">
                <img src={form.image} alt="" className="aspect-video w-full object-cover" />
                <button
                  onClick={() => setForm((prev) => ({ ...prev, image: '' }))}
                  className="absolute end-2 top-2 rounded-lg bg-black/70 p-1.5 text-white transition-colors hover:bg-red-500"
                  aria-label="إزالة الصورة"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <label className="flex cursor-pointer flex-col items-center gap-2 rounded-xl border-2 border-dashed border-white/10 py-8 transition-colors hover:border-gold-500/40 hover:bg-gold-500/[0.03]">
                {uploading ? (
                  <Loader2 className="h-6 w-6 animate-spin text-gold-400" />
                ) : (
                  <Upload className="h-6 w-6 text-sand-100/30" />
                )}
                <span className="text-xs text-sand-100/40">
                  {uploading ? 'جاري الرفع...' : 'اضغط لرفع صورة'}
                </span>
                <span className="text-[10px] text-sand-100/25">JPG, PNG, WebP — حتى 5MB</span>
                <input type="file" accept="image/*" onChange={handleUpload} className="hidden" disabled={uploading} />
              </label>
            )}

            <input
              type="text"
              value={form.image}
              onChange={(e) => setForm((prev) => ({ ...prev, image: e.target.value }))}
              placeholder="أو الصق رابط صورة مباشرة..."
              dir="ltr"
              className="mt-3 w-full rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-[11px] text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none"
            />
          </div>

          {/* النشر والتصنيف */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-bold text-sand-100/70">
              <Star className="h-4 w-4 text-gold-400" />
              النشر والتصنيف
            </h3>

            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-[11px] text-sand-100/50">القسم</label>
                <select
                  value={form.categorySlug}
                  onChange={(e) => setForm((prev) => ({ ...prev, categorySlug: e.target.value }))}
                  className="w-full rounded-lg border border-white/[0.07] bg-lapis-900 px-3 py-2.5 text-xs text-sand-100 focus:border-gold-500/50 focus:outline-none"
                >
                  {CATEGORIES.map((c) => (
                    <option key={c.slug} value={c.slug}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 flex items-center gap-1 text-[11px] text-sand-100/50">
                  <MapPin className="h-3 w-3" />
                  المحافظة
                </label>
                <select
                  value={form.governorateSlug}
                  onChange={(e) => setForm((prev) => ({ ...prev, governorateSlug: e.target.value }))}
                  className="w-full rounded-lg border border-white/[0.07] bg-lapis-900 px-3 py-2.5 text-xs text-sand-100 focus:border-gold-500/50 focus:outline-none"
                >
                  {GOVERNORATES.map((g) => (
                    <option key={g.slug} value={g.slug}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-[11px] text-sand-100/50">وقت القراءة (دقائق)</label>
                <input
                  type="number"
                  min={1}
                  max={30}
                  value={form.readingTime}
                  onChange={(e) => setForm((prev) => ({ ...prev, readingTime: parseInt(e.target.value) || 5 }))}
                  className="w-full rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2.5 text-xs text-sand-100 focus:border-gold-500/50 focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3">
                <span className="flex items-center gap-2 text-xs text-sand-100/70">
                  <Flame className={cn('h-4 w-4', form.breaking ? 'text-red-400' : 'text-sand-100/30')} />
                  خبر عاجل
                </span>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, breaking: !prev.breaking }))}
                  className={cn(
                    'relative h-6 w-11 rounded-full transition-colors',
                    form.breaking ? 'bg-red-500' : 'bg-white/10'
                  )}
                  aria-pressed={form.breaking}
                >
                  <span className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
                    form.breaking ? 'start-[22px]' : 'start-0.5'
                  )} />
                </button>
              </div>

              <div className="flex items-center justify-between rounded-xl border border-white/[0.07] bg-white/[0.02] px-3.5 py-3">
                <span className="flex items-center gap-2 text-xs text-sand-100/70">
                  <Star className={cn('h-4 w-4', form.featured ? 'text-gold-400' : 'text-sand-100/30')} />
                  مقال مميز
                </span>
                <button
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, featured: !prev.featured }))}
                  className={cn(
                    'relative h-6 w-11 rounded-full transition-colors',
                    form.featured ? 'bg-gold-500' : 'bg-white/10'
                  )}
                  aria-pressed={form.featured}
                >
                  <span className={cn(
                    'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-all',
                    form.featured ? 'start-[22px]' : 'start-0.5'
                  )} />
                </button>
              </div>
            </div>
          </div>

          {/* معرض الصور المتعدد */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
            <h3 className="mb-1 flex items-center gap-2 text-xs font-bold text-sand-100/70">
              <ImageIcon className="h-4 w-4 text-gold-400" />
              معرض الصور الإضافية
            </h3>
            <p className="mb-3 text-[10px] text-sand-100/35">أضف عدة صور لتظهر كمعرض تفاعلي في صفحة المقال</p>

            {form.gallery.length > 0 && (
              <div className="mb-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
                {form.gallery.map((img: string, i: number) => (
                  <div key={i} className="group relative overflow-hidden rounded-xl border border-white/10">
                    <img src={img} alt="" className="aspect-video w-full object-cover" />
                    <button
                      type="button"
                      onClick={() => setForm((prev) => ({ ...prev, gallery: prev.gallery.filter((_: string, x: number) => x !== i) }))}
                      className="absolute end-1.5 top-1.5 rounded-lg bg-black/70 p-1 text-white transition-colors hover:bg-red-500"
                      aria-label="حذف الصورة"
                    >
                      <X className="h-3 w-3" />
                    </button>
                    <span className="absolute bottom-1 start-1.5 rounded bg-black/60 px-1.5 text-[9px] font-bold text-white">
                      {i + 1}
                    </span>
                  </div>
                ))}
              </div>
            )}

            <label className={cn(
              'flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed py-3.5 text-xs font-medium transition-all',
              uploadingGallery
                ? 'border-gold-500/40 text-gold-400'
                : 'border-white/10 text-sand-100/40 hover:border-gold-500/40 hover:bg-gold-500/[0.03] hover:text-gold-400'
            )}>
              {uploadingGallery ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> جاري رفع الصور...</>
              ) : (
                <><Upload className="h-4 w-4" /> إضافة صور للمعرض (يمكن اختيار عدة صور)</>
              )}
              <input
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                disabled={uploadingGallery}
                onChange={async (e: React.ChangeEvent<HTMLInputElement>) => {
                  const files = Array.from(e.target.files || [])
                  if (files.length === 0) return
                  setUploadingGallery(true)
                  const uploaded: string[] = []
                  for (const file of files) {
                    try {
                      const fd = new FormData()
                      fd.append('file', file)
                      const res = await fetch('/api/upload', { method: 'POST', body: fd })
                      const data = await res.json()
                      if (res.ok) uploaded.push(data.url)
                    } catch { /* تجاهل */ }
                  }
                  if (uploaded.length > 0) {
                    setForm((prev) => ({ ...prev, gallery: [...prev.gallery, ...uploaded] }))
                    showToast('success', `تم رفع ${uploaded.length} صورة`)
                  }
                  setUploadingGallery(false)
                }}
              />
            </label>
          </div>

          {/* الوسوم */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
            <h3 className="mb-3 flex items-center gap-2 text-xs font-bold text-sand-100/70">
              <Tag className="h-4 w-4 text-gold-400" />
              الوسوم
            </h3>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                placeholder="أضف وسماً واضغط Enter..."
                className="flex-1 rounded-lg border border-white/[0.07] bg-white/[0.03] px-3 py-2 text-xs text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none"
              />
              <button
                onClick={addTag}
                className="rounded-lg bg-gold-500/15 px-3 text-xs font-bold text-gold-400 transition-colors hover:bg-gold-500/25"
              >
                +
              </button>
            </div>
            {form.tagSlugs.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-1.5">
                {form.tagSlugs.map((tag) => (
                  <span key={tag} className="flex items-center gap-1 rounded-lg bg-white/[0.05] px-2.5 py-1 text-[11px] text-sand-100/60">
                    {tag}
                    <button
                      onClick={() => setForm((prev) => ({ ...prev, tagSlugs: prev.tagSlugs.filter((x) => x !== tag) }))}
                      className="text-sand-100/30 hover:text-red-400"
                      aria-label={`حذف ${tag}`}
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
