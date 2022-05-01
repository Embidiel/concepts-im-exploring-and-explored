self.onmessage = ({ data: { buffer, name } }) => {
  // Notify main thread that it's ready to take tasks
  postMessage("ready");
  const view = new Int32Array(buffer);
  console.log(`Worker ${name} started.`);

  // Sleep thread at infinity seconds if view[0] === 0, Resolves to true since base value of view[0] is 0.
  const result = Atomics.wait(view, 0, 0, 10);

  console.log(`Worker ${name} - ${result}`);
};
