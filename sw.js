/**
 * SSTS - Service Worker 離線快取引擎 (sw.js)
 * 策略：網路優先 (Network-First) 搭配快取備援，確保連網時自動取得最新程式碼，斷網時秒開離線遊玩
 */

const CACHE_NAME = 'ssts-game-cache-v1';

const CORE_ASSETS = [
  './',
  './index.html',
  './style.css',
  './manifest.json',
  './equipment_db.js',
  './landmarks_db.js',
  './monsters_db.js',
  './render_art.js',
  './loot_system.js',
  './ui_controls.js',
  './map.js',
  './game.js'
];

// 1. 安裝階段：預先快取所有核心模組檔案
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(CORE_ASSETS))
  );
  self.skipWaiting();
});

// 2. 啟用階段：自動清理舊版本快取
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))
      )
    )
  );
  self.clients.claim();
});

// 3. 請求攔截：連網時抓取最新檔案並更新快取；斷網時直接從快取讀取
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  event.respondWith(
    fetch(event.request)
      .then((networkResponse) => {
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
        return networkResponse;
      })
      .catch(() => caches.match(event.request))
  );
});
