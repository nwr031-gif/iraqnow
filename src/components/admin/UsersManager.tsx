'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  UserPlus, Shield, Pencil, Trash2, X, Loader2, CheckCircle2, AlertCircle,
  Mail, KeyRound, RefreshCw, Power, Eye, EyeOff,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminUser {
  id: string
  name: string
  slug: string
  email: string
  role: string
  avatar?: string
  jobTitle: { ar: string; ku: string; en: string }
  bio: { ar: string; ku: string; en: string }
  specialties: string[]
  staffSince: string
  isActive: boolean
  articleCount: number
}

const ROLE_LABELS: Record<string, { label: string; color: string }> = {
  ADMIN: { label: 'مدير عام', color: 'bg-red-500/15 text-red-400 border-red-500/30' },
  EDITOR: { label: 'محرر', color: 'bg-gold-500/15 text-gold-500 border-gold-500/30' },
  JOURNALIST: { label: 'صحفي', color: 'bg-lapis-500/15 text-lapis-400 border-lapis-500/30' },
  READER: { label: 'قارئ', color: 'bg-white/10 text-sand-100/60 border-white/20' },
}

const CURRENT_USER_ROLE = 'ADMIN'

export function UsersManager({ currentUserId }: { currentUserId: string }) {
  const [users, setUsers] = useState<AdminUser[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [editUser, setEditUser] = useState<AdminUser | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const loadUsers = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/admin/users/list')
      if (res.ok) {
        const data = await res.json()
        setUsers(data.users || [])
      }
    } catch {
      /* ignore */
    }
    setLoading(false)
  }, [])

  useEffect(() => {
    loadUsers()
  }, [loadUsers])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const toggleActive = async (user: AdminUser) => {
    try {
      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: user.id, isActive: !user.isActive }),
      })
      if (res.ok) {
        setUsers((prev) => prev.map((u) => (u.id === user.id ? { ...u, isActive: !u.isActive } : u)))
        showToast('success', user.isActive ? 'تم تعطيل الحساب' : 'تم تفعيل الحساب')
      } else {
        const data = await res.json()
        showToast('error', data.error || 'فشل التحديث')
      }
    } catch {
      showToast('error', 'حدث خطأ')
    }
  }

  const deleteUser = async (user: AdminUser) => {
    if (!confirm(`حذف حساب "${user.name}" نهائياً؟ سيتم الاحتفاظ بمقالاته الموقعة باسمه.`)) return
    try {
      const res = await fetch(`/api/admin/users?id=${user.id}`, { method: 'DELETE' })
      if (res.ok) {
        setUsers((prev) => prev.filter((u) => u.id !== user.id))
        showToast('success', 'تم حذف المستخدم')
      } else {
        const data = await res.json()
        showToast('error', data.error || 'فشل الحذف')
      }
    } catch {
      showToast('error', 'حدث خطأ')
    }
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
          <h1 className="font-kufi text-2xl font-bold text-white">فريق التحرير</h1>
          <p className="mt-1 text-sm text-sand-100/50">
            إدارة المحررين والصحفيين — {users.length} عضو
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadUsers}
            className="rounded-xl border border-white/10 p-2.5 text-sand-100/60 transition-colors hover:border-gold-500/40 hover:text-gold-400"
            aria-label="تحديث"
          >
            <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
          </button>
          <button onClick={() => setShowCreate(true)} className="btn-primary !rounded-xl !px-5 !py-2.5 text-xs font-kufi">
            <UserPlus className="h-4 w-4" />
            إضافة محرر جديد
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
          {users.map((user) => {
            const role = ROLE_LABELS[user.role] || ROLE_LABELS.READER
            return (
              <div
                key={user.id}
                className={cn(
                  'group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-b from-white/[0.04] to-transparent p-5 transition-all duration-300 hover:border-gold-500/30',
                  !user.isActive && 'opacity-50'
                )}
              >
                {!user.isActive && (
                  <span className="absolute end-3 top-3 rounded-md bg-red-500/15 px-2 py-0.5 text-[9px] font-bold text-red-400">
                    معطّل
                  </span>
                )}

                <div className="flex items-start gap-4">
                  {user.avatar ? (
                    <img src={user.avatar} alt="" className="h-14 w-14 rounded-xl object-cover ring-2 ring-gold-500/30" />
                  ) : (
                    <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-lapis-600 to-lapis-900 font-kufi text-lg font-bold text-gold-400 ring-2 ring-gold-500/20">
                      {user.name.charAt(0)}
                    </span>
                  )}
                  <div className="min-w-0 flex-1">
                    <h3 className="truncate font-kufi text-sm font-bold text-white">{user.name}</h3>
                    <p className="truncate text-[11px] text-sand-100/40" dir="ltr">{user.email}</p>
                    <span className={cn('mt-1.5 inline-flex items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold', role.color)}>
                      <Shield className="h-2.5 w-2.5" />
                      {role.label}
                    </span>
                  </div>
                </div>

                {user.jobTitle.ar && (
                  <p className="mt-3 text-xs text-sand-100/55">{user.jobTitle.ar}</p>
                )}

                <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-3.5">
                  <span className="text-[11px] text-sand-100/40">
                    {user.articleCount} مقال
                  </span>
                  <div className="flex items-center gap-1">
                    {user.id !== currentUserId && (
                      <>
                        <button
                          onClick={() => toggleActive(user)}
                          className={cn(
                            'rounded-lg p-2 transition-colors',
                            user.isActive
                              ? 'text-sand-100/40 hover:bg-red-500/10 hover:text-red-400'
                              : 'text-green-500/70 hover:bg-green-500/10 hover:text-green-400'
                          )}
                          title={user.isActive ? 'تعطيل الحساب' : 'تفعيل الحساب'}
                        >
                          <Power className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => setEditUser(user)}
                          className="rounded-lg p-2 text-sand-100/40 transition-colors hover:bg-gold-500/10 hover:text-gold-400"
                          title="تعديل"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => deleteUser(user)}
                          className="rounded-lg p-2 text-sand-100/40 transition-colors hover:bg-red-500/10 hover:text-red-400"
                          title="حذف"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </>
                    )}
                    {user.id === currentUserId && (
                      <span className="text-[10px] text-gold-500/60">أنت</span>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showCreate && (
        <CreateUserModal
          onClose={() => setShowCreate(false)}
          onCreated={() => {
            setShowCreate(false)
            loadUsers()
            showToast('success', 'تم إنشاء حساب المحرر بنجاح')
          }}
          onError={(msg) => showToast('error', msg)}
        />
      )}

      {editUser && (
        <EditUserModal
          user={editUser}
          onClose={() => setEditUser(null)}
          onSaved={() => {
            setEditUser(null)
            loadUsers()
            showToast('success', 'تم تحديث بيانات المستخدم')
          }}
          onError={(msg) => showToast('error', msg)}
        />
      )}
    </div>
  )
}

/* ─────────── نافذة إنشاء محرر ─────────── */

function CreateUserModal({
  onClose,
  onCreated,
  onError,
}: {
  onClose: () => void
  onCreated: () => void
  onError: (msg: string) => void
}) {
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'JOURNALIST', jobTitle: '', bio: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok) onCreated()
      else onError(data.error || 'فشل إنشاء الحساب')
    } catch {
      onError('حدث خطأ في الاتصال')
    }
    setSaving(false)
  }

  const generatePassword = () => {
    const pass = Math.random().toString(36).slice(2, 8) + Math.random().toString(36).slice(2, 6).toUpperCase()
    setForm((prev) => ({ ...prev, password: pass }))
    setShowPassword(true)
  }

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-gold-500/20 bg-gradient-to-b from-lapis-900 to-ink-950 p-6 shadow-2xl animate-scale-in">
        <div className="mb-5 flex items-center justify-between">
          <h2 className="flex items-center gap-2 font-kufi text-lg font-bold text-white">
            <UserPlus className="h-5 w-5 text-gold-400" />
            إضافة محرر جديد
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-sand-100/50 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">الاسم الكامل *</label>
            <input
              type="text"
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              placeholder="مثال: مريم الجنابي"
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-sand-100/70">
              <Mail className="h-3.5 w-3.5" />
              البريد الإلكتروني *
            </label>
            <input
              type="email"
              required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="editor@iraqnow.com"
              dir="ltr"
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
            />
          </div>

          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-sand-100/70">
              <KeyRound className="h-3.5 w-3.5" />
              كلمة المرور *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="6 أحرف على الأقل"
                dir="ltr"
                className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 pe-20 text-sm text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
              />
              <div className="absolute end-2 top-1/2 flex -translate-y-1/2 items-center gap-1">
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="rounded-lg p-1.5 text-sand-100/40 hover:text-sand-100"
                  aria-label={showPassword ? 'إخفاء' : 'إظهار'}
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button
                  type="button"
                  onClick={generatePassword}
                  className="rounded-lg bg-gold-500/15 px-2 py-1 text-[10px] font-bold text-gold-400 hover:bg-gold-500/25"
                >
                  توليد
                </button>
              </div>
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">الدور</label>
            <div className="grid grid-cols-3 gap-2">
              {(['JOURNALIST', 'EDITOR', 'ADMIN'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm({ ...form, role })}
                  className={cn(
                    'rounded-xl border px-3 py-2.5 text-xs font-bold transition-all',
                    form.role === role
                      ? 'border-gold-500 bg-gold-500/15 text-gold-400'
                      : 'border-white/[0.07] text-sand-100/50 hover:border-gold-500/30'
                  )}
                >
                  {ROLE_LABELS[role].label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-[10px] leading-relaxed text-sand-100/35">
              {form.role === 'JOURNALIST' && 'الصحفي: يكتب مقالاته ويرفعها للمراجعة فقط'}
              {form.role === 'EDITOR' && 'المحرر: ينشر ويتحكم بالمحتوى والتعليقات والبودكاست'}
              {form.role === 'ADMIN' && 'المدير: صلاحيات كاملة بما فيها إدارة الفريق والإعدادات'}
            </p>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">المسمى الوظيفي</label>
            <input
              type="text"
              value={form.jobTitle}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
              placeholder="مثال: مراسل سياسي — بغداد"
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">نبذة تعريفية</label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              placeholder="سيرة قصيرة تظهر في صفحة الكاتب..."
              className="w-full resize-none rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none focus:ring-2 focus:ring-gold-500/15"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-sand-100/60 transition-colors hover:bg-white/5">
              إلغاء
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 !rounded-xl !py-3 text-sm font-kufi">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <UserPlus className="h-4 w-4" />}
              {saving ? 'جاري الإنشاء...' : 'إنشاء الحساب'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

/* ─────────── نافذة تعديل مستخدم ─────────── */

function EditUserModal({
  user,
  onClose,
  onSaved,
  onError,
}: {
  user: AdminUser
  onClose: () => void
  onSaved: () => void
  onError: (msg: string) => void
}) {
  const [form, setForm] = useState({
    name: user.name,
    role: user.role,
    jobTitle: user.jobTitle.ar,
    bio: user.bio.ar,
    password: '',
  })
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const payload: any = {
        id: user.id,
        name: form.name,
        role: form.role,
        jobTitle: { ar: form.jobTitle, ku: form.jobTitle, en: form.jobTitle },
        bio: { ar: form.bio, ku: form.bio, en: form.bio },
      }
      if (form.password) payload.password = form.password

      const res = await fetch('/api/admin/users', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const data = await res.json()
      if (res.ok) onSaved()
      else onError(data.error || 'فشل التحديث')
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
            <Pencil className="h-5 w-5 text-gold-400" />
            تعديل: {user.name}
          </h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-sand-100/50 hover:bg-white/10 hover:text-white">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">الاسم الكامل</label>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 focus:border-gold-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">الدور</label>
            <div className="grid grid-cols-3 gap-2">
              {(['JOURNALIST', 'EDITOR', 'ADMIN'] as const).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setForm({ ...form, role })}
                  className={cn(
                    'rounded-xl border px-3 py-2.5 text-xs font-bold transition-all',
                    form.role === role
                      ? 'border-gold-500 bg-gold-500/15 text-gold-400'
                      : 'border-white/[0.07] text-sand-100/50 hover:border-gold-500/30'
                  )}
                >
                  {ROLE_LABELS[role].label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">المسمى الوظيفي</label>
            <input
              type="text"
              value={form.jobTitle}
              onChange={(e) => setForm({ ...form, jobTitle: e.target.value })}
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 focus:border-gold-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">النبذة التعريفية</label>
            <textarea
              rows={3}
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full resize-none rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 focus:border-gold-500/50 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-xs font-semibold text-sand-100/70">
              كلمة مرور جديدة <span className="text-sand-100/35">(اتركها فارغة للإبقاء على الحالية)</span>
            </label>
            <input
              type="text"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              placeholder="كلمة مرور جديدة..."
              dir="ltr"
              className="w-full rounded-xl border border-white/[0.07] bg-white/[0.03] px-4 py-3 text-sm text-sand-100 placeholder:text-sand-100/25 focus:border-gold-500/50 focus:outline-none"
            />
          </div>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 rounded-xl border border-white/10 py-3 text-sm text-sand-100/60 transition-colors hover:bg-white/5">
              إلغاء
            </button>
            <button type="submit" disabled={saving} className="btn-primary flex-1 !rounded-xl !py-3 text-sm font-kufi">
              {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <CheckCircle2 className="h-4 w-4" />}
              {saving ? 'جاري الحفظ...' : 'حفظ التعديلات'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
