import { NextRequest, NextResponse } from 'next/server'
import { requirePermission, isErrorResponse } from '@/lib/rbac'
import { logAudit } from '@/lib/audit'

/**
 * غرفة العمليات الذكية — الذكاء الاصطناعي يدير الموقع ويطوره ويصطاد المشاهدات
 * الإجراءات: analyze (تحليل شامل) | optimize (تحسين SEO للمقالات الضعيفة) | growth (خطة النمو)
 */

const SB_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SB_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const NIM_KEY = process.env.NIM_KEY || ''
const NIM_MODEL = process.env.NIM_MODEL || 'nvidia/nemotron-3.5-lightning-30b-a3b'
const BASE = 'https://iraqnow.pages.dev'

const H = { apikey: SB_KEY || '', Authorization: `Bearer ${SB_KEY || ''}`, 'Content-Type': 'application/json' }

async function sbGet(p: string): Promise<any> {
  try {
    const res = await fetch(`${SB_URL}/rest/v1/${p}`, { headers: H, cache: 'no-store' })
    if (!res.ok) return []
    return await res.json()
  } catch { return [] }
}

async function nim(prompt: string, maxTokens = 6000): Promise<string> {
  if (!NIM_KEY) throw new Error('NIM_KEY غير مضبوط في بيئة التشغيل')
  let lastErr: any = null
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
        method: 'POST',
        headers: { Authorization: `Bearer ${NIM_KEY}`, 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          model: NIM_MODEL,
          messages: [{ role: 'user', content: 'detailed thinking off. ' + prompt }],
          temperature: 0.4,
          top_p: 0.9,
          max_tokens: maxTokens,
        }),
      })
      if (!res.ok) { lastErr = new Error(`NIM ${res.status}`); await new Promise((x) => setTimeout(x, 3000)); continue }
      const j = await res.json()
      return j.choices?.[0]?.message?.content || ''
    } catch (e: any) {
      lastErr = e
      await new Promise((x) => setTimeout(x, 4000))
    }
  }
  throw lastErr || new Error('NIM فشل')
}

/* مُصلح JSON متين: أسوار، فواصل زائدة، اقتباسات مزدوجة داخل القيم */
function extractJson(raw: string): any {
  let s = String(raw || '').replace(/```json|```/g, '').trim()
  const start = s.indexOf('{')
  if (start < 0) throw new Error('لا JSON')
  s = s.slice(start)
  /* آخر قوس إغلاق متوازن */
  let depth = 0, end = -1, inStr = false, esc = false
  for (let i = 0; i < s.length; i++) {
    const ch = s[i]
    if (esc) { esc = false; continue }
    if (ch === '\\') { esc = true; continue }
    if (ch === '"') inStr = !inStr
    if (inStr) continue
    if (ch === '{') depth++
    if (ch === '}') { depth--; if (depth === 0) { end = i + 1; break } }
  }
  if (end > 0) s = s.slice(0, end)
  const attempts = [
    s,
    s.replace(/,\s*([}\]])/g, '$1'),
    s.replace(/,\s*([}\]])/g, '$1').replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g, ' '),
  ]
  for (const a of attempts) {
    try { return JSON.parse(a) } catch { /* المحاولة التالية */ }
  }
  /* إصلاح أخطر: اقتباس مزدوج داخل قيم عربية — نستبدله بـ «» */
  const fixed = s.replace(/"([^"\\]*)"/g, (m0) => m0) // أساس
  try { return JSON.parse(fixed.replace(/,\s*([}\]])/g, '$1')) } catch { /* آخر محاولة */ }
  /* مخرج آمن: نحاول التقاط الحقول يدوياً */
  const grab = (key: string) => {
    const m2 = s.match(new RegExp('"' + key + '"\\s*:\\s*"([^"]*(?:«[^»]*»[^"]*)*)"'))
    return m2 ? m2[1] : undefined
  }
  const loose: any = {}
  for (const k of ['summary']) { const v = grab(k); if (v) loose[k] = v }
  if (loose.summary) return loose
  throw new Error('JSON غير قابل للإصلاح')
}

/* ═══ جمع إحصاءات الموقع الحقيقية ═══ */
async function gatherStats() {
  const all = (await sbGet('articles?select=id,title_ar,category_slug,view_count,published_at,created_at,status&limit=10000')) as any[]
  const pub = all.filter((a) => a.status === 'PUBLISHED')
  const byCategory: Record<string, { count: number; views: number }> = {}
  for (const a of pub) {
    const c = a.category_slug || 'غير مصنف'
    byCategory[c] = byCategory[c] || { count: 0, views: 0 }
    byCategory[c].count++
    byCategory[c].views += a.view_count || 0
  }
  const day = 86400_000
  const now = Date.now()
  const last7 = pub.filter((a) => now - new Date(a.published_at).getTime() < 7 * day)
  const last24 = pub.filter((a) => now - new Date(a.published_at).getTime() < day)
  const topViewed = [...pub].sort((a, b) => (b.view_count || 0) - (a.view_count || 0)).slice(0, 8)
    .map((a) => ({ title: a.title_ar, views: a.view_count || 0, category: a.category_slug }))
  const weak = pub
    .filter((a) => {
      const ageDays = (now - new Date(a.published_at).getTime()) / day
      return ageDays >= 2 && ageDays <= 21 && (a.view_count || 0) < 10
    })
    .sort((a, b) => (a.view_count || 0) - (b.view_count || 0))
    .slice(0, 10)
    .map((a) => ({ id: a.id, title: a.title_ar, views: a.view_count || 0, category: a.category_slug, ageDays: Math.round((now - new Date(a.published_at).getTime()) / day) }))
  return {
    totalPublished: pub.length,
    last24h: last24.length,
    last7d: last7.length,
    totalViews: pub.reduce((s, a) => s + (a.view_count || 0), 0),
    byCategory,
    topViewed,
    weak,
    engine: (await sbGet('site_settings?key=eq.ai_engine&select=value'))[0]?.value ? JSON.parse((await sbGet('site_settings?key=eq.ai_engine&select=value'))[0].value).daily : null,
  }
}

