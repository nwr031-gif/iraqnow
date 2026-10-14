/**
 * repair-writing.cjs — ترميم كتابة المقالات الموجودة:
 * 1) عناوين عربية بكلمات لاتينية → نقحرة عبر NIM
 * 2) أحرف مكسورة (U+FFFD) → إصلاح عبر NIM بسياق الجملة
 * 3) جمل محتوى عربي بكلمات لاتينية → انقحار على مستوى الجملة
 */
const https = require('https')
const fs = require('fs')
const path = require('path')

const secrets = JSON.parse(fs.readFileSync('D:/ui/iraqnow/ai-worker/.deploy.secrets.json', 'utf8'))
const NIM_KEY = secrets.NIM_KEY
const K = 'sb_publishable_-MsvXS3OevPwi4bbRSyNJw_O29W7-1i'
const SB = 'https://xtdrkziyndkvaxkxvfqx.supabase.co'
const LOG = 'D:/ui/iraqnow/scripts/repair.log'
const log = (m) => { console.log(m); fs.appendFileSync(LOG, m + '\n') }

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

async function nimJSON(prompt, maxTokens = 6000) {
  for (let t = 0; t < 2; t++) {
    try {
      const r = await req('https://integrate.api.nvidia.com/v1/chat/completions', 'POST', {
        Authorization: `Bearer ${NIM_KEY}`, 'Content-Type': 'application/json', Accept: 'application/json',
      }, JSON.stringify({
        model: 'nvidia/nemotron-3-super-120b-a12b',
        messages: [{ role: 'user', content: 'detailed thinking off. ' + prompt }],
        temperature: 0.1, top_p: 0.9, max_tokens: maxTokens,
      }))
      if (r.s !== 200) { log(`  NIM ${r.s}`); await sleep(3000); continue }
      const content = JSON.parse(r.d).choices[0].message.content
      const m = content.match(/\{[\s\S]*\}/)
      return JSON.parse(m[0])
    } catch (e) { log(`  nim err: ${e.message}`); await sleep(3000) }
  }
  return null
}

async function patchArticle(id, fields) {
  const r = await req(`${SB}/rest/v1/articles?id=eq.${encodeURIComponent(id)}`, 'PATCH',
    { ...H, Prefer: 'return=minimal' }, JSON.stringify(fields))
  return r.s >= 200 && r.s < 300
}

