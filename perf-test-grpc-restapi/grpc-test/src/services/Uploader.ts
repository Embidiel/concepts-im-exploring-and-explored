import {
  UntypedHandleCall,
  sendUnaryData,
  ServerReadableStream,
  ServerUnaryCall,
  status,
} from "@grpc/grpc-js";

import {
  UploaderPackageService,
  UploaderPackageServer,
  FileRequest,
  GenericResponse,
} from "../models/uploader";

import fs, { WriteStream } from "fs";
import { join } from "path";

import { ServiceError } from "../responses";

import { STREAM_EVENT } from "../ports";

const FILES_DIR = join(__dirname, "../../files");

const fileWriterStream = (path: string) => {
  return fs.createWriteStream(path);
};

/**
 * package UploaderPackage
 * service Uploader
 */
class Uploader implements UploaderPackageServer {
  // Argument of type 'Greeter' is not assignable to parameter of type 'UntypedServiceImplementation'.
  // Index signature is missing in type 'Greeter'.ts(2345)
  [method: string]: UntypedHandleCall;

  public uploadFile(
    call: ServerUnaryCall<FileRequest, GenericResponse>,
    callback: sendUnaryData<GenericResponse>
  ): void {
    console.log(`uploadFile`);

    const { file, filename } = call.request;

    try {
      if (!filename || !file) {
        callback(new ServiceError(status.ABORTED, "CantWrite"), null);
        return;
      }
      const writedest = join(FILES_DIR, filename);
      fs.writeFileSync(writedest, file);
      callback(null, { code: status.OK, message: "Success" });
    } catch (err) {
      console.log(err);
      callback(new ServiceError(status.ABORTED, "CantWrite"), null);
    }
  }

  public uploadFileStream(
    call: ServerReadableStream<FileRequest, GenericResponse>,
    callback: sendUnaryData<GenericResponse>
  ): void {
    console.log(`uploadFileStream`);

    let writer: WriteStream;

    call
      .on(STREAM_EVENT.DATA, (chunk: FileRequest) => {
        const { filename, file } = chunk;

        if (filename) {
          const writedest = join(FILES_DIR, filename);
          writer = fileWriterStream(writedest);
        }

        if (writer && file) {
          writer.write(file);
        }
      })
      .on(STREAM_EVENT.END, () => {
        callback(null, { code: status.OK, message: "Success" });
      })
      .on(STREAM_EVENT.ERROR, (err: Error) => {
        console.error(err);
        callback(new ServiceError(status.INTERNAL, err.message), null);
      });
  }
}

export { Uploader, UploaderPackageService };
