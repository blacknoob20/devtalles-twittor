importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v0';
const DYNAMI_CACHE = 'dynami-v0';
const INMUTA_CACHE = 'inmuta-v0';

const APP_SHELL = [
    // '/',
    '/index.html',
    '/css/style.css',
    '/img/favicon.ico',
    'img/avatars/wolverine.jpg',
    'img/avatars/thor.jpg',
    'img/avatars/spiderman.jpg',
    'img/avatars/ironman.jpg',
    'img/avatars/hulk.jpg',
    'js/app.js',
    'js/sw-utils.js'
];
const APP_SHELL_INMUTABLE = [
    'https://fonts.googleapis.com/css?family=Quicksand:300,400',
    'https://fonts.googleapis.com/css?family=Lato:400,300',
    'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
    'https://fonts.gstatic.com/s/lato/v24/S6uyw4BMUTPHjx4wXg.woff2',
    'https://fonts.gstatic.com/s/quicksand/v31/6xKtdSZaM9iE8KbpRA_hK1QN.woff2',
    'css/animate.css',
    'js/libs/jquery.js',
];

self.addEventListener('install', e => {
    const cacheStatic = caches.open(STATIC_CACHE).then(cache => cache.addAll(APP_SHELL));
    const cacheInmuta = caches.open(INMUTA_CACHE).then(cache => cache.addAll(APP_SHELL_INMUTABLE));

    e.waitUntil(Promise.all([cacheStatic, cacheInmuta]));
});

self.addEventListener('activate', e => {
    const response = caches.keys().then(keys => {
        keys.forEach(key => {
            if (key !== STATIC_CACHE && key.includes('static')) caches.delete(key);
            // if(key !== DYNAMI_CACHE && key.includes('dynami')) caches.delete(key);
        });

    });

    e.waitUntil(response);
});

self.addEventListener('fetch', e => {
    const response = caches.match(e.request).then(res => {
        if (res) return res;
        else return fetch(e.request).then(newResponse => {
            return actualizaCacheDinamico(DYNAMI_CACHE, e.request, newResponse);
        });
    });

    if (e.request.url.startsWith('http')) e.respondWith(response)
});