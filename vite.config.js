// vite.config.js
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa'; // Import the plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      // ---- Basic PWA Configuration ----
      registerType: 'autoUpdate', // Automatically update PWA when new content is available
      injectRegister: 'auto', // Let the plugin handle injecting the registration script

      // ---- Web App Manifest ----
      manifest: {
        name: 'Portail OpenData Agadir', // Full app name
        short_name: 'OpenDataAgadir', // Short name for homescreen icon
        description: 'Explorez, visualisez et téléchargez les données ouvertes de la Commune d\'Agadir.',
        theme_color: '#3E8CAA', // Your primary theme color
        background_color: '#F8F9FA', // Your light mode background color
        display: 'standalone', // App-like feel
        scope: '/',
        start_url: '/',
        icons: [
          // --- Reference your icons placed in public/ ---
          {
            src: 'pwa-192x192.png', // Make sure this exists in public/
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any maskable', // Use 'maskable' if your icon is designed for it
          },
          {
            src: 'pwa-512x512.png', // Make sure this exists in public/
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable', // Use 'maskable' if your icon is designed for it
          },
          // Add other sizes from your list if you created them (e.g., 144x144, 256x256)
          // {
          //   src: 'pwa-144x144.png',
          //   sizes: '144x144',
          //   type: 'image/png',
          //   purpose: 'any'
          // },
        ],
      },

      // ---- Service Worker Configuration (Workbox) ----
      workbox: {
        // Precache assets generated during build
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg,woff,woff2}'],

        // Runtime Caching for API calls and other assets
        runtimeCaching: [
          {
            // Cache API calls to Supabase
            urlPattern: ({ url }) => url.pathname.startsWith('/rest/v1/'),
            handler: 'NetworkFirst', // Try network, fallback to cache
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 * 7, // 1 week
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
          {
            // Cache common image/font assets
            urlPattern: /\.(?:png|gif|jpg|jpeg|svg|woff|woff2)$/,
            handler: 'CacheFirst', // Serve from cache first
            options: {
              cacheName: 'asset-cache',
              expiration: {
                maxEntries: 100,
                maxAgeSeconds: 60 * 60 * 24 * 30, // 30 days
              },
              cacheableResponse: { statuses: [0, 200] },
            },
          },
        ],
      },

      // ---- Development Options ----
      devOptions: {
        enabled: false, // Keep disabled for faster dev reloads
        type: 'module',
      },
    }),
  ],
});
