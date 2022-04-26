console.log(`Hello from worker.js`);

// instance of MessageEvent = msg
self.onmessage = (msg) => {
  console.log(`Message from main.js ${msg.data}`);

  postMessage(`Message from worker.js to main.js`);
};

console.log(`End of worker.js`);
