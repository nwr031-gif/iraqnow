# العراق الآن | Iraq Now

منصة إخبارية عراقية حديثة — ثنائية اللغة (عربي/إنجليزي)، بخريطة تفاعلية ثلاثية الأبعاد، مركز بيانات، بحث نصي كامل، ومحرك نشر آلي يعمل على مدار الساعة.

**الموقع الحي**: https://iraqnow.pages.dev

---

## البنية التقنية

| الطبقة | التقنية |
|--------|---------|
| الواجهة | Next.js 16 (App Router) + TypeScript + Tailwind CSS v4 |
| الخريطة | Three.js — نموذج عراق ثلاثي الأبعاد مُبسَّط |
| البحث | Meilisearch (مُزامَن أثناء البناء) |
| قاعدة البيانات | Supabase (REST + RLS) |
| الاستضافة | Cloudflare Pages — وضع Advanced (`_worker.js`) |
| محرك النشر الآلي | Cloudflare Worker منفصل (`ai-worker/`) + NVIDIA NIM |
| النشر التلقائي | GitHub Actions (`repository_dispatch` من المحرك) |

## التشغيل المحلي

```bash
# المتطلبات: Node.js 22+
npm ci

# متغيرات البيئة — أنشئ .env (انظر قسم الأسرار)
npm run dev          # التطوير على 3000

# البناء الكامل + المزامنة
npm run build:pages  # next build → opennext → prepare → extract → meili sync

# النشر (يقرأ wrangler.toml)
npx wrangler pages deploy pages-deploy --project-name=iraqnow --commit-dirty=true
```

## النشر على Cloudflare Pages

1. المشروع مربوط بحساب Cloudflare عبر `wrangler pages deploy` (وضع Direct Upload).
2. متغيرات البيئة مضبوطة في إعدادات المشروع (deployment_configs) — انظر القسم أدناه.
3. `_routes.json` يوجّه: الـ Worker فقط لـ `/api/*`, `/admin*`, `/ar/auth/*`... والبقية ملفات ثابتة من CDN.
4. GitHub Actions (`.github/workflows/auto-deploy.yml`) يعيد البناء والنشر تلقائياً عند وصول محتوى جديد (`repository_dispatch: content-update`).

## متغيرات البيئة المطلوبة

### عامة (متاحة للبناء والواجهة)
| المتغير | الغرض |
|---------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` / `NEXT_PUBLIC_SUPABASE_ANON_KEY` | قاعدة البيانات |
| `NEXT_PUBLIC_APP_URL` | النطاق الأساسي (canonical) |
| `MEILISEARCH_HOST` / `MEILISEARCH_SEARCH_KEY` | البحث (قراءة) |

### سرية (خادم فقط)
| المتغير | الغرض |
|---------|-------|
| `MEILISEARCH_ADMIN_KEY` | مزامنة الفهرس |
| `ADMIN_PASSWORD` | كلمة مرور لوحة التحكم |
| `ADMIN_COOKIE_SECRET` | ملح توقيع كوكي الإدارة |
| `TURNSTILE_SECRET_KEY` / `RESEND_API_KEY` | النماذج والبريد (إن فعّلتها) |

> ⚠️ لا تضع أي مفتاح سري في ملفات الكود المرفوعة. جميع الأسرار تُضبط في: Cloudflare Pages Settings → Environment variables، وملف `.env` المحلي (مستثنى من Git).

## لوحة التحكم

`https://iraqnow.pages.dev/admin` — الدخول بكلمة المرور (كوكي موقّع HMAC، صالح 30 يوماً).

- حماية مزدوجة: middleware على الحافة (`src/proxy.ts`) + تحقق خادمي في التخطيط وواجهات API.
- إدارة: المقالات، الأقسام، البودكاست، الوسائط، الإعدادات.

## محرك النشر الآلي (`ai-worker/`)

Cloudflare Worker بجدولة كل 30 دقيقة:
1. يقرأ 16 مصدر RSS (تدوير 6 مصادر/تشغيلة).
2. يجمع القصص المتشابهة ويجلب النص الكامل (بحث مكثف).
3. يكتب التقرير عبر NVIDIA NIM (`nemotron-3-super-120b`) مع احتياطي Cloudflare Workers AI.
4. يضبط التصنيف والمحافظة والصورة عالية الدقة وينسب المصادر.
5. ينشر في Supabase ويُطلق إعادة نشر الموقع.

اختبار يدوي: `POST https://iraqnow-ai.<subdomain>.workers.dev/trigger` مع ترويسة `x-trigger-key`.

## بنية المجلدات

```
src/app/[locale]/     صفحات الموقع (رئيسية، latest، data، map، article، category...)
src/app/admin/        لوحة التحكم (محمية)
src/app/api/          واجهات API (search, articles, admin-login, ...)
src/components/       مكونات الواجهة (home, map, data, admin, ui...)
src/lib/              طبقة البيانات (supabase-store, data, meilisearch, admin-auth...)
ai-worker/            محرك النشر الآلي
scripts/              أدوات البناء والنشر والفحص
supabase/schema.sql   مخطط قاعدة البيانات
```

## الاختبار

```bash
node scripts/smoke-test.cjs                    # فحص شامل على النطاق الحي
node scripts/smoke-test.cjs http://localhost:8788   # على بيئة محلية
node scripts/verify-clean.js                   # فحص حالات الفراغ والتنظيف
```

يغطي فحص الدخان: الصفحات الأساسية، SEO (JSON-LD/OG/alt)، البحث الحقيقي، التحويلات، 404، الأداء (زمن استجابة فعلي)، وحماية واجهات الإدارة.

## حدود معروفة

- الأداء المقاس بـ curl (زمن استجابة كامل): الصفحات 240–1400ms — أقل من هدف LCP=2.5s. لم تُشغَّل أداة Lighthouse في هذه البيئة؛ يُنصح بتشغيل PageSpeed Insights يدوياً للحصول على درجات Core Web Vitals الرسمية.
- محرك الذكاء الاصطناعي مجاني (NVIDIA NIM) — عند استنزاف الحصة يتحول تلقائياً لاحتياطي Cloudflare.
- عدّادات القراءة تُحدَّث عند زيارات المقالات (تحتاج إعادة نشر لتظهر في الصفحات الثابتة).
