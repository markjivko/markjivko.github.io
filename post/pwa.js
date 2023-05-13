/* global self, caches, fetch */
// Service Worker configuration
const staticCacheName = "quote-maker-0.1";

// Installation event
self.addEventListener("install", (event) => {
  console &&
    console.log("%quotemaker", "color:purple", "Installing app version 0.1...");
});

// Local file server
self.addEventListener("fetch", (event) => {
  // Skip non-GET requests
  if ("GET" === event.request.method) {
    // HTML navigation
    if ("navigate" === event.request.mode) {
      event.respondWith(
        (async () => {
          try {
            // First, try to use the navigation preload response if it's supported
            const preloadResponse = await event.preloadResponse;
            if (preloadResponse) {
              return preloadResponse;
            }

            // Preload not supported by this browser
            const networkResponse = await fetch(event.request);
            return networkResponse;
          } catch (error) {
            // Network error, deliver the "offline" page
            console &&
              console.log("%quotemaker", "color:purple", "Offline", error);
          }
        })()
      );
    } else {
      // Prepare the response, checking the cache
      event.respondWith(
        caches.match(event.request).then((response) => {
          // Cache hit
          if (response) {
            return response;
          }

          // Get the main path
          var pathUrl = new URL(event.request.url);

          // Cache all static resources
          var cacheBuster =
            "fonts.googleapis.com" === pathUrl.hostname ||
            ("markjivko.com" === pathUrl.hostname &&
              pathUrl.pathname.match(
                /\.(?:ico|png|gif|jpe?g|txt|json|woff2)$/gi
              ));

          // Fetch the new file; hacks.mozilla.org/2016/03/referrer-and-cache-control-apis-for-fetch/
          return fetch(event.request, {
            cache: cacheBuster ? "reload" : "no-cache",
          }).then((response) => {
            // Browser-Server caching
            if (!cacheBuster) {
              return response;
            }

            // Local caching
            return caches.open(staticCacheName).then((cache) => {
              console &&
                console.log(
                  "%quotemaker",
                  "color:purple",
                  "DLC " + event.request.url
                );
              cache.put(event.request, response.clone());
              return response;
            });
          });
        })
      );
    }
  }
});

// Activation event
self.addEventListener("activate", (event) => {
  console &&
    console.log("%quotemaker", "color:purple", "Activating app version 0.1...");

  // Enable navigation preload if it's supported
  event.waitUntil(
    (async () => {
      if ("navigationPreload" in self.registration) {
        await self.registration.navigationPreload.enable();
      }
    })()
  );

  // Cache clean
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (-1 === [staticCacheName].indexOf(cacheName)) {
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});
