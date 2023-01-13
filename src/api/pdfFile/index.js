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
  getPDFReadableStream,
  asyncPDFGeneration,
  getPDFReadableStreamListOfProducts,
} from "../../lib/pdfTools/pdf-tools-multiple.js";

const pdfHandlerRouter = express.Router();
pdfHandlerRouter.get("/mediasJSON", (req, res, next) => {
  try {
    // SOURCES (file on disk, http request,...) --> DESTINATIONS (file on disk, terminal, http response)

    // SOURCE (Readable Stream on books.json file) --> DESTINATION (http response)

    res.setHeader("Content-Disposition", "attachment; filename=medias.json.gz");
    const source = getMediasJSONReadableStream();
    const destination = res;
    const transform = createGzip();
    pipeline(source, transform, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});
pdfHandlerRouter.get("/mediasPDF", async (req, res, next) => {
  try {
    // SOURCES (file on disk, http request,...) --> DESTINATIONS (file on disk, terminal, http response)

    // SOURCE (Readable Stream on books.json file) --> DESTINATION (http response)

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=products3.json.pdf"
    );
    const medias = await getMedias();
    const source = getPDFReadableStreamListOfProducts(medias);
    const destination = res;
    pipeline(source, destination, (err) => {
      if (err) console.log(err);
    });
  } catch (error) {
    next(error);
  }
});

pdfHandlerRouter.get("/mediasPDFVerify", async (req, res, next) => {
  try {
    // SOURCES (file on disk, http request,...) --> DESTINATIONS (file on disk, terminal, http response)

    // SOURCE (Readable Stream on books.json file) --> DESTINATION (http response)

    res.setHeader(
      "Content-Disposition",
      "attachment; filename=products3.json.pdf"
    );
    const prod = await getMedias();
    const source = getPDFReadableStream(prod);
    const destination = res;
    pipeline(source, destination, (err) => {
      if (err) console.log(err);
      else console.log("STREAM ENDED SUCCESSFULLY");
    });
  } catch (error) {
    next(error);
  }
});

pdfHandlerRouter.get("/mediasCSV", (req, res, next) => {
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

pdfHandlerRouter.get("/asyncPDF", async (req, res, next) => {
  try {
    const medias = await getMedias();
    await asyncPDFGeneration(medias);
    res.send();
  } catch (error) {
    next(error);
  }
});

export default pdfHandlerRouter;
