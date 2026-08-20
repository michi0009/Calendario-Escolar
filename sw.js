const CACHE_NAME = "calendario-escolar-v1";

const ARCHIVOS = [
    "./",
    "./index.html",
    "./manifest.json"
];

self.addEventListener("install", evento => {
    evento.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(ARCHIVOS))
    );

    self.skipWaiting();
});

self.addEventListener("activate", evento => {
    evento.waitUntil(
        caches.keys().then(claves =>
            Promise.all(
                claves
                    .filter(clave => clave !== CACHE_NAME)
                    .map(clave => caches.delete(clave))
            )
        )
    );

    self.clients.claim();
});

self.addEventListener("fetch", evento => {

    if (
        evento.request.url.includes(
            "calendario-escolar-api.elkitsunelegendario.workers.dev"
        )
    ) {
        return;
    }

    evento.respondWith(
        caches.match(evento.request)
            .then(respuesta =>
                respuesta || fetch(evento.request)
            )
    );
});
