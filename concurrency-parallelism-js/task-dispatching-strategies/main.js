const http = require("http");
const RpcWorkerPool = require("./rpc-worker.js");
const args = process.argv;

const threads = args[2];
const strategy = args[3];

const worker = new RpcWorkerPool("./worker.js", Number(threads), strategy);

const server = http.createServer(async (req, res) => {
  const val = Math.floor(Math.random() * 100_000_000);
  const sum = await worker.exec("square_sum", val);
  res.end(JSON.stringify({ sum, val }));
});

server.listen(1337, (err) => {
  if (err) throw err;
  console.log(`http://localhost:1337/`);
});
