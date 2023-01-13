import express from "express";
import multer from "multer";
import { extname } from "path";
import { v2 as cloudinary } from "cloudinary";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import { pipeline } from "stream"; //
import { createGzip } from "zlib";
import PdfPrinter from "pdfmake";
import json2csv from "json2csv";
import { writeMedias, getMedias } from "../../lib/fs-tools.js";
const filesRouter = express.Router();
const cloudUploder = multer({
  storage: new CloudinaryStorage({
    cloudinary,
    params: {
      folder: "fs0422/netflix",
    },
  }),
}).single("avatar");
filesRouter.post("/:mediaId", cloudUploder, async (req, res, next) => {
  try {
    const medias = await getMedias();
    const index = medias.findIndex(
      (media) => media.imdbID === req.params.mediaId
    );
    console.log("REQ FILE: ", req.file);
    const oldMedia = medias[index];

    const updateMedia = {
      ...oldMedia,
      poster: req.file.path,
      updatedAt: new Date(),
    };
    medias[index] = updateMedia;

    await writeMedias(medias);
    res.send("file uploaded in the proper field");
    // 1. upload on Cloudinary happens automatically
    // 2. req.file contains the path which is the url where to find that picture
    // 3. update the resource by adding the path to it
  } catch (error) {
    next(error);
  }
});
export default filesRouter;
