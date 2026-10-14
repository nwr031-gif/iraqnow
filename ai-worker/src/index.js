/**
 * محرك الذكاء الاصطناعي — العراق الآن
 * يعمل 24/7 عبر Cron: يقرأ RSS العراق/الشرق الأوسط/العالم →
 * بحث مكثف (نص كامل + مصادر متقاطعة) → تحليل وكتابة عبر NVIDIA NIM (مع Workers AI احتياطاً)
 * → نشر في Supabase → إشعار إعادة نشر الموقع
 */

/* ═══════════ الإعدادات ═══════════ */

const FEEDS = [
  /* العراق */
  { url: 'https://shafaq.com/rss/ar', name: 'شفق نيوز', lang: 'ar', region: 'iraq' },
  { url: 'https://shafaq.com/rss/en', name: 'Shafaq News', lang: 'en', region: 'iraq' },
  { url: 'https://shafaq.com/rss/ku', name: 'شفق نیوز', lang: 'ku', region: 'iraq' },
  { url: 'https://news.google.com/rss/search?q=%D8%A7%D9%84%D8%B9%D8%B1%D8%A7%D9%82&hl=ar&gl=IQ&ceid=IQ:ar', name: 'أخبار العراق', lang: 'ar', region: 'iraq' },
  { url: 'https://news.google.com/rss/search?q=Iraq&hl=en-US&gl=US&ceid=US:en', name: 'Iraq News', lang: 'en', region: 'iraq' },
  { url: 'https://iraqinews.com/feed/', name: 'Iraqi News', lang: 'en', region: 'iraq' },
  /* الشرق الأوسط */
  { url: 'https://news.google.com/rss/search?q=%D8%A7%D9%84%D8%B4%D8%B1%D9%82+%D8%A7%D9%84%D8%A3%D9%88%D8%B3%D8%B7&hl=ar&gl=IQ&ceid=IQ:ar', name: 'أخبار الشرق الأوسط', lang: 'ar', region: 'region' },
  { url: 'https://www.skynewsarabia.com/rss', name: 'سكاي نيوز عربية', lang: 'ar', region: 'region' },
  { url: 'https://arabic.cnn.com/api/v1/rss/rss.xml', name: 'CNN عربية', lang: 'ar', region: 'region' },
  { url: 'https://arabic.rt.com/rss/', name: 'RT عربية', lang: 'ar', region: 'region' },
  /* العالم */
  { url: 'https://feeds.bbci.co.uk/arabic/rss.xml', name: 'BBC عربي', lang: 'ar', region: 'world' },
  { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', name: 'BBC World', lang: 'en', region: 'world' },
  { url: 'https://rss.dw.com/rdf/rss-ar-all', name: 'DW عربية', lang: 'ar', region: 'world' },
  { url: 'https://www.france24.com/ar/rss', name: 'فرانس 24', lang: 'ar', region: 'world' },
  { url: 'https://www.aljazeera.com/xml/rss/all.xml', name: 'الجزيرة', lang: 'en', region: 'world' },
  { url: 'https://www.alhurra.com/rss', name: 'الحرة', lang: 'ar', region: 'world' },
  /* أمريكا */
  { url: 'https://news.google.com/rss/search?q=%D8%A7%D9%84%D9%88%D9%84%D8%A7%D9%8A%D8%A7%D8%AA+%D8%A7%D9%84%D9%85%D8%AA%D8%AD%D8%AF%D8%A9+%D8%A7%D9%85%D8%B1%D9%8A%D9%83%D8%A7&hl=ar&gl=US&ceid=US:ar', name: 'أخبار أمريكا', lang: 'ar', region: 'world' },
  { url: 'https://rss.cnn.com/rss/edition_us.rss', name: 'CNN أمريكا', lang: 'en', region: 'world' },
  { url: 'https://rss.cnn.com/rss/edition_world.rss', name: 'CNN العالم', lang: 'en', region: 'world' },
  /* أوروبا */
  { url: 'https://news.google.com/rss/search?q=%D8%A3%D9%88%D8%B1%D9%88%D8%A8%D8%A7&hl=ar&gl=FR&ceid=FR:ar', name: 'أخبار أوروبا', lang: 'ar', region: 'world' },
  { url: 'https://rss.dw.com/rdf/rss-en-world', name: 'DW World', lang: 'en', region: 'world' },
  { url: 'https://www.france24.com/en/rss', name: 'France24 EN', lang: 'en', region: 'world' },
  /* روسيا وأوكرانيا */
  { url: 'https://news.google.com/rss/search?q=%D8%B1%D9%88%D8%B3%D9%8A%D8%A7&hl=ar&gl=IQ&ceid=IQ:ar', name: 'أخبار روسيا', lang: 'ar', region: 'world' },
  { url: 'https://tass.com/rss/v2.xml', name: 'TASS', lang: 'en', region: 'world' },
  { url: 'https://news.google.com/rss/search?q=%D8%A3%D9%88%D9%83%D8%B1%D8%A7%D9%86%D9%8A%D8%A7&hl=ar&gl=IQ&ceid=IQ:ar', name: 'أخبار أوكرانيا', lang: 'ar', region: 'world' },
  { url: 'https://kyivindependent.com/feed/', name: 'Kyiv Independent', lang: 'en', region: 'world' },
  /* الصين وآسيا */
  { url: 'https://news.google.com/rss/search?q=%D8%A7%D9%84%D8%B5%D9%8A%D9%86&hl=ar&gl=IQ&ceid=IQ:ar', name: 'أخبار الصين', lang: 'ar', region: 'world' },
  { url: 'https://www.chinadaily.com.cn/rss/world_rss.xml', name: 'China Daily', lang: 'en', region: 'world' },
  /* متابعة العالم */
  { url: 'https://news.un.org/feed/subscribe/ar/news/all/rss.xml', name: 'الأمم المتحدة', lang: 'ar', region: 'world' },
  { url: 'https://news.google.com/rss/headlines/section/topic/WORLD?hl=ar&gl=US&ceid=US:ar', name: 'أخبار العالم', lang: 'ar', region: 'world' },
]

const FEEDS_PER_RUN = 8

const CATEGORIES = ['politics', 'economy', 'security', 'society', 'culture', 'sports', 'technology', 'health', 'education', 'environment', 'local', 'world']

const GOVERNORATES = ['baghdad', 'basra', 'erbil', 'mosul', 'najaf', 'karbala', 'kirkuk', 'sulaymaniyah', 'anbar', 'duhok']

const CATEGORY_IMAGES = {
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

const AI_AUTHOR = {
  id: 'iraqnow', slug: 'iraqnow', email: 'news@iraqnow.com',
  name: 'العراق الآن', role: 'EDITOR',
  job_title: 'فريق التحرير',
  bio: 'فريق تحرير منصة العراق الآن — تغطية إخبارية على مدار الساعة من العراق والشرق الأوسط والعالم.',
}

const UA = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36'

const MAX_SEEN = 900
const MAX_FEED_BYTES = 150000
const MAX_ARTICLE_BYTES = 300000
const MAX_FULLTEXT_CHARS = 4200
const MAX_ARTICLE_AGE_MS = 8 * 3600_000
const MIN_HOOK_INTERVAL_MS = 60_000 /* نشر شبه فوري: إعادة بناء بعد كل جولة نشر */
const SAFETY_HOOK_INTERVAL_MS = 12 * 3600_000

/* كلمات وقف للعربية والإنجليزية (لتجميع القصص المتشابهة) */
const STOPWORDS = new Set([
  'في', 'من', 'على', 'إلى', 'الى', 'عن', 'مع', 'هذا', 'هذه', 'ذلك', 'التي', 'الذي', 'بعد', 'قبل', 'بين', 'أن', 'إن', 'او', 'أو', 'و', 'ما', 'لا', 'لم', 'لن', 'هو', 'هي', 'كان', 'كانت', 'قد', 'كل', 'بأن', 'عقد', 'خلال', 'ضد', 'حول', 'بشأن', 'بسبب', 'دون', 'حتى', 'ثم', 'أي', 'اي', 'كما', 'عند', 'عندما', 'اليوم', 'أمس', 'امس',
  'the', 'a', 'an', 'of', 'in', 'on', 'at', 'to', 'for', 'with', 'by', 'from', 'and', 'or', 'as', 'is', 'are', 'was', 'were', 'after', 'before', 'over', 'under', 'into', 'about', 'says', 'said', 'new', 'amid',
])

/* ═══════════ أدوات Supabase ═══════════ */

function sbHeaders(env, extra = {}) {
  return {
    apikey: env.SUPABASE_KEY,
    Authorization: `Bearer ${env.SUPABASE_KEY}`,
    'Content-Type': 'application/json',
    ...extra,
  }
}

async function loadState(env) {
  try {
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/site_settings?key=eq.ai_engine&select=value`, { headers: sbHeaders(env) })
    if (res.status !== 200) return null
    const rows = await res.json()
    if (!rows.length || !rows[0].value) return null
    return JSON.parse(rows[0].value)
  } catch { return null }
}

async function saveState(env, state) {
  try {
    await fetch(`${env.SUPABASE_URL}/rest/v1/site_settings`, {
      method: 'POST',
      headers: sbHeaders(env, { Prefer: 'resolution=merge-duplicates,return=minimal' }),
      body: JSON.stringify({ key: 'ai_engine', value: JSON.stringify(state), updated_at: new Date().toISOString() }),
    })
  } catch { /* تجاهل */ }
}

async function ensureAuthor(env) {
  try {
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/authors?id=eq.iraqnow&select=id`, { headers: sbHeaders(env) })
    const rows = res.status === 200 ? await res.json() : []
    if (!rows.length) {
      await fetch(`${env.SUPABASE_URL}/rest/v1/authors`, {
        method: 'POST',
        headers: sbHeaders(env, { Prefer: 'return=minimal' }),
        body: JSON.stringify({ ...AI_AUTHOR, specialties: ['أخبار عاجلة', 'تحليل'], is_active: true, article_count: 0 }),
      })
    }
  } catch { /* تجاهل */ }
}

async function insertArticle(env, row, diag) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/articles`, {
    method: 'POST',
    headers: sbHeaders(env, { Prefer: 'return=minimal' }),
    body: JSON.stringify(row),
  })
  if (res.status >= 200 && res.status < 300) return true
  try {
    const errBody = await res.json()
    diag.insertError = `${res.status} ${JSON.stringify(errBody).slice(0, 250)}`
  } catch {
    diag.insertError = `${res.status}`
  }
  return false
}

/* ترقية جودة الصور — المصغرات الصغيرة تُستبدل بنسخ عالية الدقة */
function upgradeImageUrl(url) {
  if (!url) return ''
  /* سكاي نيوز عربية: استبدال الأبعاد الصغيرة بـ 944/531 */
  if (/images\.skynewsarabia\.com/.test(url)) {
    return url.replace(/\/(\d{1,3})\/(\d{1,3})\//, (m, w, h) => {
      const W = parseInt(w, 10), H = parseInt(h, 10)
      return W < 400 && H < 400 ? '/944/531/' : m
    })
  }
  return url
}

/* مطابقة كلمات مفتاحية للموضوع مع صورة مناسبة من المسبح الموثق */
const KEYWORD_IMAGES = [
  { re: /نفط|بترول|OPEC|أوبك|صادرات|مصفاة/i, id: 'photo-1518709268805-4e9042af9f23' },
  { re: /دولار|دينار|صرف|مصرف|مركزي|ميزانية|اقتصاد/i, id: 'photo-1611974789855-9c2a0a7236a3' },
  { re: /كرة|مباراة|منتخب|دوري|لاعب|بطولة/i, id: 'photo-1461896836934-ffe607ba8211' },
  { re: /انتخاب|برلمان|حكومة|وزير|قمة|مفاوض/i, id: 'photo-1529107386315-e1a2ed48a620' },
  { re: /انفجار|هجوم|اشتباك|قصف|جيش|شرطة|أمن/i, id: 'photo-1541872703-74c5e44368f9' },
  { re: /مدرسة|جامعة|طلاب|تعليم|امتحان/i, id: 'photo-1503676260728-1c00da094a0b' },
  { re: /مستشفى|صحة|مرض|وباء|دواء/i, id: 'photo-1576091160399-112ba8d25d1d' },
  { re: /معرض|مسرح|تراث|ثقاف|فن/i, id: 'photo-1590247813693-5541d1c609fd' },
  { re: /ماء|مياه|جفاف|سيول|بيئة|تلوث|مناخ/i, id: 'photo-1470071459604-3b5ec3a7fe05' },
  { re: /تكنولوج|ذكاء اصطناعي|تطبيق|هاتف|رقمي|إنترنت|انترنت/i, id: 'photo-1518770660439-4636190af475' },
]

function pickImage(item, category, searchText, ogImage, memberImages) {
  /* مضيفات قد تكون محجوبة جغرافياً — نتجنبها كلياً */
  const UNRELIABLE = /russiatoday|rt\.com|sputnik/i
  const usable = (u) => {
    const up = upgradeImageUrl(u)
    return up && !UNRELIABLE.test(up) ? up : ''
  }

  /* 1) صورة الخبر من مصدر موثوق — الأكثر صلة */
  const upgraded = usable(item.image)
  if (upgraded) return upgraded

  /* 2) صورة الخبر الأصلية من صفحة الناشر (og:image) */
  const og = usable(ogImage)
  if (og) return og

  /* 3) صور من باقي مصادر القصة نفسها */
  for (const mi of memberImages || []) {
    const m = usable(mi)
    if (m) return m
  }

  /* 4) مطابقة الكلمات المفتاحية مع مسبح الصور الموثق */
  const text = `${searchText || ''}`
  for (const k of KEYWORD_IMAGES) {
    if (k.re.test(text)) {
      return `https://images.unsplash.com/${k.id}?auto=format&fit=crop&w=1200&q=75`
    }
  }

  /* 5) صورة القسم */
  const cid = (CATEGORY_IMAGES[category] || CATEGORY_IMAGES.world).split('?')[0]
  return `https://images.unsplash.com/${cid}?auto=format&fit=crop&w=1200&q=75`
}

