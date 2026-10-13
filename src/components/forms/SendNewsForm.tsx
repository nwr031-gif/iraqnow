'use client'

import { useState } from 'react'
import { Loader2, CheckCircle2, Send, AlertCircle } from 'lucide-react'

export function SendNewsForm() {
  const [name, setName] = useState('')
  const [contact, setContact] = useState('')
  const [body, setBody] = useState('')
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (loading) return
    setError('')

    if (body.trim().length < 20) {
      setError('يرجى كتابة تفاصيل الخبر (20 حرفاً على الأقل)')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/send-news', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, contact, body }),
      })
      const data = await res.json().catch(() => ({}))
      if (res.ok && data.ok) {
        setDone(true)
        return
      }
      setError(data.error || 'تعذر الإرسال — حاول مجدداً')
    } catch {
      setError('تعذر الاتصال — حاول مجدداً')
    }
    setLoading(false)
  }

  if (done) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl border border-line bg-[var(--card-bg)] px-6 py-10 text-center" role="status">
        <CheckCircle2 className="h-10 w-10 text-emerald-600" />
        <p className="font-kufi text-lg font-bold text-[var(--foreground)]">وصلنا تقريرك — شكراً لك</p>
        <p className="max-w-sm text-sm text-[var(--muted)]">
          سيراجعه فريق التحرير، وإذا كان قابلاً للنشر سنتواصل معك عبر بيانات التواصل التي أدخلتها.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} className="rounded-2xl border border-line bg-[var(--card-bg)] p-6" noValidate>
      <div className="mb-4 grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="tip-name" className="mb-1.5 block text-xs font-semibold text-[var(--foreground)]">
            الاسم (اختياري)
          </label>
          <input
            id="tip-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={80}
            className="input"
            placeholder="اسمك الكامل"
          />
        </div>
        <div>
          <label htmlFor="tip-contact" className="mb-1.5 block text-xs font-semibold text-[var(--foreground)]">
            بريد أو هاتف للتواصل (اختياري)
          </label>
          <input
            id="tip-contact"
            type="text"
            value={contact}
            onChange={(e) => setContact(e.target.value)}
            maxLength={120}
            className="input"
            placeholder="لكي نتمكن من التواصل معك"
          />
        </div>
      </div>

      <div>
        <label htmlFor="tip-body" className="mb-1.5 block text-xs font-semibold text-[var(--foreground)]">
          تفاصيل الخبر أو الحدث <span className="text-[var(--muted)]">(إلزامي)</span>
        </label>
        <textarea
          id="tip-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          rows={6}
          maxLength={3000}
          required
          className="input resize-y"
          placeholder="ماذا حدث؟ أين؟ متى؟ ومن المرجح أن يعرف تفاصيل أكثر؟ اكتب كل ما تعرفه..."
        />
        <p className="mt-1.5 flex items-center gap-1.5 text-[11px] text-[var(--muted)]">
          <AlertCircle className="h-3 w-3" />
          لا ترسل معلومات شخصية حساسة عن غيرك. التقارير المجهولة تُراجع أيضاً.
        </p>
      </div>

      {error && (
        <p className="mt-4 rounded-xl bg-cream-deep px-4 py-2.5 text-xs font-bold text-[var(--foreground)]" role="alert">
          {error}
        </p>
      )}

      <button type="submit" disabled={loading} className="btn-primary mt-5 w-full font-kufi">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {loading ? 'جاري الإرسال...' : 'إرسال الخبر لفريق التحرير'}
      </button>
    </form>
  )
}
