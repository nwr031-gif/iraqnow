'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  Settings, Save, Loader2, CheckCircle2, AlertCircle, Globe, Share2,
  Mail, ToggleLeft, ToggleRight, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'

export default function AdminSettingsPage() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const loadSettings = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/settings')
      if (res.ok) {
        const data = await res.json()
        setSettings(data.settings || {})
      }
    } catch {
      /* ignore */
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadSettings()
  }, [loadSettings])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const save = async () => {
    setSaving(true)
    try {
      const res = await fetch('/api/admin/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      })
      if (res.ok) showToast('success', 'تم حفظ الإعدادات بنجاح')
      else showToast('error', 'فشل الحفظ')
    } catch {
      showToast('error', 'حدث خطأ')
    }
    setSaving(false)
  }

  const toggle = (key: string) => {
    setSettings((prev) => ({ ...prev, [key]: prev[key] === 'true' ? 'false' : 'true' }))
  }

  const field = (key: string, value: string) => setSettings((prev) => ({ ...prev, [key]: value }))

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-32 text-sand-100/50">
        <Loader2 className="h-6 w-6 animate-spin text-gold-400" />
        جاري تحميل الإعدادات...
      </div>
    )
  }

  const inputClass = 'w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/15'

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      {toast && (
        <div className={cn(
          'fixed bottom-6 start-6 z-[100] flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl animate-fade-up',
          toast.type === 'success' ? 'border-green-500/30 bg-green-950/95 text-green-300' : 'border-red-500/30 bg-red-950/95 text-red-300'
        )}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      <div>
        <h1 className="font-kufi text-2xl font-bold text-white">إعدادات الموقع</h1>
        <p className="mt-1 text-sm text-sand-100/50">التحكم الكامل بهوية المنصة وخياراتها</p>
      </div>

      {/* الهوية */}
      <div className="space-y-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
        <h2 className="flex items-center gap-2 font-kufi text-sm font-bold text-white">
          <Sparkles className="h-4 w-4 text-gold-400" />
          هوية المنصة
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">اسم الموقع (عربي)</label>
            <input type="text" value={settings.siteName || ''} onChange={(e) => field('siteName', e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">اسم الموقع (إنكليزي)</label>
            <input type="text" value={settings.siteNameEn || ''} onChange={(e) => field('siteNameEn', e.target.value)} dir="ltr" className={inputClass} />
          </div>
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">الشعار النصي (Tagline)</label>
          <input type="text" value={settings.tagline || ''} onChange={(e) => field('tagline', e.target.value)} className={inputClass} />
        </div>
        <div>
          <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">وصف الموقع</label>
          <textarea rows={2} value={settings.description || ''} onChange={(e) => field('description', e.target.value)} className={cn(inputClass, 'resize-none')} />
        </div>
      </div>

      {/* التواصل */}
      <div className="space-y-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
        <h2 className="flex items-center gap-2 font-kufi text-sm font-bold text-white">
          <Share2 className="h-4 w-4 text-gold-400" />
          حسابات التواصل الاجتماعي
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            { key: 'twitter', label: 'X (تويتر)', placeholder: 'iraqnow' },
            { key: 'facebook', label: 'فيسبوك', placeholder: 'iraqnow' },
            { key: 'instagram', label: 'إنستغرام', placeholder: 'iraqnow' },
            { key: 'youtube', label: 'يوتيوب', placeholder: 'iraqnow' },
            { key: 'telegram', label: 'تيليجرام', placeholder: 'iraqnow' },
            { key: 'contactEmail', label: 'البريد الرسمي', placeholder: 'info@iraqnow.iq' },
          ].map((f) => (
            <div key={f.key}>
              <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-sand-100/70">
                {f.key === 'contactEmail' ? <Mail className="h-3.5 w-3.5" /> : <Globe className="h-3.5 w-3.5" />}
                {f.label}
              </label>
              <input
                type="text"
                value={settings[f.key] || ''}
                onChange={(e) => field(f.key, e.target.value)}
                placeholder={f.placeholder}
                dir="ltr"
                className={inputClass}
              />
            </div>
          ))}
        </div>
      </div>

      {/* خيارات التشغيل */}
      <div className="space-y-4 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
        <h2 className="flex items-center gap-2 font-kufi text-sm font-bold text-white">
          <Settings className="h-4 w-4 text-gold-400" />
          خيارات التشغيل
        </h2>
        {[
          { key: 'breakingEnabled', label: 'شريط الأخبار العاجلة', desc: 'إظهار شريط الأخبار المتحرك في الصفحة الرئيسية' },
          { key: 'newsletterEnabled', label: 'النشرة البريدية', desc: 'تفعيل نموذج الاشتراك في النشرة للمستخدمين' },
          { key: 'maintenanceMode', label: 'وضع الصيانة', desc: 'إيقاف الموقع مؤقتاً للصيانة (يظهر للجمهور صفحة صيانة)' },
        ].map((opt) => (
          <div key={opt.key} className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.02] px-4 py-3.5">
            <div>
              <p className="text-sm font-medium text-sand-100/80">{opt.label}</p>
              <p className="mt-0.5 text-[11px] text-sand-100/40">{opt.desc}</p>
            </div>
            <button
              type="button"
              onClick={() => toggle(opt.key)}
              className={cn(
                'flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold transition-all',
                settings[opt.key] === 'true'
                  ? 'bg-green-500/15 text-green-400'
                  : 'bg-white/[0.06] text-sand-100/40'
              )}
            >
              {settings[opt.key] === 'true' ? <ToggleRight className="h-4 w-4" /> : <ToggleLeft className="h-4 w-4" />}
              {settings[opt.key] === 'true' ? 'مفعّل' : 'معطّل'}
            </button>
          </div>
        ))}
      </div>

      {/* حفظ */}
      <div className="sticky bottom-6">
        <div className="flex items-center justify-between rounded-2xl border border-gold-500/25 bg-lapis-950/95 p-5 shadow-2xl backdrop-blur-lg">
          <p className="text-xs text-sand-100/50">سيتم تطبيق التغييرات على الواجهة الأمامية مباشرة</p>
          <button onClick={save} disabled={saving} className="btn-primary !rounded-xl !px-8 !py-3 font-kufi">
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
            {saving ? 'جاري الحفظ...' : 'حفظ الإعدادات'}
          </button>
        </div>
      </div>
    </div>
  )
}
