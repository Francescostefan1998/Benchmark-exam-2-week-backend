import express from "express";
import uniqid from "uniqid";
import httpErrors from "http-errors";
import multer from "multer";
import { extname } from "path";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import {
  getMedias,
  writeMedias,
  saveMediasAvatar,
} from "../../lib/fs-tools.js";
const { NotFound, Unauthorized, BadRequest } = httpErrors;

const mediasRouter = express.Router();

mediasRouter.post("/", async (req, res, next) => {
  try {
    const newMedia = {
      ...req.body,
      createdAt: new Date(),
      imdbID: uniqid(),
      reviews: [],
      poster: "",
    };
    const mediasArray = await getMedias();
    mediasArray.push(newMedia);
    await writeMedias(mediasArray);
    res.status(201).send({ imdbID: newMedia.imdbID });
  } catch (error) {
    next(error);
  }
});
mediasRouter.get("/", async (req, res, next) => {
  try {
    const mediasArray = await getMedias();
    res.send(mediasArray);
  } catch (error) {
    next(error);
  }
});
mediasRouter.get("/:mediaId", async (req, res, next) => {
  try {
    const mediasArray = await getMedias();
    const findMedia = mediasArray.find(
      (media) => media.imdbID === req.params.mediaId
    );
    if (findMedia) {
      res.send(findMedia);
    } else {
      next(NotFound(`Media with id ${req.params.mediaId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
mediasRouter.put("/:mediaId", async (req, res, next) => {
  try {
    const mediasArray = await getMedias();
    const index = mediasArray.findIndex(
      (media) => media.imdbID === req.params.mediaId
    );
    if (index !== -1) {
      const oldMedia = mediasArray[index];
      const updateMedia = {
        ...oldMedia,
        ...req.body,
        updatedAt: new Date(),
      };

      mediasArray[index] = updateMedia;
      await writeMedias(mediasArray);
      res.send(mediasArray);
    } else {
      next(NotFound(`Media with id ${req.params.mediaId} not found`));
    }
  } catch (error) {
    next(error);
  }
});
mediasRouter.delete("/:mediaId", async (req, res, next) => {
  try {
    const mediasArray = await getMedias();
    const index = mediasArray.findIndex(
      (media) => media.imdbID === req.params.mediaId
    );
    if (index !== -1) {
      const remaingMedias = mediasArray.filter(
        (media) => media.imdbID !== req.params.mediaId
      );
      await writeMedias(remaingMedias);
      console.log("media deleted succesfully");
      res.status(204).send("media deleted succesfully");
    } else {
      next(NotFound(`Media with id ${req.params.mediaId} not found`));
    }
  } catch (error) {
    next(error);
  }
});

export default mediasRouter;
