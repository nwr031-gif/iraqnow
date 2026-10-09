/**
 * البيانات التجريبية للعراق الآن
 * Mock data — يُستخدم كـ fallback عندما لا تكون قاعدة البيانات متاحة
 */

export type Locale = 'ar' | 'ku' | 'en'

export interface MockCategory {
  id: string
  slug: string
  order: number
  articleCount: number
  translations: { locale: Locale; name: string; description: string }[]
}

export interface MockAuthor {
  id: string
  name: string
  slug: string
  email: string
  role: 'ADMIN' | 'EDITOR' | 'JOURNALIST' | 'READER'
  avatar?: string
  coverImage?: string
  jobTitle: Record<Locale, string>
  bio: Record<Locale, string>
  twitter?: string
  linkedin?: string
  instagram?: string
  website?: string
  specialties: string[]
  staffSince: string
  isActive: boolean
  articleCount: number
}

export interface MockArticle {
  id: string
  slug: string
  status: 'DRAFT' | 'IN_REVIEW' | 'SCHEDULED' | 'PUBLISHED' | 'ARCHIVED'
  breaking: boolean
  featured: boolean
  publishedAt: string
  createdAt: string
  updatedAt: string
  viewCount: number
  readingTime: number
  authorId: string
  categorySlug: string
  tagSlugs: string[]
  governorateSlug: string
  image: string
  translations: {
    locale: Locale
    title: string
    excerpt: string
    content: string
  }[]
}

export interface MockPodcast {
  id: string
  slug: string
  episodeNumber: number
  season: number
  duration: string
  audioUrl: string
  coverUrl: string
  publishedAt: string
  isPublished: boolean
  isFeatured: boolean
  views: number
  guest: Record<Locale, string>
  translations: {
    locale: Locale
    title: string
    description: string
    showNotes: string
  }[]
}

export interface MockComment {
  id: string
  articleId: string
  articleTitle: string
  userId: string
  userName: string
  content: string
  status: 'pending' | 'approved' | 'rejected'
  createdAt: string
}

/* ═══════════ الأقسام - Categories ═══════════ */

export const MOCK_CATEGORIES: MockCategory[] = [
  { id: 'cat-politics', slug: 'politics', order: 1, articleCount: 1240, translations: [
    { locale: 'ar', name: 'السياسة', description: 'أخبار política العراق المحلية والدولية، تحليلات معمقة، ومتابعة مستمرة للمشهد السياسي' },
    { locale: 'ku', name: 'سیاسەت', description: 'هەواڵ و شیکاری سیاسەتی عێراق' },
    { locale: 'en', name: 'Politics', description: 'Iraqi political news, in-depth analysis and continuous coverage' },
  ]},
  { id: 'cat-economy', slug: 'economy', order: 2, articleCount: 890, translations: [
    { locale: 'ar', name: 'الاقتصاد', description: 'أخبار الاقتصاد العراقي، أسواق المال، النفط، والاستثمار' },
    { locale: 'ku', name: 'ئابووری', description: 'هەواڵی ئابووری عێراق، بازاڕەکان و نەوت' },
    { locale: 'en', name: 'Economy', description: 'Iraqi economy, markets, oil and investment' },
  ]},
  { id: 'cat-security', slug: 'security', order: 3, articleCount: 567, translations: [
    { locale: 'ar', name: 'الأمن', description: 'أخبار الأمن والدفاع ومكافحة الإرهاب في العراق' },
    { locale: 'ku', name: 'ئاسایش', description: 'هەواڵی ئاسایش، بەرگری و بەرەنگاربوونەوەی تیرۆر' },
    { locale: 'en', name: 'Security', description: 'Security, defense and counter-terrorism news' },
  ]},
  { id: 'cat-society', slug: 'society', order: 4, articleCount: 723, translations: [
    { locale: 'ar', name: 'المجتمع', description: 'قضايا اجتماعية وإنسانية تلامس حياة المواطن العراقي' },
    { locale: 'ku', name: 'کۆمەڵگە', description: 'کێشە کۆمەڵایەتی و مرۆییەکان' },
    { locale: 'en', name: 'Society', description: 'Social and humanitarian issues affecting Iraqis' },
  ]},
  { id: 'cat-culture', slug: 'culture', order: 5, articleCount: 445, translations: [
    { locale: 'ar', name: 'الثقافة', description: 'أخبار الثقافة والفنون والتراث والحضارة العراقية' },
    { locale: 'ku', name: 'چاند', description: 'هەواڵی چاند، هونەر و میراتی عێراق' },
    { locale: 'en', name: 'Culture', description: 'Culture, arts, heritage and civilization news' },
  ]},
  { id: 'cat-sports', slug: 'sports', order: 6, articleCount: 612, translations: [
    { locale: 'ar', name: 'الرياضة', description: 'أخبار الرياضة العراقية المحلية والدولية' },
    { locale: 'ku', name: 'وەرزش', description: 'هەواڵی وەرزشی عێراق' },
    { locale: 'en', name: 'Sports', description: 'Iraqi sports news, local and international' },
  ]},
  { id: 'cat-technology', slug: 'technology', order: 7, articleCount: 334, translations: [
    { locale: 'ar', name: 'التكنولوجيا', description: 'أخبار التقنية والابتكار والتحول الرقمي في العراق' },
    { locale: 'ku', name: 'تەکنەلۆژی', description: 'هەواڵی تەکنەلۆژی و داهێنان' },
    { locale: 'en', name: 'Technology', description: 'Technology, innovation and digital transformation' },
  ]},
  { id: 'cat-health', slug: 'health', order: 8, articleCount: 289, translations: [
    { locale: 'ar', name: 'الصحة', description: 'أخبار الصحة والطب والرعاية الصحية في العراق' },
    { locale: 'ku', name: 'تەندروستی', description: 'هەواڵی تەندروستی و پزیشکی' },
    { locale: 'en', name: 'Health', description: 'Health, medicine and healthcare news' },
  ]},
  { id: 'cat-education', slug: 'education', order: 9, articleCount: 198, translations: [
    { locale: 'ar', name: 'التعليم', description: 'أخبار التعليم والجامعات والبحث العلمي' },
    { locale: 'ku', name: 'پەروەردە', description: 'هەواڵی پەروەردە و زانکۆکان' },
    { locale: 'en', name: 'Education', description: 'Education, universities and scientific research' },
  ]},
  { id: 'cat-environment', slug: 'environment', order: 10, articleCount: 156, translations: [
    { locale: 'ar', name: 'البيئة', description: 'أخبار البيئة والمناخ والمياه والتغير المناخي' },
    { locale: 'ku', name: 'ژینگە', description: 'هەواڵی ژینگە، کەشوهەوا و ئاو' },
    { locale: 'en', name: 'Environment', description: 'Environment, climate, water and climate change' },
  ]},
  { id: 'cat-local', slug: 'local', order: 11, articleCount: 876, translations: [
    { locale: 'ar', name: 'محليات', description: 'أخبار المحافظات العراقية من بغداد إلى البصرة' },
    { locale: 'ku', name: 'ناوخۆ', description: 'هەواڵی پارێزگاکانی عێراق' },
    { locale: 'en', name: 'Local', description: 'Governorate news from Baghdad to Basra' },
  ]},
  { id: 'cat-world', slug: 'world', order: 12, articleCount: 432, translations: [
    { locale: 'ar', name: 'العالم', description: 'أخبار العالم وتأثيرها على العراق والمنطقة' },
    { locale: 'ku', name: 'جیهان', description: 'هەواڵی جیهان و کاریگەری لەسەر عێراق' },
    { locale: 'en', name: 'World', description: 'World news and its impact on Iraq and the region' },
  ]},
]

