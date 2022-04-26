const sleep = (ms) => new Promise((res) => setTimeout(res, ms)); // Artificial long running calculation for slowdown.

// Wrapper function to conveniently pull or await data out of the selected command / method of the client and pass it again to the client as a response (postMessage)
function asyncOnMessageWrap(fn) {
  return async function (msg) {
    const res = await fn(msg.data);
    postMessage(res);
  };
}

// Mema
const commands = {
  async square_sum(max) {
    // Long calculation simulation
    await sleep(Math.random() * 100);
    let sum = 0;
    for (let i = 0; i < max; i++) {
      sum += Math.sqrt(i);
    }
    return sum;
  },
  async fibonacci(limit) {
    await sleep(Math.random() * 100);
    let prev = 1n,
      next = 0n,
      swap;

    while (limit) {
      swap = prev;
      prev = prev + next;
      next = swap;
      limit--;
    }

    return String(next);
  },
  async bad() {
    await sleep(Math.random() * 10);
    throw new Error(`Oh no!`);
  },
};

async function onMessageHandler(rpc) {
  const { method, params, id } = rpc;

  if (commands.hasOwnProperty(method)) {
    try {
      const res = await commands[method](...params);
      return { id, result: res };
    } catch (err) {
      return { id, error: { code: -69, message: err.message } };
    }
  } else {
    return {
      id,
      error: { code: -420, message: `Method ${method} not found` },
    };
  }
}
self.onmessage = asyncOnMessageWrap(onMessageHandler);
