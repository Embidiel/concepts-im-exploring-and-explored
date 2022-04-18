"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const grpc_js_1 = require("@grpc/grpc-js");
const uploader_1 = require("./models/uploader");
const ports_1 = require("./ports");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const PORT = process.env["PORT"] || 5000;
const HOST = process.env["HOST"] || "localhost";
const LOCATION = `${HOST}:${PORT}`;
const client = new uploader_1.UploaderPackageClient(LOCATION, grpc_js_1.credentials.createInsecure(), {
    "grpc.keepalive_time_ms": 120000,
    "grpc.http2.min_time_between_pings_ms": 120000,
    "grpc.keepalive_timeout_ms": 20000,
    "grpc.http2.max_pings_without_data": 0,
    "grpc.keepalive_permit_without_calls": 1,
});
const grpcClientStreamRequest = client.uploadFileStream((err, res) => {
    if (err) {
        console.error("grpcSteamRequest:", err);
    }
    console.log("grpcSteamRequest:", res.message);
});
const grpcClientRequest = (request) => new Promise((reso, rej) => {
    client.uploadFile(request, (err, res) => {
        if (err) {
            console.error("startUpload:", err);
            rej(false);
        }
        console.log("startUpload:", res.message);
        reso(true);
    });
});
const tobeuploaded_photo = path_1.default.join(__dirname, "../tobeuploaded/test_photo.png");
const startUploadChunk = ({ filepath, reader }, { filename, uploader }) => {
    const start = performance.now();
    console.log(`I'll start streaming this ${filepath}`);
    uploader.write({
        filename,
        file: undefined,
    });
    reader
        .on(ports_1.STREAM_EVENT.DATA, (chunk) => {
        const fileChunk = chunk;
        uploader.write({
            filename: undefined,
            file: fileChunk,
        });
    })
        .on(ports_1.STREAM_EVENT.END, () => {
        const end = performance.now();
        const total = end - start;
        console.log('S', total);
        uploader.end();
    });
};
const startUpload = ({ filepath, reader }, { filename, uploader }) => {
    const start = performance.now();
    console.log(`I'll start uploading this ${filepath}`);
    const filebuffer = reader(filepath);
    uploader({ file: filebuffer, filename }).then((reso) => {
        const end = performance.now();
        const total = end - start;
        console.log('U', total);
        process.exit(0);
    });
};
startUpload({
    filepath: tobeuploaded_photo,
    reader: fs_1.default.readFileSync,
}, {
    filename: "ff7_photo_unary.png",
    uploader: grpcClientRequest,
});
//# sourceMappingURL=client.js.map