/* ═══════════ أدوات RSS ═══════════ */

function decodeEntities(s) {
  return s
    .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
    .replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&quot;/g, '"')
    .replace(/&#0?39;|&apos;/g, "'").replace(/&nbsp;/g, ' ')
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(parseInt(n, 10)))
    .replace(/&#x([0-9a-fA-F]+);/g, (_, n) => String.fromCodePoint(parseInt(n, 16)))
    .replace(/&amp;/g, '&')
}

function stripTags(s) {
  return decodeEntities(s).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

function extractTag(block, tag) {
  const re = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i')
  const m = block.match(re)
  return m ? m[1] : ''
}

function extractAttr(block, tag, attr) {
  const re = new RegExp(`<${tag}[^>]*\\s${attr}=["']([^"']+)["'][^>]*>`, 'i')
  const m = block.match(re)
  return m ? m[1] : ''
}

function extractImage(block, baseUrl) {
  let img = extractAttr(block, 'media:content', 'url')
    || extractAttr(block, 'media:thumbnail', 'url')
    || extractAttr(block, 'enclosure', 'url')
  if (!img) {
    const desc = extractTag(block, 'description') || extractTag(block, 'content:encoded')
    const m = decodeEntities(desc).match(/<img[^>]+src=["']([^"']+)["']/i)
    if (m) img = m[1]
  }
  if (!img) return ''
  try { return new URL(decodeEntities(img), baseUrl).href } catch { return '' }
}

function parseFeed(xml, feed) {
  const items = []
  const chunks = xml.split(/<item[\s>]/i).slice(1)
  const entries = chunks.length ? chunks : xml.split(/<entry[\s>]/i).slice(1)

  for (const chunk of entries.slice(0, 40)) {
    const block = chunk.slice(0, 8000)
    const title = stripTags(extractTag(block, 'title'))
    if (!title || title.length < 15) continue

    let link = stripTags(extractTag(block, 'link'))
    if (!link) link = extractAttr(block, 'link', 'href')
    if (!link) continue

    const desc = stripTags(extractTag(block, 'description') || extractTag(block, 'content:encoded') || extractTag(block, 'summary')).slice(0, 1500)
    const pubRaw = stripTags(extractTag(block, 'pubDate') || extractTag(block, 'published') || extractTag(block, 'updated') || extractTag(block, 'dc:date'))
    const pubMs = pubRaw ? Date.parse(pubRaw) : Date.now()
    const sourceName = stripTags(extractTag(block, 'source')) || feed.name
    const image = extractImage(block, feed.url)

    items.push({ title, link, desc, pubMs: isNaN(pubMs) ? Date.now() : pubMs, sourceName, image, feed })
  }
  return items
}

async function readCapped(res, maxBytes) {
  const reader = res.body.getReader()
  const decoder = new TextDecoder()
  let data = ''
  while (data.length < maxBytes) {
    const { done, value } = await reader.read()
    if (done) break
    data += decoder.decode(value, { stream: true })
  }
  try { reader.cancel() } catch { /* تجاهل */ }
  return data
}

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: { 'User-Agent': UA, Accept: 'application/rss+xml, application/xml, text/xml, */*' },
      cf: { cacheTtl: 300 },
    })
    if (res.status !== 200) return []
    const data = await readCapped(res, MAX_FEED_BYTES)
    return parseFeed(data, feed)
  } catch { return [] }
}

