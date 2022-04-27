const crypto = require("crypto");

const { Worker, isMainThread, parentPort } = require("worker_threads");

const big64arr = new BigUint64Array(1);

function random64() {
  crypto.randomFillSync(big64arr);
  return big64arr[0];
}

// n means it will be a type of 'bigint' instead of 'number'
function sumDigitsSquared(num) {
  let total = 0n;
  while (num > 0) {
    // Get each digit from right to left
    const numModBase = num % 10n;
    // Square number then add to total
    total += numModBase ** 2n;
    num = num / 10n;
  }

  return total;
}

function isHappy(num) {
  // A number is happy or valid if it is folded into number '1', 4 it means that we never ended up at 1
  while (num != 1n && num != 4n) {
    num = sumDigitsSquared(num);
  }
  return num === 1n;
}

function isHappyCoin(num) {
  // Number is also happy if it is divisible by 10,000
  return isHappy(num) && num % 10000n === 0n;
}

const THREAD_COUNT = 4;

if (isMainThread) {
  let inFlight = THREAD_COUNT;

  let count = 0;

  // Init worker threads up to 4
  for (let i = 0; i < THREAD_COUNT; i++) {
    const worker = new Worker(__filename);

    // Handle message from worker thread.
    console.log(`Starting to mine...`);
    const t0 = performance.now();
    worker.on("message", (msg) => {
      if (msg === "done") {
        if (--inFlight === 0) {
          process.stdout.write(`\n Count : ${count} \n`);
          const t1 = performance.now();
          console.log("Mining took " + (t1 - t0) + " milliseconds.");
        }
      } else if (typeof msg === "bigint") {
        process.stdout.write(msg.toString() + "");
        count++;
      }
    });
  }
} else {
  // Worker thread
  // Compute until quarter of 10,000,000 only since work is divided into 4 worker threads.
  for (let i = 1; i < 10_000_000 / THREAD_COUNT; i++) {
    const random = random64();

    if (isHappyCoin(random)) {
      // Past happycoin number to main thread
      parentPort.postMessage(random);
    }
  }
  parentPort.postMessage("done");
}
