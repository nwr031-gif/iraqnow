import Link from 'next/link'
import { Send, MessageSquare, Rss, Globe, Mail, Shield, Scale, MapPin, Phone, ArrowUp } from 'lucide-react'
import { Logo, IshtarStar, CuneiformDivider, CuneiformBand } from '@/components/brand/Brand'

type Locale = 'ar' | 'ku' | 'en'

const FOOTER_DATA: Record<Locale, any> = {
  ar: {
    description: 'منصة إخبارية عراقية مستقلة متعددة اللغات، تقدم تغطية شاملة ومصداقية من قلب بغداد إلى أربيل والبصرة والموصل. صوت العراق الحقيقي، بثلاث لغات.',
    tagline: 'من قلب بلاد الرافدين، إلى العالم',
    sections: {
      navigation: {
        title: 'التنقل',
        links: [
          { label: 'الرئيسية', href: '/' },
          { label: 'آخر الأخبار', href: '/latest' },
          { label: 'الخريطة التفاعلية', href: '/map' },
          { label: 'صحافة البيانات', href: '/data' },
          { label: 'البودكاست', href: '/podcasts' },
          { label: 'الأرشيف', href: '/archive' },
        ],
      },
      about: {
        title: 'المؤسسة',
        links: [
          { label: 'عن العراق الآن', href: '/about' },
          { label: 'فريق التحرير', href: '/team' },
          { label: 'السياسة التحريرية', href: '/editorial-policy' },
          { label: 'التحقق من المعلومات', href: '/fact-check' },
          { label: 'فرص العمل', href: '/careers' },
          { label: 'اتصل بنا', href: '/contact' },
        ],
      },
      services: {
        title: 'خدمات',
        links: [
          { label: 'النشرة البريدية', href: '/newsletter' },
          { label: 'تطبيق الجوال', href: '/app' },
          { label: 'واجهة API', href: '/developers' },
          { label: 'أعلن معنا', href: '/advertise' },
          { label: 'الشراكات', href: '/partnerships' },
          { label: 'ترخيص المحتوى', href: '/licensing' },
        ],
      },
    },
    trustBadges: ['محتوى موثّق', 'تحرير مستقل', 'تغطية شاملة'],
    copyright: '© 2026 العراق الآن — Iraq Now. جميع الحقوق محفوظة.',
    madeIn: 'صُنع في بغداد بكل فخر',
    address: 'بغداد، العراق',
  },
  ku: {
    description: 'پلاتفۆرمێکی هەواڵی سەربەخۆی عێراقی بە چەند زمان، پەرپێدانی گشتگیر و باوەڕپێکراو لە دڵی بەغدادەوە بۆ هەولێر و بەسرە و موسڵ.',
    tagline: 'لە دڵی میزۆپۆتامیاوە، بۆ جیهان',
    sections: {
      navigation: {
        title: 'ناڤیگەیشن',
        links: [
          { label: 'سەرەکی', href: '/' },
          { label: 'دوایین هەواڵەکان', href: '/latest' },
          { label: 'نەخشەی بەراوەر', href: '/map' },
          { label: 'رۆژنامەوانی داتا', href: '/data' },
          { label: 'پۆدکاست', href: '/podcasts' },
          { label: 'ئەرشیف', href: '/archive' },
        ],
      },
      about: {
        title: 'دەربارە',
        links: [
          { label: 'دەربارەی عێراق ئێستا', href: '/about' },
          { label: 'تیمی ڕۆژنامەوانی', href: '/team' },
          { label: 'سیاسەتی ڕۆژنامەوانی', href: '/editorial-policy' },
          { label: 'پشکنینی زانیاری', href: '/fact-check' },
          { label: 'هەلی کار', href: '/careers' },
          { label: 'پەیوەندی', href: '/contact' },
        ],
      },
      services: {
        title: 'خزمەتگوزاری',
        links: [
          { label: 'نامەی هەواڵ', href: '/newsletter' },
          { label: 'ئەپی مۆبایل', href: '/app' },
          { label: 'API', href: '/developers' },
          { label: 'ڕیکلام', href: '/advertise' },
          { label: 'هاوبەشی', href: '/partnerships' },
          { label: 'مۆڵەتی ناوەڕۆک', href: '/licensing' },
        ],
      },
    },
    trustBadges: ['ناوەڕۆکی باوەڕپێکراو', 'سەربەخۆیی', 'پەرپێدانی گشتگیر'],
    copyright: '© 2026 عێراق ئێستا — Iraq Now. هەموو مافەکان پارێزراون.',
    madeIn: 'بە فەخری لە بەغداد دروستکراوە',
    address: 'بەغداد، عێراق',
  },
  en: {
    description: 'An independent Iraqi multilingual news platform delivering comprehensive, credible coverage from the heart of Baghdad to Erbil, Basra, and Mosul. The true voice of Iraq, in three languages.',
    tagline: 'From Mesopotamia to the World',
    sections: {
      navigation: {
        title: 'Navigation',
        links: [
          { label: 'Home', href: '/' },
          { label: 'Latest News', href: '/latest' },
          { label: 'Interactive Map', href: '/map' },
          { label: 'Data Journalism', href: '/data' },
          { label: 'Podcasts', href: '/podcasts' },
          { label: 'Archive', href: '/archive' },
        ],
      },
      about: {
        title: 'Company',
        links: [
          { label: 'About Iraq Now', href: '/about' },
          { label: 'Editorial Team', href: '/team' },
          { label: 'Editorial Policy', href: '/editorial-policy' },
          { label: 'Fact Checking', href: '/fact-check' },
          { label: 'Careers', href: '/careers' },
          { label: 'Contact Us', href: '/contact' },
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
    trustBadges: ['Verified Content', 'Independent', 'Comprehensive'],
    copyright: '© 2026 Iraq Now. All rights reserved.',
    madeIn: 'Proudly Made in Baghdad',
    address: 'Baghdad, Iraq',
  },
}

export function Footer({ locale }: { locale: Locale }) {
  const data = FOOTER_DATA[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'

  const socials = [
    { Icon: Send, href: 'https://t.me/iraqnow', label: 'Telegram' },
    { Icon: MessageSquare, href: 'https://wa.me/iraqnow', label: 'WhatsApp' },
    { Icon: Globe, href: 'https://x.com/iraqnow', label: 'X' },
    { Icon: Rss, href: '/rss', label: 'RSS' },
    { Icon: Mail, href: 'mailto:info@iraqnow.iq', label: 'Email' },
  ]

  return (
    <footer className="relative overflow-hidden bg-lapis-950 text-sand-100" dir={dir}>
      {/* خلفية زخرفية */}
      <div className="pointer-events-none absolute inset-0 ishtar-grid opacity-40" aria-hidden="true" />
      <div
        className="pointer-events-none absolute -top-40 start-1/2 h-80 w-[600px] -translate-x-1/2 rounded-full opacity-20 blur-3xl"
        style={{ background: 'radial-gradient(circle, #d4af37 0%, transparent 70%)' }}
        aria-hidden="true"
      />

      <CuneiformBand />

      <div className="container-main relative py-14 lg:py-20">
        <div className="grid gap-10 lg:grid-cols-12">
          {/* العمود الأول - الهوية */}
          <div className="lg:col-span-4">
            <Logo locale={locale} variant="light" showTagline />
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-sand-100/70">
              {data.description}
            </p>

            <p className="mt-4 flex items-center gap-2 text-xs font-medium text-gold-400/90">
              <IshtarStar size={14} />
              {data.tagline}
            </p>

            <div className="mt-6 flex flex-wrap gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex h-10 w-10 items-center justify-center rounded-xl border border-sand-100/10 bg-white/5 text-sand-100/60 transition-all duration-300 hover:-translate-y-1 hover:border-gold-500/50 hover:bg-gold-500/15 hover:text-gold-400"
                >
                  <Icon className="h-4.5 w-4.5" />
                </a>
              ))}
            </div>

            <div className="mt-6 space-y-2 text-xs text-sand-100/50">
              <p className="flex items-center gap-2">
                <MapPin className="h-3.5 w-3.5 text-gold-500/70" />
                {data.address}
              </p>
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5 text-gold-500/70" />
                info@iraqnow.iq
              </p>
            </div>
          </div>

          {/* الأعمدة */}
          <div className="grid gap-8 sm:grid-cols-3 lg:col-span-8">
            {Object.entries(data.sections).map(([key, section]: [string, any]) => (
              <nav key={key} aria-labelledby={`footer-${key}`}>
                <h3 id={`footer-${key}`} className="mb-5 flex items-center gap-2 font-kufi text-sm font-bold text-gold-400">
                  <span className="h-3 w-1 rounded-full bg-gradient-to-b from-gold-400 to-gold-700" />
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link: any) => (
                    <li key={link.label}>
                      <Link
                        href={`/${locale}${link.href}`}
                        className="group inline-flex items-center gap-2 text-sm text-sand-100/60 transition-all duration-200 hover:text-gold-400"
                      >
                        <span className="h-px w-0 bg-gold-500 transition-all duration-300 group-hover:w-3" />
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <CuneiformDivider variant="star" className="opacity-60" />

        {/* الشريط السفلي */}
        <div className="flex flex-col items-center justify-between gap-4 text-xs text-sand-100/50 md:flex-row">
          <p>{data.copyright}</p>

          <div className="flex flex-wrap items-center justify-center gap-5">
            {data.trustBadges.map((badge: string, i: number) => (
              <span key={i} className="flex items-center gap-1.5">
                {i === 0 && <Shield className="h-3.5 w-3.5 text-gold-500" />}
                {i === 1 && <Scale className="h-3.5 w-3.5 text-gold-500" />}
                {i === 2 && <Globe className="h-3.5 w-3.5 text-gold-500" />}
                {badge}
              </span>
            ))}
            <span className="hidden text-sand-100/30 md:inline">•</span>
            <span className="text-gold-500/80">{data.madeIn} 🇮🇶</span>
          </div>

          <a
            href="#top"
            className="flex items-center gap-1.5 rounded-lg border border-sand-100/10 px-3 py-1.5 transition-all duration-300 hover:border-gold-500/50 hover:text-gold-400"
            aria-label="Back to top"
          >
            <ArrowUp className="h-3.5 w-3.5" />
            <span>{locale === 'en' ? 'Top' : 'للأعلى'}</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
