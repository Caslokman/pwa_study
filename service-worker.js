let cacheName = 'notes-son.v.1.0.0'
let filesToCache = [
    './',
    'index.html',
    'css/bootstrap/bootstrap.min.css',
    'css/colors.css',
    'css/main.css',
    'js/bootstrap/bootstrap.min.js',
    'js/object.observe.polyfill.js',
    'js/array.observer.polyfill.js',
    'js/main.js',
    'service-worker.js'
]

self.addEventListener('install', function(e){
    console.log('[ServiceWorker] Installer')
    e.waitUntil(
        caches.open(cacheName).then(function(cache){
            console.log('[ServiceWorker] Caching app shell')
            return cache.addAll(filesToCache)
        })
    )
})

self.addEventListener('active', function(e){
    console.log('[ServiceWorker] Activate')
    e.waitUntil(
        caches.keys().then(function(keyList){
            return Promise.all(keyList.map(function(key){
                if(key !== cacheName){
                    console.log('[ServiceWorker] Removing old cache')
                    return caches.delete(key)
                }
            }))
        })
    )
})

self.addEventListener('fetch', function(e){
    console.log('[ServiceWorker] Fetch', e.request.url)
    e.respondWith(
        caches.match(e.request).then(function(response){
            return response || fetch(e.request)
        })
    )
})