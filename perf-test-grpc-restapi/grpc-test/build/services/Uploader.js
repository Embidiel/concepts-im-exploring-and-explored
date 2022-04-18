"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploaderPackageService = exports.Uploader = void 0;
const grpc_js_1 = require("@grpc/grpc-js");
const uploader_1 = require("../models/uploader");
Object.defineProperty(exports, "UploaderPackageService", { enumerable: true, get: function () { return uploader_1.UploaderPackageService; } });
const fs_1 = __importDefault(require("fs"));
const path_1 = require("path");
const responses_1 = require("../responses");
const ports_1 = require("../ports");
const FILES_DIR = (0, path_1.join)(__dirname, "../../files");
const fileWriterStream = (path) => {
    return fs_1.default.createWriteStream(path);
};
class Uploader {
    uploadFile(call, callback) {
        console.log(`uploadFile`);
        const { file, filename } = call.request;
        try {
            if (!filename || !file) {
                callback(new responses_1.ServiceError(grpc_js_1.status.ABORTED, "CantWrite"), null);
                return;
            }
            const writedest = (0, path_1.join)(FILES_DIR, filename);
            fs_1.default.writeFileSync(writedest, file);
            callback(null, { code: grpc_js_1.status.OK, message: "Success" });
        }
        catch (err) {
            console.log(err);
            callback(new responses_1.ServiceError(grpc_js_1.status.ABORTED, "CantWrite"), null);
        }
    }
    uploadFileStream(call, callback) {
        console.log(`uploadFileStream`);
        let writer;
        call
            .on(ports_1.STREAM_EVENT.DATA, (chunk) => {
            const { filename, file } = chunk;
            if (filename) {
                const writedest = (0, path_1.join)(FILES_DIR, filename);
                writer = fileWriterStream(writedest);
            }
            if (writer && file) {
                writer.write(file);
            }
        })
            .on(ports_1.STREAM_EVENT.END, () => {
            callback(null, { code: grpc_js_1.status.OK, message: "Success" });
        })
            .on(ports_1.STREAM_EVENT.ERROR, (err) => {
            console.error(err);
            callback(new responses_1.ServiceError(grpc_js_1.status.INTERNAL, err.message), null);
        });
    }
}
exports.Uploader = Uploader;
//# sourceMappingURL=Uploader.js.map