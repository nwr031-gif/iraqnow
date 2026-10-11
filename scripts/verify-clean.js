const https = require('https')

function get(url) {
  return new Promise((resolve, reject) => {
    https.get(url, { timeout: 60000 }, (res) => {
      let data = ''
      res.on('data', (c) => (data += c))
      res.on('end', () => resolve(data))
    }).on('error', reject)
  })
}

async function main() {
  const home = await get('https://iraqnow.pages.dev/ar')
  const latest = await get('https://iraqnow.pages.dev/ar/latest')
  const podcasts = await get('https://iraqnow.pages.dev/ar/podcasts')

  const checks = {
    home_coming_soon_state: home.includes('قريباً') && home.includes('نعمل على تقديم'),
    home_podcast_empty_state: home.includes('نحضّر لكم حوارات'),
    home_no_mock_article_1: !home.includes('مستقبل الاقتصاد العراقي'),
    home_no_mock_article_2: !home.includes('الموصل: عشر سنوات'),
    home_new_hero: home.includes('حيث يُروى الخبر كاملاً'),
    home_no_mock_breaking: !home.includes('عاجل الآن'),
    latest_empty_state: latest.includes('غرفة الأخبار تجهّز أول التقارير'),
    podcasts_empty_state: podcasts.includes('لا توجد حلقات منشورة بعد'),
  }

  let pass = 0, fail = 0
  for (const [k, v] of Object.entries(checks)) {
    console.log(`${v ? 'PASS' : 'FAIL'} ${k}`)
    v ? pass++ : fail++
  }
  console.log(`--- ${pass}/${pass + fail} ---`)
}

main().catch((e) => { console.error('ERROR', e.message); process.exit(1) })