/* ═══════════ المحررون - Authors ═══════════ */

export const MOCK_AUTHORS: MockAuthor[] = [
  {
    id: 'user-admin', name: 'مدير التحرير', slug: 'admin', email: 'admin@iraqnow.com', role: 'ADMIN',
    avatar: 'https://i.pravatar.cc/300?img=12', coverImage: 'https://picsum.photos/seed/cover-admin/1600/400',
    jobTitle: { ar: 'رئيس التحرير', ku: 'سەرۆکی دەستکاری', en: 'Editor-in-Chief' },
    bio: {
      ar: 'صحفي عراقي بخبرة تمتد لأكثر من 15 عاماً في الصحافة الاستقصائية والتغطيات الميدانية. عمل في عدة مؤسسات إعلامية عربية ودولية، ويشرف على المحتوى التحريري في العراق الآن.',
      ku: 'ڕۆژنامەنووسی عێراقی بە ئەزموونی زیاتر لە ١٥ ساڵ لە ڕۆژنامەوانی لێکۆڵینەوەیی.',
      en: 'An Iraqi journalist with over 15 years of experience in investigative journalism and field coverage.',
    },
    twitter: 'iqnow_admin', linkedin: 'iraqnow', website: 'https://iraqnow.iq',
    specialties: ['السياسة', 'التحقيقات', 'الاقتصاد'], staffSince: '2019-01-15', isActive: true, articleCount: 340,
  },
  {
    id: 'user-editor', name: 'زينب الموسوي', slug: 'zainab-almusawi', email: 'editor@iraqnow.com', role: 'EDITOR',
    avatar: 'https://i.pravatar.cc/300?img=47', coverImage: 'https://picsum.photos/seed/cover-zainab/1600/400',
    jobTitle: { ar: 'محرر أول — الشؤون الاقتصادية', ku: 'دەستکاریکار — کاروباری ئابووری', en: 'Senior Editor — Economy' },
    bio: {
      ar: 'محررة متخصصة في الشؤون الاقتصادية والنفطية، حاصلة على ماجستير في الاقتصاد من جامعة بغداد. تغطي أسواق المال والموازنة العامة منذ 2018.',
      ku: 'دەستکاریکاری پسپۆڕ لە کاروباری ئابووری و نەوت، ماستەر لە ئابووری لە زانکۆی بەغداد.',
      en: 'Specialized editor in economic and oil affairs with a master\'s in economics from Baghdad University.',
    },
    twitter: 'zainab_biz', linkedin: 'zainab-almusawi',
    specialties: ['الاقتصاد', 'النفط', 'الموازنة'], staffSince: '2020-03-01', isActive: true, articleCount: 512,
  },
  {
    id: 'user-journo-1', name: 'أحمد الزبيدي', slug: 'ahmed-alzubaidi', email: 'ahmed@iraqnow.com', role: 'JOURNALIST',
    avatar: 'https://i.pravatar.cc/300?img=33', coverImage: 'https://picsum.photos/seed/cover-ahmed/1600/400',
    jobTitle: { ar: 'مراسل سياسي — بغداد', ku: 'پەیامنێری سیاسی — بەغداد', en: 'Political Correspondent — Baghdad' },
    bio: {
      ar: 'مراسل سياسي مقيم في بغداد، يتابع مجلس النواب والحكومة منذ 2017. شارك في تغطية أربع دورات انتخابية.',
      ku: 'پەیامنێری سیاسی لە بەغداد، چاودێری پەرلەمان و حکومەت دەکات لە ٢٠١٧ەوە.',
      en: 'Political correspondent based in Baghdad, covering parliament and government since 2017.',
    },
    twitter: 'ahmed_iq', specialties: ['السياسة', 'البرلمان', 'الانتخابات'], staffSince: '2021-06-20', isActive: true, articleCount: 687,
  },
  {
    id: 'user-journo-2', name: 'سوران محمد', slug: 'soran-mohammed', email: 'soran@iraqnow.com', role: 'JOURNALIST',
    avatar: 'https://i.pravatar.cc/300?img=59', coverImage: 'https://picsum.photos/seed/cover-soran/1600/400',
    jobTitle: { ar: 'مدير مكتب أربيل', ku: 'بەڕێوەبەری نووسینگەی هەولێر', en: 'Erbil Bureau Chief' },
    bio: {
      ar: 'صحفي كردي مقيم في أربيل، يغطي أخبار إقليم كردستان والعلاقات بين بغداد وأربيل منذ 2016.',
      ku: 'ڕۆژنامەنووسی کوردی لە هەولێر، هەواڵی هەرێمی کوردستان و پەیوەندییەکانی بەغداد-هەولێر دەگرێت.',
      en: 'Kurdish journalist based in Erbil, covering the Kurdistan Region and Baghdad-Erbil relations since 2016.',
    },
    twitter: 'soran_erbil', specialties: ['كردستان', 'السياسة', 'العلاقات'], staffSince: '2020-09-10', isActive: true, articleCount: 445,
  },
  {
    id: 'user-journo-3', name: 'ليلى حسن', slug: 'laila-hassan', email: 'laila@iraqnow.com', role: 'JOURNALIST',
    avatar: 'https://i.pravatar.cc/300?img=44', coverImage: 'https://picsum.photos/seed/cover-laila/1600/400',
    jobTitle: { ar: 'مراسلة محليات — البصرة', ku: 'پەیامنێری ناوخۆ — بەسرە', en: 'Local Reporter — Basra' },
    bio: {
      ar: 'مراسلة ميدانية تغطي محافظات الجنوب من البصرة. متخصصة في قضايا المياه والبيئة والخدمات.',
      ku: 'پەیامنێری مەیدانی بۆ پارێزگاکانی باشوور لە بەسرەوە.',
      en: 'Field reporter covering southern governorates from Basra, specializing in water, environment and services.',
    },
    twitter: 'laila_basra', specialties: ['محليات', 'البيئة', 'المياه'], staffSince: '2022-02-14', isActive: true, articleCount: 298,
  },
  {
    id: 'user-journo-4', name: 'عمر عبد الله', slug: 'omar-abdullah', email: 'omar@iraqnow.com', role: 'JOURNALIST',
    avatar: 'https://i.pravatar.cc/300?img=68', coverImage: 'https://picsum.photos/seed/cover-omar/1600/400',
    jobTitle: { ar: 'مراسل رياضة وتكنولوجيا', ku: 'پەیامنێری وەرزش و تەکنەلۆژی', en: 'Sports & Tech Reporter' },
    bio: {
      ar: 'مراسل شغوف بالرياضة والتقنية، يغطي دوري نجوم العراق والمنتخبات الوطنية وأخبار التحول الرقمي.',
      ku: 'پەیامنێری وەرزش و تەکنەلۆژی، چاودێری خولی نەجمی عێراق و هەڵبژاردەکان دەکات.',
      en: 'Passionate sports and tech reporter covering the Iraqi Stars League and digital transformation.',
    },
    twitter: 'omar_sport', specialties: ['الرياضة', 'التكنولوجيا'], staffSince: '2022-08-01', isActive: true, articleCount: 356,
  },
]

