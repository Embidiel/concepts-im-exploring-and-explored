import { UntypedHandleCall, sendUnaryData, ServerReadableStream, ServerUnaryCall } from "@grpc/grpc-js";
import { UploaderPackageService, UploaderPackageServer, FileRequest, GenericResponse } from "../models/uploader";
declare class Uploader implements UploaderPackageServer {
    [method: string]: UntypedHandleCall;
    uploadFile(call: ServerUnaryCall<FileRequest, GenericResponse>, callback: sendUnaryData<GenericResponse>): void;
    uploadFileStream(call: ServerReadableStream<FileRequest, GenericResponse>, callback: sendUnaryData<GenericResponse>): void;
}
export { Uploader, UploaderPackageService };
