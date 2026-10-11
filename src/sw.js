import { CacheableResponsePlugin } from "workbox-cacheable-response";
import { ExpirationPlugin } from "workbox-expiration";
import { registerRoute } from "workbox-routing";
import { CacheFirst } from "workbox-strategies";

registerRoute(
  ({ url }) =>
    url.href.startsWith(
      "https://cdn-p.smehost.net/sites/374be6422f2b494ab9128079a4bd7dfd/",
    ),
  new CacheFirst({
    cacheName: "ddfiy-covers",
    plugins: [
      new CacheableResponsePlugin({ statuses: [0, 200] }),
      new ExpirationPlugin({ maxEntries: 500, maxAgeSeconds: 30 * 24 * 3600 }),
    ],
  }),
);
