const ID = Math.floor(Math.random() * 999999);

console.log(`shared-worker.js ID ${ID}`);

const portsSet = new Set();

// Instance of MessageEvent = event
self.onconnect = (event) => {
  // Get parent or connected to the shared worker.
  const port = event.ports[0];
  console.log(`Port : ${JSON.stringify(port)}`);
  portsSet.add(port);

  console.log(`Connected to Shared Worker ${ID} Port Size : ${portsSet.size}`);

  // Callback when a new message is received.
  port.onmessage = (event) => {
    console.log(`Received message here at Shared Worker ${ID} ${event.data}`);

    // Broadcast the message to everyone connected to the shared worker.

    for (let p of portsSet) {
      p.postMessage({ ID, message: event.data });
    }
  };
};
