import { Metadata } from 'next'
import Link from 'next/link'
import {
  Activity, BarChart3, Bell, Search, Image as ImageIcon, Mail, Shield,
  MessageCircle, Gauge, Globe, CheckCircle2, AlertCircle, ExternalLink,
  Database, Zap,
} from 'lucide-react'

export const metadata: Metadata = {
  title: 'التكاملات والخدمات',
  robots: { index: false },
}

export const dynamic = 'force-dynamic'

interface ServiceInfo {
  key: string
  name: string
  nameEn: string
  icon: any
  envVars: string[]
  free: string
  url: string
  steps: string[]
  benefit: string
}

const SERVICES: ServiceInfo[] = [
  {
    key: 'cf-analytics',
    name: 'Cloudflare Web Analytics',
    nameEn: 'Cloudflare Web Analytics',
    icon: BarChart3,
    envVars: ['NEXT_PUBLIC_CF_ANALYTICS_TOKEN'],
    free: 'مجاني غير محدود — بدون كوكيز',
    url: 'https://dash.cloudflare.com/?to=/:account/web-analytics',
    steps: [
      'افتح لوحة Cloudflare → Web Analytics',
      'أضف موقع iraqnow.pages.dev',
      'انسخ التوكن من سطر beacon.min.js',
      'ضعه في NEXT_PUBLIC_CF_ANALYTICS_TOKEN',
    ],
    benefit: 'إحصائيات زوار حقيقية بدون كوكيز — مهم للخصوصية والقانون',
  },
  {
    key: 'umami',
    name: 'أومامي | Umami',
    nameEn: 'Umami Cloud',
    icon: Activity,
    envVars: ['NEXT_PUBLIC_UMAMI_SRC', 'NEXT_PUBLIC_UMAMI_ID'],
    free: '100k حدث/شهر مجاناً — أو استضافة ذاتية بلا حدود',
    url: 'https://umami.is',
    steps: [
      'سجّل في umami.is (خطة Hobby المجانية)',
      'أضف موقع iraqnow.pages.dev',
      'انسخ Website ID و script URL',
      'ضعهما في NEXT_PUBLIC_UMAMI_ID و NEXT_PUBLIC_UMAMI_SRC',
    ],
    benefit: 'تحليلات احترافية مفتوحة المصدر تدعم العربية وRTL',
  },
  {
    key: 'onesignal',
    name: 'إشعارات OneSignal',
    nameEn: 'OneSignal Web Push',
    icon: Bell,
    envVars: ['NEXT_PUBLIC_ONESIGNAL_APP_ID'],
    free: 'إشعارات غير محدودة حتى 10,000 مشترك',
    url: 'https://onesignal.com',
    steps: [
      'أنشئ حساباً في onesignal.com',
      'أنشئ تطبيق Web Push جديد',
      'اختر Custom Code وأضف https://iraqnow.pages.dev',
      'انسخ App ID وضعه في NEXT_PUBLIC_ONESIGNAL_APP_ID',
    ],
    benefit: 'إشعارات الأخبار العاجلة للزوار حتى بعد إغلاق الموقع — أكبر عامل لعودة الزوار',
  },
  {
    key: 'giscus',
    name: 'تعليقات Giscus',
    nameEn: 'Giscus Comments',
    icon: MessageCircle,
    envVars: ['NEXT_PUBLIC_GISCUS_REPO', 'NEXT_PUBLIC_GISCUS_REPO_ID', 'NEXT_PUBLIC_GISCUS_CATEGORY', 'NEXT_PUBLIC_GISCUS_CATEGORY_ID'],
    free: 'مجاني 100% — مبني على GitHub Discussions',
    url: 'https://giscus.app',
    steps: [
      'فعّل Discussions في مستودع GitHub iraqnow',
      'ثبّت تطبيق giscus من giscus.app',
      'اختر تصنيفاً (مثلاً: Announcements)',
      'انسخ القيم الأربعة من giscus.app إلى المتغيرات',
    ],
    benefit: 'نظام تعليقات مجاني بالعربية وRTL — بدون سيرفر وإعلانات',
  },
  {
    key: 'turnstile',
    name: 'Cloudflare Turnstile',
    nameEn: 'Turnstile CAPTCHA',
    icon: Shield,
    envVars: ['NEXT_PUBLIC_TURNSTILE_SITE_KEY', 'TURNSTILE_SECRET_KEY'],
    free: 'مجاني غير محدود — بدون بطاقة',
    url: 'https://dash.cloudflare.com/?to=/:account/turnstile',
    steps: [
      'لوحة Cloudflare → Turnstile → Add Site',
      'أضف iraqnow.pages.dev',
      'انسخ Site Key إلى NEXT_PUBLIC_TURNSTILE_SITE_KEY',
      'انسخ Secret Key إلى TURNSTILE_SECRET_KEY',
    ],
    benefit: 'حماية نموذج النشرة من الروبوتات — أخف وأسرع من reCAPTCHA',
  },
  {
    key: 'resend',
    name: 'بريد Resend',
    nameEn: 'Resend Email',
    icon: Mail,
    envVars: ['RESEND_API_KEY', 'NEWS_FROM_EMAIL'],
    free: '3,000 رسالة/شهر (100/يوم) — بدون بطاقة',
    url: 'https://resend.com',
    steps: [
      'سجّل في resend.com',
      'أنشئ API Key',
      'ضعه في RESEND_API_KEY',
      '(اختياري) أضف دومينك في NEWS_FROM_EMAIL',
    ],
    benefit: 'بريد ترحيبي تلقائي لكل مشترك جديد في النشرة',
  },
  {
    key: 'indexnow',
    name: 'فهرسة IndexNow',
    nameEn: 'IndexNow (Bing/Yandex)',
    icon: Zap,
    envVars: [],
    free: 'مجاني بلا حدود — بدون حساب',
    url: 'https://www.indexnow.org',
    steps: ['مفعّل تلقائياً ✓', 'كل مقال منشور يُرسل فوراً لـ Bing وYandex', 'أرسل خريطة الموقع إلى Bing Webmaster Tools لتسريع الفهرسة'],
    benefit: 'مقالاتك تظهر في بحث Bing خلال دقائق من النشر — بدون أي حساب',
  },
  {
    key: 'webvitals',
    name: 'قياس الأداء Web Vitals',
    nameEn: 'Web Vitals RUM',
    icon: Gauge,
    envVars: [],
    free: 'مجاني بالكامل',
    url: 'https://web.dev/vitals/',
    steps: ['مفعّل تلقائياً ✓', 'يقيس سرعة الموقع الحقيقية لكل زائر (LCP, INP, CLS)', 'تُخزن في Supabase عند ربط قاعدة البيانات'],
    benefit: 'تعرف سرعة الموقع الفعلية للزوار العراقيين — أساس تحسين ترتيب جوجل',
  },
  {
    key: 'supabase',
    name: 'قاعدة البيانات Supabase',
    nameEn: 'Supabase Database',
    icon: Database,
    envVars: [],
    free: '500MB قاعدة + 50k مستخدم + 1GB تخزين',
    url: 'https://supabase.com/dashboard',
    steps: [
      'افتح SQL Editor في لوحة Supabase',
      'انسخ محتوى الملف supabase/schema.sql من المستودع',
      'الصقه وشغّل (Run)',
      'الموقع يكتشف الجداول ويزرع البيانات تلقائياً',
    ],
    benefit: 'حفظ دائم لكل التعديلات — المقالات والمحررون والتعليقات تبقى بعد إعادة النشر',
  },
]

