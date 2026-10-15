// Match the deployed sw-precache cache exactly; other apps may share this origin.
self.addEventListener('activate', event => {
  event.waitUntil(caches.delete(`sw-precache-v2-sw-precache-${self.registration.scope}`));
});
