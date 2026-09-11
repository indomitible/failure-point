const DEFAULT_URL = '/';
const NAV_CACHE = 'gymcels-navigation-v3';

self.addEventListener('install', () => {
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();

    await Promise.all(
      keys
        .filter(key => key !== NAV_CACHE)
        .map(key => caches.delete(key))
    );

    await self.clients.claim();
  })());
});

// Always use the newest online page for Home Screen / PWA navigation.
// A cached page is only used as an offline fallback.
self.addEventListener('fetch', event => {
  const request = event.request;
  if(request.method !== 'GET') return;

  const url = new URL(request.url);

  if(request.mode === 'navigate' && url.origin === self.location.origin){
    event.respondWith((async () => {
      const cache = await caches.open(NAV_CACHE);

      try{
        const fresh = await fetch(request, { cache: 'no-store' });

        if(fresh && fresh.ok){
          try{ await cache.put(request, fresh.clone()); }catch(_){}
        }

        return fresh;
      }catch(_){
        const cached =
          await cache.match(request) ||
          await cache.match('/') ||
          await caches.match(request);

        if(cached) return cached;

        return new Response(
          '<!doctype html><title>Gymcels.lol</title><body style="background:#0b0c0e;color:white;font-family:sans-serif;padding:24px">You appear to be offline. Reconnect and reopen Gymcels.lol.</body>',
          {
            status:503,
            headers:{'Content-Type':'text/html; charset=utf-8'}
          }
        );
      }
    })());

    return;
  }
});

self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (_) {
    data = {
      body:event.data
        ? event.data.text()
        : 'New Gymcels.lol notification'
    };
  }

  const title = data.title || 'Gymcels.lol';
  const options = {
    body:data.body || 'You have a new notification.',
    icon:data.icon || '/gymcels-icon-192.png',
    badge:data.badge || '/gymcels-icon-192.png',
    tag:data.tag || 'gymcels-notification',
    renotify:true,
    data:{
      url:data.url || DEFAULT_URL,
      type:data.type || '',
      notificationId:data.notificationId || null
    }
  };

  event.waitUntil(
    self.registration.showNotification(title,options)
  );
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl = new URL(
    event.notification.data?.url || DEFAULT_URL,
    self.location.origin
  ).href;

  event.waitUntil((async () => {
    const windows = await clients.matchAll({
      type:'window',
      includeUncontrolled:true
    });

    for(const client of windows){
      try{
        const current = new URL(client.url);
        const target = new URL(targetUrl);

        if(current.origin === target.origin){
          await client.focus();
          if('navigate' in client){
            await client.navigate(targetUrl);
          }
          return;
        }
      }catch(_){}
    }

    if(clients.openWindow){
      await clients.openWindow(targetUrl);
    }
  })());
});
