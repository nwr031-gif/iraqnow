/**
 * seed-indexnow.cjs — دفعة فهرسة فورية لأهم صفحات الموقع إلى Bing/Yandex
 */
const https = require('https')

const KEY = 'f60c98986db45620fc97ade3c65b3fcd'
const BASE = 'https://iraqnow.pages.dev'
const SB = 'https://xtdrkziyndkvaxkxvfqx.supabase.co'
const K = 'sb_publishable_-MsvXS3OevPwi4bbRSyNJw_O29W7-1i'

function post(url, headers, body) {
  return new Promise((r) => {
    const u = new URL(url)
    const q = https.request({ hostname: u.hostname, path: u.pathname + u.search, method: 'POST', headers, timeout: 30000 }, (x) => {
      let d = ''
      x.on('data', (c) => (d += c))
      x.on('end', () => r({ s: x.statusCode, d: d.slice(0, 150) }))
    })
    q.on('error', (e) => r({ s: 0, d: e.message }))
    if (body) q.write(body)
    q.end()
  })
}
function get(u) {
  return new Promise((r) => {
    https.get(u, { headers: { apikey: K, Authorization: `Bearer ${K}` }, timeout: 25000 }, (x) => {
      let d = ''
      x.on('data', (c) => (d += c))
      x.on('end', () => r(d))
    }).on('error', () => r('[]'))
  })
}

;(async () => {
  /* أهم 20 مقالة (الأحدث والأكثر تفاعلاً) + الصفحات الأساسية */
  const arts = JSON.parse(await get(`${SB}/rest/v1/articles?select=slug&status=eq.PUBLISHED&order=published_at.desc&limit=18`))
  const urls = [
    `${BASE}/ar`, `${BASE}/en`, `${BASE}/ar/latest`, `${BASE}/ar/data`, `${BASE}/ar/map`,
    ...arts.flatMap((a) => [`${BASE}/ar/article/${a.slug}`]),
  ]
  console.log('روابط للفهرسة:', urls.length)

  const res = await post('https://api.indexnow.org/indexnow', {
    'Content-Type': 'application/json; charset=utf-8',
  }, JSON.stringify({
    host: 'iraqnow.pages.dev',
    key: KEY,
    keyLocation: `${BASE}/api/indexnow`,
    urlList: urls,
  }))
  console.log('IndexNow response:', res.s, res.s === 200 || res.s === 202 ? '✓ قُبلت — Bing يزحف خلال ساعات' : res.d)
})()
