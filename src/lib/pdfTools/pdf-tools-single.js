import PdfPrinter from "pdfmake";
import { pipeline } from "stream";
import { promisify } from "util";
import request from "request";

export const getPDFReadableStreamSingle = (singleMedia) => {
  // Define font files
  const fonts = {
    Courier: {
      normal: "Courier",
      bold: "Courier-Bold",
      italics: "Courier-Oblique",
      bolditalics: "Courier-BoldOblique",
    },
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };

  const printer = new PdfPrinter(fonts);

  const content = [
    { text: singleMedia.title, style: "header" },
    { text: singleMedia.category, style: "subheader" },
    { text: singleMedia.type, style: "header" },
    { text: singleMedia.year, style: "subheader" },

    "\n\n",
  ];

  const docDefinition = {
    content: [...content],
    defaultStyle: {
      font: "Helvetica",
    },
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        font: "Courier",
      },
      subheader: {
        fontSize: 15,
        bold: false,
      },
    },
  };

  const pdfReadableStreamSingle = printer.createPdfKitDocument(docDefinition);
  pdfReadableStreamSingle.end();
  return pdfReadableStreamSingle;
};
export const getPDFReadableStreamListOfProductsSingle = (singleMedia) => {
  // Define font files
  const fonts = {
    Courier: {
      normal: "Courier",
      bold: "Courier-Bold",
      italics: "Courier-Oblique",
      bolditalics: "Courier-BoldOblique",
    },
    Helvetica: {
      normal: "Helvetica",
      bold: "Helvetica-Bold",
      italics: "Helvetica-Oblique",
      bolditalics: "Helvetica-BoldOblique",
    },
  };

  const printer = new PdfPrinter(fonts);

  const content = (singleMedia) => {
    return [
      { text: singleMedia.title, style: "header" },
      { text: singleMedia.category, style: "subheader" },
      { text: singleMedia.type, style: "subheader" },
      { text: singleMedia.year, style: "header" },
      { image: singleMedia.poster, width: 100, height: 100 },

      "\n\n",
    ];
  };

  const docDefinition = {
    content: [...content],
    defaultStyle: {
      font: "Helvetica",
    },
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        font: "Courier",
      },
      subheader: {
        fontSize: 15,
        bold: false,
      },
    },
  };

  const pdfReadableStreamListOfProductsSingle =
    printer.createPdfKitDocument(docDefinition);
  pdfReadableStreamListOfProductsSingle.end();

  return pdfReadableStreamListOfProductsSingle;
};

export const asyncPDFGenerationSingle = async (booksArray) => {
  const source = getPDFReadableStreamSingle(booksArray);
  const destination = pdfWritableStreamPDF("testSingle.pdf");

  // normally pipeline function works with callbacks to tell when the stream is ended, we shall avoid using callbacks
  // pipeline(source, destination, err => {}) <-- BAD (callback based pipeline)
  // await pipeline(source, destination) <-- GOOD (promise based pipeline)

  // promisify is a (VERY COOL) tool that turns a callback based function (err first callback) into a promise based function
  // since pipeline is an error first callback based function --> we can turn pipeline into a promise based pipeline

  const promiseBasedPipeline = promisify(pipeline);

  await promiseBasedPipeline(source, destination);
};
