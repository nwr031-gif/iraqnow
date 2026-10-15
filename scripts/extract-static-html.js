/**
 * يستخرج صفحات HTML المُسبقة التصيير من مخرجات بناء Next.js إلى pages-deploy
 * + sitemap.xml + _redirects + _routes.json — بدون زحف أو خادم محلي
 */
const fs = require('fs')
const path = require('path')

const SRC = path.join(__dirname, '..', '.next', 'server', 'app')
const DEST = path.join(__dirname, '..', 'pages-deploy')

/* مفاتيح الجذر فقط — كي لا تُستبعد ar/author/admin.html */
const SKIP_EXACT = ['_global-error', '_not-found', '_error', 'favicon', 'admin']

function walk(dir, base = '') {
  const entries = fs.readdirSync(dir, { withFileTypes: true })
  const results = []
  for (const entry of entries) {
    const full = path.join(dir, entry.name)
    const rel = base ? `${base}/${entry.name}` : entry.name
    if (entry.isDirectory()) {
      results.push(...walk(full, rel))
    } else if (entry.name.endsWith('.html')) {
      results.push({ full, rel })
    }
  }
  return results
}

const files = walk(SRC)
let saved = 0

for (const { full, rel } of files) {
  const name = rel.replace(/\.html$/, '')
  if (SKIP_EXACT.includes(name)) continue

  const html = fs.readFileSync(full, 'utf-8')
  if (!html || html.length < 500) continue

  const destFile = path.join(DEST, rel)
  fs.mkdirSync(path.dirname(destFile), { recursive: true })
  fs.writeFileSync(destFile, html)
  saved++
}

/* sitemap.xml — من مخرجات البناء */
let sitemap = false
const sitemapBody = path.join(SRC, 'sitemap.xml.body')
if (fs.existsSync(sitemapBody)) {
  const body = fs.readFileSync(sitemapBody)
  if (body.length > 100) {
    fs.writeFileSync(path.join(DEST, 'sitemap.xml'), body)
    sitemap = true
  }
}

/* 404.html — صفحة عدم الوجود (اصطلاح Cloudflare Pages) */
const notFoundSrc = path.join(SRC, '_not-found.html')
if (fs.existsSync(notFoundSrc)) {
  const nf = fs.readFileSync(notFoundSrc)
  if (nf.length > 300) {
    fs.writeFileSync(path.join(DEST, '404.html'), nf)
    console.log('✓ 404.html written')
  }
}

/* _headers — ترويسات الأمان للأصول الثابتة (تُطبَّق من Cloudflare Pages مباشرة) */
const CSP = "default-src 'self'; script-src 'self' 'unsafe-inline' 'unsafe-eval' https://static.cloudflareinsights.com https://cloud.umami.is https://cdn.onesignal.com https://challenges.cloudflare.com https://giscus.app; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://giscus.app; font-src 'self' https://fonts.gstatic.com https://giscus.app; img-src 'self' data: blob: https:; connect-src 'self' https://*.supabase.co https://ms-7fba9866c156-55153.par.meilisearch.io https://cloud.umami.is https://api.onesignal.com https://onesignal.com https://giscus.app https://api.resend.com wss://*.onesignal.com; frame-src https://challenges.cloudflare.com https://giscus.app https://onesignal.com; worker-src 'self' blob:; manifest-src 'self'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'"
const HEADERS = `/*
  X-DNS-Prefetch-Control: on
  X-Content-Type-Options: nosniff
  Referrer-Policy: strict-origin-when-cross-origin
  Strict-Transport-Security: max-age=63072000; includeSubDomains
  X-Frame-Options: DENY
  Permissions-Policy: camera=(), microphone=(), geolocation=(self), browsing-topics=()
  Content-Security-Policy: ${CSP}

/_next/static/*
  Cache-Control: public, max-age=31536000, immutable

/api/*
  Access-Control-Allow-Origin: *
  Access-Control-Allow-Methods: GET,POST,PUT,PATCH,DELETE,OPTIONS
  Access-Control-Allow-Headers: X-CSRF-Token, X-Requested-With, Content-Type, Authorization
`
fs.writeFileSync(path.join(DEST, '_headers'), HEADERS)
console.log('✓ _headers written')

/* _redirects — تحويل الجذر والمسارات بدون لغة إلى /ar + الكردية إلى العربية */
const barePaths = ['about', 'contact', 'data', 'editorial-policy', 'latest', 'map', 'newsletter', 'podcasts', 'privacy', 'search', 'terms', 'trending']
const redirects = [
  '/ /ar 302',
  '/ku /ar 302',
  '/ku/* /ar/:splat 302',
  ...barePaths.map((p) => `/${p} /ar/${p} 302`),
].join('\n') + '\n'
fs.writeFileSync(path.join(DEST, '_redirects'), redirects)

/* _routes.json — الـ Worker للمسارات الديناميكية + الصفحات اللحظية */
const routesJson = {
  version: 1,
  include: [
    '/api/*',
    '/admin',
    '/admin/*',
    '/ar/auth/*',
    '/ku/auth/*',
    '/en/auth/*',
    '/rss',
    '/rss.xml',
    '/feed.xml',
    '/robots.txt',
    '/google8b47612b653ee80a.html',
    '/news-sitemap.xml',
    /* صفحات لحظية: تُصنع عند الطلب (ظهور فوري للمقالات الجديدة) */
    '/ar/article/*',
    '/en/article/*',
    '/ar/latest',
    '/en/latest',
  ],
  exclude: [],
}
fs.writeFileSync(path.join(DEST, '_routes.json'), JSON.stringify(routesJson, null, 2))

console.log(`📊 ${saved} static HTML pages extracted`)
console.log(`${sitemap ? '✓' : '✗'} sitemap.xml ${sitemap ? 'extracted' : 'MISSING'}`)
console.log(`✓ _redirects written (${barePaths.length + 1} rules)`)
console.log(`✓ _routes.json: worker only for ${routesJson.include.length} patterns`)
