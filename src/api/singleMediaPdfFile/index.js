import express from "express";
import multer from "multer";
import { extname } from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { pipeline } from "stream"; //
import { createGzip } from "zlib";
import PdfPrinter from "pdfmake";
import json2csv from "json2csv";
import {
  getMedias,
  writeMedias,
  saveMediasAvatar,
  getMediasJSONReadableStream,
  pdfWritableStreamPDF,
} from "../../lib/fs-tools.js";
import {
  getPDFReadableStreamSingle,
  asyncPDFGenerationSingle,
  getPDFReadableStreamListOfProductsSingle,
} from "../../lib/pdfTools/pdf-tools-single.js";

const singlePdfRouter = express.Router();
singlePdfRouter.get("/:mediaId/pdf", async (req, res, next) => {
  try {
    // SOURCES (file on disk, http request,...) --> DESTINATIONS (file on disk, terminal, http response)

    // SOURCE (Readable Stream on books.json file) --> DESTINATION (http response)

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=products3.json.pdf"
    );
    const prod = await getMedias();
    const findSingle = prod.find(
      (media) => media.imdbID === req.params.mediaId
    );
    const source = getPDFReadableStreamSingle(findSingle);
    const destination = res;
    pipeline(source, destination, (err) => {
      if (err) console.log(err);
      else console.log("STREAM ENDED SUCCESSFULLY");
    });
  } catch (error) {
    next(error);
  }
});

singlePdfRouter.get("/:mediaId/CSV", (req, res, next) => {
  try {
    res.setHeader("Content-Disposition", "attachment; filename=books.csv");
    // SOURCE (readable stream on books.json) --> TRANSFORM (json into csv) --> DESTINATION (response)
    const source = getMediasJSONReadableStream();
    const transform = new json2csv.Transform({
      fields: ["asin", "title", "category"],
    });
    const destination = res;
    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

singlePdfRouter.get("/:mediaId/asyncPDF", async (req, res, next) => {
  try {
    const medias = await getMedias();
    const findSingle = medias.find(
      (media) => media.imdbID === req.params.mediaId
    );
    await asyncPDFGenerationSingle(findSingle);
    res.send();
  } catch (error) {
    next(error);
  }
});

export default singlePdfRouter;
