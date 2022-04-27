import { createRequire } from "module";
const require = createRequire(import.meta.url);
const express = require("express");
const fileUpload = require("express-fileupload");
// const faceApiService = require("./faceApiService")
// import faceapiService from './faceapiService'
// import faceapiService from "./faceapiService";
// import faceApiService from "./faceapiService.js";
import faceApiService from "./faceApiService.js";

const app = express();
const port = process.env.PORT || 3000;

app.use(fileUpload());

app.post("/upload", async (req, res) => {
  const { file } = req.files;



  //   const result = await faceApiService(file.data, file.name);
  const result = await faceApiService(file.data);

  // console.log(result, 'jdjjd')

  res.json({
    detectedFaces: result.length,
    url: `http://localhost:3000/out/${file.name}`,
  });
});

app.use("/out", express.static("out"));

app.listen(port, () => {
  console.log("Server started on port" + port);
});