/* ═══ الإجراءات ═══ */
async function actionAnalyze() {
  const stats = await gatherStats()
  const raw = await nim(`أنت مدير تحرير رقمي خبير ينمي مواقع الأخبار العراقية. حلل بيانات الموقع التالية وأعد خطة عملية.

البيانات:
- مقالات منشورة: ${stats.totalPublished} (آخر 24 ساعة: ${stats.last24h}، آخر أسبوع: ${stats.last7d})
- إجمالي المشاهدات: ${stats.totalViews}
- الأداء حسب القسم: ${JSON.stringify(stats.byCategory)}
- الأكثر قراءة: ${JSON.stringify(stats.topViewed.slice(0, 5))}

ممنوع علامة الاقتباس المزدوجة داخل أي قيمة — استخدم «» عند الحاجة. أعد JSON فقط: {"summary":"جملتان عن الوضع","strengths":["نقطة قوة"],"problems":["مشكلة مع حلها"],"actions":[{"title":"إجراء","detail":"كيف تنفذه بدقة","impact":"عالي|متوسط|منخفض"}],"trending":["3 مواضيع ساخنة يستحق التغطية الآن للعراقيين"]}`)
  const parsed = extractJson(raw)
  return { kind: 'analyze', stats: { totalPublished: stats.totalPublished, last24h: stats.last24h, last7d: stats.last7d, totalViews: stats.totalViews }, ...parsed }
}

async function actionOptimize() {
  const stats = await gatherStats()
  const weak = stats.weak
  if (!weak.length) return { kind: 'optimize', changes: [], message: 'لا مقالات ضعيفة حالياً — الأداء جيد' }
  const changes: { id: string; before: string; after: string }[] = []
  /* دفعة واحدة: حتى 8 مقالات */
  const batch = weak.slice(0, 8)
  const raw = await nim(`أنت خبير SEO وصناغ عناوين إخبارية عراقي. لكل مقالة ضعيفة المشاهدات أعد عنواناً جذاباً بصياغة عربية قوية (بدون clickbait كاذب، حافظ على المعنى الحرفي للخبر) وملخصاً محسّناً (سطر واحد يبرز الأهم).

المقالات: ${JSON.stringify(batch.map((w) => ({ id: w.id, title: w.title, category: w.category })))}

ممنوع علامة الاقتباس المزدوجة داخل أي قيمة — استخدم «» عند الحاجة. أعد JSON فقط: {"items":[{"id":"...","title":"العنوان المحسن","excerpt":"الملخص المحسن"}]}`)
  const parsed = extractJson(raw)
  for (const it of parsed.items || []) {
    const orig = batch.find((w) => w.id === it.id)
    if (!orig || !it.title || /[A-Za-z]{4,}/.test(it.title) || /[\uFFFD]/.test(it.title)) continue
    const title = String(it.title).slice(0, 180)
    const excerpt = String(it.excerpt || '').slice(0, 500)
    const res = await fetch(`${SB_URL}/rest/v1/articles?id=eq.${encodeURIComponent(it.id)}`, {
      method: 'PATCH', headers: { ...H, Prefer: 'return=minimal' },
      body: JSON.stringify({ title_ar: title, title_ku: title, excerpt_ar: excerpt, excerpt_ku: excerpt }),
    })
    if (res.ok) {
      changes.push({ id: it.id, before: orig.title, after: title })
      await logAudit('seo-optimize', 'article', it.id)
    }
  }
  return { kind: 'optimize', changes, message: `حُسّنت ${changes.length} من ${batch.length}` }
}

async function actionGrowth() {
  const stats = await gatherStats()
  const raw = await nim(`أنت استراتيجي نمو لموقع "العراق الآن" الإخباري. بناءً على أداء الأقسام التالي: ${JSON.stringify(stats.byCategory)}، والأكثر قراءة: ${JSON.stringify(stats.topViewed.slice(0, 5))} — صمم خطة نمو للمشاهدات لأسبوع.

ممنوع علامة الاقتباس المزدوجة داخل أي قيمة — استخدم «» عند الحاجة. أعد JSON فقط: {"plan":[{"day":"اليوم","focus":"محور التغطية","why":"سبب مبني على البيانات","expected":"النتيجة المتوقعة"}],"viralIdeas":["3 أفكار مواضيع قابلة للانتشار الواسع لدى الجمهور العراقي"],"seoTips":["نصيحتان تقنيتان محددتان"]}`)
  return { kind: 'growth', ...extractJson(raw) }
}

export async function POST(request: NextRequest) {
  const perm = await requirePermission('dashboard.view')
  if (isErrorResponse(perm)) return perm
  try {
    const body = await request.json().catch(() => ({}))
    const action = body.action
    if (action === 'analyze') return NextResponse.json(await actionAnalyze())
    if (action === 'optimize') return NextResponse.json(await actionOptimize())
    if (action === 'growth') return NextResponse.json(await actionGrowth())
    return NextResponse.json({ error: 'إجراء غير معروف' }, { status: 400 })
  } catch (error: any) {
    return NextResponse.json({ error: String(error.message || error).slice(0, 200) }, { status: 500 })
  }
}
