"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const grpc_js_1 = require("@grpc/grpc-js");
const Uploader_1 = require("./services/Uploader");
const server = new grpc_js_1.Server({
    "grpc.max_receive_message_length": -1,
    "grpc.max_send_message_length": -1,
});
const PORT = process.env["PORT"] || 5000;
const HOST = process.env["HOST"] || "localhost";
const LOCATION = `${HOST}:${PORT}`;
server.addService(Uploader_1.UploaderPackageService, new Uploader_1.Uploader());
server.bindAsync(LOCATION, grpc_js_1.ServerCredentials.createInsecure(), (err, bindPort) => {
    if (err) {
        throw err;
    }
    const now = new Date();
    console.info(`GRPC Server Started! ${bindPort} ${now}`);
    server.start();
});
//# sourceMappingURL=server.js.map