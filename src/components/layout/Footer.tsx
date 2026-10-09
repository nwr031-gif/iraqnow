import Link from 'next/link'
import { Facebook, Twitter, Youtube, Instagram, Telegram, Whatsapp, Rss, Globe, Mail, Shield, Scale } from 'lucide-react'

const footerData = {
  ar: {
    description: 'منصة إخبارية عراقية شاملة متعددة اللغات تقدم الأخبار بمصداقية وسرعة، مع خرائط تفاعلية وبحث متقدم.',
    sections: {
      navigation: {
        title: 'تنقل سريع',
        links: [
          { label: 'الرئيسية', href: '/' },
          { label: 'الأقسام', href: '/category/politics' },
          { label: 'الخريطة التفاعلية', href: '/map' },
          { label: 'صحافة البيانات', href: '/data' },
          { label: 'البودكاست', href: '/podcasts' },
          { label: 'الأرشيف', href: '/archive' },
        ],
      },
      about: {
        title: 'من نحن',
        links: [
          { label: 'عن IraqNow', href: '/about' },
          { label: 'فريق العمل', href: '/team' },
          { label: 'المنهجية التحريرية', href: '/editorial-policy' },
          { label: 'التحقق من الحقائق', href: '/fact-check' },
          { label: 'فرص العمل', href: '/careers' },
          { label: 'اتصل بنا', href: '/contact' },
        ],
      },
      legal: {
        title: 'سياسات',
        links: [
          { label: 'سياسة الخصوصية', href: '/privacy' },
          { label: 'شروط الاستخدام', href: '/terms' },
          { label: 'سياسة الكوكيز', href: '/cookies' },
          { label: 'إرشادات المجتمع', href: '/community-guidelines' },
          { label: 'تصحيح الأخطاء', href: '/corrections' },
          { label: 'إمكانية الوصول', href: '/accessibility' },
        ],
      },
      services: {
        title: 'خدمات',
        links: [
          { label: 'النشرة البريدية', href: '/newsletter' },
          { label: 'التطبيق', href: '/app' },
          { label: 'API للمطورين', href: '/developers' },
          { label: 'الإعلان معنا', href: '/advertise' },
          { label: 'الشراكات', href: '/partnerships' },
          { label: 'رخص المحتوى', href: '/licensing' },
        ],
      },
    },
    social: [
      { icon: Facebook, href: 'https://facebook.com/iraqnow', label: 'فيسبوك' },
      { icon: Twitter, href: 'https://twitter.com/iraqnow', label: 'تويتر' },
      { icon: Youtube, href: 'https://youtube.com/iraqnow', label: 'يوتيوب' },
      { icon: Instagram, href: 'https://instagram.com/iraqnow', label: 'إنستغرام' },
      { icon: Telegram, href: 'https://t.me/iraqnow', label: 'تيليجرام' },
      { icon: Whatsapp, href: 'https://whatsapp.com/channel/iraqnow', label: 'واتساب' },
      { icon: Rss, href: '/rss', label: 'RSS' },
    ],
    bottom: {
      copyright: '© 2026 IraqNow. جميع الحقوق محفوظة.',
      trustBadges: [
        { icon: Shield, text: 'محتوى موثوق' },
        { icon: Scale, text: 'تحرير مستقل' },
        { icon: Globe, text: 'تغطية شاملة' },
      ],
    },
  },
  ku: {
    description: 'پلاتفۆرمێکی هاوین لێوانەوە بۆ هەواڵەکانی عێراق بە سێ زمان (عەرەبی، کوردی، ئینگلیزی) بە ڕاستی و خێرایی، بە نەخشەی بەراوەر و گەڕانێکی سەرنجڕاکێش.',
    sections: {
      navigation: {
        title: 'ناوەڕۆک',
        links: [
          { label: 'سەرەکی', href: '/' },
          { label: 'بەشەکان', href: '/category/politics' },
          { label: 'نەخشەی بەراوەر', href: '/map' },
          { label: 'رۆژنامەوانی داتا', href: '/data' },
          { label: 'پۆدکاست', href: '/podcasts' },
          { label: 'ئەرشیف', href: '/archive' },
        ],
      },
      about: {
        title: 'دەربارەی ئێمە',
        links: [
          { label: 'دەربارەی IraqNow', href: '/about' },
          { label: 'تێم', href: '/team' },
          { label: 'مێتۆدۆلۆژیای ڕۆژنامەوانی', href: '/editorial-policy' },
          { label: 'پاکی راستی', href: '/fact-check' },
          { label: 'بۆشایی کاردەست', href: '/careers' },
          { label: 'پەیوەندی', href: '/contact' },
        ],
      },
      legal: {
        title: 'سیاسەتەکان',
        links: [
          { label: 'سیاسەتی تایبەتێتی', href: '/privacy' },
          { label: 'مەرجەکانی بەکارهێنان', href: '/terms' },
          { label: 'سیاسەتی کوکی', href: '/cookies' },
          { label: 'ڕێنمایی کۆمەڵگە', href: '/community-guidelines' },
          { label: 'چاککردنەوەی ھەڵەکان', href: '/corrections' },
          { label: 'دەسەڵاتدانی', href: '/accessibility' },
        ],
      },
      services: {
        title: 'خزمەتگوزاریەکان',
        links: [
          { label: 'نیوزلێتەر', href: '/newsletter' },
          { label: 'ئەپلیکەیشن', href: '/app' },
          { label: 'API بۆ پەرەپێدەران', href: '/developers' },
          { label: ' ڕیکلام بە مێمەوە', href: '/advertise' },
          { label: 'هاوپێچەکان', href: '/partnerships' },
          { label: 'مۆڵەتی ناوەڕۆک', href: '/licensing' },
        ],
      },
    },
    social: [
      { icon: Facebook, href: 'https://facebook.com/iraqnow', label: 'فەیسبووک' },
      { icon: Twitter, href: 'https://twitter.com/iraqnow', label: 'تویتەر' },
      { icon: Youtube, href: 'https://youtube.com/iraqnow', label: 'یۆتوب' },
      { icon: Instagram, href: 'https://instagram.com/iraqnow', label: 'ئینستاگرام' },
      { icon: Telegram, href: 'https://t.me/iraqnow', label: 'تێلێگرام' },
      { icon: Whatsapp, href: 'https://whatsapp.com/channel/iraqnow', label: 'واتساپ' },
      { icon: Rss, href: '/rss', label: 'RSS' },
    ],
    bottom: {
      copyright: '© 2026 IraqNow. ھەموو مافەکان پارێزراوە.',
      trustBadges: [
        { icon: Shield, text: 'ناوەڕۆکی باوەڕپێکراو' },
        { icon: Scale, text: 'ڕۆژنامەوانی سەربەخۆ' },
        { icon: Globe, text: 'پەرەپێدانی گشتگیر' },
      ],
    },
  },
  en: {
    description: 'A comprehensive Iraqi multilingual news platform delivering credible, fast news with interactive maps and advanced search.',
    sections: {
      navigation: {
        title: 'Quick Navigation',
        links: [
          { label: 'Home', href: '/' },
          { label: 'Sections', href: '/category/politics' },
          { label: 'Interactive Map', href: '/map' },
          { label: 'Data Journalism', href: '/data' },
          { label: 'Podcasts', href: '/podcasts' },
          { label: 'Archive', href: '/archive' },
        ],
      },
      about: {
        title: 'About Us',
        links: [
          { label: 'About IraqNow', href: '/about' },
          { label: 'Our Team', href: '/team' },
          { label: 'Editorial Policy', href: '/editorial-policy' },
          { label: 'Fact Checking', href: '/fact-check' },
          { label: 'Careers', href: '/careers' },
          { label: 'Contact', href: '/contact' },
        ],
      },
      legal: {
        title: 'Policies',
        links: [
          { label: 'Privacy Policy', href: '/privacy' },
          { label: 'Terms of Service', href: '/terms' },
          { label: 'Cookie Policy', href: '/cookies' },
          { label: 'Community Guidelines', href: '/community-guidelines' },
          { label: 'Corrections', href: '/corrections' },
          { label: 'Accessibility', href: '/accessibility' },
        ],
      },
      services: {
        title: 'Services',
        links: [
          { label: 'Newsletter', href: '/newsletter' },
          { label: 'Mobile App', href: '/app' },
          { label: 'Developer API', href: '/developers' },
          { label: 'Advertise', href: '/advertise' },
          { label: 'Partnerships', href: '/partnerships' },
          { label: 'Content Licensing', href: '/licensing' },
        ],
      },
    },
    social: [
      { icon: Facebook, href: 'https://facebook.com/iraqnow', label: 'Facebook' },
      { icon: Twitter, href: 'https://twitter.com/iraqnow', label: 'Twitter' },
      { icon: Youtube, href: 'https://youtube.com/iraqnow', label: 'YouTube' },
      { icon: Instagram, href: 'https://instagram.com/iraqnow', label: 'Instagram' },
      { icon: Telegram, href: 'https://t.me/iraqnow', label: 'Telegram' },
      { icon: Whatsapp, href: 'https://whatsapp.com/channel/iraqnow', label: 'WhatsApp' },
      { icon: Rss, href: '/rss', label: 'RSS' },
    ],
    bottom: {
      copyright: '© 2026 IraqNow. All rights reserved.',
      trustBadges: [
        { icon: Shield, text: 'Trusted Content' },
        { icon: Scale, text: 'Independent Journalism' },
        { icon: Globe, text: 'Comprehensive Coverage' },
      ],
    },
  },
}

