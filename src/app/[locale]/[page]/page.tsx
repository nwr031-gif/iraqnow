import { Metadata } from 'next'
import Link from 'next/link'
import { Home, ChevronLeft } from 'lucide-react'
import { IshtarStar, CuneiformDivider } from '@/components/brand/Brand'

type Locale = 'ar' | 'ku' | 'en'

interface InfoSection { heading: string; body: string }
interface InfoPageData { title: string; subtitle: string; sections: InfoSection[] }

const INFO_PAGES: Record<string, Record<Locale, InfoPageData>> = {
  about: {
    ar: { title: 'عن العراق الآن', subtitle: 'من قلب بلاد الرافدين، إلى العالم', sections: [
      { heading: 'من نحن', body: 'العراق الآن منصة إخبارية عراقية مستقلة متعددة اللغات (العربية، الكردية، الإنكليزية). نؤمن بأن العراق يستحق صحافة نوعية — تحقيق، تحليل، وبيانات مفتوحة. نحن لسنا مملوكة لأي حزب أو حكومة أو دولة أجنبية.' },
      { heading: 'رسالتنا', body: 'تقديم أخبار موثوقة بمعايير صحفية دولية، مع تغطية شاملة لجميع المحافظات الـ 18+1، وإعطاء صوت للمجتمعات المهمشة. نستخدم تقنية حديثة لتقديم الأخبار بسرعة ووضوح.' },
      { heading: 'قيمنا', body: 'الدقة قبل السرعة. الاستقلالية التامة. الشفافية في التمويل والمصادر. احترام خصوصية القارئ.' },
    ]},
    ku: { title: 'دەربارەی عێراق ئێستا', subtitle: 'لە دڵی میزۆپۆتامیاوە بۆ جیهان', sections: [
      { heading: 'ئێمە کێین', body: 'عێراق ئێستا پلاتفۆرمێکی هەواڵی سەربەخۆی عێراقییە بە سێ زمان.' },
      { heading: 'ئەرکەکەمان', body: 'پێشکەشکردنی هەواڵی متمانەپێکراو بە ستانداردی نێودەوڵەتی.' },
      { heading: 'بەهاکانمان', body: 'وردوکاری، سەربەخۆیی، شەفافیەت.' },
    ]},
    en: { title: 'About Iraq Now', subtitle: 'From Mesopotamia to the World', sections: [
      { heading: 'Who We Are', body: 'Iraq Now is an independent Iraqi multilingual news platform (Arabic, Kurdish, English). We believe Iraq deserves quality journalism — investigations, analysis, and open data. We are not owned by any party, government, or foreign state.' },
      { heading: 'Our Mission', body: 'Deliver credible news with international standards, covering all governorates, giving voice to marginalised communities.' },
      { heading: 'Our Values', body: 'Accuracy before speed. Full independence. Transparency in funding and sources. Respect for reader privacy.' },
    ]},
  },
  privacy: {
    ar: { title: 'سياسة الخصوصية', subtitle: 'خصوصيتك أمانة', sections: [
      { heading: 'ما نجمعه', body: 'نجمع الحد الأدنى: بيانات تحليلات مجهولة (بدون كوكيز تتبع)، وبريدك الإلكتروني إذا اشتركت في النشرة. لا نجمع بيانات شخصية أخرى.' },
      { heading: 'كيف نستخدمه', body: 'بيانات التحليلات تُستخدم لتحسين الموقع. بريدك يُستخدم فقط لإرسال النشرة. لا نشارك بياناتك مع أي طرف ثالث.' },
      { heading: 'حقوقك', body: 'يمكنك طلب حذف بياناتك في أي وقت عبر مراسلتنا.' },
    ]},
    ku: { title: 'سیاسەتی تایبەتێتی', subtitle: 'تایبەتێتت ئەمانەتە', sections: [
      { heading: 'چی کۆدەکەینەوە', body: 'کەمترین داتا: شیکاری نەناسراو و ئیمەیڵ بۆ نامەی هەواڵ.' },
      { heading: 'چۆن بەکاریدەهێنین', body: 'تەنها بۆ باشترکردنی ماڵپەر و نامەی هەواڵ.' },
      { heading: 'مافەکانت', body: 'دەتوانی داوای سڕینەوەی داتاکانت بکەیت.' },
    ]},
    en: { title: 'Privacy Policy', subtitle: 'Your privacy is a trust', sections: [
      { heading: 'What We Collect', body: 'Minimum data: anonymous analytics (no tracking cookies) and your email if you subscribe to the newsletter.' },
      { heading: 'How We Use It', body: 'Analytics improve the site. Email is used only for the newsletter. We never share your data.' },
      { heading: 'Your Rights', body: 'Request deletion of your data anytime.' },
    ]},
  },
  terms: {
    ar: { title: 'شروط الاستخدام', subtitle: 'باستخدامك للموقع فأنت توافق على هذه الشروط', sections: [
      { heading: 'الاستخدام المقبول', body: 'يُسمح بقراءة ومشاركة المحتوى مع نسبة المصدر. يُمنع نسخ المحتوى لأغراض تجارية بدون ترخيص.' },
      { heading: 'المحتوى', body: 'المقالات تعبر عن وجهة نظر كاتبها. نتخذ إجراءات ضد المحتوى المخالف بعد التحقق.' },
      { heading: 'إخلاء مسؤولية', body: 'لا نضمن استمرارية توفر الخدمة دون انقطاع. المحتوى للتوعية وليس استشارة مهنية.' },
    ]},
    ku: { title: 'مەرجەکانی بەکارهێنان', subtitle: 'بە بەکارهێنانی ماڵپەر ڕازیکەیت', sections: [
      { heading: 'بەکارهێنانی قبوڵکراو', body: 'خوێندن و هاوبەشکردن لەگەڵ ناوهێنانەوە.' },
      { heading: 'ناوەڕۆک', body: 'وتارەکان ڕاکانی نووسەران دەگەیەنن.' },
      { heading: 'ڕەتکردنەوە', body: 'گەرانتی بەردەوامی خزمەتگوزاری ناکەین.' },
    ]},
    en: { title: 'Terms of Service', subtitle: 'By using this site you agree to these terms', sections: [
      { heading: 'Acceptable Use', body: 'Reading and sharing with attribution is allowed. Commercial copying requires a licence.' },
      { heading: 'Content', body: 'Articles reflect their authors\' views. We take action against violating content after verification.' },
      { heading: 'Disclaimer', body: 'We don\'t guarantee uninterrupted service. Content is informational, not professional advice.' },
    ]},
  },
  contact: {
    ar: { title: 'اتصل بنا', subtitle: 'يسعدنا سماع رأيك', sections: [
      { heading: 'البريد الإلكتروني', body: 'info@iraqnow.iq — نرد خلال 24-48 ساعة.' },
      { heading: 'للصحفيين', body: 'لإرسال تقارير أو تقارير خبرية من المحافظات، راسلنا على نفس البريد مع موضوع واضح.' },
      { heading: 'للإعلانات', body: 'راسلنا على advertise@iraqnow.iq لمعرفة خطتنا الإعلانية.' },
    ]},
    ku: { title: 'پەیوەندی', subtitle: 'دەنگی خۆمان ببیستین', sections: [
      { heading: 'ئیمەیڵ', body: 'info@iraqnow.iq' },
      { heading: 'بۆ ڕۆژنامەنووسان', body: 'ڕاپۆرتەکان بنێرە بۆ هەمان ئیمەیڵ.' },
      { heading: 'بۆ ڕیکلام', body: 'advertise@iraqnow.iq' },
    ]},
    en: { title: 'Contact Us', subtitle: 'We\'d love to hear from you', sections: [
      { heading: 'Email', body: 'info@iraqnow.iq — we respond within 24-48 hours.' },
      { heading: 'For Journalists', body: 'Send reports from governorates to the same email with a clear subject.' },
      { heading: 'For Advertising', body: 'Contact advertise@iraqnow.iq for our media kit.' },
    ]},
  },
  'editorial-policy': {
    ar: { title: 'السياسة التحريرية', subtitle: 'معاييرنا في التحقيق والنشر', sections: [
      { heading: 'التحقق', body: 'كل خبر يمر عبر مراجعة محرر مستقل قبل النشر. الأخبار العاجلة تُوسم بوضوح ويُحدّث الأدلة لاحقاً.' },
      { heading: 'التصحيحات', body: 'الأخطاء تُصحح بشفافية مع ملاحظة "صحّح" في أعلى المقال. التصحيحات الجوهرية تُنشر في صفحة مخصصة.' },
      { heading: 'المصادر', body: 'نحمي هوية المصادر عند الطلب. نستخدم مصادر متعددة للتحقق من المعلومات الحساسة.' },
    ]},
    ku: { title: 'سیاسەتی ڕۆژنامەگەری', subtitle: 'ستانداردەکانی ئێمە', sections: [
      { heading: 'پشکنین', body: 'هەر هەواڵێک پێش بڵاوکردنەوە دەپشکنرێت.' },
      { heading: 'ڕاستکردنەوە', body: 'هەڵەکان بە شەفافیەتی ڕاست دەکرێنەوە.' },
      { heading: 'سەرچاوەکان', body: 'پاراستنی ناسنامەی سەرچاوەکان.' },
    ]},
    en: { title: 'Editorial Policy', subtitle: 'Our standards for verification and publishing', sections: [
      { heading: 'Verification', body: 'Every story is reviewed by an independent editor before publishing. Breaking news is clearly marked.' },
      { heading: 'Corrections', body: 'Errors are corrected transparently with an editor\'s note.' },
      { heading: 'Sources', body: 'We protect source identity. Multiple sources verify sensitive information.' },
    ]},
  },
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; page: string }> }): Promise<Metadata> {
  const { locale, page } = await params
  const data = INFO_PAGES[page]
  if (!data) return { title: 'غير موجود' }
  const info = data[locale as Locale] || data.ar
  return { title: info.title, description: info.subtitle }
}

