"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs = __importStar(require("fs"));
const axios_1 = __importDefault(require("axios"));
const form_data_1 = __importDefault(require("form-data"));
const path_1 = __importDefault(require("path"));
const method = "POST";
const tobeuploaded_photo = path_1.default.join(__dirname, "../tobeuploaded/test_photo.png");
const uploadFile = async () => {
    const start = performance.now();
    console.log(`I'll start uploading this ${tobeuploaded_photo}`);
    const file = fs.readFileSync(tobeuploaded_photo);
    const filename = "ff7_photo_u.png";
    const form = new form_data_1.default();
    form.append("file", file, filename);
    form.append("filename", filename);
    const request = {
        headers: {
            ...form.getHeaders(),
        },
    };
    console.log(request);
    const response = await axios_1.default.post(`http://localhost:6000/file`, form, request);
    const end = performance.now();
    const total = end - start;
    console.log("U", total);
    return response;
};
const uploadFileStream = async () => {
    const start = performance.now();
    console.log(`I'll start uploading this ${tobeuploaded_photo}`);
    const fileStream = fs.createReadStream(tobeuploaded_photo);
    const filename = "ff7_photo_s.png";
    const request = {
        headers: {
            "Transfer-Encoding": "chunked",
            "Content-Type": "application/octet-stream",
        },
        data: fileStream,
    };
    const response = await axios_1.default.post(`http://localhost:6000/file/stream/${filename}`, request);
    const end = performance.now();
    const total = end - start;
    console.log("U", total);
    return response;
};
uploadFileStream()
    .then((response) => {
    process.exit(0);
})
    .catch((err) => {
});
//# sourceMappingURL=client.js.map