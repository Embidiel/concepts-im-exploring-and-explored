self.onmessage = ({ data: buffer }) => {
  // Actual buffer object is not shared only the REFERENCE to the memory location. Constraint of the structured clone algorithm.
  buffer.foo = 42;

  const view = new Uint8Array(buffer);

  view[0] = 69;

  console.log(`Updated in worker.js`);
};
