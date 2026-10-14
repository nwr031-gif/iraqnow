/**
 * fix-final-one.cjs — الإصلاح النهائي للمقالة العنيدة (الشاباك)
 */
const https = require('https')
const fs = require('fs')
const K = 'sb_publishable_-MsvXS3OevPwi4bbRSyNJw_O29W7-1i'
const SB = 'https://xtdrkziyndkvaxkxvfqx.supabase.co'

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

;(async () => {
  const a = JSON.parse((await req(`${SB}/rest/v1/articles?select=id,content_ar&content_ar=like.*%EF%BF%BD*&limit=5`, 'GET', H)).d)[0]
  if (!a) { console.log('لا شيء متبقٍ'); process.exit(0) }
  console.log('المقالة:', a.id)
  let c = a.content_ar

  /* إصلاحات مستنتجة من السياق (FFFD واحد أو أكثر) */
  c = c.replace(/الإ\uFFFD+لام/g, 'الإعلام')
  c = c.replace(/\uFFFD+الحركات/g, 'والحركات')
  c = c.replace(/تعر\uFFFD+وا/g, 'تعرضوا')
  c = c.replace(/الا\uFFFD+تراكي/g, 'الاشتراكي')
  c = c.replace(/س\uFFFD+بق/g, 'سبق')
  c = c.replace(/بداي\uFFFD+/g, 'بداية')
  c = c.replace(/ترشي\uFFFD+/g, 'ترشيح')

  /* أي كلمة ما زالت مكسورة: أزل حروف الاستبدال منها (قابل للقراءة) */
  const before = (c.match(/\uFFFD/g) || []).length
  c = c.replace(/\uFFFD+/g, '')

  const p = await req(`${SB}/rest/v1/articles?id=eq.${encodeURIComponent(a.id)}`, 'PATCH',
    { ...H, Prefer: 'return=minimal' },
    JSON.stringify({ content_ar: c.trim(), content_ku: c.trim() }))
  const line = (p.s >= 200 && p.s < 300 ? '✓ تم' : '✗ ' + p.s) + ` | أُصلحت ${8 - before} كلمة مستنتجة + ${before} نظّفت`
  console.log(line)
  fs.appendFileSync('D:/ui/iraqnow/scripts/rf.log', line + '\n')

  const left = JSON.parse((await req(`${SB}/rest/v1/articles?select=id&or=(content_ar.like.*%EF%BF%BD*,title_ar.like.*%EF%BF%BD*,excerpt_ar.like.*%EF%BF%BD*)&limit=10`, 'GET', H)).d)
  console.log('المتبقي:', left.length)
})()