;(async () => {
  fs.writeFileSync(LOG, '')
  log('=== ترميم الكتابة — بدء ===')

  /* 1) العناوين اللاتينية */
  const lt = JSON.parse((await req(`${SB}/rest/v1/articles?select=id,title_ar,excerpt_ar&title_ar=like.*a*&status=eq.PUBLISHED&limit=100`, 'GET', H)).d)
    .filter((a) => /[A-Za-z]{3,}/.test(a.title_ar))
  log(`عناوين لاتينية: ${lt.length}`)
  if (lt.length) {
    const resp = await nimJSON(`انقح العناوين العربية التالية إلى العربية الفصحى كاملة: انقح الأسماء الأجنبية إلى العربية، واستبدل أي كلمة إنجليزية (مثل amid) بمرادفها العربي (وسط/إبّان/في خضم). احافظ على المعنى حرفياً. أعد JSON فقط: {"items":[{"id":"...","title":"...","excerpt":"..."}]} — إن كان الملخص (excerpt) خالياً من اللاتينية أعده كما هو. المقالات:\n${JSON.stringify(lt.map((a) => ({ id: a.id, title: a.title_ar, excerpt: (a.excerpt_ar || '').slice(0, 220) })))}`)
    for (const it of (resp && resp.items) || []) {
      const orig = lt.find((a) => a.id === it.id)
      if (!orig || !it.title || /[A-Za-z]{3,}/.test(it.title)) { log(`  تخطي ${it.id}`); continue }
      const fields = { title_ar: String(it.title).slice(0, 180), title_ku: String(it.title).slice(0, 180) }
      if (it.excerpt && it.excerpt !== orig.excerpt_ar && !/[A-Za-z]{3,}/.test(it.excerpt)) fields.excerpt_ar = String(it.excerpt).slice(0, 500)
      if (await patchArticle(it.id, fields)) log(`✓ عنوان: ${it.title.slice(0, 50)}`)
      await sleep(250)
    }
  }

  /* 2) الأحرف المكسورة */
  const corrupted = JSON.parse((await req(`${SB}/rest/v1/articles?select=id,title_ar,excerpt_ar,content_ar&or=(content_ar.like.*%EF%BF%BD*,title_ar.like.*%EF%BF%BD*,excerpt_ar.like.*%EF%BF%BD*)&limit=100`, 'GET', H)).d)
  log(`مقالات بأحرف مكسورة: ${corrupted.length}`)
  const repairs = [] // {id, bad, context, field}
  for (const a of corrupted) {
    for (const field of ['title_ar', 'excerpt_ar', 'content_ar']) {
      const text = a[field] || ''
      const words = [...new Set((text.match(/\S*\uFFFD\S*/g) || []))]
      for (const w of words.slice(0, 6)) {
        const idx = text.indexOf(w)
        repairs.push({ id: a.id, field, bad: w, context: text.slice(Math.max(0, idx - 60), idx + w.length + 60) })
      }
    }
  }
  log(`كلمات مكسورة للإصلاح: ${repairs.length}`)
  for (let i = 0; i < repairs.length; i += 12) {
    const chunk = repairs.slice(i, i + 12)
    const resp = await nimJSON(`أصلح الكلمات العربية التالفة (تحتوي حرفاً مفقوداً مُشاراً بـ \uFFFD). استنتج الكلمة الصحيحة من السياق. أعد JSON فقط: {"items":[{"key":"<فهرس>","word":"<الكلمة الصحيحة>"}]}. العناصر:\n${JSON.stringify(chunk.map((r, ix) => ({ key: String(ix), word: r.bad, context: r.context })))}`)
    const fixes = (resp && resp.items) || []
    for (let ix = 0; ix < chunk.length; ix++) {
      const r = chunk[ix]
      const fix = fixes.find((f) => String(f.key) === String(ix))
      if (!fix || !fix.word || /\uFFFD|[A-Za-z]{3,}/.test(fix.word)) continue
      const art = corrupted.find((a) => a.id === r.id)
      const cur = art[r.field]
      if (!cur || !cur.includes(r.bad)) continue
      const patched = await patchArticle(r.id, { [r.field]: cur.split(r.bad).join(fix.word) })
      if (patched) { art[r.field] = cur.split(r.bad).join(fix.word); log(`✓ إصلاح: ${r.bad} → ${fix.word}`) }
      await sleep(250)
    }
  }

  /* 3) جمل المحتوى بكلمات لاتينية */
  const lc = JSON.parse((await req(`${SB}/rest/v1/articles?select=id,content_ar&content_ar=like.*%20*&status=eq.PUBLISHED&limit=200`, 'GET', H)).d)
    .filter((a) => /[A-Za-z]{4,}/.test(a.content_ar || ''))
  log(`مقالات محتواها فيه لاتيني: ${lc.length}`)
  for (const a of lc.slice(0, 40)) {
    const sentences = (a.content_ar || '').split(/\n|(?<=[.؟!])\s+/).filter((s) => /[A-Za-z]{4,}/.test(s)).slice(0, 4)
    if (!sentences.length) continue
    const resp = await nimJSON(`انقح الأسماء اللاتينية في الجمل العربية التالية إلى العربية (اكتب الاسم بالحروف العربية)، واستبدل الكلمات الإنجليزية بمرادف عربي. لا تغيّر أي شيء آخر إطلاقاً — نفس الجملة حرفياً مع الانقحار فقط. أعد JSON فقط: {"items":[{"key":"<فهرس>","text":"..."}]}. الجمل:\n${JSON.stringify(sentences.map((s, ix) => ({ key: String(ix), text: s })))}`)
    const items = (resp && resp.items) || []
    let content = a.content_ar
    let changed = false
    for (let ix = 0; ix < sentences.length; ix++) {
      const f = items.find((x) => String(x.key) === String(ix))
      if (f && f.text && !/[A-Za-z]{4,}/.test(f.text) && content.includes(sentences[ix])) {
        content = content.split(sentences[ix]).join(f.text)
        changed = true
      }
    }
    if (changed && (await patchArticle(a.id, { content_ar: content, content_ku: content }))) {
      log(`✓ محتوى منقح: ${a.id}`)
    }
    await sleep(400)
  }

  log('=== اكتمل الترميم ===')
})()
