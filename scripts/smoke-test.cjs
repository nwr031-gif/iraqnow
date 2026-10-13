/**
 * اختبار دخان شامل للمنصة — يُشغَّل على النطاق الحي
 * الاستخدام: node scripts/smoke-test.cjs [base-url]
 */
const https = require('https')

const BASE = process.argv[2] || 'https://iraqnow.pages.dev'
let pass = 0, fail = 0
const failures = []

function check(name, cond, detail = '') {
  if (cond) { pass++; console.log(`PASS  ${name}${detail ? ' — ' + detail : ''}`) }
  else { fail++; failures.push(name); console.log(`FAIL  ${name}${detail ? ' — ' + detail : ''}`) }
}

function get(path) {
  return new Promise((r) => {
    https.get(BASE + path, { timeout: 60000, headers: { 'User-Agent': 'iraqnow-smoke/1.0' } }, (x) => {
      let d = ''
      x.on('data', (c) => (d += c))
      x.on('end', () => r({ n: x.statusCode, d, ms: 0, h: x.headers }))
    }).on('error', () => r({ n: 0, d: '', ms: 0, h: {} }))
  })
}

async function timeGet(path) {
  const t0 = Date.now()
  const r = await get(path)
  return { ...r, ms: Date.now() - t0 }
}

;(async () => {
  console.log(`═══ فحص دخان: ${BASE} ═══\n[1] الصفحات الأساسية`)
  for (const p of ['/ar', '/en', '/ar/latest', '/ar/data', '/ar/map', '/ar/podcasts', '/ar/about', '/ar/team', '/ar/contact', '/ar/corrections', '/ar/fact-check', '/ar/privacy', '/ar/terms']) {
    const r = await timeGet(p)
    check(`GET ${p}`, r.n === 200 && r.d.length > 10000, `${r.n}, ${Math.round(r.d.length / 1024)}KB, ${r.ms}ms`)
  }

  console.log('\n[2] صفحة المقال + SEO')
  const home = await get('/ar')
  const slugM = home.d.match(/\/ar\/article\/([a-z0-9-]+)/)
  if (slugM) {
    const art = await get(`/ar/article/${slugM[1]}`)
    check('GET مقال', art.n === 200, slugM[1])
    check('NewsArticle JSON-LD', art.d.includes('"NewsArticle"'))
    check('Open Graph', art.d.includes('og:title'))
    check('canonical', art.d.includes('rel="canonical"'))
    check('alt للصور', !/<img(?![^>]*alt=)[^>]*>/.test(art.d.slice(art.d.indexOf('<article') >= 0 ? art.d.indexOf('<article') : 0)))
  } else {
    check('مقال متاح على الرئيسية', false, 'لا رابط مقال في الرئيسية')
  }

  console.log('\n[3] البحث الحقيقي')
  const s1 = JSON.parse((await get('/api/search?action=search&q=' + encodeURIComponent('العراق'))).d)
  check('نتائج عربية', (s1.estimatedTotalHits || 0) > 0, `${s1.estimatedTotalHits} نتيجة`)
  const s2 = JSON.parse((await get('/api/search?action=search&q=zzzznonexistent')).d)
  check('نتائج فارغة نظيفة', (s2.hits || []).length === 0)

  console.log('\n[4] التحويلات و404')
  const root = await new Promise((r) => {
    https.get(BASE + '/', { timeout: 30000 }, (x) => { x.resume(); r(x.statusCode + '|' + (x.headers.location || '')) }).on('error', () => r('0'))
  })
  check('/ → 302 /ar', root.startsWith('302') && root.includes('/ar'), root)
  const nf = await get('/ar/this-page-does-not-exist')
  check('404 لصفحة غير موجودة', nf.n === 404, `${nf.n}`)

  console.log('\n[5] الأداء (قياس فعلي TTFB + الحجم)')
  for (const p of ['/ar', '/ar/latest']) {
    const r = await timeGet(p)
    check(`زمن الاستجابة ${p}`, r.ms < 2500, `${r.ms}ms`)
  }

  console.log('\n[6] الأمان')
  const api = await get('/api/admin/articles/list')
  check('admin API محمي', api.n === 401, `status ${api.n}`)
  const h = (await get('/ar')).h
  check('HSTS', String(h['strict-transport-security'] || '').length > 0)
  check('X-Frame-Options / frame-ancestors', String(h['x-frame-options'] || h['content-security-policy'] || '').length > 0)

  console.log(`\n═══ النتيجة: ${pass} نجح / ${fail} فشل ═══`)
  if (failures.length) console.log('الفاشلات: ' + failures.join(' | '))
  process.exit(fail > 0 ? 1 : 0)
})()
