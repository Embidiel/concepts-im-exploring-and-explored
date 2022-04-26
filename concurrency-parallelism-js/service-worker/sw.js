// Just a flag to let us know that the request is intercepted
let ctr = 0;

// Instantiation work for caches
self.oninstall = (event) => {
  console.log(`Service Worker Installed`);
};

// Tear down old version of caches, cache invalidation etc.
self.onactivate = (event) => {
  console.log(`Service Worker Activated`);

  event.waitUntil(self.clients.claim()); // Returns promise, control client of the Service Worker
};

// Intercept any network request
self.onfetch = (event) => {
  console.log(`Fetch : ${event.request.url}`);

  const isRequestDataJSON = event.request.url.endsWith("/data.json");
  console.log(`isRequestDataJSON : `, isRequestDataJSON);
  if (isRequestDataJSON) {
    // Flag
    ctr++;
    event.respondWith(
      new Response(JSON.stringify({ ctr }), {
        headers: { "Content-Type": "application/json" },
      })
    );
    return;
  }

  // Fallback to normal http request
  event.respondWith(fetch(event.request));
};
