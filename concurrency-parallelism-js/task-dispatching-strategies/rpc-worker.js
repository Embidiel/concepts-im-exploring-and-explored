const { Worker } = require("worker_threads");

const CORES = require("os").cpus().length;
const STRATEGIES = { roundrobin: true, random: true, leastbusy: true };

module.exports = class RpcWorkerPool {
  constructor(path, size = 0, strategy = "roundrobin") {
    if (size === 0) this.size = CORES;
    else if (size < 0) this.size = CORES + size;
    else this.size = size;

    if (!STRATEGIES[strategy]) throw TypeError(`Strategy not found`);

    this.strategy = strategy;
    this.rr_index = -1;

    this.next_command_id = 0;

    // Array to store pool of workers
    this.workers = [];

    for (let i = 0; i < this.size; i++) {
      // Init worker thread
      const worker = new Worker(path);
      this.workers.push({ worker, in_flight_commands: new Map() });
      worker.on("message", (msg) => {
        this.onMessageHandler(msg, i);
      });
    }
  }

  onMessageHandler(msg, worker_id) {
    const worker = this.workers[worker_id];
    const { result, error, id } = msg;
    const { resolve, reject } = worker.in_flight_commands.get(id);
    worker.in_flight_commands.delete(id);
    if (error) reject(error);
    else resolve(result);
  }

  exec(method, ...args) {
    const id = ++this.next_command_id;
    let resolve, reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });

    const worker = this.getWorker();
    worker.in_flight_commands.set(id, { resolve, reject });
    worker.worker.postMessage({ method, params: args, id });

    return promise;
  }

  getWorker() {
    let id;

    if (this.strategy === "random") {
      id = Math.floor(Math.random() * this.size);
    } else if (this.strategy === "roundrobin") {
      // Move to next worker like from 1 to 2
      this.rr_index++;

      // Reset to 0 if rr index became larger than the thread pool size.
      if (this.rr_index >= this.size) this.rr_index = 0;

      id = this.rr_index;
    } else if (this.strategy === "leastbusy") {
      let min = Infinity;
      // For every worker in the thread pool, check who is the worker that has the least work.
      for (let i = 0; i < this.size; i++) {
        let worker = this.workers[i];
        if (worker.in_flight_commands.size < min) {
          min = worker.in_flight_commands.size;
          id = i;
        }
      }
    }

    console.log(`Selected worker : ${id}`);
    return this.workers[id];
  }
};
