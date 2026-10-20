/**
 * deploy-verified.cjs — بناء ونشر مع تحقق من مسار ops (إعادة حتى النجاح)
 * الاستخدام: node scripts/deploy-verified.cjs  (نفّذ build:pages أولاً يدوياً أو ضمن السكربت)
 */
const { execSync } = require('child_process')
const https = require('https')

function req(hostname, path, method, headers, body, timeout = 90000) {
  return new Promise((r) => {
    const q = https.request({ hostname, path, method, headers, timeout }, (x) => {
      let d = ''
      const sc = x.headers['set-cookie'] || []
      x.on('data', (c) => (d += c))
      x.on('end', () => r({ s: x.statusCode, d, cookies: sc.map((c) => c.split(';')[0]).join('; ') }))
    })
    q.on('error', (e) => r({ s: 0, d: e.message }))
    if (body) q.write(JSON.stringify(body))
    q.end()
  })
}

async function opsOk(host) {
  try {
    const l = await req(host, '/api/admin-login', 'POST', { 'Content-Type': 'application/json' }, { password: process.env.ADMIN_PASSWORD || 'Noor07813415176@@' })
    if (l.s !== 200) return false
    const r = await req(host, '/api/admin/ops', 'POST', { 'Content-Type': 'application/json', Cookie: l.cookies }, { action: 'analyze' })
    return r.s === 200
  } catch { return false }
}

;(async () => {
  const env = { ...process.env }
  for (let attempt = 1; attempt <= 4; attempt++) {
    console.log(`=== المحاولة ${attempt}: نشر ===`)
    try {
      execSync('npx wrangler pages deploy pages-deploy --project-name=iraqnow --commit-dirty=true', { stdio: 'pipe', env, cwd: 'D:/ui/iraqnow', timeout: 600000 })
    } catch (e) { console.log('نشر فشل:', String(e).slice(0, 100)); continue }
    console.log('انتشار 40 ثانية...')
    await new Promise((r) => setTimeout(r, 40000))
    /* اختبر على الإنتاج وعلى رابط النشر إن وُجد */
    const prodOk = await opsOk('iraqnow.pages.dev')
    console.log(`الإنتاج: ops ${prodOk ? '200 ✓' : '404 ✗'}`)
    if (prodOk) { console.log('=== نجاح — النشر سليم ==='); process.exit(0) }
    /* أعد البناء (غير حتمي — قد تُسقط Turbopack المسار) */
    console.log('إعادة البناء النظيف...')
    try {
      execSync('node -e "require(\'fs\').rmSync(\'D:/ui/iraqnow/.next\',{recursive:true,force:true})"', { stdio: 'pipe' })
      execSync('npm run build:pages', { stdio: 'pipe', env: { ...process.env }, cwd: 'D:/ui/iraqnow', timeout: 900000 })
    } catch (e) { console.log('بناء فشل:', String(e).slice(0, 100)) }
  }
  console.log('✗ لم ينجح بعد 4 محاولات')
  process.exit(1)
})()
