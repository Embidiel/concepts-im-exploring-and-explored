// Check if JS environment supports SharedArrayBuffer
if (!crossOriginIsolated) {
  throw new Error(`Shared Array Buffer is not supported`);
}

// 4 bytes
const buffer = new SharedArrayBuffer(4);
const view = new Int32Array(buffer);
const now = Date.now();
let count = 4;

for (let i = 0; i < 4; i++) {
  const worker = new Worker("worker.js");

  // Pass shared memory and worker name to worker thread.
  worker.postMessage({ buffer, name: i });

  // Handle worker thread prepared message.
  worker.onmessage = () => {
    console.log(`Ready : ${i}, count=${--count}, time=${Date.now() - now}ms`);
    if (count === 0) {
      // Awake all threads that are locked with the same view and index.
      Atomics.notify(view, 0);
    }
  };
}
