"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploaderPackageClient = exports.UploaderPackageService = exports.GenericResponse = exports.FileRequest = void 0;
const long_1 = __importDefault(require("long"));
const grpc_js_1 = require("@grpc/grpc-js");
const minimal_1 = __importDefault(require("protobufjs/minimal"));
function createBaseFileRequest() {
    return { filename: undefined, file: undefined };
}
exports.FileRequest = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.filename !== undefined) {
            writer.uint32(10).string(message.filename);
        }
        if (message.file !== undefined) {
            writer.uint32(18).bytes(message.file);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseFileRequest();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.filename = reader.string();
                    break;
                case 2:
                    message.file = reader.bytes();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            filename: isSet(object.filename) ? String(object.filename) : undefined,
            file: isSet(object.file)
                ? Buffer.from(bytesFromBase64(object.file))
                : undefined,
        };
    },
    toJSON(message) {
        const obj = {};
        message.filename !== undefined && (obj.filename = message.filename);
        message.file !== undefined &&
            (obj.file =
                message.file !== undefined ? base64FromBytes(message.file) : undefined);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseFileRequest();
        message.filename = (_a = object.filename) !== null && _a !== void 0 ? _a : undefined;
        message.file = (_b = object.file) !== null && _b !== void 0 ? _b : undefined;
        return message;
    },
};
function createBaseGenericResponse() {
    return { code: 0, message: "" };
}
exports.GenericResponse = {
    encode(message, writer = minimal_1.default.Writer.create()) {
        if (message.code !== 0) {
            writer.uint32(8).int32(message.code);
        }
        if (message.message !== "") {
            writer.uint32(18).string(message.message);
        }
        return writer;
    },
    decode(input, length) {
        const reader = input instanceof minimal_1.default.Reader ? input : new minimal_1.default.Reader(input);
        let end = length === undefined ? reader.len : reader.pos + length;
        const message = createBaseGenericResponse();
        while (reader.pos < end) {
            const tag = reader.uint32();
            switch (tag >>> 3) {
                case 1:
                    message.code = reader.int32();
                    break;
                case 2:
                    message.message = reader.string();
                    break;
                default:
                    reader.skipType(tag & 7);
                    break;
            }
        }
        return message;
    },
    fromJSON(object) {
        return {
            code: isSet(object.code) ? Number(object.code) : 0,
            message: isSet(object.message) ? String(object.message) : "",
        };
    },
    toJSON(message) {
        const obj = {};
        message.code !== undefined && (obj.code = Math.round(message.code));
        message.message !== undefined && (obj.message = message.message);
        return obj;
    },
    fromPartial(object) {
        var _a, _b;
        const message = createBaseGenericResponse();
        message.code = (_a = object.code) !== null && _a !== void 0 ? _a : 0;
        message.message = (_b = object.message) !== null && _b !== void 0 ? _b : "";
        return message;
    },
};
exports.UploaderPackageService = {
    uploadFile: {
        path: "/UploaderPackage.UploaderPackage/uploadFile",
        requestStream: false,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(exports.FileRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.FileRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.GenericResponse.encode(value).finish()),
        responseDeserialize: (value) => exports.GenericResponse.decode(value),
    },
    uploadFileStream: {
        path: "/UploaderPackage.UploaderPackage/uploadFileStream",
        requestStream: true,
        responseStream: false,
        requestSerialize: (value) => Buffer.from(exports.FileRequest.encode(value).finish()),
        requestDeserialize: (value) => exports.FileRequest.decode(value),
        responseSerialize: (value) => Buffer.from(exports.GenericResponse.encode(value).finish()),
        responseDeserialize: (value) => exports.GenericResponse.decode(value),
    },
};
exports.UploaderPackageClient = (0, grpc_js_1.makeGenericClientConstructor)(exports.UploaderPackageService, "UploaderPackage.UploaderPackage");
var globalThis = (() => {
    if (typeof globalThis !== "undefined")
        return globalThis;
    if (typeof self !== "undefined")
        return self;
    if (typeof window !== "undefined")
        return window;
    if (typeof global !== "undefined")
        return global;
    throw "Unable to locate global object";
})();
const atob = globalThis.atob ||
    ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64) {
    const bin = atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
        arr[i] = bin.charCodeAt(i);
    }
    return arr;
}
const btoa = globalThis.btoa ||
    ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr) {
    const bin = [];
    for (const byte of arr) {
        bin.push(String.fromCharCode(byte));
    }
    return btoa(bin.join(""));
}
if (minimal_1.default.util.Long !== long_1.default) {
    minimal_1.default.util.Long = long_1.default;
    minimal_1.default.configure();
}
function isSet(value) {
    return value !== null && value !== undefined;
}
//# sourceMappingURL=uploader.js.map