const crypto = require("crypto");

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

let count = 0;

console.log(`Starting to mine...`);
const t0 = performance.now();
for (let i = 1; i < 10_000_000; i++) {
  const random = random64();
  if (isHappyCoin(random)) {
    process.stdout.write(random.toString() + " ");
    count++;
  }
}

process.stdout.write(`\nCount : ${count} \n`);
const t1 = performance.now();
console.log("Mining took " + (t1 - t0) + " milliseconds.");
