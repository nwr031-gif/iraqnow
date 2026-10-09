import { PrismaClient } from '@prisma/client'
import { hash } from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Seeding database...')

  // Create admin user
  const adminPassword = await hash('admin123', 12)
  const admin = await prisma.user.upsert({
    where: { email: 'admin@iraqnow.com' },
    update: {},
    create: {
      email: 'admin@iraqnow.com',
      name: 'Admin User',
      role: 'ADMIN',
      locale: 'ar',
      password: adminPassword,
    },
  })
  console.log('✅ Admin user created:', admin.email)

  // Create editor user
  const editorPassword = await hash('editor123', 12)
  const editor = await prisma.user.upsert({
    where: { email: 'editor@iraqnow.com' },
    update: {},
    create: {
      email: 'editor@iraqnow.com',
      name: 'Editor User',
      role: 'EDITOR',
      locale: 'ar',
      password: editorPassword,
    },
  })
  console.log('✅ Editor user created:', editor.email)

  // Create journalist user
  const journoPassword = await hash('journo123', 12)
  const journalist = await prisma.user.upsert({
    where: { email: 'journalist@iraqnow.com' },
    update: {},
    create: {
      email: 'journalist@iraqnow.com',
      name: 'Ahmed Al-Zubaydi',
      role: 'JOURNALIST',
      locale: 'ar',
      password: journoPassword,
    },
  })
  console.log('✅ Journalist user created:', journalist.email)

  // Create categories
  const categories = [
    { slug: 'politics', order: 1, translations: { ar: { name: 'السياسة', description: 'أخبار السياسة المحلية والدولية' }, ku: { name: 'سیاسەت', description: 'هەواڵە سیاسەتی ناوخۆ و نێودەوڵەتی' }, en: { name: 'Politics', description: 'Local and international political news' } } },
    { slug: 'economy', order: 2, translations: { ar: { name: 'الاقتصاد', description: 'أخبار الاقتصاد والأسواق' }, ku: { name: 'أپووری', description: 'هەواڵە ئابووری و بازاڕەکان' }, en: { name: 'Economy', description: 'Economic and market news' } } },
    { slug: 'security', order: 3, translations: { ar: { name: 'الأمن', description: 'أخبار الأمن والدفاع' }, ku: { name: 'ئاسایش', description: 'هەواڵە ئاسایش و پارێزگاری' }, en: { name: 'Security', description: 'Security and defense news' } } },
    { slug: 'society', order: 4, translations: { ar: { name: 'المجتمع', description: 'قضايا اجتماعية وإنسانية' }, ku: { name: 'کۆمەڵگە', description: 'کێشە کۆمەڵایەتی و مرۆڤایەتی' }, en: { name: 'Society', description: 'Social and humanitarian issues' } } },
    { slug: 'culture', order: 5, translations: { ar: { name: 'الثقافة', description: 'أخبار الثقافة والفنون والتراث' }, ku: { name: 'چанд', description: 'هەواڵە چاند، هونەر و میرات' }, en: { name: 'Culture', description: 'Culture, arts and heritage news' } } },
    { slug: 'sports', order: 6, translations: { ar: { name: 'الرياضة', description: 'أخبار الرياضة المحلية والدولية' }, ku: { name: 'وەرزش', description: 'هەواڵە وەرزش ناوخۆ و نێودەوڵەتی' }, en: { name: 'Sports', description: 'Local and international sports news' } } },
    { slug: 'technology', order: 7, translations: { ar: { name: 'التكنولوجيا', description: 'أخبار التقنية والابتكار' }, ku: { name: 'تەکنەلۆژی', description: 'هەواڵە تەکنەلۆژی و نوێکاری' }, en: { name: 'Technology', description: 'Technology and innovation news' } } },
    { slug: 'health', order: 8, translations: { ar: { name: 'الصحة', description: 'أخبار الصحة والطب' }, ku: { name: 'تەندروستی', description: 'هەواڵە تەندروستی و پزیشکی' }, en: { name: 'Health', description: 'Health and medical news' } } },
    { slug: 'education', order: 9, translations: { ar: { name: 'التعليم', description: 'أخبار التعليم والجامعات' }, ku: { name: 'پەروەردە', description: 'هەواڵە پەروەردە و زانکۆەکان' }, en: { name: 'Education', description: 'Education and university news' } } },
    { slug: 'environment', order: 10, translations: { ar: { name: 'البيئة', description: 'أخبار البيئة والمناخ' }, ku: { name: 'ژینگە', description: 'هەواڵە ژینگە و کەش و ھەوا' }, en: { name: 'Environment', description: 'Environment and climate news' } } },
    { slug: 'local', order: 11, translations: { ar: { name: 'محليات', description: 'أخبار المحافظات والأقضية' }, ku: { name: 'ناوخۆ', description: 'هەواڵە پارێزگا و قەزاکەکان' }, en: { name: 'Local', description: 'Governorates and districts news' } } },
    { slug: 'world', order: 12, translations: { ar: { name: 'العالم', description: 'أخبار دولية وعالمية' }, ku: { name: 'جیھان', description: 'هەواڵە نێودەوڵەتی و جیھانی' }, en: { name: 'World', description: 'International and world news' } } },
  ]

  for (const cat of categories) {
    await prisma.category.upsert({
      where: { slug: cat.slug },
      update: {},
      create: {
        slug: cat.slug,
        order: cat.order,
        isActive: true,
        translations: {
          create: [
            { locale: 'ar', name: cat.translations.ar.name, description: cat.translations.ar.description },
            { locale: 'ku', name: cat.translations.ku.name, description: cat.translations.ku.description },
            { locale: 'en', name: cat.translations.en.name, description: cat.translations.en.description },
          ],
        },
      },
    })
  }
  console.log('✅ Categories created')

  // Create governorates
  const governorates = [
    { code: 'baghdad', centerLat: 33.3152, centerLng: 44.3661, zoom: 10, translations: { ar: 'بغداد', ku: 'بەغداد', en: 'Baghdad' } },
    { code: 'basra', centerLat: 30.5085, centerLng: 47.7804, zoom: 10, translations: { ar: 'البصرة', ku: 'بەصرە', en: 'Basra' } },
    { code: 'mosul', centerLat: 36.3350, centerLng: 43.1189, zoom: 10, translations: { ar: 'الموصل', ku: 'مۆسڵ', en: 'Mosul' } },
    { code: 'erbil', centerLat: 36.1911, centerLng: 44.0094, zoom: 10, translations: { ar: 'أربيل', ku: 'ھەولێر', en: 'Erbil' } },
    { code: 'sulaymaniyah', centerLat: 35.5567, centerLng: 45.4358, zoom: 10, translations: { ar: 'السليمانية', ku: 'سەڵاحەدین', en: 'Sulaymaniyah' } },
    { code: 'duhok', centerLat: 36.8680, centerLng: 42.9886, zoom: 10, translations: { ar: 'دهوك', ku: 'دهۆک', en: 'Duhok' } },
    { code: 'najaf', centerLat: 32.0275, centerLng: 44.3481, zoom: 10, translations: { ar: 'النجف', ku: 'نەجەف', en: 'Najaf' } },
    { code: 'karbala', centerLat: 32.6161, centerLng: 44.0233, zoom: 10, translations: { ar: 'كربلاء', ku: 'کەربەلا', en: 'Karbala' } },
    { code: 'anbar', centerLat: 33.4206, centerLng: 41.2517, zoom: 9, translations: { ar: 'الأنبار', ku: 'ئەنباری', en: 'Anbar' } },
    { code: 'diyala', centerLat: 33.7570, centerLng: 44.8729, zoom: 9, translations: { ar: 'ديالى', ku: 'دیالە', en: 'Diyala' } },
    { code: 'kiruk', centerLat: 35.4681, centerLng: 44.4024, zoom: 10, translations: { ar: 'كركوك', ku: 'کەرکووک', en: 'Kirkuk' } },
    { code: 'salahuddin', centerLat: 34.4500, centerLng: 43.5833, zoom: 9, translations: { ar: 'صلاح الدين', ku: 'سەڵاحەدین', en: 'Salahuddin' } },
    { code: 'babylon', centerLat: 32.5422, centerLng: 44.4208, zoom: 9, translations: { ar: 'بابل', ku: 'بابل', en: 'Babylon' } },
    { code: 'wasit', centerLat: 32.3111, centerLng: 45.8186, zoom: 9, translations: { ar: 'واسط', ku: 'واسیت', en: 'Wasit' } },
    { code: 'maysan', centerLat: 31.8000, centerLng: 47.1500, zoom: 9, translations: { ar: 'ميسان', ku: 'مێسان', en: 'Maysan' } },
    { code: 'dhi-qar', centerLat: 31.0500, centerLng: 46.2500, zoom: 9, translations: { ar: 'ذي قار', ku: 'زیقار', en: 'Dhi Qar' } },
    { code: 'muthanna', centerLat: 30.5000, centerLng: 45.3000, zoom: 9, translations: { ar: 'المثنى', ku: 'موسەننا', en: 'Muthanna' } },
    { code: 'qadisiya', centerLat: 31.9900, centerLng: 44.9300, zoom: 9, translations: { ar: 'القادسية', ku: 'قادسیە', en: 'Qadisiya' } },
  ]

  for (const gov of governorates) {
    await prisma.governorate.upsert({
      where: { code: gov.code },
      update: {},
      create: {
        code: gov.code,
        centerLat: gov.centerLat,
        centerLng: gov.centerLng,
        zoom: gov.zoom,
        translations: {
          create: [
            { locale: 'ar', name: gov.translations.ar },
            { locale: 'ku', name: gov.translations.ku },
            { locale: 'en', name: gov.translations.en },
          ],
        },
      },
    })
  }
  console.log('✅ Governorates created')

  // Create sample tags
  const tags = [
    'العراق', 'بغداد', 'كردستان', 'الانتخابات', 'الاقتصاد', 'النفط', 'الكهرباء', 'الماء',
    'الصحة', 'التعليم', 'الجامعات', 'الرياضة', 'كرة القدم', 'كأس آسيا', 'السياحة',
    'الآثار', 'التراث', 'المناخ', 'البيئة', 'التكنولوجيا', 'الذكاء الاصطناعي',
  ]

  for (const tagName of tags) {
    const slug = tagName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '')
    await prisma.tag.upsert({
      where: { slug },
      update: {},
      create: {
        slug,
        translations: {
          create: [
            { locale: 'ar', name: tagName },
            { locale: 'ku', name: tagName },
            { locale: 'en', name: tagName },
          ],
        },
      },
    })
  }
  console.log('✅ Tags created')

  // Create ad slots
  const adSlots = [
    { name: 'header-banner', description: 'Top banner above header', sizes: [[728, 90], [320, 50], [970, 90]] },
    { name: 'sidebar-1', description: 'First sidebar ad', sizes: [[300, 250], [300, 600]] },
    { name: 'sidebar-2', description: 'Second sidebar ad', sizes: [[300, 250]] },
    { name: 'in-article-1', description: 'In-article ad after 3rd paragraph', sizes: [[300, 250], [728, 90]] },
    { name: 'in-article-2', description: 'In-article ad after 6th paragraph', sizes: [[300, 250]] },
    { name: 'footer-banner', description: 'Bottom banner above footer', sizes: [[728, 90], [970, 90]] },
    { name: 'mobile-sticky', description: 'Sticky mobile footer ad', sizes: [[320, 50], [320, 100]] },
    { name: 'interstitial', description: 'Full-screen interstitial', sizes: [[320, 480], [480, 320]] },
  ]

  for (const slot of adSlots) {
    await prisma.adSlot.upsert({
      where: { name: slot.name },
      update: {},
      create: { name: slot.name, description: slot.description, sizes: slot.sizes, active: true },
    })
  }
  console.log('✅ Ad slots created')

  console.log('🎉 Database seeding complete!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })