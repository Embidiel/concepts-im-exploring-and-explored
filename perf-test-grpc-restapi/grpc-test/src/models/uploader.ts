/* eslint-disable */
import Long from "long";
import {
  makeGenericClientConstructor,
  ChannelCredentials,
  ChannelOptions,
  UntypedServiceImplementation,
  handleUnaryCall,
  handleClientStreamingCall,
  Client,
  ClientUnaryCall,
  Metadata,
  CallOptions,
  ClientWritableStream,
  ServiceError,
} from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";

export interface FileRequest {
  filename: string | undefined;
  file: Buffer | undefined;
}

export interface GenericResponse {
  code: number;
  message: string;
}

function createBaseFileRequest(): FileRequest {
  return { filename: undefined, file: undefined };
}

export const FileRequest = {
  encode(
    message: FileRequest,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.filename !== undefined) {
      writer.uint32(10).string(message.filename);
    }
    if (message.file !== undefined) {
      writer.uint32(18).bytes(message.file);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): FileRequest {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = createBaseFileRequest();
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.filename = reader.string();
          break;
        case 2:
          message.file = reader.bytes() as Buffer;
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): FileRequest {
    return {
      filename: isSet(object.filename) ? String(object.filename) : undefined,
      file: isSet(object.file)
        ? Buffer.from(bytesFromBase64(object.file))
        : undefined,
    };
  },

  toJSON(message: FileRequest): unknown {
    const obj: any = {};
    message.filename !== undefined && (obj.filename = message.filename);
    message.file !== undefined &&
      (obj.file =
        message.file !== undefined ? base64FromBytes(message.file) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<FileRequest>, I>>(
    object: I
  ): FileRequest {
    const message = createBaseFileRequest();
    message.filename = object.filename ?? undefined;
    message.file = object.file ?? undefined;
    return message;
  },
};

function createBaseGenericResponse(): GenericResponse {
  return { code: 0, message: "" };
}

export const GenericResponse = {
  encode(
    message: GenericResponse,
    writer: _m0.Writer = _m0.Writer.create()
  ): _m0.Writer {
    if (message.code !== 0) {
      writer.uint32(8).int32(message.code);
    }
    if (message.message !== "") {
      writer.uint32(18).string(message.message);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GenericResponse {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
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

  fromJSON(object: any): GenericResponse {
    return {
      code: isSet(object.code) ? Number(object.code) : 0,
      message: isSet(object.message) ? String(object.message) : "",
    };
  },

  toJSON(message: GenericResponse): unknown {
    const obj: any = {};
    message.code !== undefined && (obj.code = Math.round(message.code));
    message.message !== undefined && (obj.message = message.message);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GenericResponse>, I>>(
    object: I
  ): GenericResponse {
    const message = createBaseGenericResponse();
    message.code = object.code ?? 0;
    message.message = object.message ?? "";
    return message;
  },
};

export const UploaderPackageService = {
  uploadFile: {
    path: "/UploaderPackage.UploaderPackage/uploadFile",
    requestStream: false,
    responseStream: false,
    requestSerialize: (value: FileRequest) =>
      Buffer.from(FileRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => FileRequest.decode(value),
    responseSerialize: (value: GenericResponse) =>
      Buffer.from(GenericResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GenericResponse.decode(value),
  },
  uploadFileStream: {
    path: "/UploaderPackage.UploaderPackage/uploadFileStream",
    requestStream: true,
    responseStream: false,
    requestSerialize: (value: FileRequest) =>
      Buffer.from(FileRequest.encode(value).finish()),
    requestDeserialize: (value: Buffer) => FileRequest.decode(value),
    responseSerialize: (value: GenericResponse) =>
      Buffer.from(GenericResponse.encode(value).finish()),
    responseDeserialize: (value: Buffer) => GenericResponse.decode(value),
  },
} as const;

export interface UploaderPackageServer extends UntypedServiceImplementation {
  uploadFile: handleUnaryCall<FileRequest, GenericResponse>;
  uploadFileStream: handleClientStreamingCall<FileRequest, GenericResponse>;
}

export interface UploaderPackageClient extends Client {
  uploadFile(
    request: FileRequest,
    callback: (error: ServiceError | null, response: GenericResponse) => void
  ): ClientUnaryCall;
  uploadFile(
    request: FileRequest,
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GenericResponse) => void
  ): ClientUnaryCall;
  uploadFile(
    request: FileRequest,
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GenericResponse) => void
  ): ClientUnaryCall;
  uploadFileStream(
    callback: (error: ServiceError | null, response: GenericResponse) => void
  ): ClientWritableStream<FileRequest>;
  uploadFileStream(
    metadata: Metadata,
    callback: (error: ServiceError | null, response: GenericResponse) => void
  ): ClientWritableStream<FileRequest>;
  uploadFileStream(
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GenericResponse) => void
  ): ClientWritableStream<FileRequest>;
  uploadFileStream(
    metadata: Metadata,
    options: Partial<CallOptions>,
    callback: (error: ServiceError | null, response: GenericResponse) => void
  ): ClientWritableStream<FileRequest>;
}

export const UploaderPackageClient = makeGenericClientConstructor(
  UploaderPackageService,
  "UploaderPackage.UploaderPackage"
) as unknown as {
  new (
    address: string,
    credentials: ChannelCredentials,
    options?: Partial<ChannelOptions>
  ): UploaderPackageClient;
  service: typeof UploaderPackageService;
};

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") return globalThis;
  if (typeof self !== "undefined") return self;
  if (typeof window !== "undefined") return window;
  if (typeof global !== "undefined") return global;
  throw "Unable to locate global object";
})();

const atob: (b64: string) => string =
  globalThis.atob ||
  ((b64) => globalThis.Buffer.from(b64, "base64").toString("binary"));
function bytesFromBase64(b64: string): Uint8Array {
  const bin = atob(b64);
  const arr = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; ++i) {
    arr[i] = bin.charCodeAt(i);
  }
  return arr;
}

const btoa: (bin: string) => string =
  globalThis.btoa ||
  ((bin) => globalThis.Buffer.from(bin, "binary").toString("base64"));
function base64FromBytes(arr: Uint8Array): string {
  const bin: string[] = [];
  for (const byte of arr) {
    bin.push(String.fromCharCode(byte));
  }
  return btoa(bin.join(""));
}

type Builtin =
  | Date
  | Function
  | Uint8Array
  | string
  | number
  | boolean
  | undefined;

type DeepPartial<T> = T extends Builtin
  ? T
  : T extends Array<infer U>
  ? Array<DeepPartial<U>>
  : T extends ReadonlyArray<infer U>
  ? ReadonlyArray<DeepPartial<U>>
  : T extends {}
  ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
type Exact<P, I extends P> = P extends Builtin
  ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & Record<
        Exclude<keyof I, KeysOfUnion<P>>,
        never
      >;

if (_m0.util.Long !== Long) {
  _m0.util.Long = Long as any;
  _m0.configure();
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
