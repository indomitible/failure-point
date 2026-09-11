const DEFAULT_URL = '/';

self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', event => event.waitUntil(self.clients.claim()));

self.addEventListener('push', event => {
  let data = {};

  try {
    data = event.data ? event.data.json() : {};
  } catch (_) {
    data = { body: event.data ? event.data.text() : 'New Gymcels.lol notification' };
  }

  const title = data.title || 'Gymcels.lol';
  const options = {
    body: data.body || 'You have a new notification.',
    icon: data.icon || '/gymcels-icon-192.png',
    badge: data.badge || '/gymcels-icon-192.png',
    tag: data.tag || 'gymcels-notification',
    renotify: true,
    data: {
      url: data.url || DEFAULT_URL,
      type: data.type || '',
      notificationId: data.notificationId || null
    }
  };

  event.waitUntil(self.registration.showNotification(title, options));
});

self.addEventListener('notificationclick', event => {
  event.notification.close();

  const targetUrl = new URL(event.notification.data?.url || DEFAULT_URL, self.location.origin).href;

  event.waitUntil((async () => {
    const windows = await clients.matchAll({ type: 'window', includeUncontrolled: true });

    for (const client of windows) {
      try {
        const current = new URL(client.url);
        const target = new URL(targetUrl);

        if (current.origin === target.origin) {
          await client.focus();
          if ('navigate' in client) await client.navigate(targetUrl);
          return;
        }
      } catch (_) {}
    }

    if (clients.openWindow) await clients.openWindow(targetUrl);
  })());
});
