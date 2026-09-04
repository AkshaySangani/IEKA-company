const WorkboxWebpackPlugin = require("workbox-webpack-plugin");

module.exports = function override(config, env) {
  if (env === "production") {
    config.plugins.push(
      new WorkboxWebpackPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,

        cleanupOutdatedCaches: true,

        swDest: "service-worker.js",

        navigateFallback: "/index.html",

        navigateFallbackDenylist: [
          /^\/api/,
          /\.(?:png|jpg|jpeg|svg|gif|webp|ico|json|txt|xml|pdf)$/i,
        ],

        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "image",

            handler: "CacheFirst",

            options: {
              cacheName: "images",

              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 30 * 24 * 60 * 60,
              },

              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          {
            urlPattern: ({ request }) =>
              request.destination === "font",

            handler: "CacheFirst",

            options: {
              cacheName: "fonts",

              expiration: {
                maxEntries: 30,
                maxAgeSeconds: 365 * 24 * 60 * 60,
              },

              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },

          {
            urlPattern: ({ request }) =>
              request.destination === "style" ||
              request.destination === "script",

            handler: "StaleWhileRevalidate",

            options: {
              cacheName: "static-resources",

              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 7 * 24 * 60 * 60,
              },
            },
          },
        ],
      })
    );
  }

  return config;
};