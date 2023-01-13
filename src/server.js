import express from "express";
import listEndpoints from "express-list-endpoints";
import cors from "cors";
import { join } from "path";
import mediasRouter from "./api/medias/index.js";
import filesRouter from "./api/fileImage/index.js";
import pdfHandlerRouter from "./api/pdfFile/index.js";
import singlePdfRouter from "./api/singleMediaPdfFile/index.js";
import {
  genericErrorHandler,
  notFoundHandler,
  badRequestHandler,
  unauthorizedHandler,
} from "./errorHandler.js";
import swagger from "swagger-ui-express";
import yaml from "yamljs";
import createHttpError from "http-errors";
const server = express();

const port = process.env.PORT || 3001;

const publicFolderPath = join(process.cwd(), "./public");
const yamlFile = yaml.load(join(process.cwd(), "./src/docs/apiDocs.yml"));

const loggerMiddleware = (req, res, next) => {
  console.log(`Request method ${req.method} --url ${req.url} -- ${new Date()}`);
  req.user = "Dan";
  next();
};
server.use(express.static(publicFolderPath));
server.use(loggerMiddleware);
server.use(express.json());
server.use("/medias", mediasRouter);
server.use("/medias/getfile", pdfHandlerRouter);
server.use("/medias", singlePdfRouter);
server.use("/medias", filesRouter);
server.use("/docs", swagger.serve, swagger.setup(yamlFile));
console.log("pol");
server.use(badRequestHandler);
server.use(unauthorizedHandler);
server.use(notFoundHandler);
server.use(genericErrorHandler);

server.listen(port, () => {
  console.table(listEndpoints(server));
  console.log("Server is running on port : ", port);
});
