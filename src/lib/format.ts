/**
 * أدوات التنسيق العربية الموحدة — وقت، تاريخ، أرقام، أشهر
 */

const AR_MONTHS_LEVANT = [
  'كانون الثاني', 'شباط', 'آذار', 'نيسان', 'أيار', 'حزيران',
  'تموز', 'آب', 'أيلول', 'تشرين الأول', 'تشرين الثاني', 'كانون الأول',
]

const AR_MONTHS_GULF = [
  'يناير', 'فبراير', 'مارس', 'أبريل', 'مايو', 'يونيو',
  'يوليو', 'أغسطس', 'سبتمبر', 'أكتوبر', 'نوفمبر', 'ديسمبر',
]

export function arabicMonth(monthIndex: number, style: 'levant' | 'gulf' = 'levant'): string {
  return (style === 'gulf' ? AR_MONTHS_GULF : AR_MONTHS_LEVANT)[monthIndex] || ''
}

/**
 * الوقت النسبي العربي الصحيح نحوياً:
 * منذ لحظات / منذ دقيقة / منذ دقيقتين / منذ 33 دقيقة
 * منذ ساعة / منذ ساعتين / منذ 5 ساعات / أمس / منذ 3 أيام
 */
export function timeAgoAr(date: Date | string): string {
  const d = new Date(date)
  if (isNaN(d.getTime())) return ''
  const diffSec = Math.floor((Date.now() - d.getTime()) / 1000)
  if (diffSec < 60) return 'منذ لحظات'

  const mins = Math.floor(diffSec / 60)
  if (mins < 60) {
    if (mins === 1) return 'منذ دقيقة'
    if (mins === 2) return 'منذ دقيقتين'
    if (mins <= 10) return `منذ ${mins} دقائق`
    return `منذ ${mins} دقيقة`
  }

  const hours = Math.floor(mins / 60)
  if (hours < 24) {
    if (hours === 1) return 'منذ ساعة'
    if (hours === 2) return 'منذ ساعتين'
    if (hours <= 10) return `منذ ${hours} ساعات`
    return `منذ ${hours} ساعة`
  }

  const days = Math.floor(hours / 24)
  if (days === 1) return 'أمس'
  if (days === 2) return 'منذ يومين'
  if (days <= 10) return `منذ ${days} أيام`
  if (days < 30) return `منذ ${days} يوماً`

  const months = Math.floor(days / 30)
  if (months === 1) return 'منذ شهر'
  if (months === 2) return 'منذ شهرين'
  if (months < 12) return `منذ ${months} أشهر`
  return `منذ ${Math.floor(months / 12)} عام`
}

/**
 * التاريخ الهجري (أم القرى) — صيغة عربية رسمية
 */
export function hijriDate(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date
  try {
    return new Intl.DateTimeFormat('ar-SA-u-ca-islamic-umalqura', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(d) + ' هـ'
  } catch {
    return ''
  }
}

/**
 * التاريخ الميلادي بأشهر المشرق: 13 تشرين الأول 2026
 */
export function gregorianDateLevant(date: Date | string = new Date()): string {
  const d = typeof date === 'string' ? new Date(date) : date
  if (isNaN(d.getTime())) return ''
  return `${d.getDate()} ${arabicMonth(d.getMonth())} ${d.getFullYear()}`
}

/**
 * أرقام عربية-هندية للعرض عند الحاجة
 */
export function toArabicDigits(n: number | string): string {
  return String(n).replace(/\d/g, (d) => '٠١٢٣٤٥٦٧٨٩'[Number(d)])
}
