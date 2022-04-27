import { createRequire } from "module";
const require = createRequire(import.meta.url);
import fs from 'fs'
const tf = require("@tensorflow/tfjs-node");
const util = require("util");
const faceapi = require("@vladmandic/face-api/dist/face-api.node-gpu.js"); // this loads face-api version with correct bindings for tfjs-node-gpu
// const canvas = require("canvas");

import path from 'path'


import { fileURLToPath } from "url";
import { dirname } from "path";
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);


// const { Canvas, Image, ImageData } = canvas;
// faceapi.env.monkeyPatch({ Canvas, Image, ImageData })
const modelPathRoot = "./models";

export default async (file) => {
  console.log(file, "files");

  async function image(file) {
    const decoded = tf.node.decodeImage(file, 3);
    const casted = decoded.toFloat();
    const result = casted.expandDims(0);
    decoded.dispose();
    casted.dispose();
    return result;
  }

  //LOAD IMAGE FROM FILE
  // const readImg = util.promisify(fs.readFile);
  // const img = await readImg("./public/images/bad2.jpg");


  // const adaptedImg = tf.node.decodeImage(file, 3);

  const modelPath = path.join(__dirname, modelPathRoot);

  try {
    await faceapi.nets.ssdMobilenetv1.loadFromDisk(modelPath);

    const tensor = await image(file);

    const detections = await faceapi.detectAllFaces(tensor);
    console.log(detections, "DETECTION OUTPUT");
    return detections;
  } catch (err) {
    console.log(err, "ERROR");
  }
};
