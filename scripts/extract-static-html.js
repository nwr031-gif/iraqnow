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

/* _redirects — تحويل الجذر والمسارات بدون لغة إلى /ar (بدون Worker) */
const barePaths = ['about', 'contact', 'data', 'editorial-policy', 'latest', 'map', 'newsletter', 'podcasts', 'privacy', 'search', 'terms', 'trending']
const redirects = [
  '/ /ar 302',
  ...barePaths.map((p) => `/${p} /ar/${p} 302`),
].join('\n') + '\n'
fs.writeFileSync(path.join(DEST, '_redirects'), redirects)

/* _routes.json — الـ Worker فقط للمسارات الديناميكية */
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
  ],
  exclude: [],
}
fs.writeFileSync(path.join(DEST, '_routes.json'), JSON.stringify(routesJson, null, 2))

console.log(`📊 ${saved} static HTML pages extracted`)
console.log(`${sitemap ? '✓' : '✗'} sitemap.xml ${sitemap ? 'extracted' : 'MISSING'}`)
console.log(`✓ _redirects written (${barePaths.length + 1} rules)`)
console.log(`✓ _routes.json: worker only for ${routesJson.include.length} patterns`)
