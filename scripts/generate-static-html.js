/**
 * يزور كل الصفحات ويحفظ HTML ثابت + ينشئ _routes.json
 * الاستخدام: node scripts/generate-static-html.js (بعد تشغيل wrangler pages dev)
 */
const http = require('http')
const fs = require('fs')
const path = require('path')

const BASE = 'http://localhost:8788'
const OUT = path.resolve(__dirname, '..', 'pages-deploy')
const LOCALES = ['ar', 'ku', 'en']

const PATHS = [
  '/', '/podcasts', '/podcasts/post-oil-economy', '/latest', '/trending', '/search',
  '/map', '/data', '/newsletter', '/auth/signin',
  '/category/politics', '/category/economy', '/category/security', '/category/society',
  '/category/culture', '/category/sports', '/category/technology', '/category/health',
  '/category/education', '/category/environment', '/category/local', '/category/world',
  '/governorate/baghdad', '/governorate/basra', '/governorate/erbil', '/governorate/mosul',
  '/author/admin', '/author/zainab-almusawi', '/author/ahmed-alzubaidi',
  '/article/iraq-news-1-politics', '/article/iraq-news-2-economy',
  '/about', '/privacy', '/terms', '/contact', '/editorial-policy',
]

function fetchPage(url) {
  return new Promise((resolve, reject) => {
    http.get(url, { timeout: 30000 }, (res) => {
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        // Follow redirect
        const loc = res.headers.location.startsWith('http') ? res.headers.location : BASE + res.headers.location
        return fetchPage(loc).then(resolve).catch(reject)
      }
      let data = ''
      res.on('data', (chunk) => { data += chunk })
      res.on('end', () => resolve({ status: res.statusCode, body: data }))
    }).on('error', reject)
  })
}

async function main() {
  console.log('🌐 Crawling pages...\n')
  let ok = 0, fail = 0
  const savedPaths = []

  for (const locale of LOCALES) {
    for (const pagePath of PATHS) {
      const url = `${BASE}/${locale}${pagePath}`
      try {
        const { status, body } = await fetchPage(url)
        if (status !== 200) { fail++; continue }

        // Determine output path: /ar/podcasts → pages-deploy/ar/podcasts.html
        const htmlPath = pagePath === '/' ? `${locale}.html` : `${locale}${pagePath}.html`
        const fullHtmlPath = path.join(OUT, htmlPath)
        fs.mkdirSync(path.dirname(fullHtmlPath), { recursive: true })
        fs.writeFileSync(fullHtmlPath, body, 'utf8')
        savedPaths.push(`/${locale}${pagePath}`)
        ok++
      } catch (e) {
        fail++
        console.error(`✗ ${locale}${pagePath}: ${e.message}`)
      }
    }
  }

  // Root page (redirects to /ar)
  try {
    const { body } = await fetchPage(`${BASE}/ar`)
    fs.writeFileSync(path.join(OUT, 'index.html'), body, 'utf8')
    ok++
  } catch { fail++ }

  // Generate _routes.json — tell Cloudflare NOT to invoke worker for static pages
  const routes = {
    version: 1,
    include: ['/api/*', '/admin/*'],
    exclude: []
  }
  fs.writeFileSync(path.join(OUT, '_routes.json'), JSON.stringify(routes, null, 2), 'utf8')

  console.log(`\n📊 ${ok} pages saved as HTML, ${fail} failed`)
  console.log('✓ _routes.json: worker only for /api/*')
}

main().catch(console.error)