function getEnvStatus(key: string): boolean {
  const val = process.env[key]
  return typeof val === 'string' && val.length > 3
}

export default function IntegrationsPage() {
  const activeCount = SERVICES.filter((s) => s.envVars.length === 0 || s.envVars.every(getEnvStatus)).length

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-kufi text-2xl font-bold text-white">التكاملات والخدمات المجانية</h1>
          <p className="mt-1 text-sm text-sand-100/50">
            {activeCount} من {SERVICES.length} خدمة مفعّلة — كلها بخطط مجانية بدون بطاقة ائتمان
          </p>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        {SERVICES.map((service) => {
          const configured = service.envVars.length === 0 || service.envVars.every(getEnvStatus)
          return (
            <div
              key={service.key}
              className={`rounded-2xl border p-5 transition-all duration-300 ${
                configured
                  ? 'border-green-500/25 bg-green-500/[0.04]'
                  : 'border-white/[0.07] bg-white/[0.03]'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className={`flex h-11 w-11 items-center justify-center rounded-xl ${
                    configured ? 'bg-green-500/15 text-green-400' : 'bg-gold-500/12 text-gold-400'
                  }`}>
                    <service.icon className="h-5 w-5" />
                  </span>
                  <div>
                    <h2 className="font-kufi text-sm font-bold text-white">{service.name}</h2>
                    <p className="text-[10px] text-sand-100/40" dir="ltr">{service.nameEn}</p>
                  </div>
                </div>
                {configured ? (
                  <span className="flex items-center gap-1 rounded-lg bg-green-500/15 px-2.5 py-1 text-[10px] font-bold text-green-400">
                    <CheckCircle2 className="h-3 w-3" />
                    مفعّل
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-lg bg-gold-500/15 px-2.5 py-1 text-[10px] font-bold text-gold-400">
                    <AlertCircle className="h-3 w-3" />
                    غير مفعّل
                  </span>
                )}
              </div>

              <p className="mt-3 flex items-center gap-1.5 text-xs text-gold-300/80">
                <Zap className="h-3 w-3 shrink-0" />
                {service.benefit}
              </p>

              <div className="mt-3 rounded-xl border border-white/[0.06] bg-white/[0.02] p-3.5">
                <p className="mb-2 text-[10px] font-bold text-sand-100/50">
                  الخطة المجانية: <span className="text-sand-100/80">{service.free}</span>
                </p>
                <ol className="space-y-1">
                  {service.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-[11px] text-sand-100/55">
                      <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-gold-500/15 text-[9px] font-bold text-gold-400">
                        {i + 1}
                      </span>
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {service.envVars.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {service.envVars.map((v) => (
                    <span
                      key={v}
                      className={`rounded-md border px-2 py-0.5 text-[9px] font-bold ${
                        getEnvStatus(v)
                          ? 'border-green-500/30 bg-green-500/10 text-green-400'
                          : 'border-red-500/25 bg-red-500/10 text-red-400'
                      }`}
                      dir="ltr"
                    >
                      {v}
                    </span>
                  ))}
                </div>
              )}

              <a
                href={service.url}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-4 flex items-center justify-center gap-2 rounded-xl border border-gold-500/30 py-2 text-xs font-semibold text-gold-400 transition-colors hover:bg-gold-500/10"
              >
                <ExternalLink className="h-3.5 w-3.5" />
                فتح {service.nameEn}
              </a>
            </div>
          )
        })}
      </div>

      {/* ملاحظة إضافة المتغيرات */}
      <div className="rounded-2xl border border-gold-500/25 bg-gold-500/[0.05] p-5">
        <h2 className="mb-2 flex items-center gap-2 font-kufi text-sm font-bold text-gold-400">
          <Globe className="h-4 w-4" />
          كيف أفعّل خدمة؟
        </h2>
        <ol className="space-y-1.5 text-xs leading-relaxed text-sand-100/60">
          <li>1. سجّل في الخدمة (مجانية) وانسخ المفاتيح</li>
          <li>2. أضفها إلى ملف <code className="rounded bg-black/40 px-1.5 py-0.5 text-gold-300" dir="ltr">wrangler.toml</code> في قسم [vars] بأسماء المتغيرات المذكورة أعلاه</li>
          <li>3. أعد النشر — أو أرسل المفاتيح للمطور ليضيفها</li>
          <li className="text-gold-400/70">⚠️ ملاحظة: المتغيرات التي تبدأ بـ NEXT_PUBLIC_ تظهر في المتصفح — لا تضع فيها أسرار حقيقية</li>
        </ol>
      </div>
    </div>
  )
}
