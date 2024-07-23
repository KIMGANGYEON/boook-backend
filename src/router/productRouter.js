import express from "express";
import {
  getproduct,
  postImage,
  postUpload,
} from "../controllers/productControllers";
import auth from "../middleware/auth";

const productRouter = express.Router();

productRouter.get("/", getproduct);
productRouter.post("/upload", auth, postUpload);
productRouter.post("/image", auth, postImage);

export default productRouter;
