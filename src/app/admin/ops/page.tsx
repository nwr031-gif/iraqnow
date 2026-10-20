'use client'

import { useState, useEffect, useCallback } from 'react'
import {
  BrainCircuit, Sparkles, TrendingUp, Gauge, Zap, CheckCircle2,
  AlertCircle, Loader2, Target, Lightbulb, ArrowUpRight, Activity,
} from 'lucide-react'

type OpsData = any

const CARD = 'rounded-2xl border border-sand-500/15 bg-sand-900/40 p-5'
const BTN = 'inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all disabled:opacity-40'

export default function OpsPage() {
  const [data, setData] = useState<OpsData | null>(null)
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState('')
  const [log, setLog] = useState<string[]>([])

  const push = (m: string) => setLog((l) => [`${new Date().toLocaleTimeString('ar-IQ')} — ${m}`, ...l].slice(0, 12))

  const run = useCallback(async (action: string) => {
    setLoading(action); setError('')
    try {
      const res = await fetch('/api/admin/ops', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'فشل')
      setData((prev: OpsData) => ({ ...prev, [action]: j }))
      push(action === 'analyze' ? 'اكتمل التحليل الذكي' : action === 'optimize' ? `حُسّنت ${j.changes?.length ?? 0} مقالة` : 'خطة النمو جاهزة')
    } catch (e: any) {
      setError(String(e.message || e))
      push('فشل: ' + String(e.message || e).slice(0, 60))
    }
    setLoading(null)
  }, [])

  useEffect(() => { run('analyze') }, [run])

  const analyze = data?.analyze
  const optimize = data?.optimize
  const growth = data?.growth

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      {/* الرأس */}
      <div className={CARD + ' bg-gradient-to-l from-lapis-800/60 to-sand-900/40'}>
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-gold-400 to-gold-600 text-lapis-950">
            <BrainCircuit className="h-7 w-7" />
          </span>
          <div className="flex-1">
            <h1 className="font-kufi text-2xl font-bold text-white">غرفة العمليات الذكية</h1>
            <p className="mt-1 text-sm text-sand-100/60">ذكاء اصطناعي يدير موقعك ويسعى لتكثيف المشاهدات — تحليل، تحسين SEO، خطة نمو</p>
          </div>
          <span className="flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1 text-xs font-bold text-emerald-400">
            <Activity className="h-3.5 w-3.5 animate-pulse" /> مباشر
          </span>
        </div>
        <div className="mt-5 flex flex-wrap gap-2">
          <button onClick={() => run('analyze')} disabled={!!loading} className={BTN + ' bg-gold-500 text-lapis-950 hover:bg-gold-400'}>
            {loading === 'analyze' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Gauge className="h-4 w-4" />} تحليل شامل
          </button>
          <button onClick={() => run('optimize')} disabled={!!loading} className={BTN + ' border border-gold-500/40 text-gold-400 hover:bg-gold-500/10'}>
            {loading === 'optimize' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Zap className="h-4 w-4" />} تحسين SEO للمقالات الضعيفة
          </button>
          <button onClick={() => run('growth')} disabled={!!loading} className={BTN + ' border border-sand-500/30 text-sand-100/80 hover:bg-sand-500/10'}>
            {loading === 'growth' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />} خطة النمو
          </button>
        </div>
        {error && <p className="mt-3 flex items-center gap-2 text-sm text-red-400"><AlertCircle className="h-4 w-4" />{error}</p>}
      </div>

      {/* المؤشرات */}
      {analyze?.stats && (
        <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
          {[
            { icon: '📄', label: 'مقالات منشورة', v: analyze.stats.totalPublished },
            { icon: '⚡', label: 'آخر 24 ساعة', v: analyze.stats.last24h },
            { icon: '📅', label: 'آخر أسبوع', v: analyze.stats.last7d },
            { icon: '👁️', label: 'إجمالي المشاهدات', v: analyze.stats.totalViews },
          ].map((s, i) => (
            <div key={i} className={CARD + ' text-center'}>
              <p className="text-2xl">{s.icon}</p>
              <p className="mt-1 font-kufi text-2xl font-bold text-white">{s.v}</p>
              <p className="text-[11px] text-sand-100/50">{s.label}</p>
            </div>
          ))}
        </div>
      )}

      {/* التحليل */}
      {analyze && (
        <div className="space-y-4">
          {analyze.summary && (
            <div className={CARD}>
              <h2 className="mb-2 flex items-center gap-2 font-kufi font-bold text-gold-400"><Sparkles className="h-4 w-4" /> خلاصة المدير الرقمي</h2>
              <p className="text-sm leading-relaxed text-sand-100/80">{analyze.summary}</p>
            </div>
          )}
          <div className="grid gap-4 lg:grid-cols-2">
            {analyze.strengths?.length > 0 && (
              <div className={CARD}>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-emerald-400"><CheckCircle2 className="h-4 w-4" /> نقاط القوة</h3>
                <ul className="space-y-2">{analyze.strengths.map((s: string, i: number) => <li key={i} className="text-sm text-sand-100/75">• {s}</li>)}</ul>
              </div>
            )}
            {analyze.problems?.length > 0 && (
              <div className={CARD}>
                <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-red-400"><AlertCircle className="h-4 w-4" /> مشاكل وحلولها</h3>
                <ul className="space-y-2">{analyze.problems.map((s: string, i: number) => <li key={i} className="text-sm text-sand-100/75">• {s}</li>)}</ul>
              </div>
            )}
          </div>
          {analyze.actions?.length > 0 && (
            <div className={CARD}>
              <h3 className="mb-4 flex items-center gap-2 font-kufi text-sm font-bold text-white"><TrendingUp className="h-4 w-4 text-gold-400" /> إجراءات موصى بها — نفّذها بنفسك الآن</h3>
              <div className="space-y-3">
                {analyze.actions.map((a: any, i: number) => (
                  <div key={i} className="rounded-xl border border-sand-500/15 bg-lapis-950/40 p-4">
                    <div className="flex items-start justify-between gap-3">
                      <p className="font-bold text-white">{a.title}</p>
                      <span className={'shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-bold ' + (a.impact === 'عالي' ? 'bg-emerald-500/15 text-emerald-400' : a.impact === 'متوسط' ? 'bg-gold-500/15 text-gold-400' : 'bg-sand-500/15 text-sand-100/60')}>{a.impact}</span>
                    </div>
                    <p className="mt-1.5 text-sm text-sand-100/65">{a.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
          {analyze.trending?.length > 0 && (
            <div className={CARD}>
              <h3 className="mb-3 flex items-center gap-2 text-sm font-bold text-gold-400"><Lightbulb className="h-4 w-4" /> مواضيع ساخنة تستحق التغطية الآن</h3>
              <div className="flex flex-wrap gap-2">{analyze.trending.map((t: string, i: number) => <span key={i} className="rounded-full border border-gold-500/30 bg-gold-500/10 px-3 py-1.5 text-xs text-gold-300">{t}</span>)}</div>
            </div>
          )}
        </div>
      )}

      {/* تحسين SEO — قبل/بعد */}
      {optimize?.changes?.length > 0 && (
        <div className={CARD}>
          <h2 className="mb-4 flex items-center gap-2 font-kufi font-bold text-white"><Zap className="h-4 w-4 text-gold-400" /> عناوين أُعيدت صياغتها لجذب القراء — {optimize.message}</h2>
          <div className="space-y-3">
            {optimize.changes.map((c: any, i: number) => (
              <div key={i} className="rounded-xl border border-sand-500/15 p-4">
                <p className="text-xs text-sand-100/40 line-through">{c.before}</p>
                <p className="mt-1.5 flex items-start gap-1.5 text-sm font-bold text-white"><ArrowUpRight className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />{c.after}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* خطة النمو */}
      {growth?.plan?.length > 0 && (
        <div className={CARD}>
          <h2 className="mb-4 flex items-center gap-2 font-kufi font-bold text-white"><Target className="h-4 w-4 text-gold-400" /> خطة نمو المشاهدات الأسبوعية</h2>
          <div className="space-y-3">
            {growth.plan.map((p: any, i: number) => (
              <div key={i} className="rounded-xl border border-sand-500/15 bg-lapis-950/40 p-4">
                <p className="text-sm font-bold text-gold-400">{p.day} — {p.focus}</p>
                <p className="mt-1 text-sm text-sand-100/65">{p.why}</p>
                <p className="mt-1 text-xs text-emerald-400/80">المتوقع: {p.expected}</p>
              </div>
            ))}
          </div>
          {growth.viralIdeas?.length > 0 && (
            <div className="mt-4">
              <p className="mb-2 text-xs font-bold text-sand-100/50">أفكار قابلة للانتشار:</p>
              <ul className="space-y-1.5">{growth.viralIdeas.map((v: string, i: number) => <li key={i} className="text-sm text-sand-100/75">💡 {v}</li>)}</ul>
            </div>
          )}
        </div>
      )}

      {/* سجل العمليات */}
      {log.length > 0 && (
        <div className={CARD + ' bg-lapis-950/60'}>
          <h3 className="mb-2 text-xs font-bold text-sand-100/50">سجل الغرفة</h3>
          <ul className="space-y-1 font-mono text-[11px] text-sand-100/45">{log.map((l, i) => <li key={i}>{l}</li>)}</ul>
        </div>
      )}
    </div>
  )
}
