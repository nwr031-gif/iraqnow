/**
 * بيانات العراق الحقيقية — من مصادر رسمية ودولية موثقة
 * كل رقم يحمّل مصدره وسنة البيانات. الأرقام تقريبية مدورة للمصدر.
 * آخر مراجعة: تشرين الأول 2026
 */

export const IRAQ_FACTS = {
  capital: 'بغداد',
  capitalEn: 'Baghdad',
  area: 438317, // كم²
  governorates: 19,
  population: 45.4, // مليون — التعداد العام للسكان 2024
  populationSource: 'التعداد العام للسكان 2024 — الجهاز المركزي للإحصاء',
  gdp: 250, // مليار دولار تقريباً — البنك الدولي 2023
  gdpSource: 'البنك الدولي — تقديرات الناتج المحلي الإجمالي 2023',
  oilReserves: 145, // مليار برميل — أوبك/البنك الدولي
  oilReservesSource: 'الاحتياطيات النفطية المؤكدة — أوبك (الخامسة عالمياً)',
  exchangeRate: 1320, // دينار/دولار — السعر الرسمي
  exchangeSource: 'البنك المركزي العراقي — السعر الرسمي منذ شباط 2023',
  currency: 'الدينار العراقي (IQD)',
  timezone: 'GMT+3',
  unemployment: 15.5, // % — البنك الدولي 2023
  unemploymentSource: 'البنك الدولي — مؤشرات التنمية العالمية 2023',
  oilRevenueShare: 90, // % النفط من إيرادات الموازنة — البنك الدولي
  urbanShare: 70, // % سكان الحضر تقريباً
}

/* سكان أكبر المحافظات — تقديرات التعداد العام 2024 (الجهاز المركزي للإحصاء) */
export const GOV_POPULATION: { ar: string; en: string; population: number }[] = [
  { ar: 'بغداد', en: 'Baghdad', population: 9.5 },
  { ar: 'نينوى', en: 'Nineveh', population: 3.8 },
  { ar: 'البصرة', en: 'Basra', population: 3.2 },
  { ar: 'ذي قار', en: 'Dhi Qar', population: 2.3 },
  { ar: 'السليمانية', en: 'Sulaymaniyah', population: 2.1 },
  { ar: 'الأنبار', en: 'Anbar', population: 1.8 },
  { ar: 'أربيل', en: 'Erbil', population: 1.7 },
  { ar: 'كركوك', en: 'Kirkuk', population: 1.7 },
  { ar: 'صلاح الدين', en: 'Salahuddin', population: 1.5 },
  { ar: 'النجف', en: 'Najaf', population: 1.4 },
]

export const GOV_POPULATION_SOURCE =
  'تقديرات التعداد العام للسكان 2024 — الجهاز المركزي للإحصاء (أرقام مدورة بالمليون)'

/* تركيبة إيرادات الموازنة الاتحادية — البنك الدولي */
export const BUDGET_MIX = [
  { label: 'إيرادات نفطية', value: 90, color: '#183a6f' },
  { label: 'إيرادات غير نفطية', value: 10, color: '#d4af37' },
]
export const BUDGET_MIX_SOURCE = 'البنك الدولي — نظرة عامة على العراق (النفط يشكل الغالبية من إيرادات الموازنة)'
