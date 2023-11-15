function actualizaCacheDinamico(dynamicCache, req, res) {
    if (!(req.url.startsWith('http') && res.ok)) return res;

    caches.open(dynamicCache).then(cache => {
        cache.put(req, res.clone());
        return res.clone();
    });
}