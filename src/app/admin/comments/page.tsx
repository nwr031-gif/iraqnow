'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  CheckCircle2, XCircle, Trash2, Loader2, MessageSquare, RefreshCw,
  Clock, AlertCircle, User,
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface AdminComment {
  id: string
  articleTitle: string
  userName: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

const STATUS_TABS = [
  { value: 'pending', label: 'بانتظار المراجعة' },
  { value: 'approved', label: 'معتمد' },
  { value: 'rejected', label: 'مرفوض' },
  { value: 'all', label: 'الكل' },
]

const STATUS_BADGES: Record<string, { label: string; color: string }> = {
  pending: { label: 'بالانتظار', color: 'bg-gold-500/15 text-gold-500 border-gold-500/30' },
  approved: { label: 'معتمد', color: 'bg-green-500/15 text-green-400 border-green-500/30' },
  rejected: { label: 'مرفوض', color: 'bg-red-500/15 text-red-400 border-red-500/30' },
}

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `منذ ${mins} دقيقة`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `منذ ${hours} ساعة`
  return `منذ ${Math.floor(hours / 24)} يوم`
}

export default function AdminCommentsPage() {
  const [comments, setComments] = useState<AdminComment[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('pending')
  const [actionId, setActionId] = useState<string | null>(null)
  const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  const loadComments = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/comments/list?status=${tab}`)
      if (res.ok) {
        const data = await res.json()
        setComments(data.comments || [])
      }
    } catch {
      /* ignore */
    }
    setLoading(false)
  }, [tab])

  useEffect(() => {
    loadComments()
  }, [loadComments])

  const showToast = (type: 'success' | 'error', message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 3000)
  }

  const moderate = async (id: string, status: 'approved' | 'rejected') => {
    setActionId(id)
    try {
      const res = await fetch('/api/admin/comments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status }),
      })
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id))
        showToast('success', status === 'approved' ? 'تم اعتماد التعليق' : 'تم رفض التعليق')
      } else {
        const data = await res.json()
        showToast('error', data.error || 'فشل الإجراء')
      }
    } catch {
      showToast('error', 'حدث خطأ')
    }
    setActionId(null)
  }

  const remove = async (id: string) => {
    if (!confirm('حذف هذا التعليق نهائياً؟')) return
    setActionId(id)
    try {
      const res = await fetch(`/api/admin/comments?id=${id}`, { method: 'DELETE' })
      if (res.ok) {
        setComments((prev) => prev.filter((c) => c.id !== id))
        showToast('success', 'تم حذف التعليق')
      }
    } catch {
      showToast('error', 'حدث خطأ')
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
          <h1 className="font-kufi text-2xl font-bold text-white">إدارة التعليقات</h1>
          <p className="mt-1 text-sm text-sand-100/50">مراجعة واعتماد تعليقات القراء</p>
        </div>
        <button
          onClick={loadComments}
          className="rounded-xl border border-white/10 p-2.5 text-sand-100/60 transition-colors hover:border-gold-500/40 hover:text-gold-400"
          aria-label="تحديث"
        >
          <RefreshCw className={cn('h-4 w-4', loading && 'animate-spin')} />
        </button>
      </div>

      <div className="flex flex-wrap gap-1.5 rounded-xl border border-white/[0.07] bg-white/[0.03] p-1.5 sm:w-fit">
        {STATUS_TABS.map((t) => (
          <button
            key={t.value}
            onClick={() => setTab(t.value)}
            className={cn(
              'rounded-lg px-4 py-2 text-xs font-medium transition-all',
              tab === t.value
                ? 'bg-gold-500 text-lapis-950 shadow-lg shadow-gold-500/20'
                : 'text-sand-100/60 hover:bg-white/[0.05]'
            )}
          >
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="flex items-center justify-center gap-3 py-20 text-sand-100/50">
          <Loader2 className="h-5 w-5 animate-spin text-gold-400" />
          جاري التحميل...
        </div>
      ) : comments.length === 0 ? (
        <div className="flex flex-col items-center gap-3 rounded-2xl border border-white/[0.07] bg-white/[0.03] py-20 text-center">
          <CheckCircle2 className="h-10 w-10 text-green-500/50" />
          <p className="text-sm text-sand-100/50">لا توجد تعليقات في هذه الفئة</p>
        </div>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => {
            const badge = STATUS_BADGES[comment.status]
            return (
              <div
                key={comment.id}
                className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5 transition-colors hover:border-gold-500/25"
              >
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-lapis-700/50 text-gold-400">
                      <User className="h-4 w-4" />
                    </span>
                    <div>
                      <p className="text-sm font-semibold text-sand-100/90">{comment.userName}</p>
                      <p className="flex items-center gap-1.5 text-[11px] text-sand-100/40">
                        <Clock className="h-3 w-3" />
                        {timeAgo(comment.createdAt)}
                      </p>
                    </div>
                  </div>
                  <span className={cn('rounded-lg border px-2.5 py-1 text-[10px] font-bold', badge.color)}>
                    {badge.label}
                  </span>
                </div>

                <p className="mt-4 rounded-xl bg-white/[0.03] p-4 text-sm leading-relaxed text-sand-100/75">
                  {comment.content}
                </p>

                <p className="mt-3 flex items-center gap-1.5 text-[11px] text-sand-100/35">
                  <MessageSquare className="h-3 w-3" />
                  على مقال: {comment.articleTitle || 'مقال محذوف'}
                </p>

                <div className="mt-4 flex items-center gap-2 border-t border-white/[0.06] pt-4">
                  {comment.status !== 'approved' && (
                    <button
                      onClick={() => moderate(comment.id, 'approved')}
                      disabled={actionId === comment.id}
                      className="flex items-center gap-2 rounded-xl bg-green-500/15 px-4 py-2 text-xs font-bold text-green-400 transition-colors hover:bg-green-500/25 disabled:opacity-50"
                    >
                      {actionId === comment.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <CheckCircle2 className="h-3.5 w-3.5" />}
                      اعتماد
                    </button>
                  )}
                  {comment.status !== 'rejected' && (
                    <button
                      onClick={() => moderate(comment.id, 'rejected')}
                      disabled={actionId === comment.id}
                      className="flex items-center gap-2 rounded-xl bg-red-500/15 px-4 py-2 text-xs font-bold text-red-400 transition-colors hover:bg-red-500/25 disabled:opacity-50"
                    >
                      <XCircle className="h-3.5 w-3.5" />
                      رفض
                    </button>
                  )}
                  <button
                    onClick={() => remove(comment.id)}
                    disabled={actionId === comment.id}
                    className="ms-auto flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-medium text-sand-100/40 transition-colors hover:bg-red-500/10 hover:text-red-400 disabled:opacity-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    حذف
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
