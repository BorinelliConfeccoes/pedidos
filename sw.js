const CACHE='borinelli-pedidos-v140';
const ARQS=['./','./index.html','./manifest.json'];
self.addEventListener('install', e=>{ self.skipWaiting();
  e.waitUntil(caches.open(CACHE).then(c=>c.addAll(ARQS).catch(()=>{}))); });
self.addEventListener('activate', e=>{ e.waitUntil(
  caches.keys().then(ks=>Promise.all(ks.filter(k=>k!==CACHE).map(k=>caches.delete(k)))).then(()=>self.clients.claim())); });
self.addEventListener('fetch', e=>{
  if(e.request.method!=='GET') return;
  const u=new URL(e.request.url);
  if(u.origin!==location.origin) return;                 /* firebase sempre pela rede */
  if(u.pathname.endsWith('version.json')) return;
  e.respondWith(
    fetch(e.request).then(r=>{ const cl=r.clone();
      caches.open(CACHE).then(c=>c.put(e.request, cl)).catch(()=>{}); return r; })
    .catch(()=>caches.match(e.request).then(r=>r||caches.match('./index.html'))));
});
