const { Worker } = require("worker_threads");

const worker = new Worker(__dirname + "/worker.js");

const buffer = new SharedArrayBuffer(1024);
const view = new Uint8Array(buffer);

worker.postMessage(buffer);

console.log(`Now : `, view[0]);

setTimeout(() => {
  console.log(`Later : `, view[0]);

  console.log(`Prop : `, buffer.foo);

  // Prevent worker from running the process forever.
  worker.unref();
}, 500);
