/**
 * repair-full.cjs — ترميم نص كامل للمقالات الأربع (NIM يصلح كل الأحرف المكسورة دفعة واحدة)
 */
const https = require('https')
const fs = require('fs')
const K = 'sb_publishable_-MsvXS3OevPwi4bbRSyNJw_O29W7-1i'
const SB = 'https://xtdrkziyndkvaxkxvfqx.supabase.co'
const NIM_KEY = JSON.parse(fs.readFileSync('D:/ui/iraqnow/ai-worker/.deploy.secrets.json', 'utf8')).NIM_KEY

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
  const r = await req('https://integrate.api.nvidia.com/v1/chat/completions', 'POST', {
    Authorization: `Bearer ${NIM_KEY}`, 'Content-Type': 'application/json', Accept: 'application/json',
  }, JSON.stringify({
    model: 'nvidia/nemotron-3-super-120b-a12b',
    messages: [{ role: 'user', content: 'detailed thinking off. النص العربي التالي يحتوي أحرفاً مفقودة مُشاراً لها بـ \uFFFD. أعد النص كاملاً مع إصلاح كل كلمة تالفة باستنتاج الحرف الصحيح من السياق. لا تغيّر أي كلمة سليمة إطلاقاً — أعد النص حرفياً مع إصلاح التالف فقط. أعد JSON فقط: {"text":"النص المصحح كاملاً"}\n\nالنص:\n' + text }],
    temperature: 0.1, top_p: 0.9, max_tokens: 6000,
  }))
  if (r.s !== 200) return null
  try {
    const content = JSON.parse(r.d).choices[0].message.content
    const m = content.match(/\{[\s\S]*\}/)
    const parsed = JSON.parse(m[0])
    return parsed.text || null
  } catch { return null }
}

;(async () => {
  const say = (m) => { console.log(m); fs.appendFileSync('D:/ui/iraqnow/scripts/rf.log', m + '\n') }
  try {
  const arts = JSON.parse((await req(`${SB}/rest/v1/articles?select=id,content_ar&content_ar=like.*%EF%BF%BD*&limit=10`, 'GET', H)).d)
  say('للترميم الكامل: ' + arts.length)
  for (const a of arts) {
    const fixed = await nimFix(a.content_ar)
    const ok = fixed && !/\uFFFD/.test(fixed) && fixed.length > (a.content_ar.length * 0.7) && fixed.length < (a.content_ar.length * 1.4)
    if (ok) {
      const p = await req(`${SB}/rest/v1/articles?id=eq.${encodeURIComponent(a.id)}`, 'PATCH',
        { ...H, Prefer: 'return=minimal' },
        JSON.stringify({ content_ar: fixed.trim(), content_ku: fixed.trim() }))
      say((p.s >= 200 && p.s < 300 ? '✓' : '✗ ' + p.s) + ' | ' + a.id)
    } else {
      say('✗ رفض الترميم | ' + a.id + ' | fixed: ' + (fixed ? fixed.length : 'null'))
    }
    await sleep(1500)
  }
  function sleep(ms) { return new Promise((r) => setTimeout(r, ms)) }

  const left = JSON.parse((await req(`${SB}/rest/v1/articles?select=id&or=(content_ar.like.*%EF%BF%BD*,title_ar.like.*%EF%BF%BD*,excerpt_ar.like.*%EF%BF%BD*)&limit=10`, 'GET', H)).d)
  say('المتبقي نهائياً: ' + left.length)
  } catch (e) { fs.appendFileSync('D:/ui/iraqnow/scripts/rf.log', 'CRASH: ' + e.message + '\n') }
})()
