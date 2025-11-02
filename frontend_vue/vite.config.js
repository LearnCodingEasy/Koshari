import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// For Pwa
// https://vite-pwa-org.netlify.app/guide/
import { VitePWA } from "vite-plugin-pwa";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueDevTools(),
        // For Pwa
    VitePWA({
      registerType: "autoUpdate",
      workbox: {
        globPatterns: ["**/*.{js,css,html,ico,png,svg}"],
        clientsClaim: true,
        skipWaiting: true,
        cleanupOutdatedCaches: false,
        offlineGoogleAnalytics: true,
        sourcemap: true,
        runtimeCaching: [
          {
            urlPattern: ({ request }) =>
              request.destination === "document" ||
              request.destination === "script" ||
              request.destination === "style" ||
              request.destination === "image" ||
              request.destination === "font",
            handler: "StaleWhileRevalidate",
            options: {
              cacheName: "assets-cache",
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
      },
      injectRegister: "auto",
      includeAssets: ["**/*"],
      manifest: {
        name: "Script Youtube",
        short_name: "Script Youtube",
        description: "My Awesome App Script Youtube",
        theme_color: "#ffffff",
        icons: [
          {
            src: "./images/icons/icon_72x72.png",
            type: "image/png",
            sizes: "72x72",
            purpose: "any maskable",
          },
          {
            src: "./images/icons/icon_96x96.png",
            type: "image/png",
            sizes: "96x96",
            purpose: "any maskable",
          },
          {
            src: "./images/icons/icon_128x128.png",
            type: "image/png",
            sizes: "128x128",
            purpose: "any maskable",
          },
          {
            src: "./images/icons/icon_144x144.png",
            type: "image/png",
            sizes: "144x144",
            purpose: "any maskable",
          },
          {
            src: "./images/icons/icon_152x152.png",
            type: "image/png",
            sizes: "152x152",
            purpose: "any maskable",
          },
          {
            src: "./images/icons/icon_192x192.png",
            type: "image/png",
            sizes: "192x192",
            purpose: "any maskable",
          },
          {
            src: "./images/icons/icon_384x384.png",
            type: "image/png",
            sizes: "384x384",
            purpose: "any maskable",
          },
          {
            src: "./images/icons/icon_512x512.png",
            type: "image/png",
            sizes: "512x512",
            purpose: "any maskable",
          },
        ],
        screenshots: [
          {
            src: "./images/screenshots/screenshots.png",
            sizes: "640x480",
            type: "image/png",
            form_factor: "wide",
            // "form_factor": "narrow"
          },
        ],
      },
    }),

  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
})