/* ═══════════ البحث المكثف — جلب النص الكامل ═══════════ */

function extractParagraphs(html) {
  const body = html
    .replace(/<script[\s\S]*?<\/script>/gi, ' ')
    .replace(/<style[\s\S]*?<\/style>/gi, ' ')
    .replace(/<nav[\s\S]*?<\/nav>/gi, ' ')
    .replace(/<header[\s\S]*?<\/header>/gi, ' ')
    .replace(/<footer[\s\S]*?<\/footer>/gi, ' ')
    .replace(/<aside[\s\S]*?<\/aside>/gi, ' ')
    .replace(/<svg[\s\S]*?<\/svg>/gi, ' ')

  const paras = []
  const re = /<p[^>]*>([\s\S]*?)<\/p>/gi
  let m
  let total = 0
  while ((m = re.exec(body))) {
    const text = stripTags(m[1])
    if (text.length > 40) {
      paras.push(text)
      total += text.length
      if (total > MAX_FULLTEXT_CHARS) break
    }
  }
  return paras.join('\n')
}

async function fetchFullText(url) {
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml' },
      cf: { cacheTtl: 600 },
    })
    if (res.status !== 200) return { text: '', image: '' }
    const html = await readCapped(res, MAX_ARTICLE_BYTES)

    /* صفحات جوجل الإخبارية قد تحوّل عبر meta refresh */
    if (/news\.google\.com/.test(url)) {
      const refresh = html.match(/http-equiv=["']refresh["'][^>]*url=(["']?)(https?:\/\/[^"'>\s]+)\1/i)
      if (refresh) return fetchFullText(refresh[2])
      const canon = html.match(/<a[^>]+href=["'](https?:\/\/(?!news\.google)[^"']+)["'][^>]*>\s*<h[23]/i)
      if (canon) return fetchFullText(canon[1])
      return { text: '', image: '' }
    }

    const full = extractParagraphs(html)
    return {
      text: full.length > 200 ? full.slice(0, MAX_FULLTEXT_CHARS) : '',
      image: extractOgImage(html, url),
    }
  } catch { return { text: '', image: '' } }
}

