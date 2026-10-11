/**
 * تجهيز مجلد النشر على Cloudflare Pages (Advanced Mode)
 * + كاش استجابة HTML باستخدام Cache API (يحل مشكلة 1102/CPU)
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

/* 3) قراءة الـ worker وإزالة صادرات Durable Objects */
let worker = readFileSync(join(OPEN_NEXT, 'worker.js'), 'utf8')
worker = worker.replace(/\/\/\s*@ts-expect-error[^\n]*\n\s*export \{[^}]+\} from "\.\/\.build\/[^"]+";?\n?/g, '')
worker = worker.replace(/^\s*export \{[^}]+\} from "\.\/\.build\/[^"]+";?\s*$/gm, '')

/* 4) حقن خدمة الأصول الثابتة (صور/خطوط/ملفات) */
const staticAssetPatch = `
            if ((request.method === "GET" || request.method === "HEAD") && env.ASSETS !== void 0 && (url.pathname.startsWith("/_next/static/") || /\\.(css|js|mjs|svg|png|jpg|jpeg|gif|webp|avif|ico|woff|woff2|ttf|otf|eot|map|json|webmanifest|xml|txt)$/i.test(url.pathname))) {
                const assetRes = await env.ASSETS.fetch(request);
                if (assetRes.status !== 404) {
                    return assetRes;
                }
            }`

const needleUrl = 'const url = new URL(request.url);'
if (worker.includes(needleUrl)) {
  worker = worker.replace(needleUrl, () => needleUrl + staticAssetPatch)
  console.log('✓ static asset serving injected')
}

/* 5) تحويل export default إلى متغير داخلي + إضافة كاش استجابة HTML */
worker = worker.replace('export default {', 'const _innerHandler = {')

const cacheWrapper = `

/* ═══════════ كاش استجابة HTML — يحل مشكلة 1102/CPU ═══════════ */
const _pageCache = caches.default;
const _CACHE_TTL = 60;

export default {
  async fetch(request, env, ctx) {
    /* طلبات غير GET أو API أو admin → مباشرة بدون كاش */
    if (request.method !== "GET") {
      return _innerHandler.fetch(request, env, ctx);
    }
    const _ckUrl = new URL(request.url);
    if (_ckUrl.pathname.startsWith("/api/") || _ckUrl.pathname.startsWith("/admin")) {
      return _innerHandler.fetch(request, env, ctx);
    }

    /* البحث في كاش الصفحات */
    try {
      const _ckReq = new Request(_ckUrl.toString(), { method: "GET", headers: request.headers });
      const _cached = await _pageCache.match(_ckReq);
      if (_cached) {
        return _cached;
      }
    } catch { /* تجاهل أخطاء الكاش */ }

    /* إعادة التوجيه للمعالج الأصلي */
    const _response = await _innerHandler.fetch(request, env, ctx);

    /* تخزين الاستجابات الناجحة */
    if (_response.status === 200 && _response.headers.get("Content-Type")?.includes("text/html")) {
      try {
        const _clone = _response.clone();
        _clone.headers.set("Cache-Control", "public, max-age=60, stale-while-revalidate=300");
        ctx.waitUntil(_pageCache.put(new Request(_ckUrl.toString(), { method: "GET" }), _clone));
      } catch { /* تجاهل */ }
    }

    return _response;
  }
};
`

worker += cacheWrapper
writeFileSync(join(OUT, '_worker.js'), worker)
console.log('✓ _worker.js created with response cache')

/* 6) وحدات التشغيل */
for (const dir of ['cloudflare', 'middleware', 'server-functions']) {
  if (existsSync(join(OPEN_NEXT, dir))) {
    cpSync(join(OPEN_NEXT, dir), join(OUT, dir), { recursive: true })
    console.log(`✓ ${dir}/ copied`)
  }
}

/* 7) إزالة package.json من الجذر */
const badPkg = join(OUT, 'package.json')
if (existsSync(badPkg)) {
  try { rmSync(badPkg) } catch { /* ignore */ }
}

console.log('')
console.log('✅ Done! Deploy with:')
console.log('   npx wrangler pages deploy pages-deploy --project-name=iraqnow --commit-dirty=true')
