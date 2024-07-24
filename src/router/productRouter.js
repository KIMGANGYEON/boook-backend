import express from "express";
import {
  getProduct,
  postImage,
  postUpload,
  showProduct,
} from "../controllers/productControllers";
import auth from "../middleware/auth";

const productRouter = express.Router();

productRouter.get("/", getProduct);
productRouter.get("/:id", showProduct);
productRouter.post("/upload", auth, postUpload);
productRouter.post("/image", auth, postImage);

export default productRouter;
