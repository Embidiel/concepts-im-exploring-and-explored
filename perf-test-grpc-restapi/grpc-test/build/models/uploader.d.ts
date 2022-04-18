/// <reference types="node" />
import { ChannelCredentials, ChannelOptions, UntypedServiceImplementation, handleUnaryCall, handleClientStreamingCall, Client, ClientUnaryCall, Metadata, CallOptions, ClientWritableStream, ServiceError } from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";
export interface FileRequest {
    filename: string | undefined;
    file: Buffer | undefined;
}
export interface GenericResponse {
    code: number;
    message: string;
}
export declare const FileRequest: {
    encode(message: FileRequest, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): FileRequest;
    fromJSON(object: any): FileRequest;
    toJSON(message: FileRequest): unknown;
    fromPartial<I extends {
        filename?: string | undefined;
        file?: Buffer | undefined;
    } & {
        filename?: string | undefined;
        file?: Buffer | undefined;
    } & Record<Exclude<keyof I, keyof FileRequest>, never>>(object: I): FileRequest;
};
export declare const GenericResponse: {
    encode(message: GenericResponse, writer?: _m0.Writer): _m0.Writer;
    decode(input: _m0.Reader | Uint8Array, length?: number | undefined): GenericResponse;
    fromJSON(object: any): GenericResponse;
    toJSON(message: GenericResponse): unknown;
    fromPartial<I extends {
        code?: number | undefined;
        message?: string | undefined;
    } & {
        code?: number | undefined;
        message?: string | undefined;
    } & Record<Exclude<keyof I, keyof GenericResponse>, never>>(object: I): GenericResponse;
};
export declare const UploaderPackageService: {
    readonly uploadFile: {
        readonly path: "/UploaderPackage.UploaderPackage/uploadFile";
        readonly requestStream: false;
        readonly responseStream: false;
        readonly requestSerialize: (value: FileRequest) => Buffer;
        readonly requestDeserialize: (value: Buffer) => FileRequest;
        readonly responseSerialize: (value: GenericResponse) => Buffer;
        readonly responseDeserialize: (value: Buffer) => GenericResponse;
    };
    readonly uploadFileStream: {
        readonly path: "/UploaderPackage.UploaderPackage/uploadFileStream";
        readonly requestStream: true;
        readonly responseStream: false;
        readonly requestSerialize: (value: FileRequest) => Buffer;
        readonly requestDeserialize: (value: Buffer) => FileRequest;
        readonly responseSerialize: (value: GenericResponse) => Buffer;
        readonly responseDeserialize: (value: Buffer) => GenericResponse;
    };
};
export interface UploaderPackageServer extends UntypedServiceImplementation {
    uploadFile: handleUnaryCall<FileRequest, GenericResponse>;
    uploadFileStream: handleClientStreamingCall<FileRequest, GenericResponse>;
}
export interface UploaderPackageClient extends Client {
    uploadFile(request: FileRequest, callback: (error: ServiceError | null, response: GenericResponse) => void): ClientUnaryCall;
    uploadFile(request: FileRequest, metadata: Metadata, callback: (error: ServiceError | null, response: GenericResponse) => void): ClientUnaryCall;
    uploadFile(request: FileRequest, metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: GenericResponse) => void): ClientUnaryCall;
    uploadFileStream(callback: (error: ServiceError | null, response: GenericResponse) => void): ClientWritableStream<FileRequest>;
    uploadFileStream(metadata: Metadata, callback: (error: ServiceError | null, response: GenericResponse) => void): ClientWritableStream<FileRequest>;
    uploadFileStream(options: Partial<CallOptions>, callback: (error: ServiceError | null, response: GenericResponse) => void): ClientWritableStream<FileRequest>;
    uploadFileStream(metadata: Metadata, options: Partial<CallOptions>, callback: (error: ServiceError | null, response: GenericResponse) => void): ClientWritableStream<FileRequest>;
}
export declare const UploaderPackageClient: {
    new (address: string, credentials: ChannelCredentials, options?: Partial<ChannelOptions> | undefined): UploaderPackageClient;
    service: typeof UploaderPackageService;
};