/* ═══════════ المقالات - Articles ═══════════ */

const HEADLINES: Array<{ cat: string; gov: string; ar: string; ku: string; en: string; excerptAr: string; excerptEn: string }> = [
  { cat: 'politics', gov: 'baghdad', ar: 'مجلس النواب يقر قانون الموازنة العامة بعد مناقشات ماراثونية', ku: 'پەرلەمان یاسای بودجەی گشتی پەسەند دەکات', en: 'Parliament Passes General Budget Law After Marathon Debates', excerptAr: 'أقر مجلس النواب العراقي قانون الموازنة العامة الاتحادية بعد سلسلة جلسات ماراثونية استمرت أسبوعين، مع تعديلات جوهرية على توزيع الإيرادات بين الحكومة الاتحادية والإقليم.', excerptEn: 'The Iraqi Parliament passed the federal general budget law after two weeks of marathon sessions, with major amendments to revenue distribution.' },
  { cat: 'economy', gov: 'baghdad', ar: 'البنك المركزي يعلن حزمة إجراءات لدعم استقرار سعر الدينار', ku: 'بانکی ناوەندی پاکێجێک بۆ دامەزراندنی نرخی دینار ڕادەگەیەنێت', en: 'Central Bank Announces Package to Stabilize the Dinar Rate', excerptAr: 'أعلن البنك المركزي العراقي عن حزمة جديدة من الإجراءات النقدية تستهدف استقرار سعر صرف الدينار وضبط سوق العملات الموازية.', excerptEn: 'The Central Bank of Iraq announced new monetary measures aimed at stabilizing the dinar exchange rate and controlling the parallel market.' },
  { cat: 'economy', gov: 'basra', ar: 'العراق يسجل أعلى معدل تصدير نفطي منذ ثلاث سنوات', ku: 'عێراق بەرزترین ڕێژەی هەناردەی نەوت تۆمار دەکات', en: 'Iraq Records Highest Oil Export Rate in Three Years', excerptAr: 'سجلت وزارة النفط أعلى معدل تصدير يومي للنفط الخام منذ 2023، مدفوعة بزيادة الطاقة التصديرية من ميناء البصرة وميناء الفاو الكبير.', excerptEn: 'The Oil Ministry recorded its highest daily crude export rate since 2023, boosted by increased capacity from Basra port and Grand Faw.' },
  { cat: 'local', gov: 'baghdad', ar: 'انطلاق المرحلة الأولى من مشروع مترو بغداد بطول 30 كيلومتراً', ku: 'دەستپێکردنی قۆناغی یەکەمی مێترۆی بەغداد', en: 'Phase One of Baghdad Metro Launches with 30km Line', excerptAr: 'بدأت أمانة بغداد بتنفيذ المرحلة الأولى من مشروع مترو بغداد الذي يمتد على طول 30 كيلومتراً ويربط 14 محطة بين مركز العاصمة وضواحيها الشمالية.', excerptEn: 'Baghdad Municipality began phase one of the metro project spanning 30km and 14 stations connecting the capital center with northern suburbs.' },
  { cat: 'security', gov: 'mosul', ar: 'قوات الأمن تعلن تفكيك شبكة تهريب آثار في نينوى', ku: 'هێزەکانی ئاسایش تۆڕێکی قاچاخچییەتی شوێنەوار هەڵدەوەشێننەوە', en: 'Security Forces Dismantle Antiquities Smuggling Network in Nineveh', excerptAr: 'أعلنت قيادة شرطة نينوى عن تفكيك شبكة منظمة متخصصة بتهريب الآثار العراقية، وضبطت قطعاً أثرية تعود لحضارات بلاد الرافدين.', excerptEn: 'Nineveh police announced the dismantling of an organized network smuggling Iraqi antiquities, seizing artifacts from Mesopotamian civilizations.' },
  { cat: 'society', gov: 'sulaymaniyah', ar: 'حملة وطنية للتشجير تطلق مليون شتلة في عموم المحافظات', ku: 'کەمپینی نیشتیمانی چاندنی درەخت بۆ ملیۆنێک نەمام', en: 'National Tree-Planting Campaign Launches One Million Saplings', excerptAr: 'انطلقت حملة وطنية واسعة للتشجير تستهدف زراعة مليون شتلة في جميع المحافظات العراقية لمواجهة التصحر وتحسين جودة الهواء.', excerptEn: 'A national afforestation campaign launched targeting one million trees across Iraqi governorates to combat desertification.' },
  { cat: 'sports', gov: 'baghdad', ar: 'منتخب العراق يتأهل لنهائيات كأس آسيا بعد فوز تاريخي', ku: 'هەڵبژاردەی عێراق بۆ کۆتایی جامی ئاسیا سەرکەوت', en: 'Iraq Qualifies for Asian Cup Final After Historic Win', excerptAr: 'تأهل المنتخب العراقي إلى نهائيات كأس آسيا بعد فوز مستحق في مباراة مثيرة، وسط احتفالات جماهيرية غمرت شوارع بغداد والمحافظات.', excerptEn: 'The Iraqi national team qualified for the Asian Cup final after a dramatic win, triggering celebrations across Baghdad.' },
  { cat: 'technology', gov: 'erbil', ar: 'إطلاق أول مركز بيانات سحابي في إقليم كردستان', ku: 'کردنەوەی یەکەم ناوەندی داتای هەور لە هەرێمی کوردستان', en: 'First Cloud Data Center Opens in Kurdistan Region', excerptAr: 'أعلنت شركة تقنية كبرى عن افتتاح أول مركز بيانات سحابي معتمد في أربيل، لتقديم خدمات الاستضافة والحوسبة للمؤسسات العراقية.', excerptEn: 'A major tech company opened the first certified cloud data center in Erbil to serve Iraqi institutions.' },
  { cat: 'health', gov: 'najaf', ar: 'افتتاح مستشفى تعليمي جديد بسعة 400 سرير في النجف', ku: 'کردنەوەی نەخۆشخانەیەکی فێرکاری بە ٤٠٠ جێی نوستن', en: 'New 400-Bed Teaching Hospital Opens in Najaf', excerptAr: 'افتتحت وزارة الصحة مستشفى تعليمياً جديداً في النجف بسعة 400 سرير مزود بأحدث الأجهزة الطبية ووحدات عناية مركزة متطورة.', excerptEn: 'The Health Ministry opened a new 400-bed teaching hospital in Najaf equipped with advanced medical technology.' },
  { cat: 'education', gov: 'karbala', ar: 'الجامعات العراقية تدخل ضمن أفضل 500 جامعة عالمية', ku: 'زانکۆکانی عێراق لە باشترین ٥٠٠ زانکۆی جیهان', en: 'Iraqi Universities Rank Among World\'s Top 500', excerptAr: 'حقت الجامعات العراقية قفزة نوعية في التصنيفات العالمية، إذ دخلت خمس جامعات ضمن أفضل 500 جامعة حسب تصنيف QS لهذا العام.', excerptEn: 'Iraqi universities achieved a qualitative leap in global rankings, with five universities entering QS top 500.' },
  { cat: 'culture', gov: 'babylon', ar: 'مهرجان بابل الدولي يعيد الحياة إلى المسرح الأثري', ku: 'فێستیڤاڵی نێودەوڵەتی بابڵ ژیان دەگەڕێنێتەوە', en: 'Babylon International Festival Revives Ancient Theater', excerptAr: 'انطلقت فعاليات مهرجان بابل الدولي بمشاركة فنانين من 20 دولة، وسط إقبال جماهيري كبير على المسرح الأثري المرمم.', excerptEn: 'The Babylon International Festival launched with artists from 20 countries, drawing large crowds to the restored ancient theater.' },
  { cat: 'environment', gov: 'basra', ar: 'العراق يستضيف قمة إقليمية لمواجهة أزمة المياه', ku: 'عێراق میوانداری لووتکەی ناوچەیی قەیرانی ئاو', en: 'Iraq Hosts Regional Summit on Water Crisis', excerptAr: 'استضافت البصرة قمة إقليمية لمناقشة أزمة المياه والتغير المناخي، بمشاركة دول الجوار ومنظمات دولية متخصصة.', excerptEn: 'Basra hosted a regional summit on the water crisis and climate change with neighboring countries and international organizations.' },
 

  { cat: 'politics', gov: 'kirkuk', ar: 'اتفاق مبدئي على تشكيل حكومة كركوك المحلية', ku: 'ڕێککەوتنی سەرەتایی بۆ پێکهێنانی حکومەتی خۆجێیی کەرکووک', en: 'Preliminary Agreement to Form Kirkuk Local Government', excerptAr: 'توصلت القوى السياسية في كركوك إلى اتفاق مبدئي لتشكيل الحكومة المحلية بعد أشهر من الجمود السياسي، وسط ترحيب شعبي واسع.', excerptEn: 'Political forces in Kirkuk reached a preliminary agreement to form the local government after months of deadlock.' },
  { cat: 'economy', gov: 'baghdad', ar: 'إطلاق صندوق سيادي عراقي للاستثمار في البنية التحتية', ku: 'دەستپێکردنی سندوقێکی سەروەت بۆ وەبەرهێنان', en: 'Iraq Launches Sovereign Fund for Infrastructure Investment', excerptAr: 'وافق مجلس الوزراء على تأسيس صندوق سيادي بقيمة 5 مليارات دولار للاستثمار في مشاريع البنية التحتية والطاقة المتجددة.', excerptEn: 'The Cabinet approved a $5 billion sovereign fund to invest in infrastructure and renewable energy projects.' },
  { cat: 'local', gov: 'dhi-qar', ar: 'افتتاح أكبر محطة تحلية مياه في ذي قار', ku: 'کردنەوەی گەورەترین وێستگەی پاڵاوتنەوەی ئاو', en: 'Largest Water Desalination Plant Opens in Dhi Qar', excerptAr: 'افتتحت محافظة ذي قار أكبر محطة لتحلية مياه في جنوب العراق بطاقة إنتاجية تصل إلى 200 ألف متر مكعب يومياً.', excerptEn: 'Dhi Qar opened the largest water desalination plant in southern Iraq with a capacity of 200,000 cubic meters daily.' },
  { cat: 'security', gov: 'anbar', ar: 'انطلاق عملية أمنية واسعة لتأمين الحدود الغربية', ku: 'دەستپێکردنی ئۆپەراسیۆنی ئاسایشی بۆ پاراستنی سنوور', en: 'Major Security Operation Launches to Secure Western Borders', excerptAr: 'انطلقت عملية أمنية واسعة بمشاركة قوات الجيش والحشد لتطهير المناطق الصحراوية الحدودية مع سوريا من الخلايا النائمة.', excerptEn: 'A major security operation launched with army and PMF forces to clear desert border areas with Syria of sleeper cells.' },
  { cat: 'sports', gov: 'erbil', ar: 'أربيل يستعد لاستضافة نهائي دوري أبطال آسيا', ku: 'هەولێر ئامادەکاری دەکات بۆ میوانداری کۆتایی', en: 'Erbil Prepares to Host AFC Champions League Final', excerptAr: 'بدأت محافظة أربيل استعداداتها الكبرى لاستضافة نهائي دوري أبطال آسيا، مع تطوير ملعب فرانسو حريري وتحديث البنية الفندقية.', excerptEn: 'Erbil began major preparations to host the AFC Champions League final, upgrading Franso Hariri Stadium and hospitality infrastructure.' },
  { cat: 'technology', gov: 'baghdad', ar: 'منصة حكومية رقمية جديدة تخدم 10 ملايين مواطن', ku: 'پلاتفۆرمێکی دیجیتاڵی حکومی بۆ ١٠ ملیۆن هاووڵاتی', en: 'New Digital Government Platform Serves 10 Million Citizens', excerptAr: 'أطلقت الحكومة منصة رقمية موحدة تتيح للمواطنين إنجاز 150 خدمة حكومية إلكترونياً دون الحاجة لمراجعة الدوائر.', excerptEn: 'The government launched a unified digital platform enabling citizens to complete 150 services online.' },
  { cat: 'health', gov: 'duhok', ar: 'حملة تطعيم شاملة ضد الحصبة تنطلق في دهوك', ku: 'کەمپینی کوتان بەرەنگاری سوورێژە لە دهۆک', en: 'Comprehensive Measles Vaccination Campaign Launches in Duhok', excerptAr: 'أطلقت وزارة الصحة حملة تطعيم شاملة ضد الحصبة في دهوك تستهدف الأطفال دون الخامسة، ضمن برنامج وطني لمكافحة الأوبئة.', excerptEn: 'The Health Ministry launched a measles vaccination campaign in Duhok targeting children under five.' },
  { cat: 'culture', gov: 'mosul', ar: 'ترميم جامع النوري الكبير يدخل مراحله النهائية', ku: 'نۆژەنکردنەوەی مزگەوتی نوری گەورە قۆناغی کۆتایی', en: 'Great Al-Nuri Mosque Restoration Enters Final Phase', excerptAr: 'دخل مشروع ترميم جامع النوري الكبير في الموصل مراحله النهائية، وسط آمال بإعادة افتتاحه قبل نهاية العام الجاري.', excerptEn: 'The restoration of Mosul\'s Great Al-Nuri Mosque entered its final phase, with hopes of reopening by year-end.' },
  { cat: 'world', gov: 'baghdad', ar: 'العراق وتركيا يوقعان اتفاقية تعاون اقتصادي شاملة', ku: 'عێراق و تورکیا ڕێککەوتنی هاوکاری ئابووری واژوو دەکەن', en: 'Iraq and Turkey Sign Comprehensive Economic Agreement', excerptAr: 'وقع العراق وتركيا اتفاقية تعاون اقتصادي شاملة تشمل التجارة والطاقة ومشروع طريق التنمية، في زيارة رسمية رفيعة المستوى.', excerptEn: 'Iraq and Turkey signed a comprehensive economic agreement covering trade, energy and the Development Road project.' },
  { cat: 'politics', gov: 'salahuddin', ar: 'مجلس المحافظة يقر خطة إعمار شاملة بقيمة 400 مليار دينار', ku: 'ئەنجومەنی پارێزگا پلانی ئاوەدانکردنەوە پەسەند دەکات', en: 'Provincial Council Approves 400B Dinar Reconstruction Plan', excerptAr: 'أقر مجلس صلاح الدين خطة إعمار شاملة بقيمة 400 مليار دينار تشمل الطرق والجسور والمدارس والمستشفيات في جميع الأقضية.', excerptEn: 'Salahuddin council approved a 400 billion dinar reconstruction plan covering roads, bridges, schools and hospitals.' },
  { cat: 'economy', gov: 'erbil', ar: 'إقليم كردستان يقر قانون استثمار جديداً بجذب 3 مليارات دولار', ku: 'هەرێمی کوردستان یاسای سەرمایەکاری نوێ پەسەند دەکات', en: 'Kurdistan Region Passes New Investment Law Attracting $3B', excerptAr: 'أقر برلمان إقليم كردستان قانون الاستثمار الجديد الذي يمنح تسهيلات واسعة للمستثمرين الأجانب، متوقعاً جذب 3 مليارات دولار.', excerptEn: 'Kurdistan Parliament passed a new investment law offering incentives expected to attract $3 billion.' },
  { cat: 'local', gov: 'wasit', ar: 'مشروع سكني جديد يوفر 10 آلاف وحدة في واسط', ku: 'پڕۆژەی نیشتەجێبوونی نوێ بۆ ١٠ هەزار یەکە', en: 'New Housing Project Provides 10,000 Units in Wasit', excerptAr: 'أعلنت هيئة الاستثمار في واسط عن مشروع سكني جديد يوفر 10 آلاف وحدة سكنية بأسعار مدعومة للشباب ومحدودي الدخل.', excerptEn: 'The Wasit Investment Authority announced a new housing project providing 10,000 subsidized units.' },
]

