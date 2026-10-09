import Link from 'next/link'
import {
  Newspaper, Users, MessageSquare, Mail, Mic, Eye, TrendingUp,
  ArrowLeft, Clock, PenSquare, CheckCircle2, AlertCircle, Database,
} from 'lucide-react'
import { getAdminStats, getAdminArticles, getAdminComments, isDbAvailable } from '@/lib/data'
import { getSessionUser } from '@/lib/rbac'

export const dynamic = 'force-dynamic'

const STATUS_LABELS: Record<string, { label: string; color: string }> = {
  DRAFT: { label: 'مسودة', color: 'bg-sand-500/15 text-sand-600 border-sand-500/30' },
  IN_REVIEW: { label: 'قيد المراجعة', color: 'bg-gold-500/15 text-gold-600 border-gold-500/30' },
  SCHEDULED: { label: 'مجدول', color: 'bg-lapis-500/15 text-lapis-500 border-lapis-500/30' },
  PUBLISHED: { label: 'منشور', color: 'bg-green-500/15 text-green-600 border-green-500/30' },
  ARCHIVED: { label: 'مؤرشف', color: 'bg-ink-500/15 text-ink-500 border-ink-500/30' },
}

function timeAgo(dateStr: string, locale = 'ar'): string {
  if (!dateStr) return '—'
  const diff = Date.now() - new Date(dateStr).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `منذ ${mins} دقيقة`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `منذ ${hours} ساعة`
  return `منذ ${Math.floor(hours / 24)} يوم`
}

