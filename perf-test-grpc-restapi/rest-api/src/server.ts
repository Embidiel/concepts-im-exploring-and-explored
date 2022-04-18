import express, { Express, Request, Response } from "express";
import fileUpload, { UploadedFile } from "express-fileupload";
import fs from "fs";

const app: Express = express();
const port = process.env["PORT"] || 6000;

import { join } from "path";

const FILES_DIR = join(__dirname, "../files");

interface FileRequest {
  filename: string;
  file: BinaryData;
}

app.use(express.json());
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 },
  })
);

app.get("/", (req: Request<{}, {}, FileRequest>, res: Response) => {
  res.sendStatus(200);
});

app.post("/file", (req: Request, res: Response) => {
  if (!req.files) {
    res.sendStatus(400);
    return;
  }

  const file: UploadedFile = req.files["file"] as UploadedFile;
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

app.post(
  "/file/stream/:filename",
  (req: Request<{ filename: string }, {}, FileRequest>, res: Response) => {
    const filename = req.params.filename;
    const stream = fs.createWriteStream(`${FILES_DIR}/${filename}`);
    // With the open - event, data will start being written
    // from the request to the stream's destination path
    stream.on("open", () => {
      console.log("Stream open ...  0.00%");
      req.pipe(stream);
    });

    // Drain is fired whenever a data chunk is written.
    // When that happens, print how much data has been written yet.
    stream.on("data", () => {
      console.log(`Data`);
      const written = stream.bytesWritten;
      const total = parseInt(req.headers["content-length"] as string);
      const pWritten = ((written / total) * 100).toFixed(2);
      console.log(`Processing  ...  ${pWritten}% done`);
    });

    // When the stream is finished, print a final message
    // Also, resolve the location of the file to calling function
    stream.on("close", () => {
      console.log("Processing  ...  100%");
      res.sendStatus(200);
    });
    // If something goes wrong, reject the primise
    stream.on("error", (err) => {
      console.error(err);
      res.sendStatus(500);
    });
  }
);

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});
