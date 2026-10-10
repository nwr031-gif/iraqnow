'use client'

import Link from 'next/link'
import { MapPin, ArrowLeft, ArrowRight } from 'lucide-react'
import { Reveal } from '@/components/ui/Reveal'
import { Iraq3DMap } from '@/components/map/Iraq3DMap'

type Locale = 'ar' | 'ku' | 'en'

interface MapSectionProps {
  locale: Locale
}

const UI: Record<Locale, any> = {
  ar: {
    badge: 'خريطة العراق 3D',
    title: 'الأخبار على الخريطة',
    subtitle: 'استكشف التغطية حسب المحافظة على خريطة 3D حية — من زاخو شمالاً إلى الفاو جنوباً',
    explore: 'الخريطة الكاملة',
  },
  ku: {
    badge: 'نەخشەی عێراق 3D',
    title: 'هەواڵەکان لەسەر نەخشە',
    subtitle: 'گەڕان بەپێی پارێزگا لەسەر نەخشەی 3D — لە زاخۆوە بۆ فاو',
    explore: 'نەخشەی تەواو',
  },
  en: {
    badge: 'Iraq 3D Map',
    title: 'News on the Map',
    subtitle: 'Explore coverage by governorate on a live 3D map — from Zakho to Faw',
    explore: 'Full Map',
  },
}

export function IraqMapSection({ locale }: MapSectionProps) {
  const t = UI[locale]
  const dir = locale === 'en' ? 'ltr' : 'rtl'
  const Arrow = dir === 'rtl' ? ArrowLeft : ArrowRight

  return (
    <section className="relative overflow-hidden bg-lapis-950 py-14 text-white lg:py-20" dir={dir} aria-labelledby="map-heading">
      <div className="pointer-events-none absolute inset-0 ishtar-grid opacity-50" aria-hidden="true" />
      <div className="pointer-events-none absolute -start-40 top-1/4 h-96 w-96 rounded-full bg-lapis-600/20 blur-[120px]" aria-hidden="true" />

      <div className="container-main relative">
        <Reveal className="mb-10 text-center">
          <span className="badge border border-gold-500/30 bg-gold-500/10 text-gold-400">
            <MapPin className="h-3.5 w-3.5" />
            {t.badge}
          </span>
          <h2 id="map-heading" className="mt-4 font-kufi text-3xl font-bold lg:text-4xl">
            {t.title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-sand-100/60">{t.subtitle}</p>
        </Reveal>

        <Reveal delay={120}>
          <Iraq3DMap locale={locale} height={520} showPanel={true} />
        </Reveal>

        <Reveal delay={200} className="mt-8 flex justify-center">
          <Link href={`/${locale}/map`} className="btn-primary group inline-flex font-kufi">
            <MapPin className="h-4 w-4" />
            {t.explore}
            <Arrow className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1 rtl:group-hover:-translate-x-1" />
          </Link>
        </Reveal>
      </div>
    </section>
  )
}
