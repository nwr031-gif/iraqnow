/**
 * مزامنة فهرس Meilisearch مع المقالات المنشورة — تُشغَّل ضمن البناء
 * الاستخدام: NEXT_PUBLIC_SUPABASE_URL=... MEILISEARCH_ADMIN_KEY=... node scripts/sync-meilisearch.cjs
 */
const https = require('https')

const SB = process.env.NEXT_PUBLIC_SUPABASE_URL
const SBK = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
const MH = process.env.MEILISEARCH_HOST
const MK = process.env.MEILISEARCH_ADMIN_KEY

function restJSON(url, method, key, body) {
  return new Promise((r) => {
    const req = https.request(url, {
      method: method || 'GET',
      headers: { Authorization: `Bearer ${key}`, apikey: key, 'Content-Type': 'application/json' },
      timeout: 45000,
    }, (x) => {
      let d = ''
      x.on('data', (c) => (d += c))
      x.on('end', () => { try { r({ s: x.statusCode, j: JSON.parse(d) }) } catch { r({ s: x.statusCode, j: null }) } })
    })
    req.on('error', () => r({ s: 0, j: null }))
    if (body) req.write(JSON.stringify(body))
    req.end()
  })
}

;(async () => {
  if (!SB || !SBK || !MH || !MK) {
    console.log('⚠ مزامنة Meili: متغيرات ناقصة — تخطٍ')
    process.exit(0)
  }

  /* 1) جلب المقالات المنشورة من Supabase */
  const sr = await restJSON(`${SB}/rest/v1/articles?status=eq.PUBLISHED&select=id,slug,title_ar,title_en,excerpt_ar,excerpt_en,content_ar,category_slug,governorate_slug,breaking,featured,image,view_count,reading_time,published_at,updated_at,author_name&order=published_at.desc&limit=1000`, 'GET', SBK)
  if (!Array.isArray(sr.j)) { console.log('⚠ تعذر جلب المقالات'); process.exit(0) }

  const docs = sr.j.map((a) => ({
    id: a.id,
    objectID: a.id,
    slug: a.slug,
    title_ar: a.title_ar || '',
    title_en: a.title_en || '',
    excerpt_ar: a.excerpt_ar || '',
    excerpt_en: a.excerpt_en || '',
    content_ar: (a.content_ar || '').slice(0, 8000),
    categorySlug: a.category_slug || 'world',
    governorateSlug: a.governorate_slug || '',
    breaking: !!a.breaking,
    featured: !!a.featured,
    image: a.image || '',
    viewCount: a.view_count || 0,
    readingTime: a.reading_time || 3,
    publishedAt: a.published_at || '',
    publishedAtTs: a.published_at ? Math.floor(new Date(a.published_at).getTime() / 1000) : 0,
    updatedAt: a.updated_at || '',
    authorName: a.author_name || 'العراق الآن',
  }))

  console.log(`مقالات للمزامنة: ${docs.length}`)

  /* 2) الدفع إلى Meili (المفتاح الأساسي الحالي: id) */
  const add = await restJSON(`${MH}/indexes/articles/documents`, 'POST', MK, docs)
  if (add.s !== 202) { console.log('⚠ فشل الدفع:', add.s); process.exit(0) }
  const taskUid = add.j.taskUid

  /* 3) انتظار اكتمال المهمة */
  let done = false
  for (let i = 0; i < 30; i++) {
    await new Promise((r) => setTimeout(r, 700))
    const st = await restJSON(`${MH}/tasks/${taskUid}`, 'GET', MK)
    if (st.j && (st.j.status === 'succeeded' || st.j.status === 'failed')) {
      done = st.j.status === 'succeeded'
      if (!done) console.log('⚠ المهمة فشلت:', JSON.stringify(st.j.error || {}).slice(0, 200))
      break
    }
  }

  /* 4) إعدادات الفهرس (مرة كل عملية) */
  await restJSON(`${MH}/indexes/articles/settings`, 'PATCH', MK, {
    searchableAttributes: ['title_ar', 'title_en', 'excerpt_ar', 'excerpt_en', 'content_ar', 'tags_ar'],
    filterableAttributes: ['categorySlug', 'governorateSlug', 'breaking', 'featured'],
    sortableAttributes: ['publishedAtTs', 'viewCount'],
  })

  console.log(done ? '✓ Meilisearch متزامن' : '⚠ انتهى بلا تأكيد نهائي')
})()
