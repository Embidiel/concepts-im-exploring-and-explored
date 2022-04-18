import { Server, ServerCredentials } from "@grpc/grpc-js";

import { Uploader, UploaderPackageService } from "./services/Uploader";

// Do not use @grpc/proto-loader
const server = new Server({
  "grpc.max_receive_message_length": -1,
  "grpc.max_send_message_length": -1,
});

const PORT = process.env["PORT"] || 5000;
const HOST = process.env["HOST"] || "localhost";
const LOCATION = `${HOST}:${PORT}`;
server.addService(UploaderPackageService, new Uploader());
server.bindAsync(
  LOCATION,
  ServerCredentials.createInsecure(),
  (err: Error | null, bindPort: number) => {
    if (err) {
      throw err;
    }

    const now = new Date();
    console.info(`GRPC Server Started! ${bindPort} ${now}`);
    server.start();
  }
);
