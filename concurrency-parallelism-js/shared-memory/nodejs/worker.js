const {parentPort} = require('worker_threads');

parentPort.on('message', (buffer) => {
    buffer.foo = 420;

    const view = new Uint8Array(buffer);

    view[0] = 69;
    console.log(`Updated in worker`)
})