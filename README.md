# IraqNow - بوابة العراق الإخبارية الشاملة

منصة إخبارية عراقية متعددة اللغات (العربية، الكردية، الإنكليزية) مبنية بتقنيات حديثة مع ميزات تفاعلية متقدمة.

## 🚀 المميزات الرئيسية

- **ثلاث لغات أصلية**: العربية، الكردية (السورانية)، الإنكليزية مع دعم RTL كامل
- **خرائط تفاعلية**: تصفح الأخبار جغرافياً على خريطة العراق مع طبقات المحافظات والأقضية
- **بحث متقدم**: Meilisearch مع دعم العربية والكردية، مرشحات، تصحيح إملائي، ومرادفات
- **نظام تعليقات**: تعليقات متسلسلة مع تصويت وإشارات مرجعية
- **إشعارات فورية**: WebSocket/Push notifications للأخبار العاجلة
- **صحف بيانات**: دatasets قابلة للتحميل، رسوم بيانية تفاعلية
- **نشرات بريدية**: اشتراك متعدد اللغات مع جدولة
- **تطبيقات PWA**: تثبيت على الهاتف، قراءة أوفلاين
- **SEO محسّن**: hreflang، structured data، sitemaps، RSS

## 🛠 التقنيات المستخدمة

| الطبقة | التقنية |
|----------|---------|
| **Frontend** | Next.js 15 (App Router)، React 19، TypeScript، Tailwind CSS v4 |
| **CMS/Backend** | Strapi v5 (Headless)، PostgreSQL (Supabase) |
| **قاعدة البيانات** | Prisma ORM، PostgreSQL |
| **البحث** | Meilisearch (مستضاف ذاتياً) |
| **المصادقة** | NextAuth v5 (Credentials، Google، Facebook) |
| **الوقت الحقيقي** | Socket.io / Pusher |
| **الاستضافة** | Cloudflare Pages + Workers |
| **قاعدة البيانات** | Supabase (PostgreSQL) |
| **الصور/الوسائط** | Cloudflare Images / Mux |
| **المراقبة** | Sentry، Logtail |

## 📦 بدء العمل

### المتطلبات
- Node.js 20+
- npm 10+
- حساب Supabase
- حساب Meilisearch Cloud
- حساب Cloudflare

### التثبيت

```bash
# استنساخ المستودع
git clone https://github.com/nwr031-gif/iraqnow.git
cd iraqnow

# تثبيت التبعيات
npm install

# إعداد متغيرات البيئة
cp .env.example .env
# عدل .env بمفاتيحك

# إعداد قاعدة البيانات
npm run db:generate
npm run db:push
npm run db:seed

# إعداد فهارس البحث
npm run search:setup

# تشغيل بيئة التطوير
npm run dev
```

### متغيرات البيئة المطلوبة

```env
# Meilisearch
MEILISEARCH_HOST=https://your-meilisearch.par.meilisearch.io
MEILISEARCH_MASTER_KEY=your-master-key
MEILISEARCH_ADMIN_KEY=your-admin-key
MEILISEARCH_SEARCH_KEY=your-search-key

# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32

# OAuth (اختياري)
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
FACEBOOK_CLIENT_ID=
FACEBOOK_CLIENT_SECRET=

# Strapi (عند النشر)
NEXT_PUBLIC_STRAPI_URL=
STRAPI_API_TOKEN=
```

## 📁 هيكل المشروع

```
src/
├── app/
│   ├── [locale]/           # صفحات متعددة اللغات
│   │   ├── page.tsx        # الصفحة الرئيسية
│   │   ├── layout.tsx      # التخطيط الرئيسي
│   │   ├── globals.css     # الأنماط العامة
│   │   ├── providers.tsx   # موفرو السياق
│   │   ├── auth/           # صفحات المصادقة
│   │   ├── api/            # مسارات API
│   │   ├── category/       # صفحات الأقسام
│   │   ├── article/        # صفحات المقالات
│   │   ├── map/            # خريطة تفاعلية
│   │   ├── data/           # صحافة البيانات
│   │   └── podcasts/       # البودكاست
│   ├── api/                # API routes المشتركة
│   ├── sitemap.ts          # خريطة الموقع
│   └── robots.ts           # robots.txt
├── components/
│   ├── layout/             # مكونات التخطيط (Header, Footer, etc.)
│   ├── home/               # مكونات الصفحة الرئيسية
│   ├── auth/               # نماذج المصادقة
│   ├── theme/              # ThemeProvider
│   └── ui/                 # مكونات UI قابلة لإعادة الاستخدام
├── lib/
│   ├── meilisearch.ts      # عميل Meilisearch والبحث
│   ├── supabase/           # عملاء Supabase
│   ├── prisma.ts           # عميل Prisma
│   ├── auth.ts             # إعداد NextAuth
│   ├── store.ts            # Zustand store
│   ├── utils.ts            # دوال مساعدة
│   └── constants.ts        # ثوابت التطبيق
├── prisma/
│   ├── schema.prisma       # مخطط قاعدة البيانات
│   └── seed.ts             # بيانات البذر
└── scripts/
    ├── setup-meilisearch.ts    # إعداد فهارس البحث
    └── index-articles.ts       # فهرسة المقالات
```