/* صورة الخبر الأصلية من صفحة الناشر — الأكثر تطابقاً مع المحتوى */
function extractOgImage(html, baseUrl) {
  try {
    const m = html.match(/<meta[^>]+property=["']og:image(?::secure_url)?["'][^>]+content=["']([^"']+)["']/i)
      || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image(?::secure_url)?["']/i)
      || html.match(/<meta[^>]+name=["']twitter:image(?::src)?["'][^>]+content=["']([^"']+)["']/i)
    if (!m) return ''
    const raw = decodeEntities(m[1]).trim()
    if (!raw || /^data:/i.test(raw)) return ''
    const u = new URL(raw, baseUrl)
    if (!/^https?:$/.test(u.protocol)) return ''
    if (/news\.google\.com/.test(u.hostname)) return ''
    /* تجاهل الشعارات والأيقونات الصغيرة غالباً */
    if (/(logo|sprite|icon|favicon)/i.test(u.pathname)) return ''
    return u.href
  } catch { return '' }
}

/* ═══════════ التجزئة وتجميع القصص ═══════════ */

async function hashText(text) {
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text))
  return Array.from(new Uint8Array(digest)).slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('')
}

function titleKey(title) {
  const words = title
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w))
  if (words.length < 2) return ''
  return [...new Set(words)].sort().slice(0, 8).join('|')
}

/* ═══════════ الذكاء الاصطناعي — NIM أولاً ثم Workers AI ═══════════ */

function extractJson(text) {
  if (!text) return null
  /* إزالة الكتل الداخلية (reasoning) */
  const cleaned = text
    .replace(/[\s\S]*?<\/think>/gi, '')
    .replace(/<\|begin_of_thought\|>[\s\S]*?<\|end_of_thought\|>/gi, '')
  const start = cleaned.indexOf('{')
  const end = cleaned.lastIndexOf('}')
  if (start === -1 || end === -1 || end <= start) return null
  let slice = cleaned.slice(start, end + 1)
  slice = slice.replace(/,\s*([}\]])/g, '$1')
  try { return JSON.parse(slice) } catch { return null }
}

async function callNIM(env, messages, maxTokens) {
  const model = env.NIM_MODEL || 'nvidia/nemotron-3-super-120b-a12b'
  const res = await fetch('https://integrate.api.nvidia.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.NIM_KEY}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify({ model, messages, temperature: 0.3, top_p: 0.9, max_tokens: maxTokens }),
  })
  if (res.status !== 200) throw new Error(`NIM ${res.status}`)
  const j = await res.json()
  return j.choices && j.choices[0] && j.choices[0].message && j.choices[0].message.content
}

