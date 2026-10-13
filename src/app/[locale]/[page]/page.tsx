import { Metadata } from 'next'
import Link from 'next/link'
import { Home, ChevronLeft } from 'lucide-react'
import { IshtarStar, CuneiformDivider } from '@/components/brand/Brand'

type Locale = 'ar' | 'ku' | 'en'

interface InfoSection { heading: string; body: string }
interface InfoPageData { title: string; subtitle: string; sections: InfoSection[] }

const INFO_PAGES: Record<string, Partial<Record<Locale, InfoPageData>>> = {
  team: {
    ar: { title: 'فريق التحرير', subtitle: 'من يقف خلف العراق الآن', sections: [
      { heading: 'غرفة الأخبار', body: 'تُدار غرفة أخبار العراق الآن على مدار الساعة: منظومة تحريرية رقمية تراقب المصادر الإخبارية العراقية والعربية والعالمية، تبحث وتبحث ويتحقق ثم تصوغ التقارير بمعايير صحفية صارمة.' },
      { heading: 'المراجعة والجودة', body: 'يخضع كل تقرير لسلسلة تحقق صارمة: مقارنة المعلومات بالمصادر الأصلية، ونسب المصادر صراحة في نهاية كل مقال، ومنع أي معلومة غير موثقة. كما يراجع فريق التحرير المحتوى دورياً.' },
      { heading: 'التغطية', body: 'تغطي المنصة أحداث العراق والشرق الأوسط والعالم — من بغداد إلى البصرة وأربيل والموصل — بالعربية والإنجليزية، على مستوى محافظات العراق الـ 19.' },
    ]},
    en: { title: 'Editorial Team', subtitle: 'Who stands behind Iraq Now', sections: [
      { heading: 'The Newsroom', body: 'The Iraq Now newsroom operates around the clock: a digital editorial system monitors Iraqi, Arab and international news sources, researches and verifies, then drafts reports to strict journalistic standards.' },
      { heading: 'Review & Quality', body: 'Every report goes through strict verification: facts are checked against original sources, sources are explicitly credited at the end of each article, and unverified information is never published. Editors also review content regularly.' },
      { heading: 'Coverage', body: 'We cover Iraq, the Middle East and the world — from Baghdad to Basra, Erbil and Mosul — in Arabic and English, across all 19 Iraqi governorates.' },
    ]},
  },
  'fact-check': {
    ar: { title: 'التحقق من المعلومات', subtitle: 'منهجيتنا في الدقة والمصداقية', sections: [
      { heading: 'منهجيتنا', body: 'كل خبر ننشره مبني على مصدر إخباري معروف يُذكر اسمه صراحة في نهاية التقرير. نعتمد على بيانات RSS الرسمية من وسائل الإعلام الموثوقة، ونمنع منعاً باتاً إضافة أي معلومة أو رقم أو تصريح غير موجود في المصادر الأصلية.' },
      { heading: 'معايير النشر', body: 'كل تقرير يُراجع قبل النشر: التحقق من تطابق الوقائع مع المصدر، سلامة اللغة، ووضوح التوقيت والمكان. نرفض نشر أي محتوى لا يمكن ربطه بمصدر موثوق.' },
      { heading: 'الإبلاغ عن خطأ', body: 'إن لاحظت أي خطأ في أي تقرير، راسلنا فوراً على info@iraqnow.iq مع رابط المقال، وسنقوم بالمراجعة والتصحيح خلال 24 ساعة.' },
    ]},
    en: { title: 'Fact Checking', subtitle: 'Our methodology for accuracy', sections: [
      { heading: 'Our Methodology', body: 'Every story we publish is based on a known news source explicitly credited at the end of the report. We rely on official RSS feeds from trusted outlets, and never add any fact, number or statement not present in the original sources.' },
      { heading: 'Publishing Standards', body: 'Every report is reviewed before publishing: facts are matched against the source, language quality is checked, and timing and location are made clear. We refuse to publish any content that cannot be tied to a trusted source.' },
      { heading: 'Report an Error', body: 'If you spot an error in any report, contact info@iraqnow.iq with the article link, and we will review and correct within 24 hours.' },
    ]},
  },
  archive: {
    ar: { title: 'الأرشيف', subtitle: 'كل ما نشرته المنصة في مكان واحد', sections: [
      { heading: 'تصفح الأرشيف', body: 'يمكنك الوصول إلى كل المقالات المنشورة عبر صفحة «آخر الأخبار» التي تعرض أحدث 30 مقالاً مرتبة زمنياً، أو التنقل حسب القسم من صفحة الأقسام.' },
      { heading: 'البحث النصي', body: 'استخدم زر البحث أعلى الموقع للبحث الفوري في جميع العناوين والمحتوى المنشور.' },
      { heading: 'تحميل البيانات', body: 'أرشيف المقالات الكامل متاح للتحميل بصيغة CSV من صفحة «العراق بالأرقام» ضمن قسم قواعد البيانات المفتوحة.' },
    ]},
    en: { title: 'Archive', subtitle: 'Everything the platform has published', sections: [
      { heading: 'Browse the Archive', body: 'Access all published articles through the Latest News page, which shows the most recent 30 stories in chronological order, or navigate by section.' },
      { heading: 'Text Search', body: 'Use the search button at the top of the site for instant search across all published headlines and content.' },
      { heading: 'Data Export', body: 'The full articles archive is available for download as CSV from the "Iraq in Numbers" page, under open datasets.' },
    ]},
  },
  careers: {
    ar: { title: 'فرص العمل', subtitle: 'انضم إلى فريق العراق الآن', sections: [
      { heading: 'الوظائف الحالية', body: 'لا توجد وظائف متفرغة شاغرة حالياً. نبحث دائماً عن صحفيين ومحررين متعاونين من مختلف محافظات العراق لتوسيع التغطية المحلية.' },
      { heading: 'كيف تتقدم', body: 'أرسل سيرتك الذاتية مع نماذج من أعمالك الصحفية إلى info@iraqnow.iq بعنوان «تعاون صحفي»، وسنتواصل معك عند توفر فرصة مناسبة.' },
    ]},
    en: { title: 'Careers', subtitle: 'Join the Iraq Now team', sections: [
      { heading: 'Current Openings', body: 'There are no full-time openings at the moment. We are always looking for freelance journalists and editors from across Iraq to expand local coverage.' },
      { heading: 'How to Apply', body: 'Send your CV and writing samples to info@iraqnow.iq with the subject "Journalism Collaboration", and we will reach out when a suitable opportunity opens.' },
    ]},
  },
  app: {
    ar: { title: 'تطبيق الجوال', subtitle: 'ثبّت العراق الآن على هاتفك', sections: [
      { heading: 'تطبيق ويب تقدمي (PWA)', body: 'موقع العراق الآن يعمل كتطبيق جوال كامل — يمكنك تثبيته على الشاشة الرئيسية لتصفح أسرع وتجربة بلا شريط المتصفح، دون الحاجة لتحميله من متجر التطبيقات.' },
      { heading: 'على iPhone و iPad', body: 'افتح الموقع في متصفح Safari، اضغط زر المشاركة، ثم اختر «إضافة إلى الشاشة الرئيسية».' },
      { heading: 'على Android', body: 'افتح الموقع في متصفح Chrome، ثم اختر «تثبيت التطبيق» أو «إضافة إلى الشاشة الرئيسية» من قائمة النقاط الثلاث.' },
    ]},
    en: { title: 'Mobile App', subtitle: 'Install Iraq Now on your phone', sections: [
      { heading: 'Progressive Web App (PWA)', body: 'Iraq Now works as a full mobile app — install it to your home screen for faster browsing and a full-screen experience, with no app store download required.' },
      { heading: 'On iPhone & iPad', body: 'Open the site in Safari, tap the Share button, then choose "Add to Home Screen".' },
      { heading: 'On Android', body: 'Open the site in Chrome, then choose "Install app" or "Add to Home Screen" from the three-dot menu.' },
    ]},
  },
  developers: {
    ar: { title: 'واجهة API', subtitle: 'وصول برمجي لمحتوى المنصة', sections: [
      { heading: 'خلاصات RSS', body: 'اشترك في تحديثات الموقع فورياً عبر خلاصة RSS جاهزة على الرابط: iraqnow.pages.dev/rss — وتتضمن أحدث المقالات المنشورة بالعربية.' },
      { heading: 'خريطة الموقع', body: 'ملف sitemap.xml محدث تلقائياً بكل الصفحات والمقالات، جاهز لمحركات البحث والأدوات البرمجية: iraqnow.pages.dev/sitemap.xml' },
      { heading: 'وصول موسّع', body: 'للحصول على وصول برمجي موسّع للمحتوى (بيانات منظمة، تدفقات JSON)، تواصل معنا على info@iraqnow.iq مع وصف لاستخدامك المقترح.' },
    ]},
    en: { title: 'Developer API', subtitle: 'Programmatic access to our content', sections: [
      { heading: 'RSS Feeds', body: 'Subscribe to instant updates via our ready RSS feed at: iraqnow.pages.dev/rss — includes the latest published Arabic articles.' },
      { heading: 'Sitemap', body: 'A sitemap.xml file is automatically updated with all pages and articles, ready for search engines and developer tools: iraqnow.pages.dev/sitemap.xml' },
      { heading: 'Extended Access', body: 'For extended programmatic access (structured data, JSON feeds), contact info@iraqnow.iq describing your intended use.' },
    ]},
  },
  advertise: {
    ar: { title: 'أعلن معنا', subtitle: 'اوصل رسالتك إلى جمهور عراقي حقيقي', sections: [
      { heading: 'لماذا العراق الآن؟', body: 'جمهور عراقي متابع للأخبار من جميع محافظات العراق الـ 19، يصلنا مباشرة من محركات البحث ووسائل التواصل، بقراءة سريعة وموثوقة بالعربية والإنجليزية.' },
      { heading: 'الصيغ المتاحة', body: 'مساحات عرض داخل المقالات، رعاية أقسام إخبارية، رعاية حلقات البودكاست، وحملات محتوى مدفوعة. نصمم الحزمة بما يناسب أهدافك وميزانيتك.' },
      { heading: 'تواصل معنا', body: 'راسلنا على info@iraqnow.iq بعنوان «إعلان» مع نبذة عن نشاطك، وسنرسل لك قائمة الأسعار والخيارات المتاحة.' },
    ]},
    en: { title: 'Advertise', subtitle: 'Reach a real Iraqi audience', sections: [
      { heading: 'Why Iraq Now?', body: 'An Iraqi news audience from all 19 governorates, arriving directly from search engines and social platforms, for fast, trustworthy reading in Arabic and English.' },
      { heading: 'Available Formats', body: 'In-article display placements, section sponsorships, podcast episode sponsorship, and sponsored content campaigns. We tailor the package to your goals and budget.' },
      { heading: 'Contact Us', body: 'Email info@iraqnow.iq with the subject "Advertising" and a brief about your business, and we will send you the rate card and available options.' },
    ]},
  },
  partnerships: {
    ar: { title: 'الشراكات', subtitle: 'لنبنِ تغطية أفضل معاً', sections: [
      { heading: 'شراكات المحتوى', body: 'نرحب بشراكات تبادل المحتوى مع المؤسسات الإخبارية العراقية والعربية: تغطية مشتركة للأحداث الكبرى، وتبادل التقارير والتحليلات مع نسب المصدر الكامل.' },
      { heading: 'الجامعات ومراكز الأبحاث', body: 'نوفر للباحثين والطلاب وصولاً مجانياً لقواعد بياناتنا المفتوحة، ونستقبل مقترحات الدراسات التي تعتمد على بيانات المنصة.' },
      { heading: 'تواصل معنا', body: 'راسلنا على info@iraqnow.iq بعنوان «شراكة» مع وصف المقترح، وسيعاود فريقنا التواصل معك خلال أيام.' },
    ]},
    en: { title: 'Partnerships', subtitle: 'Build better coverage together', sections: [
      { heading: 'Content Partnerships', body: 'We welcome content-exchange partnerships with Iraqi and Arab news organizations: joint coverage of major events, and exchange of reports and analyses with full source attribution.' },
      { heading: 'Universities & Research Centers', body: 'We provide researchers and students free access to our open datasets, and welcome study proposals based on platform data.' },
      { heading: 'Contact Us', body: 'Email info@iraqnow.iq with the subject "Partnership" describing your proposal, and our team will get back to you within days.' },
    ]},
  },
  licensing: {
    ar: { title: 'ترخيص المحتوى', subtitle: 'حقوق استخدام المواد المنشورة', sections: [
      { heading: 'حقوق النشر', body: 'كل المحتوى المنشور على منصة العراق الآن — من نصوص وصور وتصاميم — محمي بحقوق النشر ولا يجوز إعادة نشره تجارياً دون إذن كتابي مسبق.' },
      { heading: 'إعادة النشر المجانية', body: 'يُسمح بإقتباس جزئي (حتى 3 فقرات) مع الإشارة الواضحة «المصدر: العراق الآن» وإرفاق رابط مباشر للمقال الأصلي.' },
      { heading: 'طلبات الترخيص', body: 'للاستخدام التجاري الموسّع أوالتوزيع الكامل للمحتوى، تواصل معنا على info@iraqnow.iq بعنوان «ترخيص» مع تفاصيل الاستخدام المطلوب.' },
    ]},
    en: { title: 'Content Licensing', subtitle: 'Usage rights for published material', sections: [
      { heading: 'Copyright', body: 'All content published on Iraq Now — text, images and design — is protected by copyright and may not be republished commercially without prior written permission.' },
      { heading: 'Free Republishing', body: 'Partial quotation (up to 3 paragraphs) is permitted with clear credit "Source: Iraq Now" and a direct link to the original article.' },
      { heading: 'License Requests', body: 'For extended commercial use or full content distribution, contact info@iraqnow.iq with the subject "Licensing" including details of the intended use.' },
    ]},
  },
  about: {
    ar: { title: 'عن العراق الآن', subtitle: 'من قلب بلاد الرافدين، إلى العالم', sections: [
      { heading: 'من نحن', body: 'العراق الآن منصة إخبارية عراقية مستقلة متعددة اللغات (العربية، الكردية، الإنكليزية). نؤمن بأن العراق يستحق صحافة نوعية — تحقيق، تحليل، وبيانات مفتوحة. نحن لسنا مملوكة لأي حزب أو حكومة أو دولة أجنبية.' },
      { heading: 'رسالتنا', body: 'تقديم أخبار موثوقة بمعايير صحفية دولية، مع تغطية شاملة لجميع المحافظات الـ 19، وإعطاء صوت للمجتمعات المهمشة. نستخدم تقنية حديثة لتقديم الأخبار بسرعة ووضوح.' },
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
  const info = data[locale as Locale] || data.ar || data.en!
  return { title: info.title, description: info.subtitle }
}

export async function generateStaticParams() {
  return Object.keys(INFO_PAGES).flatMap((page) =>
    ['ar', 'en'].map((locale) => ({ page, locale }))
  )
}

export const dynamic = 'force-static'

export default async function InfoPageView({ params }: { params: Promise<{ locale: string; page: string }> }) {
  const { locale: rawLocale, page } = await params
  const locale = (rawLocale === 'en' ? 'en' : 'ar') as Locale
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
  const info = data[locale] || data.ar || data.en!
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  return (
    <div dir={dir} className="min-h-screen bg-[var(--background)]">
      <div className="container-main max-w-3xl py-12">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs text-[var(--muted)]">
          <Link href={`/${locale}`} className="flex items-center gap-1.5 hover:text-[var(--foreground)]">
            <Home className="h-3.5 w-3.5" /> {locale === 'en' ? 'Home' : 'الرئيسية'}
          </Link>
          <ChevronLeft className="h-3.5 w-3.5 ltr:rotate-180" />
          <span className="font-medium text-[var(--muted)]">{info.title}</span>
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
