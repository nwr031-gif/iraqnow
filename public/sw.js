/* Iraq Now Service Worker — PWA */
const VERSION = 'iraqnow-v1';
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
const IMG_CACHE = `${VERSION}-images`;

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  /* لا تخزن API أو لوحة التحكم */
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/admin')) return;

  /* الأصول الثابتة المُهشة — Cache First */
  if (url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/icon')) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((res) => {
            const copy = res.clone();
            caches.open(STATIC_CACHE).then((cache) => cache.put(request, copy));
            return res;
          })
      )
    );
    return;
  }

  /* الصور — Stale While Revalidate */
  if (/\.(png|jpg|jpeg|webp|avif|gif|svg|ico)$/i.test(url.pathname)) {
    event.respondWith(
      caches.open(IMG_CACHE).then(async (cache) => {
        const cached = await cache.match(request);
        const network = fetch(request)
          .then((res) => {
            if (res.ok) cache.put(request, res.clone());
            return res;
          })
          .catch(() => cached);
        return cached || network;
      })
    );
    return;
  }

  /* الصفحات — Network First مع احتياطي الكاش */
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGE_CACHE).then((cache) => cache.put(request, copy));
          return res;
        })
        .catch(async () => {
          const cached = await caches.match(request);
          return (
            cached ||
            new Response(
              '<!DOCTYPE html><html dir="rtl" lang="ar"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>غير متصل — العراق الآن</title><style>body{font-family:system-ui;display:flex;align-items:center;justify-content:center;min-height:100vh;margin:0;background:#0f2140;color:#f5f0e6;text-align:center}div{padding:2rem}h1{color:#d4af37}a{color:#d4af37}</style></head><body><div><h1>📡 غير متصل</h1><p>لا يوجد اتصال بالإنترنت حالياً</p><a href="/ar">إعادة المحاولة</a></div></body></html>',
              { status: 200, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
            )
          );
        })
    );
  }
});

/* استقبال إشعارات Push (OneSignal/FCM لاحقاً) */
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let data = {};
  try {
    data = event.data.json();
  } catch {
    data = { title: 'العراق الآن', body: event.data.text() };
  }
  event.waitUntil(
    self.registration.showNotification(data.title || 'العراق الآن', {
      body: data.body || 'خبر جديد!',
      icon: '/icon.svg',
      badge: '/icon.svg',
      dir: 'rtl',
      lang: 'ar',
      data: { url: data.url || '/ar' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data?.url || '/ar';
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      for (const client of clients) {
        if (client.url.includes(self.location.origin) && 'focus' in client) {
          client.navigate(url);
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
