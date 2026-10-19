/**
 * repair-corruption-v2.cjs — ترميم شامل: كل المقالات التالفة (محتوى + ملخص) عبر NIM
 */
const https = require('https')
const fs = require('fs')
const secrets = JSON.parse(fs.readFileSync('D:/ui/iraqnow/ai-worker/.deploy.secrets.json', 'utf8'))
const NIM_KEY = secrets.NIM_KEY
const K = 'sb_publishable_-MsvXS3OevPwi4bbRSyNJw_O29W7-1i'
const SB = 'https://xtdrkziyndkvaxkxvfqx.supabase.co'
const LOG = 'D:/ui/iraqnow/scripts/repair2.log'
const say = (m) => { fs.appendFileSync(LOG, m + '\n') }

function req(url, method, headers, body, timeout = 90000) {
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

async function nimFix(text) {
  for (let t = 0; t < 2; t++) {
    const r = await req('https://integrate.api.nvidia.com/v1/chat/completions', 'POST', {
      Authorization: `Bearer ${NIM_KEY}`, 'Content-Type': 'application/json', Accept: 'application/json',
    }, JSON.stringify({
      model: 'nvidia/nemotron-3-super-120b-a12b',
      messages: [{ role: 'user', content: 'detailed thinking off. النص العربي التالي يحتوي أحرفاً مفقودة مُشاراً لها بـ \uFFFD. أعد النص كاملاً مع إصلاح كل كلمة تالفة باستنتاج الحرف الصحيح من السياق. لا تغيّر أي كلمة سليمة إطلاقاً. أعد JSON فقط: {"text":"النص المصحح كاملاً"}\n\nالنص:\n' + text }],
      temperature: 0.1, top_p: 0.9, max_tokens: 6000,
    }))
    if (r.s !== 200) { await new Promise((x) => setTimeout(x, 3000)); continue }
    try {
      const content = JSON.parse(r.d).choices[0].message.content
      const m = content.match(/\{[\s\S]*\}/)
      const parsed = JSON.parse(m[0])
      if (parsed.text && !/\uFFFD/.test(parsed.text)) return parsed.text
    } catch { /* retry */ }
    await new Promise((x) => setTimeout(x, 2500))
  }
  return null
}

;(async () => {
  fs.writeFileSync(LOG, '')
  say('=== ترميم شامل — بدء ===')

  /* كل المقالات بأي حقل تالف */
  const all = JSON.parse((await req(`${SB}/rest/v1/articles?select=id,title_ar,excerpt_ar,content_ar&limit=10000`, 'GET', H)).d)
  const bad = all.filter((a) => /\uFFFD/.test(a.title_ar || '') || /\uFFFD/.test(a.excerpt_ar || '') || /\uFFFD/.test(a.content_ar || ''))
  say(`مقالات تالفة: ${bad.length}`)

  let fixed = 0, failed = 0
  for (const a of bad) {
    const patch = {}
    /* المحتوى */
    if (/\uFFFD/.test(a.content_ar || '')) {
      const t = await nimFix(a.content_ar)
      if (t && t.length > (a.content_ar.length * 0.6) && t.length < (a.content_ar.length * 1.5)) patch.content_ar = t.trim()
    }
    /* الملخص */
    if (/\uFFFD/.test(a.excerpt_ar || '')) {
      const t2 = await nimFix(a.excerpt_ar)
      if (t2 && t2.length < (a.excerpt_ar.length * 1.6 + 80)) patch.excerpt_ar = t2.trim()
    }
    /* العنوان */
    if (/\uFFFD/.test(a.title_ar || '')) {
      const t3 = await nimFix(a.title_ar)
      if (t3 && t3.length <= 200 && !/\uFFFD/.test(t3)) { patch.title_ar = t3.trim(); patch.title_ku = t3.trim() }
    }
    if (Object.keys(patch).length) {
      const p = await req(`${SB}/rest/v1/articles?id=eq.${encodeURIComponent(a.id)}`, 'PATCH', { ...H, Prefer: 'return=minimal' }, JSON.stringify(patch))
      if (p.s >= 200 && p.s < 300) { fixed++; say(`✓ ${a.id}`) } else { failed++; say(`✗ PATCH ${p.s} ${a.id}`) }
    } else { failed++; say(`✗ رفض ترميم ${a.id}`) }
    await new Promise((x) => setTimeout(x, 800))
  }

  /* تنظيف نهائي: إزالة أي FFFD باقٍ (حرفاً محذوفاً — أفضل من رمز مكسور) */
  const remain = JSON.parse((await req(`${SB}/rest/v1/articles?select=id,content_ar,excerpt_ar,title_ar&limit=10000`, 'GET', H)).d)
    .filter((a) => /\uFFFD/.test(a.title_ar || '') || /\uFFFD/.test(a.excerpt_ar || '') || /\uFFFD/.test(a.content_ar || ''))
  say(`بقايا: ${remain.length}`)
  for (const a of remain) {
    const strip = (t) => String(t || '').replace(/\uFFFD+/g, '').trim()
    const p = await req(`${SB}/rest/v1/articles?id=eq.${encodeURIComponent(a.id)}`, 'PATCH', { ...H, Prefer: 'return=minimal' },
      JSON.stringify({ title_ar: strip(a.title_ar), excerpt_ar: strip(a.excerpt_ar), content_ar: strip(a.content_ar), content_ku: strip(a.content_ar) }))
    say(`${p.s < 300 ? '✓ نظّف' : '✗'} ${a.id}`)
  }

  const left = JSON.parse((await req(`${SB}/rest/v1/articles?select=id&limit=10000`, 'GET', H)).d)
    .filter((a) => /\uFFFD/.test(a.title_ar || '') || /\uFFFD/.test(a.excerpt_ar || '') || /\uFFFD/.test(a.content_ar || ''))
  say(`=== النتيجة: رُمّمت ${fixed} | بقايا نهائية: ${left.length} ===`)
  process.exit(0)
})()
