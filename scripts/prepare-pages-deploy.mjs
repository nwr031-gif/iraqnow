/**
 * تجهيز مجلد النشر على Cloudflare Pages (Advanced Mode)
 * Prepares the Pages deploy directory with _worker.js + static assets
 */
import { cpSync, mkdirSync, readFileSync, writeFileSync, rmSync, existsSync } from 'fs'
import { join } from 'path'

const OUT = 'pages-deploy'
const OPEN_NEXT = '.open-next'

if (!existsSync(OPEN_NEXT)) {
  console.error('❌ .open-next not found — run `npx opennextjs-cloudflare build` first')
  process.exit(1)
}

console.log('📦 Preparing Pages deploy directory...')

/* 1) تنظيف */
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

/* 2) الأصول الثابتة */
cpSync(join(OPEN_NEXT, 'assets'), OUT, { recursive: true })
console.log('✓ Static assets copied')

/* 3) _worker.js مع إزالة صادرات Durable Objects (غير مدعومة في Pages advanced mode) */
let worker = readFileSync(join(OPEN_NEXT, 'worker.js'), 'utf8')
worker = worker.replace(/\/\/\s*@ts-expect-error[^\n]*\n\s*export \{[^}]+\} from "\.\/\.build\/[^"]+";?\n?/g, '')
/* إزالة أي أسطر export متبقية لـ .build */
worker = worker.replace(/^\s*export \{[^}]+\} from "\.\/\.build\/[^"]+";?\s*$/gm, '')
writeFileSync(join(OUT, '_worker.js'), worker)
console.log('✓ _worker.js created')

/* 4) وحدات التشغيل */
for (const dir of ['cloudflare', 'middleware', 'server-functions']) {
  if (existsSync(join(OPEN_NEXT, dir))) {
    cpSync(join(OPEN_NEXT, dir), join(OUT, dir), { recursive: true })
    console.log(`✓ ${dir}/ copied`)
  }
}

/* 5) إزالة ملف package.json من الجذر إن وجد (قد يفسر خطأً) */
const badPkg = join(OUT, 'package.json')
if (existsSync(badPkg)) {
  try { rmSync(badPkg) } catch { /* ignore */ }
}

console.log('')
console.log('✅ Done! Deploy with:')
console.log('   npx wrangler pages deploy pages-deploy --project-name=iraqnow --commit-dirty=true')
