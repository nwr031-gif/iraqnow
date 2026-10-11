'use client'

import { useState } from 'react'
import { Lock, Loader2, ArrowLeft } from 'lucide-react'
import { IshtarStar } from '@/components/brand/Brand'

export function AdminLogin() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!password || loading) return
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/admin-login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        window.location.href = '/admin/articles'
        return
      }
      setError(data.error || 'كلمة المرور غير صحيحة')
    } catch {
      setError('تعذر الاتصال — حاول مجدداً')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] px-4" dir="rtl">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white">
            <IshtarStar size={32} className="text-[#0a0a0a]" />
          </div>
          <h1 className="font-kufi text-2xl font-bold text-white">لوحة تحكم العراق الآن</h1>
          <p className="mt-2 text-sm text-white/50">أدخل كلمة المرور للوصول إلى لوحة التحكم</p>
        </div>

        <form onSubmit={submit} className="rounded-2xl border border-white/10 bg-white/[0.04] p-6">
          <label className="mb-2 block text-xs font-semibold text-white/70" htmlFor="admin-password">
            كلمة المرور
          </label>
          <div className="relative">
            <Lock className="absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-white/40" />
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              autoComplete="current-password"
              placeholder="••••••••••••"
              className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pe-4 ps-10 text-sm text-white outline-none transition-colors placeholder:text-white/25 focus:border-white/40"
            />
          </div>

          {error && (
            <p className="mt-3 rounded-lg bg-white px-3 py-2 text-xs font-semibold text-black">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !password}
            className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-white py-3 text-sm font-bold text-black transition-all hover:bg-white/90 disabled:opacity-40"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <ArrowLeft className="h-4 w-4" />}
            {loading ? 'جاري التحقق...' : 'دخول لوحة التحكم'}
          </button>
        </form>

        <p className="mt-6 text-center text-[11px] text-white/30">
          الجلسة صالحة لمدة 30 يوماً — للخروج استخدم زر الخروج في اللوحة
        </p>
      </div>
    </div>
  )
}
