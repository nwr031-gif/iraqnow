/**
 * محرك الذكاء الاصطناعي — العراق الآن
 * يعمل 24/7 عبر Cron: يقرأ RSS العراق/الشرق الأوسط/العالم →
 * يحلل ويكتب مقالات (عربي/كردي/إنجليزي) عبر Workers AI → ينشر في Supabase
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
]

const FEEDS_PER_RUN = 6

const CATEGORIES = ['politics', 'economy', 'security', 'society', 'culture', 'sports', 'technology', 'health', 'education', 'environment', 'local', 'world']

const GOVERNORATES = ['baghdad', 'basra', 'erbil', 'mosul', 'najaf', 'karbala', 'kirkuk', 'sulaymaniyah', 'anbar', 'duhok']

const CATEGORY_IMAGES = {
  politics: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&q=75',
  economy: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=1200&q=75',
  security: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?w=1200&q=75',
  society: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=1200&q=75',
  culture: 'https://images.unsplash.com/photo-1590247813693-5541d1c609fd?w=1200&q=75',
  sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=75',
  technology: 'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=75',
  health: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=75',
  education: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?w=1200&q=75',
  environment: 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=1200&q=75',
  local: 'https://images.unsplash.com/photo-1519681393784-d120267933ba?w=1200&q=75',
  world: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=1200&q=75',
}

const AI_AUTHOR = {
  id: 'ai-newsroom', slug: 'ai-newsroom', email: 'ai@iraqnow.com',
  name: 'غرفة الأخبار الذكية', role: 'EDITOR',
  job_title: 'مدعومة بالذكاء الاصطناعي',
  bio: 'غرفة أخبار آلية تعمل 24/7 على مدار الساعة، تحلل وتلخص التقارير الإخبارية من مصادر موثوقة وتنشرها مع الإشارة الكاملة إلى المصدر، بمساعدة الذكاء الاصطناعي.',
}

const MAX_SEEN = 900
const MAX_FEED_BYTES = 150000
const MIN_ARTICLE_AGE = 0 /* ثانية */
const MAX_ARTICLE_AGE_MS = 8 * 3600_000
const MIN_HOOK_INTERVAL_MS = 3 * 3600_000
const SAFETY_HOOK_INTERVAL_MS = 12 * 3600_000

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
    const res = await fetch(`${env.SUPABASE_URL}/rest/v1/authors?id=eq.ai-newsroom&select=id`, { headers: sbHeaders(env) })
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

async function insertArticle(env, row) {
  const res = await fetch(`${env.SUPABASE_URL}/rest/v1/articles`, {
    method: 'POST',
    headers: sbHeaders(env, { Prefer: 'return=minimal' }),
    body: JSON.stringify(row),
  })
  return res.status >= 200 && res.status < 300
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

async function fetchFeed(feed) {
  try {
    const res = await fetch(feed.url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0 Safari/537.36',
        Accept: 'application/rss+xml, application/xml, text/xml, */*',
      },
      cf: { cacheTtl: 300 },
    })
    if (res.status !== 200) return []
    const reader = res.body.getReader()
    const decoder = new TextDecoder()
    let data = ''
    while (data.length < MAX_FEED_BYTES) {
      const { done, value } = await reader.read()
      if (done) break
      data += decoder.decode(value, { stream: true })
    }
    try { reader.cancel() } catch { /* تجاهل */ }
    return parseFeed(data, feed)
  } catch { return [] }
}

/* ═══════════ تجزئة الروابط (منع التكرار) ═══════════ */

async function hashUrl(url) {
  const data = new TextEncoder().encode(url)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest)).slice(0, 12).map((b) => b.toString(16).padStart(2, '0')).join('')
}

/* تجزئة العنوان الموحد — لمنع تكرار القصة نفسها من مصادر متعددة */
async function hashTitle(title) {
  const normalized = title.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, '').replace(/\s+/g, ' ').trim().slice(0, 80)
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(normalized))
  return 't' + Array.from(new Uint8Array(digest)).slice(0, 10).map((b) => b.toString(16).padStart(2, '0')).join('')
}