const EXTENDED_CONTENT_AR = `\n\nوقال مسؤول في تصريح خاص لـ"العراق الآن" إن الخطوة تأتي ضمن خطة أشمل تستهدف تحسين الخدمات والارتقاء بمستوى المعيشة، مؤكداً أن العمل سيبدأ فور استكمال الإجراءات القانونية اللازمة.\n\nمن جانبه، رحب خبراء ومختصون بالخطوة واصفين إياها بـ"الإيجابية"، مشيرين إلى ضرورة المتابعة الدقيقة لمراحل التنفيذ وضمان الشفافية في توزيع الموارد والموازنات.\n\nوتأتي هذه التطورات في وقت يشهد فيه العراق حركة عمرانية وتنموية متسارعة في مختلف القطاعات، وسط تطلعات شعبية بمستقبل أكثر استقراراً وازدهاراً.`

const EXTENDED_CONTENT_EN = `\n\nAn official told Iraq Now in an exclusive statement that the move comes within a broader plan aimed at improving services and living standards, stressing that work will begin once legal procedures are complete.\n\nExperts welcomed the step as "positive," noting the need for careful monitoring of implementation phases and transparency in resource distribution.\n\nThese developments come as Iraq witnesses accelerating urban and development movement across various sectors, amid public aspirations for a more stable and prosperous future.`

