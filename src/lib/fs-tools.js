import { fileURLToPath } from "url";
import { dirname, join } from "path";
import fs from "fs-extra";
import { Console } from "console";
const { readJSON, writeJSON, writeFile, createReadStream, createWriteStream } =
  fs;
const dataFolderPath = join(dirname(fileURLToPath(import.meta.url)), "../data");
const publicFolderPath = join(process.cwd(), "./public/img/netflixCover");
console.log("Root of the project: ", process.cwd());
console.log("Public folder : ", publicFolderPath);
console.log("Data folder path: ", dataFolderPath);
const mediasJSONPath = join(dataFolderPath, "medias.json");
export const getMedias = () => readJSON(mediasJSONPath);
export const writeMedias = (mediasArray) =>
  writeJSON(mediasJSONPath, mediasArray);
export const saveMediasAvatar = (fileName, conteAsABuffer) =>
  writeFile(join(publicFolderPath, fileName), conteAsABuffer);
export const getMediasJSONReadableStream = () =>
  createReadStream(mediasJSONPath);
export const pdfWritableStreamPDF = (filename) =>
  createWriteStream(join(dataFolderPath, filename));