/* ═══════════ الذكاء الاصطناعي ═══════════ */

function buildPrompt(items) {
  const lines = items.map((it, i) => `[${i + 1}] المصدر: ${it.sourceName}
العنوان: ${it.title}
الملخص: ${it.desc || 'غير متوفر'}
الرابط: ${it.link}`).join('\n\n')

  return `أنت رئيس تحرير محترف في وكالة "العراق الآن" الإخبارية. أمامك ${items.length} خبر من مصادر موثوقة. لكل خبر، اكتب مقالاً إخبارياً جاهزاً للنشر بلغتين: العربية والإنجليزية.

القواعد الصارمة:
- اعتمد حصراً على المعلومات الواردة في العنوان والملخص. لا تختلق حقائق أو أرقاماً أو أسماء أو تصريحات غير موجودة.
- إن كانت المعلومات قليلة، اكتب نصاً قصيراً مع سياق عام موثوق دون تخمين أي تفاصيل.
- المحتوى نص عادي فقط: فقرات مفصولة بسطر جديد (\\n). ممنوع HTML أو Markdown أو عناوين فرعية أو تعداد نقطي.
- العربية: 4 فقرات على الأقل — فقرة افتتاحية تجيب ماذا/متى/أين/من، ثم فقرة تفاصيل، ثم فقرة تحليلية تبدأ بـ"لماذا يهم؟" تشرح أهمية الخبر بإيجاز، وآخر فقرة هي بالضبط: "المصدر: <اسم المصدر>".
- الإنجليزية: 2-3 فقرات موجزة، وآخر سطر فيها: "Source: <source name>".
- الأسلوب: مهني، محايد، واضح. العربية فصحى مبسطة.

أعد النتيجة كمصفوفة JSON فقط بدون أي نص خارجها أو شرح، بهذا الشكل:
[{"index":1,"category":"politics|economy|security|society|culture|sports|technology|health|education|environment|local|world","governorate":"baghdad|basra|erbil|mosul|najaf|karbala|kirkuk|sulaymaniyah|anbar|duhok أو null","breaking":false,"tags":["كلمة","كلمة"],"slug_hint":"english-slug-4-words","ar":{"title":"...","excerpt":"سطر أو سطران","content":"الفقرة الأولى\\nالفقرة الثانية\\nلماذا يهم؟...\\nالمصدر: ..."},"en":{"title":"...","excerpt":"...","content":"..."}}]

الأخبار:
${lines}`
}

function extractJson(text) {
  const start = text.indexOf('[')
  const end = text.lastIndexOf(']')
  if (start === -1 || end === -1 || end <= start) return null
  let slice = text.slice(start, end + 1)
  /* إزالة الفواصل الزائدة قبل } أو ] */
  slice = slice.replace(/,\s*([}\]])/g, '$1')
  try { return JSON.parse(slice) } catch { return null }
}