const MOCK_CONTENT_AR = `يعد هذا التطور من أبرز الملفات التي تتابعها منصة "العراق الآن" بشكل مستمر، نظراً لانعكاساته المباشرة على حياة المواطنين في مختلف المحافظات.\n\nوأكدت مصادر مطلعة أن الجهات المعنية باشرت باتخاذ الإجراءات التنفيذية اللازمة، تمهيداً للإعلان عن الخطوات التفصيلية خلال الفترة المقبلة.${EXTENDED_CONTENT_AR}`

const MOCK_CONTENT_EN = `This development is among the key files Iraq Now continuously tracks, given its direct impact on citizens' lives across governorates.\n\nInformed sources confirmed that relevant authorities began taking executive measures, preparing to announce detailed steps in the coming period.${EXTENDED_CONTENT_EN}`

const IMAGES = [
  'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=1200&q=80',
  'https://images.unsplash.com/photo-1559825481-12a05cc00344?w=1200&q=80',
  'https://images.unsplash.com/photo-1590083948600-51f876b7c8e7?w=1200&q=80',
  'https://images.unsplash.com/photo-1519452575417-564c1401ecc0?w=1200&q=80',
  'https://images.unsplash.com/photo-1444723121867-7a241cacace9?w=1200&q=80',
  'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80',
  'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1200&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&q=80',
  'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
  'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200&q=80',
  'https://images.unsplash.com/photo-1569163139544-8d8d71f9b594?w=1200&q=80',
  'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=1200&q=80',
]

