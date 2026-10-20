/**
 * نشر عامل الذكاء الاصطناعي مباشرة عبر Cloudflare API (بدون wrangler)
 * الاستخدام: node scripts/deploy-ai-worker.mjs
 * الأسرار تُقرأ من ai-worker/.deploy.secrets.json (غير مرفوع إلى git)
 */
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

const TOKEN = process.env.CF_API_TOKEN
const ACCOUNT = process.env.CF_ACCOUNT_ID
const WORKER = 'iraqnow-ai'
const ROOT = join(process.cwd(), 'ai-worker')

if (!TOKEN || !ACCOUNT) {
  console.error('❌ CF_API_TOKEN / CF_ACCOUNT_ID مطلوبان')
  process.exit(1)
}

const secretsPath = join(ROOT, '.deploy.secrets.json')
if (!existsSync(secretsPath)) {
  console.error('❌ ai-worker/.deploy.secrets.json مفقود')
  process.exit(1)
}
const secrets = JSON.parse(readFileSync(secretsPath, 'utf8'))

const script = readFileSync(join(ROOT, 'src', 'index.js'), 'utf8')

const metadata = {
  main_module: 'index.js',
  compatibility_date: '2025-03-25',
  compatibility_flags: ['nodejs_compat'],
  bindings: [
    { type: 'ai', name: 'AI' },
    { type: 'plain_text', name: 'SUPABASE_URL', text: 'https://xtdrkziyndkvaxkxvfqx.supabase.co' },
    { type: 'plain_text', name: 'SUPABASE_KEY', text: 'sb_publishable_-MsvXS3OevPwi4bbRSyNJw_O29W7-1i' },
    { type: 'plain_text', name: 'AI_MODEL', text: '@cf/meta/llama-3.1-8b-instruct-fp8' },
    { type: 'plain_text', name: 'NIM_MODEL', text: 'nvidia/nemotron-3.5-lightning-30b-a3b' },
    { type: 'plain_text', name: 'SELF_TRIGGER_URL', text: 'https://iraqnow-ai.nwr04nwr04.workers.dev/trigger' },
    { type: 'plain_text', name: 'MAX_PER_RUN', text: '2' },
    { type: 'plain_text', name: 'MAX_AI_PER_DAY', text: '220' },
    { type: 'plain_text', name: 'GITHUB_REPO', text: 'nwr031-gif/iraqnow' },
    { type: 'secret_text', name: 'TRIGGER_KEY', text: secrets.TRIGGER_KEY },
    ...(secrets.NIM_KEY ? [{ type: 'secret_text', name: 'NIM_KEY', text: secrets.NIM_KEY }] : []),
    ...(secrets.GITHUB_TOKEN ? [{ type: 'secret_text', name: 'GITHUB_TOKEN', text: secrets.GITHUB_TOKEN }] : []),
  ],
  observability: { enabled: true },
}

const form = new FormData()
form.append('metadata', new Blob([JSON.stringify(metadata)], { type: 'application/json' }))
form.append('index.js', new File([script], 'index.js', { type: 'application/javascript+module' }))

console.log('📤 رفع العامل...')
const res = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/workers/scripts/${WORKER}`, {
  method: 'PUT',
  headers: { Authorization: `Bearer ${TOKEN}` },
  body: form,
})

const body = await res.json()
if (!res.ok || !body.success) {
  console.error('❌ فشل الرفع:', res.status, JSON.stringify(body.errors || body))
  process.exit(1)
}
console.log('✓ تم رفع العامل، id:', body.result?.id)

/* الجدولة: كل 30 دقيقة */
const sched = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/workers/scripts/${WORKER}/schedules`, {
  method: 'PUT',
  headers: { Authorization: `Bearer ${TOKEN}`, 'Content-Type': 'application/json' },
   body: JSON.stringify([{ cron: '*/10 * * * *' }]),
})
const schedBody = await sched.json()
console.log(sched.ok && schedBody.success ? '✓ الجدولة مفعّلة: كل 10 دقائق' : `⚠ الجدولة: ${sched.status}`)

/* تفعيل العامل على workers.dev */
const sub = await fetch(`https://api.cloudflare.com/client/v4/accounts/${ACCOUNT}/workers/subdomain`, {
  headers: { Authorization: `Bearer ${TOKEN}` },
})
const subBody = await sub.json()

console.log('')
console.log('✅ العامل جاهز!')
if (subBody.result?.subdomain) console.log(`   https://${WORKER}.${subBody.result.subdomain}.workers.dev`)