export function Footer({ locale }: { locale: 'ar' | 'ku' | 'en' }) {
  const data = footerData[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  return (
    <footer className="border-t border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950" dir={dir}>
      <div className="container-main py-12 lg:py-16">
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href={`/${locale}`} className="flex items-center gap-2 mb-4" aria-label="IraqNow Home">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-accent">
                <span className="text-xl font-bold text-white">IQ</span>
              </div>
              <span className="font-kufi font-bold text-2xl text-primary">IraqNow</span>
            </Link>
            <p className="max-w-xs text-sm text-gray-600 dark:text-gray-400 mb-6">{data.description}</p>
            <div className="flex flex-wrap gap-3">
              {data.social.map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 text-gray-600 transition-colors hover:bg-accent hover:text-white dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-accent"
                  aria-label={item.label}
                >
                  <item.icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>

          {Object.entries(data.sections).map(([key, section]) => (
            <nav key={key} aria-labelledby={`footer-${key}`}>
              <h3 id={`footer-${key}`} className="font-semibold text-gray-900 dark:text-white mb-4">
                {section.title}
              </h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={`/${locale}${link.href}`}
                      className="text-sm text-gray-600 hover:text-accent transition-colors dark:text-gray-400 dark:hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-800">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="text-sm text-gray-500 dark:text-gray-400">{data.bottom.copyright}</p>
            <div className="flex items-center gap-6">
              {data.bottom.trustBadges.map((badge, i) => (
                <div key={i} className="flex items-center gap-1.5 text-sm text-gray-500 dark:text-gray-400">
                  <badge.icon className="h-4 w-4 text-accent" />
                  <span>{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}