const AUTHOR_IDS = ['user-journo-1', 'user-editor', 'user-journo-2', 'user-journo-3', 'user-journo-4', 'user-admin']

export const MOCK_ARTICLES: MockArticle[] = HEADLINES.map((h, i) => {
  const publishedAt = new Date(Date.now() - i * 7.5 * 3600000).toISOString()
  return {
    id: `article-${i + 1}`,
    slug: `iraq-news-${i + 1}-${h.cat}`,
    status: 'PUBLISHED' as const,
    breaking: i % 7 === 0,
    featured: i < 4,
    publishedAt,
    createdAt: new Date(Date.now() - (i + 1) * 8 * 3600000).toISOString(),
    updatedAt: publishedAt,
    viewCount: Math.floor(Math.random() * 42000) + 3800,
    readingTime: 4 + (i % 6),
    authorId: AUTHOR_IDS[i % AUTHOR_IDS.length],
    categorySlug: h.cat,
    tagSlugs: ['العراق', h.cat],
    governorateSlug: h.gov,
    image: IMAGES[i % IMAGES.length],
    translations: [
      { locale: 'ar', title: h.ar, excerpt: h.excerptAr, content: MOCK_CONTENT_AR },
      { locale: 'ku', title: h.ku, excerpt: h.excerptAr, content: MOCK_CONTENT_AR },
      { locale: 'en', title: h.en, excerpt: h.excerptEn, content: MOCK_CONTENT_EN },
    ],
  }
})

