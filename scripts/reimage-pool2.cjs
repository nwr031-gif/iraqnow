/**
 * reimage-pool2.cjs — استبدال صور المسبح العام بصور موضوعية (استعلام من العنوان مباشرة)
 * Commons (صارم) → Openverse → PATCH — سريع وحتمي
 */
const https = require('https')
const fs = require('fs')
const path = require('path')

const K = 'sb_publishable_-MsvXS3OevPwi4bbRSyNJw_O29W7-1i'
const SB = 'https://xtdrkziyndkvaxkxvfqx.supabase.co'
const LOG = path.join('D:/ui/iraqnow/scripts', 'reimage2.log')
const say = (m) => { fs.appendFileSync(LOG, m + '\n') }

function req(url, method, headers, body, timeout = 12000) {
  return new Promise((r) => {
    const u = new URL(url)
    const q = https.request({ method, hostname: u.hostname, path: u.pathname + u.search, headers, timeout }, (x) => {
      let d = ''
      x.on('data', (c) => (d += c))
      x.on('end', () => r({ s: x.statusCode, d }))
    })
    q.on('error', (e) => r({ s: 0, d: e.message }))
    if (body) q.write(body)
    q.end()
  })
}
const H = { apikey: K, Authorization: `Bearer ${K}`, 'Content-Type': 'application/json' }
const sleep = (ms) => new Promise((r) => setTimeout(r, ms))
const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/131.0 Safari/537.36'

const STOP = new Set(['في', 'من', 'على', 'الى', 'إلى', 'عن', 'مع', 'هذا', 'هذه', 'ذلك', 'التي', 'الذي', 'بعد', 'قبل', 'بين', 'أن', 'إن', 'او', 'أو', 'و', 'ما', 'لا', 'هو', 'هي', 'كان', 'كانت', 'قد', 'كل', 'خلال', 'ضد', 'حول', 'بشأن', 'بسبب', 'حتى', 'ثم', 'كما', 'عند', 'عندما', 'بينما', 'معروف', 'واسع'])

function titleTokens(s) {
  return String(s || '').toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, ' ').split(/\s+/).filter((w) => w.length > 2 && !STOP.has(w))
}
function jaccard(a, b) {
  if (!a.length || !b.length) return 0
  const A = new Set(a)
  let n = 0
  for (const t of new Set(b)) if (A.has(t)) n++
  return n / (new Set([...A, ...b]).size || 1)
}

const BAD = /(map|logo|icon|diagram|flag|coat_of_arms|chart|graph|seal|emblem|poster|bookcover|signature|banknote|stamp)/i
const words = (q) => String(q || '').toLowerCase().split(/\s+/).filter((w) => w.length > 2)

async function commonsImage(q) {
  try {
    const api = `https://commons.wikimedia.org/w/api.php?action=query&generator=search&gsrsearch=${encodeURIComponent('filetype:bitmap ' + q)}&gsrlimit=8&gsrnamespace=6&prop=imageinfo&iiprop=url%7Csize&iiurlwidth=1200&format=json`
    const j = JSON.parse((await req(api, 'GET', { 'User-Agent': UA, Accept: 'application/json' })).d || '{}')
    const pages = (j.query && j.query.pages) || {}
    const ws = words(q)
    const cands = Object.values(pages)
      .map((p) => ({ ii: p.imageinfo && p.imageinfo[0], title: String(p.title || '') }))
      .filter((x) => x.ii && (x.ii.width || 0) >= 640 && !BAD.test(x.title) && !BAD.test(x.ii.thumburl || ''))
      .map((x) => ({ ...x, score: ws.filter((w) => x.title.toLowerCase().includes(w)).length }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score || (b.ii.width || 0) - (a.ii.width || 0))
    return cands[0] ? cands[0].ii.thumburl || cands[0].ii.url || '' : ''
  } catch { return '' }
}

async function openverseImage(q) {
  try {
    const api = `https://api.openverse.org/v1/images/?q=${encodeURIComponent(q)}&license=cc0,pdm&page_size=8&mature=false`
    const j = JSON.parse((await req(api, 'GET', { 'User-Agent': UA, Accept: 'application/json' })).d || '{}')
    const ws = words(q)
    const rs = (j.results || [])
      .filter((r) => (r.width || 0) >= 640 && !BAD.test(String(r.title || '')) && !BAD.test(String(r.url || '')))
      .map((r) => ({ ...r, score: ws.filter((w) => String(r.title || '').toLowerCase().includes(w)).length }))
      .filter((r) => r.score > 0)
      .sort((a, b) => b.score - a.score || (b.width || 0) - (a.width || 0))
    return rs[0] ? rs[0].url || '' : ''
  } catch { return '' }
}
const topicalImage = async (q) => (await commonsImage(q)) || (await openverseImage(q))

;(async () => {
  fs.writeFileSync(LOG, '')
  say('=== إعادة تصوير المسبح (استعلام مباشر من العنوان) — بدء ===')

  const res = await req(`${SB}/rest/v1/articles?select=id,title_ar,image,tags,category_slug&image=like.*unsplash*&status=eq.PUBLISHED&order=created_at.desc&limit=200`, 'GET', H)
  const arts = JSON.parse(res.d || '[]')
  say(`مقالات بصور مسبح عام: ${arts.length}`)

  let replaced = 0, kept = 0, idx = 0
  for (const a of arts) {
    idx++
    const tk = titleTokens(a.title_ar)
    /* استعلامات: كلمات العنوان المهمة (مجموعات) + الوسوم */
    const qs = []
    if (tk.length >= 2) qs.push(tk.slice(0, 3).join(' '))
    if (tk.length >= 1) qs.push(tk.slice(0, 2).join(' '))
    if (Array.isArray(a.tags) && a.tags[0]) qs.push(String(a.tags[0]))
    let img = '', usedQ = ''
    for (const q of qs) {
      img = await topicalImage(q)
      if (img) { usedQ = q; break }
    }
    if (img && !/unsplash/.test(img)) {
      const p = await req(`${SB}/rest/v1/articles?id=eq.${encodeURIComponent(a.id)}`, 'PATCH',
        { ...H, Prefer: 'return=minimal' },
        JSON.stringify({ image: img, image_alt: `صورة توضيحية — ${usedQ}`.trim() }))
      if (p.s >= 200 && p.s < 300) { replaced++; say(`✓ [${idx}] ${a.title_ar.slice(0, 40)} ← ${usedQ}`) }
      else { kept++; say(`✗ PATCH ${p.s} [${idx}]`) }
    } else { kept++; say(`– [${idx}] بلا مطابقة: ${a.title_ar.slice(0, 38)} (${qs[0] || '—'})`) }
    await sleep(120)
  }
  say(`=== النتيجة: استُبدلت ${replaced} | بقيت ${kept} من ${arts.length} ===`)
  process.exit(0)
})()
