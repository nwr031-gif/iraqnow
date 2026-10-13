/**
 * صور بديلة موثوقة حسب القسم — تعمل من جميع المناطق الجغرافية
 * (معرّفات Unsplash موثقة ومختبرة)
 */

const IDS: Record<string, string> = {
  politics: 'photo-1529107386315-e1a2ed48a620',
  economy: 'photo-1611974789855-9c2a0a7236a3',
  security: 'photo-1541872703-74c5e44368f9',
  society: 'photo-1529156069898-49953e39b3ac',
  culture: 'photo-1590247813693-5541d1c609fd',
  sports: 'photo-1461896836934-ffe607ba8211',
  technology: 'photo-1518770660439-4636190af475',
  health: 'photo-1576091160399-112ba8d25d1d',
  education: 'photo-1503676260728-1c00da094a0b',
  environment: 'photo-1470071459604-3b5ec3a7fe05',
  local: 'photo-1519681393784-d120267933ba',
  world: 'photo-1451187580459-43490279c0fa',
}

export function imageFallback(category?: string | null): string {
  const id = IDS[category || ''] || IDS.world
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=75`
}
