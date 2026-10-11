const https = require('https')

function head(url) {
  return new Promise((r) => {
    https.get(url, { timeout: 45000, headers: { 'User-Agent': 'Mozilla/5.0' } }, (x) => {
      x.resume()
      r(x.statusCode)
    }).on('error', () => r(0))
  })
}

const LINKS = [
  '/ar/latest', '/ar/map', '/ar/data', '/ar/podcasts', '/ar/archive',
  '/ar/about', '/ar/team', '/ar/editorial-policy', '/ar/fact-check', '/ar/careers', '/ar/contact',
  '/ar/app', '/ar/developers', '/ar/advertise', '/ar/partnerships', '/ar/licensing',
  '/ar/privacy', '/ar/terms',
]

;(async () => {
  const bad = []
  for (const l of LINKS) {
    const code = await head('https://iraqnow.pages.dev' + l)
    const ok = code === 200 || code === 301 || code === 302
    if (!ok) bad.push(l)
    console.log(`${ok ? 'OK  ' : '404!'} ${l} (${code})`)
  }
  console.log('\nالمكسورة:', bad.length ? bad.join(', ') : 'لا شيء')
})()