async function generateArticles(env, items) {
  const model = env.AI_MODEL || '@cf/meta/llama-3.1-8b-instruct'
  const prompt = buildPrompt(items)

  for (let attempt = 0; attempt < 2; attempt++) {
    try {
      const out = await env.AI.run(model, {
        messages: [
          { role: 'system', content: 'أنت محرر أخبار محترف. تلتزم بالدقة وعدم التخمين، وتجيب دائماً بـ JSON صالح فقط.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 2000,
        temperature: attempt === 0 ? 0.35 : 0.6,
      })
      const parsed = extractJson(out.response || '')
      if (Array.isArray(parsed) && parsed.length) return parsed
    } catch (e) {
      /* أعد المحاولة */
    }
  }
  return []
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

function validCategory(c) {
  if (!c) return null
  const map = {
    سياسة: 'politics', سياسي: 'politics', 'السياسة': 'politics',
    اقتصاد: 'economy', 'الاقتصاد': 'economy', اقتصادي: 'economy',
    أمن: 'security', امن: 'security', 'الأمن': 'security', أمني: 'security',
    مجتمع: 'society', 'المجتمع': 'society', منوعات: 'society',
    ثقافة: 'culture', 'الثقافة': 'culture', فن: 'culture', فنون: 'culture',
    رياضة: 'sports', 'الرياضة': 'sports', رياضي: 'sports',
    تكنولوجيا: 'technology', تقنية: 'technology', 'التكنولوجيا': 'technology',
    صحة: 'health', 'الصحة': 'health', صحي: 'health',
    تعليم: 'education', 'التعليم': 'education', تربوي: 'education',
    بيئة: 'environment', 'البيئة': 'environment', مناخ: 'environment',
    محليات: 'local', محلي: 'local', محافظات: 'local',
    عالم: 'world', 'العالم': 'world', دولي: 'world', 'الشرق الأوسط': 'world',
  }
  const key = String(c).trim().toLowerCase()
  if (CATEGORIES.includes(key)) return key
  if (map[String(c).trim()]) return map[String(c).trim()]
  if (map[key]) return map[key]
  return null
}

/* تصنيف احتياطي بالكلمات المفتاحية */
function classifyByKeywords(title, desc) {
  const text = `${title} ${desc || ''}`
  const rules = [
    ['security', /انفجار|قتيل|قتلى|مقتل|هجوم|اشتباك|صاروخ|قصف|جرحى|إطلاق نار|اطلاق نار|خطف|اعتداء|درع|جيش|شرطة|أمن/i],
    ['economy', /دولار|نفط|اقتصاد|بورصة|أسعار|اسعار|ميزانية|استثمار|تجارة|صرف|دين|تمويل|شركة/i],
    ['sports', /كرة|منتخب|مباراة|بطولة|لاعب|أولمبياد|اولمبياد|نادي|دوري/i],
    ['health', /صحة|مرض|مستشفى|وباء|دواء|تطعيم|إصابة صحية/i],
    ['technology', /تكنولوجيا|ذكاء اصطناعي|انترنت|إنترنت|هاتف|تطبيق|حاسوب|رقمي/i],
    ['education', /تعليم|مدرسة|جامعة|طلاب|امتحان|أستاذ/i],
    ['environment', /بيئة|مناخ|جفاف|تلوث|تصحر|سيول/i],
    ['culture', /ثقافة|فن|سينما|مسرح|تراث|معرض|مهرجان/i],
    ['politics', /انتخابات|حكومة|برلمان|رئيس|وزير|مفاوضات|قمة|سياسي|قرار|مجلس/i],
  ]
  for (const [cat, re] of rules) {
    if (re.test(text)) return cat
  }
  return 'world'
}

function validGovernorate(g) {
  return GOVERNORATES.includes(g) ? g : null
}

function countWords(...texts) {
  return texts.join(' ').split(/\s+/).filter(Boolean).length
}

function cleanContent(s) {
  return (s || '')
    .replace(/<[^>]*>/g, '')
    .replace(/\\n/g, '\n')
    .split('\n').map((l) => l.trim()).filter(Boolean).join('\n')
}

async function publishFromGenerated(env, generated, item, hash) {
  const g = generated
  if (!g || !g.ar || !g.ar.title || !g.ar.content) return null

  const shortHash = hash.slice(0, 6)
  const slugBase = slugify(g.slug_hint) || slugify(g.en && g.en.title) || 'news'
  const slug = `${slugBase}-${shortHash}`

  const arTitle = String(g.ar.title).slice(0, 180)
  const enTitle = String((g.en && g.en.title) || arTitle).slice(0, 180)
  const kuTitle = arTitle

  let arContent = cleanContent(g.ar.content)
  let enContent = cleanContent(g.en && g.en.content) || arContent
  const kuContent = arContent

  /* فرض نسب المصدر إن غاب عن النص */
  if (arContent && !arContent.includes('المصدر')) {
    arContent += `\n\nالمصدر: ${item.sourceName}`
  }
  if (enContent && !/source\s*:/i.test(enContent)) {
    enContent += `\n\nSource: ${item.sourceName}`
  }

  const readingTime = Math.max(2, Math.round(countWords(arContent) / 200))
  const category = validCategory(g.category) || classifyByKeywords(arTitle, String(g.ar.excerpt || ''))
  const image = item.image || CATEGORY_IMAGES[category] || CATEGORY_IMAGES.world

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

  const ok = await insertArticle(env, row)
  if (!ok) return null
  return { id: row.id, slug: row.slug, title: arTitle, category, breaking: row.breaking }
}

/* ═══════════ المحرك الرئيسي ═══════════ */

async function runEngine(env, trigger) {
  const started = Date.now()
  const result = { trigger, feeds: 0, candidates: 0, fresh: 0, published: [], skipped: 0, aiUsed: 0, hook: false, error: null }

  try {
    const state = (await loadState(env)) || {}
    const seen = state.seen || {}
    const today = new Date().toISOString().slice(0, 10)
    const daily = state.daily && state.daily.day === today ? state.daily : { day: today, used: 0 }
    const maxPerRun = parseInt(env.MAX_PER_RUN || '2', 10)
    const maxPerDay = parseInt(env.MAX_AI_PER_DAY || '30', 10)

    /* تدوير قنوات RSS حسب الوقت */
    const slot = Math.floor(Date.now() / (30 * 60_000)) % Math.ceil(FEEDS.length / FEEDS_PER_RUN)
    const group = FEEDS.slice(slot * FEEDS_PER_RUN, slot * FEEDS_PER_RUN + FEEDS_PER_RUN)

    /* جلب وتجميع الأخبار */
    const batches = await Promise.all(group.map(fetchFeed))
    const items = batches.flat()
    result.feeds = group.length
    result.candidates = items.length

    /* فلترة: حديثة + غير معالجة سابقاً */
    const now = Date.now()
    const unseen = []
    for (const it of items) {
      if (now - it.pubMs > MAX_ARTICLE_AGE_MS || now - it.pubMs < MIN_ARTICLE_AGE * 1000) continue
      const hash = await hashUrl(it.link)
      const titleHash = await hashTitle(it.title)
      it.hash = hash
      it.titleHash = titleHash
      if (!seen[hash] && !seen[titleHash]) unseen.push(it)
    }
    unseen.sort((a, b) => b.pubMs - a.pubMs)
    result.fresh = unseen.length

    /* تحديد الدفعة — ضمن الميزانية اليومية */
    const budget = Math.max(0, Math.min(maxPerRun, maxPerDay - daily.used))
    const batch = unseen.slice(0, budget)

    /* تعليم كل المرشحين كمعالجين (منع التكرار مستقبلاً) */
    for (const it of unseen) { seen[it.hash] = now; seen[it.titleHash] = now }

    /* توليد ونشر */
    await ensureAuthor(env)
    if (batch.length) {
      const generated = await generateArticles(env, batch)
      result.aiUsed = batch.length
      for (let i = 0; i < batch.length; i++) {
        const g = generated.find((x) => x && x.index === i + 1) || generated[i]
        const published = await publishFromGenerated(env, g, batch[i], batch[i].hash)
        if (published) { result.published.push(published); daily.used++ }
        else result.skipped++
      }
    }

    /* تشذيب القائمة القديمة */
    const hashes = Object.keys(seen)
    if (hashes.length > MAX_SEEN) {
      const sorted = hashes.sort((a, b) => seen[a] - seen[b])
      for (const h of sorted.slice(0, hashes.length - MAX_SEEN)) delete seen[h]
    }

    /* إشعار إعادة النشر إلى GitHub (repository_dispatch) */
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
      return Response.json({ ok: true, engine: 'iraqnow-ai', feeds: FEEDS.length })
    }

    if (url.pathname === '/trigger' && (key === env.TRIGGER_KEY)) {
      const result = await runEngine(env, 'manual')
      return Response.json(result)
    }

    return new Response('Not found', { status: 404 })
  },
}