async function callCF(env, messages, maxTokens) {
  const model = env.AI_MODEL || '@cf/meta/llama-3.1-8b-instruct-fp8'
  const out = await env.AI.run(model, { messages, max_tokens: maxTokens, temperature: 0.35 })
  return out && out.response
}

function buildResearchPrompt(story) {
  const item = story.primary
  const corroborating = story.corroborating.map((c) => `- [${c.sourceName}] ${c.title}`).join('\n')

  return `مهمتك: تحليل هذا الحدث الإخباري تحليلاً عميقاً ثم كتابة تقرير صحفي احترافي.

## خطوة 1 — البحث والتحقق (داخلياً قبل الكتابة)
راجع جميع المواد أدناه بدقة: النص الكامل للتقرير الأساسي + عناوين تغطيات مصادر أخرى للحدث نفسه.
استخرج الحقائق المؤكدة فقط: ماذا حدث؟ متى؟ أين؟ من الأطراف؟ ما الأرقام والتصريحات الموثقة؟
أي معلومة غير موجودة صراحة في المواد أدناه ممنوع ذكرها. لا تفترض دوافع أو نتائج أو أرقاماً لم تُذكر.

## خطوة 2 — التحليل
طبّق عدسة المحلل الخبير المناسبة لطبيعة الخبر:
- أمني: طبيعة الحادث، الأطراف، خطر التصعيد، الردود المحتملة
- سياسي: الأطراف ومصالحهم، السيناريوهات المحتملة، ما يعنيه للاستقرار
- اقتصادي: أثر القرار على الدينار والنفط والأسواق والمواطن
- اجتماعي/صحي/تعليمي/بيئي: الفئة المتأثرة، الخدمات، الأثر اليومي، ردود الفعل

## المواد المصدرية
المصدر الأساسي: ${item.sourceName}
العنوان: ${item.title}
الملخص: ${item.desc || 'غير متوفر'}
النص الكامل المستخرج من الصفحة:
"""
${story.fullText || item.desc || 'غير متوفر'}
"""
${corroborating ? `\nتغطيات مصادر أخرى لنفس الحدث:\n${corroborating}\n` : '\nلا توجد تغطيات متقاطعة إضافية — اعتمد على المصدر الأساسي وحده، ولا تستنتج أي تفاصيل إضافية.\n'}

/* الخطوة 3 — كتابة التقرير
- عربي: 4-6 فقرات موجزة — فقرة افتتاحية قوية (ماذا/متى/أين/من) بصياغة جديدة لا تكرر عنوان الخبر حرفياً، ثم فقرات تفاصيل من النص الكامل ثم فقرة "لماذا يهم؟" تحليلية ثم فقرة "ما التالي؟" (نقاط المراقبة المستقبلية) وآخر سطر: "المصادر: <أسماء المصادر>"
- الإنجليزية: 2-3 فقرات موجزة جداً، آخر سطر: "Sources: <names>"
- النص عادي فقط، الفقرات مفصولة بـ \\n. ممنوع HTML وMarkdown والتعداد النقطي.
- دقة مطلقة: كل جملة تستند إلى المواد أعلاه حصراً.
- أسلوب صحفي طبيعي: لا تعلق أبداً على جودة المصادر أو نقص المعلومات، ولا تكتب جملاً مثل "لم يذكر المصدر" أو "لم يتوفر تاريخ". إن كانت معلومة غير متوفرة ببساطة تجاوزها. إن كانت المواد قليلة اجعل التقرير أقصر دون أي تعليق على ذلك.
- ممنوع بدأ أي فقرة بحرف العطف "و" — نوّع بادئات الفقرات والجمل (قال، أعلن، أشار، في سياق متصل، على صعيد...).
- "slug_hint": كلمات إنجليزية فعلية مستمدة من العنوان الإنجليزي مفصولة بشرطات (مثال: "iraq-central-bank-gold" أو "gaza-ceasefire-talks") — لا تكتب نصاً توضيحياً.

أعد JSON فقط دون أي نص خارجي بهذا الشكل:
{"category":"politics|economy|security|society|culture|sports|technology|health|education|environment|local|world","governorate":"baghdad|basra|erbil|mosul|najaf|karbala|kirkuk|sulaymaniyah|anbar|duhok أو null","breaking":true|false,"tags":["كلمة","كلمة","كلمة"],"slug_hint":"real-english-slug","ar":{"title":"...","excerpt":"سطر أو سطران","content":"..."},"en":{"title":"...","excerpt":"...","content":"..."}}`
}