## 🗄️ نموذج قاعدة البيانات

النموذج الرئيسي يدعم:
- **مقالات متعددة اللغات** مع ترجمات كاملة (عنوان، مقتطف، محتوى، SEO)
- **أقسام هرمية** مع ترجمات
- **وسوم** مع دعم متعدد اللغات
- **مستخدمين بأدوار** (قارئ، صحفي، محرر، مدير)
- **تعليقات متسلسلة** مع تصويت
- **إشارات مرجعية** مخصصة للمستخدم
- **إشعارات** فورية
- **مواقع جغرافية** (محافظات، أقضية) مع إحداثيات
- **نشرات بريدية** مع توكن إلغاء اشتراك
- **مواقع إعلانية** وأحجام متعددة
- **محتوى ممول** مع تواريخ بداية/نهاية

## 🔍 البحث مع Meilisearch

فهارس منفصلة لـ:
- **المقالات** - بحث كامل النص مع مرشحات (قسم، وسم، محافظة، كاتب، حالة)
- **الأقسام** - بحث وتصفية
- **الوسوم** - اقتراحات تلقائية
- **المحافظات** - بحث جغرافي

ميزات البحث:
- تصحيح إملائي للعربية والكردية
- مرادفات مخصصة للمصطلحات العراقية
- تسليط الضوء على النتائج
- Faceted search للفلترة
- ترتيب حسب التاريخ، المشاهدات، الصلة

## 🗺️ الخرائط التفاعلية

- **Mapbox GL JS** مع أنماط مخصصة
- **طبقات GeoJSON** لحدود المحافظات والأقضية العراقية
- **Heatmap** للأخبار الحديثة
- **Clustering** للنقاط الكثيفة
- **فلترة بالنقر** على المحافظة/القضاء
- **Popups** مع ملخص الخبر وروابط

## 📱 PWA والموبايل

- **Service Worker** للتخزين المؤقت والاستخدام أوفلاين
- **Web App Manifest** للتثبيت
- **Push Notifications** عبر Firebase/Pusher
- **Background Sync** للتعليقات والإشارات المرجعية
- **استجابة كاملة** للهواتف، الأجهزة اللوحية، سطح المكتب

## 🔐 الأمان

- **CSP** صارم مع nonces
- **Rate Limiting** على API routes
- **WAF** عبر Cloudflare
- **DDoS Protection** تلقائي
- **تشفير كلمات المرور** بـ bcrypt
- **JWT** للجلسات مع rotation
- **CSRF Protection** مدمج في NextAuth
- **XSS Protection** عبر React escaping

## ♿ إمكانية الوصول (WCAG 2.1 AA)

- **ترتيب تبويب منطقي** مع RTL support
- **تناقض ألوان** كافي في الوضعين الفاتح/الداكن
- **نصوص بديلة** للصور
- **ARIA labels** للعناصر التفاعلية
- **خطأ التركيز** مرئي
- **نصوص قابلة للتكبير** حتى 200%
- **Skip links** للمحتوى الرئيسي

## 🚀 النشر

### Cloudflare Pages (موصى به)

```bash
# بناء للإنتاج
npm run build

# النشر عبر Wrangler
npx wrangler pages deploy .vercel/output --project-name=iraqnow
```

### Docker

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
EXPOSE 3000
CMD ["node", "server.js"]
```

## 📊 المراقبة والتحليلات

- **Sentry** لتتبع الأخطاء
- **Logtail** للسجلات
- **Vercel/Cloudflare Analytics** للأداء
- **Meilisearch Analytics** لتحليل البحث
- **Supabase Dashboard** لقاعدة البيانات

## 🤝 المساهمة

1. Fork المستودع
2. إنشاء فرع للميزة (`git checkout -b feature/amazing-feature`)
3. Commit التغييرات (`git commit -m 'Add amazing feature'`)
4. Push للفرع (`git push origin feature/amazing-feature`)
5. فتح Pull Request

## 📄 الترخيص

هذا المشروع مرخص تحت رخصة MIT - راجع ملف [LICENSE](LICENSE) للتفاصيل.

## 📞 التواصل

- **الموقع**: https://iraqnow.com
- **البريد**: contact@iraqnow.com
- **تويتر**: [@iraqnow](https://twitter.com/iraqnow)
- **GitHub Issues**: للأخطاء والميزات

---

**IraqNow** - أخبار العراق بمصداقية وسرعة 🇮🇶