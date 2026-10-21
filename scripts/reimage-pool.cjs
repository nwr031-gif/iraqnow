/**
 * reimage-pool.cjs — استبدال صور المسبح العام بصور موضوعية مطابقة
 * NIM يقترح imageQuery لكل مقالة → Commons (صارم) → Openverse → PATCH
 */
const https = require('https')
const fs = require('fs')
const path = require('path')

const secrets = JSON.parse(fs.readFileSync(path.join('D:/ui/iraqnow', 'ai-worker/.deploy.secrets.json'), 'utf8'))
const NIM_KEY = secrets.NIM_KEY
const K = 'sb_publishable_-MsvXS3OevPwi4bbRSyNJw_O29W7-1i'
const SB = 'https://xtdrkziyndkvaxkxvfqx.supabase.co'
const LOG = path.join('D:/ui/iraqnow/scripts', 'reimage2.log')
const say = (m) => { fs.appendFileSync(LOG, m + '\n') }

function req(url, method, headers, body, timeout = 60000) {
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

async function nimBatchQueries(articles) {
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const list = articles.map((a) => ({ id: a.id, title: a.title_en || a.title_ar, category: a.category_slug || '', tags: Array.isArray(a.tags) ? a.tags.slice(0, 3) : [] }))
      const prompt = `detailed thinking off. أنت أخصائي صور إخبارية. لكل مقالة أعد "imageQuery": 2-4 كلمات إنجليزية تصف صورة فوتوغرافية حقيقية مطابقة لموضوعها (أشخاص/أماكن/أشياء ملموسة — بدون علامات تجارية، بدون كلمات مجردة). أعد JSON فقط: {"items":[{"id":"...","imageQuery":"..."}]}

المقالات:
${JSON.stringify(list)}`
      const r = await req('https://integrate.api.nvidia.com/v1/chat/completions', 'POST', {
        Authorization: `Bearer ${NIM_KEY}`, 'Content-Type': 'application/json', Accept: 'application/json',
      }, JSON.stringify({
        model: 'nvidia/nemotron-3.5-lightning-30b-a3b',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.2, top_p: 0.9, max_tokens: 2500,
      }))
      if (r.s !== 200) { say(`  NIM ${r.s}: ${r.d.slice(0, 80)}`); await sleep(4000); continue }
      const content = JSON.parse(r.d).choices[0].message.content
      const m = content.match(/\{[\s\S]*\}/)
      const parsed = JSON.parse(m[0])
      const map = {}
      for (const it of parsed.items || []) if (it.id && it.imageQuery) map[it.id] = String(it.imageQuery).slice(0, 80)
      return map
    } catch (e) { say(`  nim err: ${e.message}`); await sleep(4000) }
  }
  return {}
}

;(async () => {
  fs.writeFileSync(LOG, '')
  say('=== إعادة تصوير المسبح العام — بدء ===')

  const res = await req(`${SB}/rest/v1/articles?select=id,title_ar,title_en,image,tags,category_slug&image=like.*unsplash*&status=eq.PUBLISHED&order=created_at.desc&limit=200`, 'GET', H)
  const arts = JSON.parse(res.d || '[]')
  say(`مقالات بصور مسبح عام: ${arts.length}`)
  if (!arts.length) { say('لا شيء — اكتمل'); process.exit(0) }

  let replaced = 0, kept = 0, idx = 0
  for (let i = 0; i < arts.length; i += 10) {
    const batch = arts.slice(i, i + 10)
    const queries = await nimBatchQueries(batch)
    for (const a of batch) {
      idx++
      const q1 = queries[a.id]
      const fallback = (Array.isArray(a.tags) && a.tags[0]) || ''
      const qs = [q1, fallback].map((x) => String(x || '').trim()).filter(Boolean).slice(0, 2)
      let img = '', usedQ = ''
      for (const q of qs) {
        img = await topicalImage(q)
        if (img) { usedQ = q; break }
      }
      if (img && !/unsplash/.test(img)) {
        const p = await req(`${SB}/rest/v1/articles?id=eq.${encodeURIComponent(a.id)}`, 'PATCH',
          { ...H, Prefer: 'return=minimal' },
          JSON.stringify({ image: img, image_alt: `صورة توضيحية — ${usedQ}`.trim() }))
        if (p.s >= 200 && p.s < 300) { replaced++; say(`✓ [${idx}] ${a.title_ar.slice(0, 38)} ← ${usedQ}`) }
        else { kept++; say(`✗ PATCH ${p.s} [${idx}]`) }
      } else { kept++; say(`– [${idx}] بلا مطابقة: ${a.title_ar.slice(0, 36)} (${qs.join('/') || '—'})`) }
      await sleep(300)
    }
    await sleep(1000)
  }
  say(`=== النتيجة: استُبدلت ${replaced} | بقيت ${kept} من ${arts.length} ===`)
  process.exit(0)
})()
