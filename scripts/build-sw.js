import { generateSW } from 'workbox-build';

const directory = process.argv[2] || 'dist';
const { count, size, warnings } = await generateSW({
  globDirectory: directory,
  globPatterns: ['**/*.{html,js,css,json,png,ico,svg,woff,woff2}'],
  globIgnores: ['**/service-worker.js', '**/workbox-*.js', 'legacy-cache-cleanup.js'],
  swDest: `${directory}/service-worker.js`,
  cacheId: 'type-instructor',
  navigateFallback: 'index.html',
  dontCacheBustURLsMatching: /^assets\/.*-[\w-]+\./,
  // Broad cache-name scans also match nested apps. Workbox cleans its own entries.
  cleanupOutdatedCaches: false,
  skipWaiting: true,
  clientsClaim: true,
  inlineWorkboxRuntime: true,
  importScripts: ['legacy-cache-cleanup.js']
});

if (warnings.length) throw new Error(warnings.join('\n'));
console.log(`Workbox precached ${count} files (${size} bytes).`);