export async function generateStaticParams() {
  return Object.keys(INFO_PAGES).flatMap((page) =>
    ['ar', 'ku', 'en'].map((locale) => ({ page, locale }))
  )
}

export const dynamic = 'force-static'

export default async function InfoPageView({ params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale: rawLocale, page } = await params
  const locale = (['ar', 'ku', 'en'].includes(rawLocale) ? rawLocale : 'ar') as Locale
  const data = INFO_PAGES[page]
  if (!data) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <IshtarStar size={36} />
        <p className="text-sm text-[var(--muted)]">{locale === 'en' ? 'Page not found' : 'الصفحة غير موجودة'}</p>
        <Link href={`/${locale}`} className="btn-outline !py-2 text-xs">{locale === 'en' ? 'Home' : 'الرئيسية'}</Link>
      </div>
    )
  }
  const info = data[locale] || data.ar
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)]">
      <div className="container-main max-w-3xl py-12">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[var(--muted)]">
          <Link href={`/${locale}`} className="flex items-center gap-1.5 hover:text-gold-600">
            <Home className="h-3.5 w-3.5" /> {locale === 'en' ? 'Home' : 'الرئيسية'}
          </Link>
          <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" />
          <span className="font-medium text-gold-600">{info.title}</span>
        </nav>

        <div className="text-center">
          <IshtarStar size={36} className="mx-auto mb-4" />
          <h1 className="font-kufi text-3xl font-bold text-[var(--foreground)]">{info.title}</h1>
          <p className="mt-2 text-sm text-[var(--muted)]">{info.subtitle}</p>
        </div>

        <CuneiformDivider variant="star" className="my-10 opacity-40" />

        <div className="space-y-8">
          {info.sections.map((section, i) => (
            <section key={i} className="rounded-2xl border border-[var(--border)] bg-[var(--card-bg)] p-6">
              <h2 className="mb-3 flex items-center gap-2 font-kufi text-lg font-bold text-[var(--foreground)]">
                <span className="h-4 w-1 rounded-full bg-gradient-to-b from-gold-400 to-gold-700" />
                {section.heading}
              </h2>
              <p className="text-sm leading-loose text-[var(--muted)]">{section.body}</p>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
