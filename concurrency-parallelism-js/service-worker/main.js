console.log(`Here at main.js`);

// Path to JS file, Scope or directory for the current origin
navigator.serviceWorker
  .register("/sw.js", { scope: "/" })
  .then(function (registration) {
    console.log(`Kamote`);
    registration.update();
  });

navigator.serviceWorker.oncontrollerchange = () => {
  console.log(`Controller changed - Page is now controlled by Service Worker`);
};

async function makeRequest() {
  const res = await fetch("./data.json");
  const payload = await res.json();
  console.log(payload);
}