export default async function AdminDashboard() {
  const [stats, articles, comments, dbUp] = await Promise.all([
    getAdminStats(),
    getAdminArticles(),
    getAdminComments('pending'),
    isDbAvailable(),
  ])
  const user = await getSessionUser()

  const recentArticles = articles.slice(0, 6)
  const pendingComments = comments.slice(0, 5)

  const statCards = [
    { icon: Newspaper, label: 'إجمالي المقالات', value: stats.articles, sub: `${stats.published} منشور`, color: 'from-lapis-500 to-lapis-700' },
    { icon: Eye, label: 'إجمالي القراءات', value: stats.views, sub: 'آخر 30 يوماً', color: 'from-gold-500 to-gold-700' },
    { icon: MessageSquare, label: 'التعليقات', value: stats.comments, sub: `${stats.pending} بانتظار المراجعة`, color: 'from-terra-500 to-terra-700', alert: stats.pending > 0 },
    { icon: Mail, label: 'المشتركون', value: stats.subscribers, sub: 'نشرة بريدية نشطة', color: 'from-emerald-500 to-emerald-700' },
  ]

  return (
    <div className="space-y-6">
      {/* الترحيب */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-kufi text-2xl font-bold text-white">
            أهلاً بك، {user?.name?.split(' ')[0]} 👋
          </h1>
          <p className="mt-1 text-sm text-sand-100/50">
            نظرة شاملة على أداء المنصة اليوم —{' '}
            {new Date().toLocaleDateString('ar-IQ', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        <div className="flex items-center gap-3">
          {!dbUp && (
            <span className="flex items-center gap-2 rounded-xl border border-gold-500/30 bg-gold-500/10 px-3.5 py-2 text-xs font-medium text-gold-400">
              <Database className="h-3.5 w-3.5" />
              وضع تجريبي — قاعدة البيانات غير متصلة
            </span>
          )}
          <Link href="/admin/articles/new" className="btn-primary !rounded-xl !px-5 !py-2.5 text-xs font-kufi">
            <PenSquare className="h-4 w-4" />
            مقال جديد
          </Link>
        </div>
      </div>

      {/* البطاقات الإحصائية */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {statCards.map((card, i) => (
          <div
            key={i}
            className="group relative overflow-hidden rounded-2xl border border-white/[0.07] bg-gradient-to-br from-white/[0.05] to-transparent p-5 transition-all duration-300 hover:border-gold-500/30"
          >
            <div className="flex items-start justify-between">
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.color} shadow-lg`}>
                <card.icon className="h-5 w-5 text-white" />
              </span>
              {card.alert && (
                <span className="flex items-center gap-1 rounded-lg bg-red-500/15 px-2 py-1 text-[10px] font-bold text-red-400">
                  <AlertCircle className="h-3 w-3" />
                  يتطلب إجراء
                </span>
              )}
            </div>
            <p className="mt-4 font-kufi text-3xl font-bold text-white">
              {card.value.toLocaleString('ar-IQ')}
            </p>
            <p className="mt-1 text-xs text-sand-100/50">{card.label}</p>
            <p className="mt-2 flex items-center gap-1 text-[11px] text-gold-400/80">
              <TrendingUp className="h-3 w-3" />
              {card.sub}
            </p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-3">
        {/* أحدث المقالات */}
        <div className="xl:col-span-2">
          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
              <h2 className="flex items-center gap-2 font-kufi text-sm font-bold text-white">
                <Newspaper className="h-4 w-4 text-gold-400" />
                أحدث المقالات
              </h2>
              <Link href="/admin/articles" className="flex items-center gap-1 text-xs font-medium text-gold-400 transition-colors hover:text-gold-300">
                عرض الكل
                <ArrowLeft className="h-3.5 w-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-white/[0.05]">
              {recentArticles.map((article) => {
                const ar = article.translations.find((t) => t.locale === 'ar')
                const status = STATUS_LABELS[article.status] || STATUS_LABELS.DRAFT
                return (
                  <Link
                    key={article.id}
                    href={`/admin/articles/${article.id}/edit`}
                    className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-white/[0.03]"
                  >
                    {article.image && (
                      <img src={article.image} alt="" className="h-12 w-16 shrink-0 rounded-lg object-cover" />
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-sand-100/90">{ar?.title || 'بدون عنوان'}</p>
                      <div className="mt-1 flex items-center gap-3 text-[11px] text-sand-100/40">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {timeAgo(article.updatedAt)}
                        </span>
                        <span className="flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          {article.viewCount.toLocaleString('ar-IQ')}
                        </span>
                      </div>
                    </div>
                    <span className={`shrink-0 rounded-lg border px-2.5 py-1 text-[10px] font-bold ${status.color}`}>
                      {status.label}
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>

        {/* التعليقات المعلقة + إجراءات سريعة */}
        <div className="space-y-6">
          <div className="overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.03]">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-5 py-4">
              <h2 className="flex items-center gap-2 font-kufi text-sm font-bold text-white">
                <MessageSquare className="h-4 w-4 text-terra-400" />
                تعليقات بانتظار المراجعة
              </h2>
              <span className="rounded-lg bg-terra-500/15 px-2 py-0.5 text-[10px] font-bold text-terra-400">
                {stats.pending}
              </span>
            </div>
            <div className="divide-y divide-white/[0.05]">
              {pendingComments.length === 0 ? (
                <div className="flex flex-col items-center gap-2 px-5 py-8 text-center">
                  <CheckCircle2 className="h-8 w-8 text-green-500/60" />
                  <p className="text-xs text-sand-100/50">لا توجد تعليقات معلقة — كل شيء تحت السيطرة</p>
                </div>
              ) : (
                pendingComments.map((comment) => (
                  <div key={comment.id} className="px-5 py-3.5">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-sand-100/80">{comment.userName}</span>
                      <span className="text-[10px] text-sand-100/40">{timeAgo(comment.createdAt)}</span>
                    </div>
                    <p className="mt-1.5 text-xs leading-relaxed text-sand-100/60 line-clamp-2">{comment.content}</p>
                  </div>
                ))
              )}
            </div>
            <Link
              href="/admin/comments"
              className="block border-t border-white/[0.07] px-5 py-3 text-center text-xs font-medium text-gold-400 transition-colors hover:bg-white/[0.03]"
            >
              إدارة جميع التعليقات
            </Link>
          </div>

          {/* توزيع الفريق */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.03] p-5">
            <h2 className="mb-4 flex items-center gap-2 font-kufi text-sm font-bold text-white">
              <Users className="h-4 w-4 text-lapis-400" />
              فريق التحرير
            </h2>
            <div className="space-y-3">
              <div>
                <div className="mb-1.5 flex justify-between text-[11px]">
                  <span className="text-sand-100/60">مقالات منشورة</span>
                  <span className="font-bold text-gold-400">{stats.published}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <div className="h-full w-[78%] rounded-full bg-gradient-to-l from-gold-400 to-gold-600" />
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-[11px]">
                  <span className="text-sand-100/60">حلقات بودكاست</span>
                  <span className="font-bold text-gold-400">{stats.podcasts}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <div className="h-full w-[45%] rounded-full bg-gradient-to-l from-lapis-400 to-lapis-600" />
                </div>
              </div>
              <div>
                <div className="mb-1.5 flex justify-between text-[11px]">
                  <span className="text-sand-100/60">أعضاء الفريق</span>
                  <span className="font-bold text-gold-400">{stats.users}</span>
                </div>
                <div className="h-1.5 overflow-hidden rounded-full bg-white/[0.07]">
                  <div className="h-full w-[62%] rounded-full bg-gradient-to-l from-emerald-400 to-emerald-600" />
                </div>
              </div>
            </div>
            <Link
              href="/admin/users"
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl border border-gold-500/30 px-4 py-2.5 text-xs font-medium text-gold-400 transition-colors hover:bg-gold-500/10"
            >
              <Users className="h-3.5 w-3.5" />
              إدارة الفريق
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
