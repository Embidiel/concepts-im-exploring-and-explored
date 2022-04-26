const worker = new RpcWorker("worker.js");

// Run all promises, continue execution once all complete, regardless if success or failed.
Promise.allSettled([
  worker.exec("square_sum", 1_000_000),
  worker.exec("fibonacci", 1_000),
  worker.exec("fakemethod"),
  worker.exec("bad"),
]).then(([square_sum, fibonacci, fakemethod, bad]) => {
  console.log(square_sum);
  console.log(fibonacci);
  console.log(fakemethod);
  console.log(bad);
});
