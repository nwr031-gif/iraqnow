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

/* 3.5) حقن خدمة الأصول الثابتة — في Pages advanced mode كل الطلبات تذهب للـ Worker،
   وطلب /_next/static/* يصل لخادم Next الذي يفشل في قراءة الملفات → 404.
   الحل: خدمة الأصول عبر env.ASSETS.fetch() قبل تمريرها لـ Next */
const staticAssetPatch = `
            // [iraqnow-patch] Pages advanced mode: serve static assets via ASSETS binding
            if ((request.method === "GET" || request.method === "HEAD") && env.ASSETS !== void 0 && (url.pathname.startsWith("/_next/static/") || /\\.(css|js|mjs|svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf|otf|eot|map)$/i.test(url.pathname))) {
                const assetRes = await env.ASSETS.fetch(request);
                if (assetRes.status !== 404) {
                    return assetRes;
                }
            }`

const needleUrl = 'const url = new URL(request.url);'
if (worker.includes(needleUrl)) {
  worker = worker.replace(needleUrl, () => needleUrl + staticAssetPatch)
  console.log('✓ static asset serving injected into _worker.js')
} else {
  console.log('⚠ could not find injection point in worker.js')
}

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
