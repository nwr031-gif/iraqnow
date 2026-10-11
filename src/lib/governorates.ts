/**
 * المحافظات الـ 19 — بيانات مشتركة (خادم + متصفح)
 */
export interface GovMarker {
  slug: string
  ar: string
  ku: string
  en: string
  lon: number
  lat: number
  articles: number
  hot?: boolean
}

export const GOVERNORATES_19: GovMarker[] = [
  { slug: 'baghdad', ar: 'بغداد', ku: 'بەغداد', en: 'Baghdad', lon: 44.36, lat: 33.31, articles: 1240, hot: true },
  { slug: 'basra', ar: 'البصرة', ku: 'بەسرە', en: 'Basra', lon: 47.78, lat: 30.51, articles: 456, hot: true },
  { slug: 'mosul', ar: 'نينوى', ku: 'نەینەوا', en: 'Nineveh', lon: 43.12, lat: 36.34, articles: 342 },
  { slug: 'erbil', ar: 'أربيل', ku: 'هەولێر', en: 'Erbil', lon: 44.01, lat: 36.19, articles: 428, hot: true },
  { slug: 'sulaymaniyah', ar: 'السليمانية', ku: 'سلێمانی', en: 'Sulaymaniyah', lon: 45.43, lat: 35.56, articles: 289 },
  { slug: 'duhok', ar: 'دهوك', ku: 'دهۆک', en: 'Duhok', lon: 42.99, lat: 36.87, articles: 156 },
  { slug: 'halabja', ar: 'حلبجة', ku: 'هەڵەبجە', en: 'Halabja', lon: 45.99, lat: 35.18, articles: 87 },
  { slug: 'najaf', ar: 'النجف', ku: 'نەجەف', en: 'Najaf', lon: 44.01, lat: 32.0, articles: 312 },
  { slug: 'karbala', ar: 'كربلاء', ku: 'کەربەلا', en: 'Karbala', lon: 44.02, lat: 32.62, articles: 234 },
  { slug: 'anbar', ar: 'الأنبار', ku: 'ئەنبار', en: 'Anbar', lon: 41.25, lat: 33.42, articles: 198 },
  { slug: 'diyala', ar: 'ديالى', ku: 'دیالە', en: 'Diyala', lon: 45.15, lat: 33.75, articles: 134 },
  { slug: 'kirkuk', ar: 'كركوك', ku: 'کەرکووک', en: 'Kirkuk', lon: 44.39, lat: 35.47, articles: 267 },
  { slug: 'salahuddin', ar: 'صلاح الدين', ku: 'سەڵاحەدین', en: 'Salahuddin', lon: 43.58, lat: 34.45, articles: 178 },
  { slug: 'babylon', ar: 'بابل', ku: 'بابل', en: 'Babylon', lon: 44.42, lat: 32.54, articles: 145 },
  { slug: 'wasit', ar: 'واسط', ku: 'واسیت', en: 'Wasit', lon: 45.82, lat: 32.31, articles: 121 },
  { slug: 'maysan', ar: 'ميسان', ku: 'مێسان', en: 'Maysan', lon: 47.15, lat: 31.8, articles: 96 },
  { slug: 'dhi-qar', ar: 'ذي قار', ku: 'زیقار', en: 'Dhi Qar', lon: 46.26, lat: 31.05, articles: 221 },
  { slug: 'muthanna', ar: 'المثنى', ku: 'موسەننا', en: 'Muthanna', lon: 45.3, lat: 30.5, articles: 78 },
  { slug: 'qadisiya', ar: 'القادسية', ku: 'قادسیە', en: 'Qadisiya', lon: 44.93, lat: 31.99, articles: 132 },
]
