class RpcWorker {
  // worker file path
  constructor(path) {
    // Identifier to tag whose message is for?
    this.nextCommandId = 0;

    // Stores command id and the value for FUTURE response of the worker if it is success or failed. [1] : {resolve, reject}
    // TODO : Handle timeouts for worker request to handle possible memory leaks if the 'onMessageHandler' is not triggered for a specific reason.
    this.inFlightCommands = new Map();

    // Encapsulate just core logic of the RPC structure, instead of directly inheriting Worker class
    this.worker = new Worker(path);

    // Attach worker response handler and bind this class context to access class' properties and methods.
    this.worker.onmessage = this.onMessageHandler.bind(this);
  }

  onMessageHandler(workerResponse) {
    const { result, error, id } = workerResponse.data;
    const { resolve, reject } = this.inFlightCommands.get(id);

    // Remove request from memory since the worker replied.
    this.inFlightCommands.delete(id);

    // Attach result or error to the promise that will be resolved by the client of RPCWorker which is main.js
    if (error) {
      reject(error);
    } else {
      resolve(result);
    }
  }

  exec(method, ...args) {
    const id = ++this.nextCommandId;
    let resolve, reject;

    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });

    // Register execution order
    // TODO : Handle timeouts for worker request to handle possible memory leaks if the 'onMessageHandler' is not triggered for a specific reason.
    this.inFlightCommands.set(id, { resolve, reject });

    this.worker.postMessage({ method, params: args, id });

    return promise;
  }
}