async function generateArticle(env, story, diag) {
  const messages = [
    { role: 'system', content: 'detailed thinking off. أنت محلل أخبار استراتيجي محترف في وكالة "العراق الآن". تلتزم بالدقة المطلقة وعدم التخمين، وتُخرج دائماً JSON صالحاً فقط دون أي نص خارج JSON.' },
    { role: 'user', content: buildResearchPrompt(story) },
  ]

  /* NVIDIA NIM — نموذج تحليلي قوي (محاولتان) */
  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const content = await callNIM(env, messages, 6000)
      const parsed = extractJson(content)
      if (parsed && parsed.ar && parsed.ar.title && parsed.ar.content) {
        return { data: parsed, engine: 'nim' }
      }
      diag.parseFail = (diag.parseFail || 0) + 1
      diag.lastRaw = String(content || '').slice(0, 200)
    } catch (e) {
      diag.nimError = String(e && e.message || e).slice(0, 120)
    }
  }

  /* Workers AI احتياطاً */
  try {
    const content = await callCF(env, messages, 3000)
    const parsed = extractJson(content)
    if (parsed && parsed.ar && parsed.ar.title && parsed.ar.content) {
      return { data: parsed, engine: 'cf' }
    }
    diag.cfParseFail = (diag.cfParseFail || 0) + 1
  } catch (e) {
    diag.cfError = String(e && e.message || e).slice(0, 120)
  }

  return null
}

/* ═══════════ بناء صف المقال ونشره ═══════════ */

