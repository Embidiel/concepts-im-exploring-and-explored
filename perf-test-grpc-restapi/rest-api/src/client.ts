import * as fs from "fs";
import fetch from "axios";
import FormData from "form-data";

import path from "path";

const method = "POST";

const tobeuploaded_photo = path.join(
  __dirname,
  "../tobeuploaded/test_photo.png"
);

interface FileRequest<TFile = Buffer> {
  filename: string;
  file: TFile;
}

const uploadFile = async () => {
  const start = performance.now();
  console.log(`I'll start uploading this ${tobeuploaded_photo}`);

  const file = fs.readFileSync(tobeuploaded_photo);

  const filename = "ff7_photo_u.png";

  const form = new FormData();

  form.append("file", file, filename);

  form.append("filename", filename);

  const request = {
    headers: {
      ...form.getHeaders(),
    },
  };

  console.log(request);

  const response = await fetch.post(
    `http://localhost:6000/file`,
    form,
    request
  );
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

  const response = await fetch.post(
    `http://localhost:6000/file/stream/${filename}`,
    request
  );
  const end = performance.now();
  const total = end - start;

  console.log("U", total);

  return response;
};

// uploadFile()
//   .then((response) => {
//     process.exit(0);
//     // console.log(response.data);
//   })
//   .catch((err) => {
//     // console.log(err);
//   });

uploadFileStream()
  .then((response) => {
    process.exit(0);
    // console.log(response.data);
  })
  .catch((err) => {
    // console.log(err);
  });
