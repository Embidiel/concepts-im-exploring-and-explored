// Check if JS environment supports SharedArrayBuffer
if (!crossOriginIsolated) {
  throw new Error(`Shared Array Buffer is not supported`);
}

const worker = new Worker("worker.js");

// Initialize 1 kb buffer to be shared
const buffer = new SharedArrayBuffer(1024);

// Think of this as a way to get and set values to the shared array buffer.
const view = new Uint8Array(buffer);

console.log(`Now`, view[0]);

// Share memory from main thread to worker thread
worker.postMessage(buffer);

setTimeout(() => {
  console.log(`Later`, view[0]);

  console.log(`Prop`, buffer.foo);
}, 500);
