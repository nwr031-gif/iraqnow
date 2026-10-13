const https = require('https')

function get(u) {
  return new Promise((r) => {
    https.get(u, { timeout: 60000 }, (x) => {
      let d = ''
      x.on('data', (c) => (d += c))
      x.on('end', () => r(d))
    }).on('error', () => r('ERR'))
  })
}

;(async () => {
  for (const q of ['العراق', 'ترامب', 'غزة', 'econom']) {
    const r = await get(`https://iraqnow.pages.dev/api/search?action=search&q=${encodeURIComponent(q)}&locale=ar`)
    try {
      const j = JSON.parse(r)
      console.log(`"${q}": ${j.estimatedTotalHits} نتيجة | أول: ${(j.hits[0]?.title_ar || j.hits[0]?.title_en || '—').slice(0, 60)}`)
    } catch {
      console.log(`"${q}": ERROR ${r.slice(0, 120)}`)
    }
  }
})()
