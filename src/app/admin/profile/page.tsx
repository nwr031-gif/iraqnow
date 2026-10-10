'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  User, Camera, Save, Loader2, CheckCircle2, AlertCircle, Upload, X,
  Globe, MapPin, Briefcase, GraduationCap,
  KeyRound, Eye, EyeOff, ExternalLink, Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { XIcon, LinkedInIcon, InstagramIcon } from '@/components/brand/SocialIcons'
import { useSession } from 'next-auth/react'

interface ProfileData {
  id: string
  name: string
  slug: string
  email: string
  role: string
  avatar: string
  coverImage: string
  jobTitle: string
  bio: string
  twitter: string
  linkedin: string
  instagram: string
  website: string
  specialties: string[]
  staffSince: string
  articleCount: number
}

const ROLE_LABELS: Record<string, string> = {
  ADMIN: 'مدير عام',
  EDITOR: 'محرر أول',
  JOURNALIST: 'صحفي',
}

const SPECIALTY_SUGGESTIONS = [
  'السياسة', 'الاقتصاد', 'الأمن', 'المجتمع', 'الثقافة', 'الرياضة',
  'التكنولوجيا', 'الصحة', 'التعليم', 'البيئة', 'محليات', 'التحقيقات',
]

export default function AdminProfilePage() {
  const { data: session, update: updateSession } = useSession()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)
  const [uploadingCover, setUploadingCover] = useState(false)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [activeTab, setActiveTab] = useState<'info' | 'security'>('info')

  const loadProfile = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/profile')
      if (res.ok) {
        const data = await res.json()
        setProfile(data.profile)
      }
    } catch {
      /* ignore */
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadProfile()
  }, [loadProfile])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3500)
  }

  const handleUpload = async (file: File, field: 'avatar' | 'coverImage') => {
    const setUploading = field === 'avatar' ? setUploadingAvatar : setUploadingCover
    setUploading(true)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await fetch('/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      if (res.ok) {
        setProfile((prev) => (prev ? { ...prev, [field]: data.url } : prev))
        showToast('success', field === 'avatar' ? 'تم رفع الصورة الشخصية' : 'تم رفع صورة الغلاف')
      } else {
        showToast('error', data.error || 'فشل الرفع')
      }
    } catch {
      showToast('error', 'فشل الرفع')
    }
    setUploading(false)
  }

  const saveProfile = async () => {
    if (!profile) return
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: profile.name,
          avatar: profile.avatar,
          coverImage: profile.coverImage,
          jobTitle: profile.jobTitle,
          bio: profile.bio,
          twitter: profile.twitter,
          linkedin: profile.linkedin,
          instagram: profile.instagram,
          website: profile.website,
          specialties: profile.specialties,
        }),
      })
      const data = await res.json()
      if (res.ok) {
        showToast('success', 'تم حفظ ملفك الشخصي بنجاح ✨')
        await updateSession({ name: profile.name, image: profile.avatar })
      } else {
        showToast('error', data.error || 'فشل الحفظ')
      }
    } catch {
      showToast('error', 'حدث خطأ في الاتصال')
    }
    setSaving(false)
  }

  const changePassword = async () => {
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast('error', 'كلمتا المرور غير متطابقتين')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      showToast('error', 'كلمة المرور يجب أن تكون 6 أحرف على الأقل')
      return
    }
    setSaving(true)
    try {
      const res = await fetch('/api/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passwordForm.newPassword }),
      })
      if (res.ok) {
        showToast('success', 'تم تغيير كلمة المرور بنجاح')
        setPasswordForm({ newPassword: '', confirmPassword: '' })
      } else {
        const data = await res.json()
        showToast('error', data.error || 'فشل التغيير')
      }
    } catch {
      showToast('error', 'حدث خطأ')
    }
    setSaving(false)
  }

  /* ????? ????????? ??? ????? */
  const ROLE_PERMISSIONS: Record<string, string[]> = {
    ADMIN: [
      '??????? ????? ??? ??????',
      '????? ???? ??????? ?????? ??????',
      '????? ??????? ??????? ??????????',
      '??? ?????? ???? ???? ????????',
      '????????? ?????? ??????????',
    ],
    EDITOR: [
      '??? ?????? ???? ????????',
      '????? ????????? (??????/???)',
      '????? ????????? ????????',
      '????? ??????? ???????',
      '?????? ???????? (??? ??????)',
    ],
    JOURNALIST: [
      '????? ?????? ??????? ??????',
      '??? ??? ?????? ????????',
      '????? ???????? ????????',
      '??? ???? ??????',
    ],
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center gap-3 py-32 text-sand-100/50">
        <Loader2 className="h-6 w-6 animate-spin text-gold-400" />
        جاري تحميل الملف الشخصي...
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="flex flex-col items-center gap-3 py-32 text-center">
        <AlertCircle className="h-10 w-10 text-red-400/50" />
        <p className="text-sm text-sand-100/50">تعذر تحميل الملف الشخصي</p>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {toast && (
        <div className={cn(
          'fixed bottom-6 start-6 z-[100] flex items-center gap-2.5 rounded-xl border px-4 py-3 text-sm font-medium shadow-2xl animate-fade-up',
          toast.type === 'success' ? 'border-green-500/30 bg-green-950/95 text-green-300' : 'border-red-500/30 bg-red-950/95 text-red-300'
        )}>
          {toast.type === 'success' ? <CheckCircle2 className="h-4 w-4" /> : <AlertCircle className="h-4 w-4" />}
          {toast.message}
        </div>
      )}

      {/* الغلاف والهوية */}
      <div className="overflow-hidden rounded-3xl border border-white/[0.07] bg-white/[0.03]">
        <div className="relative h-44 sm:h-56">
          {profile.coverImage ? (
            <img src={profile.coverImage} alt="" className="h-full w-full object-cover" />
          ) : (
            <div className="h-full w-full bg-gradient-to-br from-lapis-700 via-lapis-900 to-ink-950 ishtar-grid" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-ink-950/90 via-transparent to-transparent" />

          <label className="absolute end-4 top-4 flex cursor-pointer items-center gap-2 rounded-xl bg-black/60 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-sm transition-colors hover:bg-black/80">
            {uploadingCover ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Camera className="h-3.5 w-3.5" />}
            تغيير الغلاف
            <input
              type="file"
              accept="image/*"
              className="hidden"
              disabled={uploadingCover}
              onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'coverImage')}
            />
          </label>
        </div>

        <div className="relative px-6 pb-6">
          <div className="-mt-14 flex flex-wrap items-end gap-5">
            <div className="relative">
              {profile.avatar ? (
                <img
                  src={profile.avatar}
                  alt=""
                  className="h-28 w-28 rounded-2xl object-cover ring-4 ring-ink-950 shadow-2xl"
                />
              ) : (
                <span className="flex h-28 w-28 items-center justify-center rounded-2xl bg-gradient-to-br from-lapis-600 to-lapis-900 font-kufi text-4xl font-bold text-gold-400 ring-4 ring-ink-950">
                  {profile.name.charAt(0)}
                </span>
              )}
              <label className="absolute -bottom-1 -end-1 flex h-9 w-9 cursor-pointer items-center justify-center rounded-xl bg-gold-500 text-lapis-950 shadow-lg transition-transform hover:scale-110">
                {uploadingAvatar ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  disabled={uploadingAvatar}
                  onChange={(e) => e.target.files?.[0] && handleUpload(e.target.files[0], 'avatar')}
                />
              </label>
            </div>

            <div className="flex-1 pb-1">
              <h1 className="font-kufi text-2xl font-bold text-white">{profile.name}</h1>
              <p className="mt-1 flex flex-wrap items-center gap-3 text-xs text-sand-100/50">
                <span className="flex items-center gap-1.5">
                  <Briefcase className="h-3.5 w-3.5 text-gold-500" />
                  {profile.jobTitle || 'محرر'}
                </span>
                <span className="flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5 text-gold-500" />
                  {ROLE_LABELS[profile.role] || profile.role}
                </span>
                <span className="rounded-lg bg-gold-500/10 px-2 py-0.5 font-bold text-gold-400">
                  {profile.articleCount} مقال منشور
                </span>
              </p>
            </div>

            {profile.slug && (
              <a
                href={`/ar/author/${profile.slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 rounded-xl border border-gold-500/30 px-4 py-2.5 text-xs font-medium text-gold-400 transition-colors hover:bg-gold-500/10"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                عرض صفحتي العامة
              </a>
            )}
          </div>
        </div>
      </div>

      {/* التبويبات */}
      <div className="flex gap-1.5 rounded-xl border border-white/[0.07] bg-white/[0.03] p-1.5 sm:w-fit">
        <button
          onClick={() => setActiveTab('info')}
          className={cn(
            'flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold transition-all',
            activeTab === 'info' ? 'bg-gold-500 text-lapis-950' : 'text-sand-100/60 hover:bg-white/[0.05]'
          )}
        >
          <User className="h-3.5 w-3.5" />
          المعلومات الشخصية
        </button>
        <button
          onClick={() => setActiveTab('security')}
          className={cn(
            'flex items-center gap-2 rounded-lg px-5 py-2.5 text-xs font-bold transition-all',
            activeTab === 'security' ? 'bg-gold-500 text-lapis-950' : 'text-sand-100/60 hover:bg-white/[0.05]'
          )}
        >
          <KeyRound className="h-3.5 w-3.5" />
          الأمان
        </button>
      </div>

      {activeTab === 'info' && (
        <div className="grid gap-6 lg:grid-cols-3">
          {/* المعلومات الأساسية */}
          <div className="space-y-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6 lg:col-span-2">
            <h2 className="flex items-center gap-2 font-kufi text-sm font-bold text-white">
              <User className="h-4 w-4 text-gold-400" />
              المعلومات الأساسية
            </h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">الاسم الكامل</label>
                <input
                  type="text"
                  value={profile.name}
                  onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                  className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">المسمى الوظيفي</label>
                <input
                  type="text"
                  value={profile.jobTitle}
                  onChange={(e) => setProfile({ ...profile, jobTitle: e.target.value })}
                  placeholder="مثال: مراسل سياسي — بغداد"
                  className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
                />
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">
                نبذة تعريفية <span className="text-sand-100/35">— تظهر في صفحتك العامة</span>
              </label>
              <textarea
                rows={5}
                value={profile.bio}
                onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                placeholder="اكتب سيرتك المهنية بإيجاز: خبراتك، تخصصاتك، وإنجازاتك الصحفية..."
                className="w-full resize-none rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm leading-relaxed text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
              />
              <p className="mt-1 text-[10px] text-sand-100/30">{profile.bio.length}/500 حرف</p>
            </div>

            <div>
              <label className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-sand-100/70">
                <GraduationCap className="h-3.5 w-3.5" />
                التخصصات
              </label>
              <div className="flex flex-wrap gap-2">
                {SPECIALTY_SUGGESTIONS.map((spec) => {
                  const selected = profile.specialties.includes(spec)
                  return (
                    <button
                      key={spec}
                      type="button"
                      onClick={() =>
                        setProfile({
                          ...profile,
                          specialties: selected
                            ? profile.specialties.filter((s) => s !== spec)
                            : [...profile.specialties, spec],
                        })
                      }
                      className={cn(
                        'rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-all',
                        selected
                          ? 'border-gold-500 bg-gold-500/15 text-gold-400'
                          : 'border-white/[0.07] text-sand-100/50 hover:border-gold-500/30'
                      )}
                    >
                      {spec}
                    </button>
                  )
                })}
              </div>
            </div>
          </div>

          {/* روابط التواصل */}
          <div className="space-y-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
            <h2 className="flex items-center gap-2 font-kufi text-sm font-bold text-white">
              <Globe className="h-4 w-4 text-gold-400" />
              روابط التواصل
            </h2>

            {[
              { key: 'twitter' as const, icon: XIcon, placeholder: 'username (بدون @)' },
              { key: 'linkedin' as const, icon: LinkedInIcon, placeholder: 'linkedin.com/in/...' },
              { key: 'instagram' as const, icon: InstagramIcon, placeholder: 'username' },
              { key: 'website' as const, icon: Globe, placeholder: 'https://...' },
            ].map((field) => (
              <div key={field.key}>
                <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-sand-100/70">
                  <field.icon className="h-3.5 w-3.5" />
                  {field.key === 'twitter' ? 'X (تويتر)' : field.key === 'linkedin' ? 'LinkedIn' : field.key === 'instagram' ? 'Instagram' : 'الموقع الشخصي'}
                </label>
                <input
                  type="text"
                  value={profile[field.key]}
                  onChange={(e) => setProfile({ ...profile, [field.key]: e.target.value })}
                  placeholder={field.placeholder}
                  dir="ltr"
                  className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-3.5 py-2.5 text-xs text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none"
                />
              </div>
            ))}

            <div className="rounded-xl border border-gold-500/15 bg-gold-500/[0.04] p-4">
              <p className="mb-2.5 flex items-center gap-2 text-[11px] font-bold text-gold-400">
                <Sparkles className="h-3.5 w-3.5" />
                صلاحياتك — {ROLE_LABELS[profile.role] || profile.role}
              </p>
              <ul className="space-y-1.5">
                {(ROLE_PERMISSIONS[profile.role] || []).map((perm, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] leading-relaxed text-sand-100/55">
                    <CheckCircle2 className="mt-0.5 h-3 w-3 shrink-0 text-green-500/70" />
                    {perm}
                  </li>
                ))}
              </ul>
            </div>

            <div className="rounded-xl border border-gold-500/15 bg-gold-500/[0.04] p-4">
              <p className="flex items-start gap-2 text-[11px] leading-relaxed text-sand-100/50">
                <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-gold-500" />
                عضو في فريق التحرير منذ {new Date(profile.staffSince).toLocaleDateString('ar-IQ', { year: 'numeric', month: 'long' })}
              </p>
            </div>
          </div>

          {/* زر الحفظ */}
          <div className="lg:col-span-3">
            <div className="flex items-center justify-between rounded-2xl border border-gold-500/20 bg-gradient-to-l from-gold-500/[0.07] to-transparent p-5">
              <p className="text-xs text-sand-100/60">
                تأكد من مراجعة بياناتك قبل الحفظ — ستظهر هذه المعلومات للجمهور في صفحتك العامة
              </p>
              <button onClick={saveProfile} disabled={saving} className="btn-primary !rounded-xl !px-8 !py-3 font-kufi">
                {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {saving ? 'جاري الحفظ...' : 'حفظ التغييرات'}
              </button>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'security' && (
        <div className="mx-auto max-w-lg space-y-5 rounded-2xl border border-white/[0.07] bg-white/[0.03] p-6">
          <h2 className="flex items-center gap-2 font-kufi text-sm font-bold text-white">
            <KeyRound className="h-4 w-4 text-gold-400" />
            تغيير كلمة المرور
          </h2>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">كلمة المرور الجديدة</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                dir="ltr"
                className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 pe-12 text-sm text-sand-100 focus:border-gold-500/50 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute end-3 top-1/2 -translate-y-1/2 text-sand-100/40 hover:text-sand-100"
                aria-label={showPassword ? 'إخفاء' : 'إظهار'}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">تأكيد كلمة المرور</label>
            <input
              type={showPassword ? 'text' : 'password'}
              value={passwordForm.confirmPassword}
              onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
              dir="ltr"
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 focus:border-gold-500/50 focus:outline-none"
            />
          </div>

          <div className="rounded-xl border border-gold-500/15 bg-gold-500/[0.04] p-4">
            <p className="text-[11px] leading-relaxed text-sand-100/50">
              💡 نصائح لكلمة مرور قوية: 8 أحرف على الأقل، مزيج من الأحرف الكبيرة والصغيرة والأرقام والرموز.
            </p>
          </div>

          <button
            onClick={changePassword}
            disabled={saving || !passwordForm.newPassword}
            className="btn-primary w-full !rounded-xl !py-3 font-kufi"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <KeyRound className="h-4 w-4" />}
            تغيير كلمة المرور
          </button>
        </div>
      )}
    </div>
  )
}