function slugify(s) {
  return (s || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .trim()
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .slice(0, 60)
}

/* تصنيف احتياطي بالكلمات المفتاحية */
function classifyByKeywords(title, desc) {
  const text = `${title} ${desc || ''}`
  const rules = [
    ['security', /انفجار|قتيل|قتلى|مقتل|هجوم|اشتباك|صاروخ|قصف|جرحى|إطلاق نار|اطلاق نار|خطف|اعتداء|جيش|شرطة|أمن/i],
    ['economy', /دولار|نفط|اقتصاد|بورصة|أسعار|اسعار|ميزانية|استثمار|تجارة|صرف|دين|تمويل|شركة/i],
    ['sports', /كرة|منتخب|مباراة|بطولة|لاعب|أولمبياد|اولمبياد|نادي|دوري/i],
    ['health', /صحة|مرض|مستشفى|وباء|دواء|تطعيم/i],
    ['technology', /تكنولوجيا|ذكاء اصطناعي|انترنت|إنترنت|هاتف|تطبيق|حاسوب|رقمي/i],
    ['education', /تعليم|مدرسة|جامعة|طلاب|امتحان/i],
    ['environment', /بيئة|مناخ|جفاف|تلوث|تصحر|سيول/i],
    ['culture', /ثقافة|فن|سينما|مسرح|تراث|معرض|مهرجان/i],
    ['politics', /انتخابات|حكومة|برلمان|رئيس|وزير|مفاوضات|قمة|سياسي|قرار|مجلس/i],
  ]
  for (const [cat, re] of rules) {
    if (re.test(text)) return cat
  }
  return 'world'
}

function validCategory(c) {
  if (!c) return null
  const map = {
    سياسة: 'politics', سياسي: 'politics', 'السياسة': 'politics',
    اقتصاد: 'economy', 'الاقتصاد': 'economy', اقتصادي: 'economy', اقتصادية: 'economy',
    أمن: 'security', امن: 'security', 'الأمن': 'security', أمني: 'security', أمنية: 'security',
    مجتمع: 'society', 'المجتمع': 'society', منوعات: 'society', اجتماعي: 'society',
    ثقافة: 'culture', 'الثقافة': 'culture', فن: 'culture', فنون: 'culture', ثقافي: 'culture',
    رياضة: 'sports', 'الرياضة': 'sports', رياضي: 'sports', رياضية: 'sports',
    تكنولوجيا: 'technology', تقنية: 'technology', 'التكنولوجيا': 'technology', تكنولوجي: 'technology',
    صحة: 'health', 'الصحة': 'health', صحي: 'health', صحية: 'health',
    تعليم: 'education', 'التعليم': 'education', تربوي: 'education', تعليمي: 'education',
    بيئة: 'environment', 'البيئة': 'environment', مناخ: 'environment', بيئي: 'environment',
    محليات: 'local', محلي: 'local', محافظات: 'local',
    عالم: 'world', 'العالم': 'world', دولي: 'world', 'الشرق الأوسط': 'world', عالمية: 'world',
  }
  const key = String(c).trim().toLowerCase()
  if (CATEGORIES.includes(key)) return key
  if (map[String(c).trim()]) return map[String(c).trim()]
  if (map[key]) return map[key]
  return null
}

function validGovernorate(g) {
  return GOVERNORATES.includes(g) ? g : null
}

function countWords(...texts) {
  return texts.join(' ').split(/\s+/).filter(Boolean).length
}

function cleanContent(s) {
  let out = (s || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\\n/g, '\n')
    .split('\n').map((l) => l.trim()).filter(Boolean).join('\n')

  /* مسافة إلزامية بعد علامات الترقيم قبل حرف عربي */
  out = out.replace(/([.،؛؟!])([ء-ي])/g, '$1 $2')
  /* طي المسافات المتعددة */
  out = out.replace(/[ \t]{2,}/g, ' ')
  return out
}

async function publishFromGenerated(env, gen, story, hash, diag) {
  const g = gen.data
  const item = story.primary
  if (!g || !g.ar || !g.ar.title || !g.ar.content) return null

  const shortHash = hash.slice(0, 6)
  const GENERIC_SLUGS = ['english-slug-4-words', 'english-slug', 'slug', 'news', 'real-english-slug']
  let slugBase = slugify(g.slug_hint) || slugify(g.en && g.en.title) || ''
  if (!slugBase || slugBase.length < 8 || GENERIC_SLUGS.includes(slugBase)) {
    slugBase = slugify(g.en && g.en.title) || slugify(arTitle) || 'iraq-news'
  }
  if (slugBase.length > 60) slugBase = slugBase.slice(0, 60).replace(/-[^-]*$/, '')
  const slug = `${slugBase}-${shortHash}`

  const arTitle = String(g.ar.title).slice(0, 180)
  const enTitle = String((g.en && g.en.title) || arTitle).slice(0, 180)
  const kuTitle = arTitle

  let arContent = cleanContent(g.ar.content)
  let enContent = cleanContent(g.en && g.en.content) || arContent
  const kuContent = arContent

  /* فرض نسب المصادر إن غاب سطر النسب */
  const sourcesLine = [...new Set([item.sourceName, ...story.corroborating.map((c) => c.sourceName)])].join('، ')
  const hasArSources = arContent.split('\n').some((l) => /^\s*(المصادر|المصدر)\s*:/.test(l))
  const hasEnSources = enContent.split('\n').some((l) => /^\s*sources?\s*:/i.test(l))
  if (arContent && !hasArSources) {
    arContent += `\nالمصادر: ${sourcesLine}`
  }
  if (enContent && !hasEnSources) {
    enContent += `\nSources: ${sourcesLine}`
  }

  const readingTime = Math.max(2, Math.round(countWords(arContent) / 200))
  const category = validCategory(g.category) || classifyByKeywords(arTitle, String(g.ar.excerpt || ''))
  const image = pickImage(item, category, `${arTitle} ${g.ar.excerpt || ''} ${(g.tags || []).join(' ')}`, story.ogImage, story.memberImages)

  const nowIso = new Date().toISOString()
  const row = {
    id: `ai-${Date.now()}-${shortHash}`.slice(0, 40),
    slug,
    status: 'PUBLISHED',
    breaking: Boolean(g.breaking) && (Date.now() - item.pubMs) < 90 * 60_000,
    featured: false,
    published_at: nowIso,
    created_at: nowIso,
    updated_at: nowIso,
    view_count: 0,
    reading_time: readingTime,
    author_id: AI_AUTHOR.id,
    author_name: AI_AUTHOR.name,
    category_slug: category,
    governorate_slug: validGovernorate(g.governorate),
    image,
    gallery: [],
    tags: Array.isArray(g.tags) ? g.tags.slice(0, 8).map((t) => String(t).slice(0, 40)) : [],
    title_ar: arTitle, title_ku: kuTitle, title_en: enTitle,
    excerpt_ar: String(g.ar.excerpt || '').slice(0, 500),
    excerpt_ku: String(g.ar.excerpt || '').slice(0, 500),
    excerpt_en: String((g.en && g.en.excerpt) || g.ar.excerpt || '').slice(0, 500),
    content_ar: arContent, content_ku: kuContent, content_en: enContent,
  }

  const ok = await insertArticle(env, row, diag)
  if (!ok) return null
  return { id: row.id, slug: row.slug, title: arTitle, category, breaking: row.breaking, engine: gen.engine, sources: sourcesLine }
}

/* ═══════════ المحرك الرئيسي ═══════════ */

async function runEngine(env, trigger) {
  const started = Date.now()
  const result = { trigger, feeds: 0, candidates: 0, fresh: 0, stories: 0, published: [], skipped: 0, hook: false, error: null }

  try {
    const state = (await loadState(env)) || {}
    const seen = state.seen || {}
    const today = new Date().toISOString().slice(0, 10)
    const daily = state.daily && state.daily.day === today ? state.daily : { day: today, used: 0 }
    const maxPerRun = parseInt(env.MAX_PER_RUN || '1', 10)
    const maxPerDay = parseInt(env.MAX_AI_PER_DAY || '30', 10)

    /* نشر المقالات المجدولة التي حان موعدها */
    try {
      const nowIso = new Date().toISOString()
      const schedRes = await fetch(`${env.SUPABASE_URL}/rest/v1/articles?status=eq.SCHEDULED&publish_at=lte.${nowIso}`, {
        method: 'PATCH',
        headers: sbHeaders(env, { Prefer: 'return=representation' }),
        body: JSON.stringify({ status: 'PUBLISHED', published_at: nowIso, updated_at: nowIso }),
      })
      if (schedRes.status === 200) {
        const rows = await schedRes.json()
        if (Array.isArray(rows) && rows.length > 0) result.scheduledPublished = rows.length
      }
    } catch { /* الجدول اختياري */ }

    /* تدوير قنوات RSS حسب الوقت */
    const slot = Math.floor(Date.now() / (30 * 60_000)) % Math.ceil(FEEDS.length / FEEDS_PER_RUN)
    const group = FEEDS.slice(slot * FEEDS_PER_RUN, slot * FEEDS_PER_RUN + FEEDS_PER_RUN)

    /* جلب وتجميع الأخبار */
    const batches = await Promise.all(group.map(fetchFeed))
    const items = batches.flat()
    result.feeds = group.length
    result.candidates = items.length

    /* فلترة الحديث + غير المعالج */
    const now = Date.now()
    const unseen = []
    for (const it of items) {
      if (now - it.pubMs > MAX_ARTICLE_AGE_MS) continue
      const hash = await hashText(it.link)
      it.hash = hash
      if (!seen[hash]) unseen.push(it)
    }
    result.fresh = unseen.length

    /* تجميع القصص المتشابهة — كل مجموعة قصة واحدة بمصادر متعددة */
    const storyMap = new Map()
    for (const it of unseen) {
      const key = titleKey(it.title)
      if (!key) continue
      if (!storyMap.has(key)) storyMap.set(key, { primary: it, corroborating: [] })
      else storyMap.get(key).corroborating.push(it)
    }
    const stories = [...storyMap.values()].sort((a, b) => b.primary.pubMs - a.primary.pubMs)
    result.stories = stories.length

    /* الميزانية */
    const budget = Math.max(0, Math.min(maxPerRun, maxPerDay - daily.used))
    const batch = stories.slice(0, budget)

    /* تعليم قصص الدفعة فقط كمعالجة — البقية تبقى مؤهلة للجولات القادمة */
    for (const story of batch) {
      seen[story.primary.hash] = now
      for (const c of story.corroborating) seen[c.hash] = now
    }

    /* البحث المكثف: النص الكامل + صورة الخبر الأصلية من أول مصدر مباشر */
    for (const story of batch) {
      story.corroborating = story.corroborating.slice(0, 4)
      const members = [story.primary, ...story.corroborating]
      const direct = members.find((c) => !/news\.google\.com/.test(c.link))
      let ft = await fetchFullText((direct || story.primary).link)
      story.fullText = ft.text
      story.ogImage = ft.image || ''
      story.memberImages = members.map((c) => c.image).filter(Boolean).slice(0, 5)
      if (!story.fullText) {
        const alt = members.find((c) => c !== (direct || story.primary) && !/news\.google\.com/.test(c.link))
        if (alt) {
          ft = await fetchFullText(alt.link)
          story.fullText = ft.text
          if (!story.ogImage) story.ogImage = ft.image || ''
        }
      }
    }

    /* التحليل والكتابة والنشر */
    await ensureAuthor(env)
    for (const story of batch) {
      const gen = await generateArticle(env, story, result)
      const published = gen ? await publishFromGenerated(env, gen, story, story.primary.hash, result) : null
      if (published) { result.published.push(published); daily.used++ }
      else result.skipped++
    }

    /* تشذيب القائمة القديمة */
    const hashes = Object.keys(seen)
    if (hashes.length > MAX_SEEN) {
      const sorted = hashes.sort((a, b) => seen[a] - seen[b])
      for (const h of sorted.slice(0, hashes.length - MAX_SEEN)) delete seen[h]
    }

    /* إشعار إعادة النشر */
    const lastHook = state.lastHook || 0
    const shouldHook =
      (result.published.length > 0 && now - lastHook > MIN_HOOK_INTERVAL_MS) ||
      (now - lastHook > SAFETY_HOOK_INTERVAL_MS)

    if (shouldHook) {
      /* المسار 1: Cloudflare Pages Deploy Hook */
      if (env.DEPLOY_HOOK) {
        try {
          const res = await fetch(env.DEPLOY_HOOK, { method: 'POST' })
          if (res.ok) { result.hook = true; state.lastHook = now }
        } catch { /* تجاهل */ }
      }
      /* المسار 2: GitHub repository_dispatch */
      if (!result.hook && env.GITHUB_TOKEN && env.GITHUB_REPO) {
        try {
          const res = await fetch(`https://api.github.com/repos/${env.GITHUB_REPO}/dispatches`, {
            method: 'POST',
            headers: {
              Authorization: `Bearer ${env.GITHUB_TOKEN}`,
              Accept: 'application/vnd.github+json',
              'User-Agent': 'iraqnow-ai',
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ event_type: 'content-update', client_payload: { source: 'ai-engine', count: result.published.length } }),
          })
          if (res.status === 204) { result.hook = true; state.lastHook = now }
        } catch { /* تجاهل */ }
      }
    }

    await saveState(env, { seen, daily, lastHook: state.lastHook || 0 })
  } catch (e) {
    result.error = String(e && e.message || e)
  }

  result.ms = Date.now() - started
  return result
}

