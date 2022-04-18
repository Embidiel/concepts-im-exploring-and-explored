import { ClientWritableStream, credentials, ServiceError } from "@grpc/grpc-js";

import {
  UploaderPackageClient,
  FileRequest,
  GenericResponse,
} from "./models/uploader";

import { STREAM_EVENT } from "./ports";

import fs, { ReadStream } from "fs";
import path from "path";

const PORT = process.env["PORT"] || 5000;
const HOST = process.env["HOST"] || "localhost";
const LOCATION = `${HOST}:${PORT}`;

const client = new UploaderPackageClient(
  LOCATION,
  credentials.createInsecure(),
  {
    "grpc.keepalive_time_ms": 120000,
    "grpc.http2.min_time_between_pings_ms": 120000,
    "grpc.keepalive_timeout_ms": 20000,
    "grpc.http2.max_pings_without_data": 0,
    "grpc.keepalive_permit_without_calls": 1,
  }
);

const grpcClientStreamRequest = client.uploadFileStream(
  (err: ServiceError | null, res: GenericResponse) => {
    if (err) {
      console.error("grpcSteamRequest:", err);
    }

    console.log("grpcSteamRequest:", res.message);
  }
);

type grcFileUpload = (request: FileRequest) => Promise<boolean>;

const grpcClientRequest: grcFileUpload = (request) =>
  new Promise((reso, rej) => {
    client.uploadFile(
      request,
      (err: ServiceError | null, res: GenericResponse) => {
        if (err) {
          console.error("startUpload:", err);
          rej(false);
        }

        console.log("startUpload:", res.message);
        reso(true);
      }
    );
  });

const tobeuploaded_photo = path.join(
  __dirname,
  "../tobeuploaded/test_photo.png"
);

interface FileReader<TReader = ReadStream> {
  filepath: string;
  reader: TReader;
}

interface Uploader<TUploader = ClientWritableStream<FileRequest>> {
  filename: string;
  uploader: TUploader;
}

const startUploadChunk = (
  { filepath, reader }: FileReader,
  { filename, uploader }: Uploader
): void => {
  const start = performance.now();
  console.log(`I'll start streaming this ${filepath}`);

  uploader.write({
    filename,
    file: undefined,
  });

  reader
    .on(STREAM_EVENT.DATA, (chunk) => {
      //console.log(`Received ${chunk.length} bytes of data.`);
      const fileChunk = chunk as Buffer;
      uploader.write({
        filename: undefined,
        file: fileChunk,
      });
    })
    .on(STREAM_EVENT.END, () => {
      const end = performance.now();
      const total = end - start;
      console.log('S', total);
      // console.log(
      //   `Call to startUploadStream took ${end - start} milliseconds.`
      // );
      uploader.end();
    });
};

const startUpload = (
  { filepath, reader }: FileReader<typeof fs.readFileSync>,
  { filename, uploader }: Uploader<grcFileUpload>
): void => {
  const start = performance.now();
  console.log(`I'll start uploading this ${filepath}`);

  const filebuffer = reader(filepath);
  uploader({ file: filebuffer, filename }).then((reso) => {
    const end = performance.now();
    const total = end - start;
    console.log('U', total);
    process.exit(0)
    // console.log(`Call to startUpload took ${end - start} milliseconds.`);
  });
};


  
  startUpload(
    {
      filepath: tobeuploaded_photo,
      reader: fs.readFileSync,
    },
    {
      filename: "ff7_photo_unary.png",
      uploader: grpcClientRequest,
    }
  );
  
