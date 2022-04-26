console.log(`Hello from main.js`);

// Instantiate worker, Download file or load from cache.
const worker = new Worker("worker.js");

// instance of MessageEvent = msg
// On received message to web worker "worker" this function shall be fired.
worker.onmessage = (msg) => {
  console.log(`Received from 'worker.js' : ${msg.data}`);
};

worker.postMessage(`This shall be sent from main.js to worker.js`);

console.log(`End of main.js`)