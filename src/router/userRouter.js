import express from "express";
import {
  getAuth,
  getEdit,
  postAddCart,
  postEdit,
  postJoin,
  postLogin,
  postLogout,
} from "../controllers/userControllers";
import auth from "../middleware/auth";

const userRouter = express.Router();

userRouter.get("/auth", auth, getAuth);
userRouter.post("/join", postJoin);
userRouter.post("/login", postLogin);
userRouter.post("/logout", auth, postLogout);
userRouter.post("/cart", auth, postAddCart);
userRouter.route("/edituser").post(postEdit);

export default userRouter;
