import mongoose from "mongoose";
import { dbUrl } from "../constant.js";

const connectToMongoDb = async () => {
  try {
    await mongoose.connect(dbUrl);
    console.log("Server connected to MongoDB.");
  } catch (error) {
    console.log(error.message);
  }
};
export default connectToMongoDb;