/* ═══════════ نقطة الدخول ═══════════ */

export default {
  async scheduled(event, env, ctx) {
    /* نمط self-wake: الجدولة تستدعي HTTP endpoint (حد cron 30s على الخطة المجانية) */
    const selfUrl = env.SELF_TRIGGER_URL
    if (selfUrl) {
      const woke = await Promise.race([
        fetch(selfUrl, { method: 'POST', headers: { 'x-trigger-key': env.TRIGGER_KEY || '' } })
          .then((r) => r.ok)
          .catch(() => false),
        new Promise((res) => setTimeout(() => res(false), 8000)),
      ])
      if (woke) return
    }
    /* احتياط: تنفيذ مباشر */
    ctx.waitUntil(runEngine(env, 'cron'))
  },

  async fetch(request, env) {
    const url = new URL(request.url)
    const key = request.headers.get('x-trigger-key') || url.searchParams.get('key')

    if (url.pathname === '/' && request.method === 'GET') {
      return Response.json({ ok: true, engine: 'iraqnow-ai', feeds: FEEDS.length, nim: env.NIM_MODEL || null })
    }

    if (url.pathname === '/trigger' && (key === env.TRIGGER_KEY)) {
      const result = await runEngine(env, 'manual')
      return Response.json(result)
    }

    return new Response('Not found', { status: 404 })
  },
}
