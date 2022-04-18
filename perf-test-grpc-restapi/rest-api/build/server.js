"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
const port = process.env["PORT"] || 6000;
const path_1 = require("path");
const FILES_DIR = (0, path_1.join)(__dirname, "../files");
app.use(express_1.default.json());
app.use((0, express_fileupload_1.default)({
    limits: { fileSize: 50 * 1024 * 1024 },
}));
app.get("/", (req, res) => {
    res.sendStatus(200);
});
app.post("/file", (req, res) => {
    if (!req.files) {
        res.sendStatus(400);
        return;
    }
    const file = req.files["file"];
    const path = `${FILES_DIR}/${req.body.filename}`;
    file.mv(path, (err) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }
        res.sendStatus(200);
        return;
    });
});
app.post("/file/stream/:filename", (req, res) => {
    const filename = req.params.filename;
    const stream = fs_1.default.createWriteStream(`${FILES_DIR}/${filename}`);
    stream.on("open", () => {
        console.log("Stream open ...  0.00%");
        req.pipe(stream);
    });
    stream.on("data", () => {
        console.log(`Data`);
        const written = stream.bytesWritten;
        const total = parseInt(req.headers["content-length"]);
        const pWritten = ((written / total) * 100).toFixed(2);
        console.log(`Processing  ...  ${pWritten}% done`);
    });
    stream.on("close", () => {
        console.log("Processing  ...  100%");
        res.sendStatus(200);
    });
    stream.on("error", (err) => {
        console.error(err);
        res.sendStatus(500);
    });
});
app.listen(port, () => {
    console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
//# sourceMappingURL=server.js.map