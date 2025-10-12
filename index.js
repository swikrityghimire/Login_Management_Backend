import express, { json } from "express";
import { port } from "./src/constant.js";
import cors from "cors";
import connectToMongoDb from "./src/connectToDb/connectToMongoDb.js";
import indexRouter from "./src/router/indexRouter.js";

const app = express();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
  connectToMongoDb();
});

app.use(cors());
app.use(json());

app.use("/", indexRouter);