/* مقالات مسودة للمراجعة في لوحة التحكم */
export const MOCK_DRAFTS: MockArticle[] = [
  {
    id: 'draft-1', slug: 'draft-oil-licensing-round', status: 'DRAFT', breaking: false, featured: false,
    publishedAt: '', createdAt: new Date(Date.now() - 2 * 86400000).toISOString(), updatedAt: new Date(Date.now() - 5 * 3600000).toISOString(),
    viewCount: 0, readingTime: 6, authorId: 'user-editor', categorySlug: 'economy', tagSlugs: ['النفط'], governorateSlug: 'baghdad',
    image: IMAGES[1],
    translations: [
      { locale: 'ar', title: 'جولة التراخيص النفطية الخامسة: فرص وتحديات', excerpt: 'ملخص مسودة التحقيق حول جولة التراخيص الجديدة...', content: 'مسودة قيد الإعداد...' },
      { locale: 'ku', title: 'خولی مۆڵەتی نەوتی پێنجەم', excerpt: '', content: '' },
      { locale: 'en', title: 'Fifth Oil Licensing Round: Opportunities and Challenges', excerpt: '', content: '' },
    ],
  },
  {
    id: 'draft-2', slug: 'draft-census-results', status: 'IN_REVIEW', breaking: false, featured: false,
    publishedAt: '', createdAt: new Date(Date.now() - 86400000).toISOString(), updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
    viewCount: 0, readingTime: 8, authorId: 'user-journo-1', categorySlug: 'society', tagSlugs: ['الإحصاء'], governorateSlug: 'baghdad',
    image: IMAGES[4],
    translations: [
      { locale: 'ar', title: 'نتائج التعداد السكاني: ماذا تعني للأجيال القادمة؟', excerpt: 'تحليل معمق لنتائج التعداد السكاني...', content: 'محتوى قيد المراجعة...' },
      { locale: 'ku', title: 'ئەنجامی سەرژمێری دانیشتووان', excerpt: '', content: '' },
      { locale: 'en', title: 'Census Results: What Do They Mean for Future Generations?', excerpt: '', content: '' },
    ],
  },
  {
    id: 'draft-3', slug: 'draft-school-reforms', status: 'SCHEDULED', breaking: false, featured: false,
    publishedAt: new Date(Date.now() + 18 * 3600000).toISOString(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
    viewCount: 0, readingTime: 5, authorId: 'user-journo-4', categorySlug: 'education', tagSlugs: ['التعليم'], governorateSlug: 'karbala',
    image: IMAGES[9],
    translations: [
      { locale: 'ar', title: 'إصلاحات جديدة في المناهج الدراسية للعام المقبل', excerpt: 'تفاصيل حزمة الإصلاحات التربوية...', content: 'محتوى مجدول للنشر...' },
      { locale: 'ku', title: 'چاکسازی نوێ لە پرۆگرامی خوێندن', excerpt: '', content: '' },
      { locale: 'en', title: 'New Curriculum Reforms for Next Academic Year', excerpt: '', content: '' },
    ],
  },
]

/* ═══════════ البودكاست - Podcasts ═══════════ */

export const MOCK_PODCASTS: MockPodcast[] = [
  {
    id: 'pod-1', slug: 'post-oil-economy', episodeNumber: 42, season: 3, duration: '38:24',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3',
    coverUrl: 'https://picsum.photos/seed/pod42/600/600',
    publishedAt: new Date(Date.now() - 2 * 86400000).toISOString(), isPublished: true, isFeatured: true, views: 15400,
    guest: { ar: 'د. مظهر محمد صالح - الخبير الاقتصادي', ku: 'د. مەزهەر محەمەد سالح', en: 'Dr. Mazhar Mohammed - Economic Expert' },
    translations: [
      { locale: 'ar', title: 'مستقبل الاقتصاد العراقي بعد النفط', description: 'حوار شامل حول سبل تنويع الاقتصاد العراقي وتقليل الاعتماد على الإيرادات النفطية، مع خبير اقتصادي بارز.', showNotes: 'في هذه الحلقة نناقش:\n\n• حجم الاعتماد الحالي على النفط\n• قطاعات واعدة للتنويع (الزراعة، الصناعة، السياحة)\n• تجارب دولية ملهمة\n• خارطة طريق اقتصادية للعقد القادم' },
      { locale: 'ku', title: 'داهاتووی ئابووری عێراق دوای نەوت', description: 'گفتوگۆیەکی گشتگیر دەربارەی جۆراوجۆرکردنی ئابووری.', showNotes: 'لەم ئەڵقەیەدا باس دەکەین...' },
      { locale: 'en', title: 'Iraq\'s Post-Oil Economic Future', description: 'A comprehensive discussion on diversifying Iraq\'s economy and reducing oil dependence.', showNotes: 'In this episode we discuss:\n\n• Current oil dependence\n• Promising sectors for diversification\n• International success stories\n• Economic roadmap for the next decade' },
    ],
  },
  {
    id: 'pod-2', slug: 'mosul-reconstruction', episodeNumber: 41, season: 3, duration: '45:10',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3',
    coverUrl: 'https://picsum.photos/seed/pod41/600/600',
    publishedAt: new Date(Date.now() - 9 * 86400000).toISOString(), isPublished: true, isFeatured: false, views: 9800,
    guest: { ar: 'م. أحمد العبيدي - مهندس إعمار', ku: 'ئەحمەد عوبەیدی', en: 'Eng. Ahmed Al-Obaidi' },
    translations: [
      { locale: 'ar', title: 'الموصل: عشر سنوات من إعادة الإعمار', description: 'رحلة ميدانية في مدينة الموصل بعد عقد من إعادة الإعمار، بين الإنجازات والتحديات المتبقية.', showNotes: 'نستعرض في هذه الحلقة مشاريع الإعمار الكبرى في الموصل القديمة والجديدة.' },
      { locale: 'ku', title: 'موسڵ: دە ساڵ لە نۆژەنکردنەوە', description: 'گەشتێکی مەیدانی لە شاری موسڵ.', showNotes: 'پڕۆژەکانی ئاوەدانکردنەوە لە موسڵ.' },
      { locale: 'en', title: 'Mosul: Ten Years of Reconstruction', description: 'A field journey through Mosul after a decade of reconstruction.', showNotes: 'We review major reconstruction projects in old and new Mosul.' },
    ],
  },
  {
    id: 'pod-3', slug: 'water-crisis-mesopotamia', episodeNumber: 40, season: 3, duration: '32:55',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3',
    coverUrl: 'https://picsum.photos/seed/pod40/600/600',
    publishedAt: new Date(Date.now() - 16 * 86400000).toISOString(), isPublished: true, isFeatured: false, views: 11200,
    guest: { ar: 'د. سهام الربيعي - خبيرة الموارد المائية', ku: 'د. سهام ڕوبەیعی', en: 'Dr. Siham Al-Rubaie' },
    translations: [
      { locale: 'ar', title: 'المياه في بلاد الرافدين: أزمة الحاضر وخطر المستقبل', description: 'نقاش علمي حول أزمة المياه المتفاقمة وتأثير التغير المناخي على نهري دجلة والفرات.', showNotes: 'محاور الحلقة:\n\n• تراجع مناسيب دجلة والفرات\n• تأثير السدود على دول المنبع\n• حلول مبتكرة للإدارة المائية' },
      { locale: 'ku', title: 'ئاو لە میزۆپۆتامیا: قەیرانی ئێستا', description: 'گفتوگۆی زانستی دەربارەی قەیرانی ئاو.', showNotes: 'تەوەرەکانی ئەڵقە...' },
      { locale: 'en', title: 'Water in Mesopotamia: The Coming Crisis', description: 'Scientific discussion on the worsening water crisis and climate change impact on the Tigris and Euphrates.', showNotes: 'Episode topics:\n\n• Declining river levels\n• Upstream dam impacts\n• Innovative water management solutions' },
    ],
  },
  {
    id: 'pod-4', slug: 'iraqi-cinema-return', episodeNumber: 39, season: 2, duration: '28:40',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3',
    coverUrl: 'https://picsum.photos/seed/pod39/600/600',
    publishedAt: new Date(Date.now() - 23 * 86400000).toISOString(), isPublished: true, isFeatured: false, views: 7600,
    guest: { ar: 'المخرج محمد الدراجي', ku: 'دەرهێنەر محەمەد دەراجی', en: 'Director Mohamed Al-Daradji' },
    translations: [
      { locale: 'ar', title: 'السينما العراقية تعود من جديد', description: 'حوار مع مخرج عراقي عالمي حول نهضة السينما العراقية والجوائز الدولية.', showNotes: 'نستضيف المخرج محمد الدراجي للحديث عن تجربته وجيل جديد من صناع الأفلام.' },
      { locale: 'ku', title: 'سینەمای عێراقی دەگەڕێتەوە', description: 'گفتوگۆ لەگەڵ دەرهێنەرێکی جیهانی.', showNotes: 'میوانداری دەرهێنەر محەمەد دەراجی.' },
      { locale: 'en', title: 'Iraqi Cinema Returns', description: 'Conversation with an internationally acclaimed Iraqi director about the cinema renaissance.', showNotes: 'Featuring director Mohamed Al-Daradji.' },
    ],
  },
  {
    id: 'pod-5', slug: 'youth-entrepreneurship', episodeNumber: 38, season: 2, duration: '41:15',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3',
    coverUrl: 'https://picsum.photos/seed/pod38/600/600',
    publishedAt: new Date(Date.now() - 30 * 86400000).toISOString(), isPublished: true, isFeatured: false, views: 6400,
    guest: { ar: 'رند الخطيب - مؤسسة شركة ناشئة', ku: 'ڕەند خەتیب', en: 'Rand Al-Khatib - Startup Founder' },
    translations: [
      { locale: 'ar', title: 'ريادة الأعمال الشبابية في العراق', description: 'قصص نجاح شبابية ملهمة في عالم الشركات الناشئة والتكنولوجيا.', showNotes: 'حلقة ملهمة عن جيل جديد من رواد الأعمال العراقيين.' },
      { locale: 'ku', title: 'کاردەکردنی لاوانی عێراق', description: 'چیرۆکی سەرکەوتنی گەنجان.', showNotes: 'ئەڵقەیەکی ئیلهامبەخش.' },
      { locale: 'en', title: 'Youth Entrepreneurship in Iraq', description: 'Inspiring success stories in startups and technology.', showNotes: 'An inspiring episode about a new generation of Iraqi entrepreneurs.' },
    ],
  },
  {
    id: 'pod-6', slug: 'baghdad-coffee-houses', episodeNumber: 37, season: 2, duration: '35:50',
    audioUrl: 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-6.mp3',
    coverUrl: 'https://picsum.photos/seed/pod37/600/600',
    publishedAt: new Date(Date.now() - 37 * 86400000).toISOString(), isPublished: true, isFeatured: false, views: 5200,
    guest: { ar: 'د. نجم والي - أديب وروائي', ku: 'د. نەجم والی', en: 'Dr. Najm Wali - Novelist' },
    translations: [
      { locale: 'ar', title: 'مقاهي بغداد: ذاكرة المدينة', description: 'جولة في تاريخ مقاهي بغداد الثقافية ودورها في الحركة الأدبية.', showNotes: 'نستضيف الأديب نجم والي للحديث عن ذاكرة المقاهي البغدادية.' },
      { locale: 'ku', title: 'قاوەخانەکانی بەغداد', description: 'مێژووی قاوەخانە کلتورییەکانی بەغداد.', showNotes: 'میوانداری ئەدیب نەجم والی.' },
      { locale: 'en', title: 'Baghdad Coffee Houses: The City\'s Memory', description: 'A tour through the history of Baghdad\'s cultural coffee houses.', showNotes: 'Featuring novelist Najm Wali on the memory of Baghdad coffee houses.' },
    ],
  },
]

/* ═══════════ التعليقات - Comments ═══════════ */

export const MOCK_COMMENTS: MockComment[] = [
  { id: 'c1', articleId: 'article-1', articleTitle: 'مجلس النواب يقر قانون الموازنة العامة', userId: 'r1', userName: 'علي الموسوي', content: 'خبر ممتاز، ننتظر تفاصيل توزيع الموازنة على المحافظات. شكراً العراق الآن على التغطية المتميزة.', status: 'approved', createdAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'c2', articleId: 'article-1', articleTitle: 'مجلس النواب يقر قانون الموازنة العامة', userId: 'r2', userName: 'فاطمة كريم', content: 'أتمنى أن تكون هذه الموازنة مختلفة عن سابقاتها وأن تصل الأموال لمستحقيها.', status: 'pending', createdAt: new Date(Date.now() - 7200000).toISOString() },
  { id: 'c3', articleId: 'article-4', articleTitle: 'انطلاق المرحلة الأولى من مشروع مترو بغداد', userId: 'r3', userName: 'حسن الجبوري', content: 'أخيراً! مشروع المترو سينقذ بغداد من أزمة المرور. متى تكتمل المراحل؟', status: 'pending', createdAt: new Date(Date.now() - 10800000).toISOString() },
  { id: 'c4', articleId: 'article-7', articleTitle: 'منتخب العراق يتأهل لنهائيات كأس آسيا', userId: 'r4', userName: 'مصطفى العزاوي', content: 'مبروك للعراق! أداء رائع وأمامنا فرصة ذهبية للتأهل. يلا يلا عراق!', status: 'approved', createdAt: new Date(Date.now() - 14400000).toISOString() },
  { id: 'c5', articleId: 'article-3', articleTitle: 'العراق يسجل أعلى معدل تصدير نفطي', userId: 'r5', userName: 'زائر ملقوف', content: 'كلام فارغ، لن نشعر بأي خير ما دام الفساد موجوداً!!!', status: 'rejected', createdAt: new Date(Date.now() - 18000000).toISOString() },
  { id: 'c6', articleId: 'article-12', articleTitle: 'العراق يستضيف قمة إقليمية لمواجهة أزمة المياه', userId: 'r6', userName: 'نور الشمري', content: 'أزمة المياه أخطر من كل الأزمات، أتمنى أن تخرج القمة بقرارات عملية ملزمة.', status: 'pending', createdAt: new Date(Date.now() - 21600000).toISOString() },
]

/* ═══════════ بيانات إضافية ═══════════ */

export const MOCK_SUBSCRIBERS = Array.from({ length: 24 }, (_, i) => ({
  id: `sub-${i + 1}`,
  email: `subscriber${i + 1}@example.com`,
  locale: (['ar', 'ku', 'en'] as const)[i % 3],
  active: i % 9 !== 0,
  createdAt: new Date(Date.now() - i * 2.3 * 86400000).toISOString(),
}))

export const MOCK_GOVERNORATES: Record<string, { ar: string; ku: string; en: string }> = {
  baghdad: { ar: 'بغداد', ku: 'بەغداد', en: 'Baghdad' },
  basra: { ar: 'البصرة', ku: 'بەسرە', en: 'Basra' },
  mosul: { ar: 'الموصل', ku: 'مۆسڵ', en: 'Mosul' },
  erbil: { ar: 'أربيل', ku: 'هەولێر', en: 'Erbil' },
  sulaymaniyah: { ar: 'السليمانية', ku: 'سلێمانی', en: 'Sulaymaniyah' },
  duhok: { ar: 'دهوك', ku: 'دهۆک', en: 'Duhok' },
  najaf: { ar: 'النجف', ku: 'نەجەف', en: 'Najaf' },
  karbala: { ar: 'كربلاء', ku: 'کەربەلا', en: 'Karbala' },
  anbar: { ar: 'الأنبار', ku: 'ئەنبار', en: 'Anbar' },
  diyala: { ar: 'ديالى', ku: 'دیالە', en: 'Diyala' },
  kirkuk: { ar: 'كركوك', ku: 'کەرکووک', en: 'Kirkuk' },
  salahuddin: { ar: 'صلاح الدين', ku: 'سەڵاحەدین', en: 'Salahuddin' },
  babylon: { ar: 'بابل', ku: 'بابل', en: 'Babylon' },
  wasit: { ar: 'واسط', ku: 'واسیت', en: 'Wasit' },
  maysan: { ar: 'ميسان', ku: 'مێسان', en: 'Maysan' },
  'dhi-qar': { ar: 'ذي قار', ku: 'زیقار', en: 'Dhi Qar' },
  muthanna: { ar: 'المثنى', ku: 'موسەننا', en: 'Muthanna' },
  qadisiya: { ar: 'القادسية', ku: 'قادسیە', en: 'Qadisiya' },
}

export const MOCK_TAGS = [
  'العراق', 'السياسة', 'الاقتصاد', 'النفط', 'بغداد', 'البصرة', 'أربيل', 'الموصل',
  'كردستان', 'الانتخابات', 'الموازنة', 'الكهرباء', 'المياه', 'التعليم', 'الصحة',
  'الرياضة', 'كأس آسيا', 'التكنولوجيا', 'البيئة', 'المناخ', 'الآثار', 'الثقافة',
]
