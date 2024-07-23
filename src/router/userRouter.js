import express from "express";
import {
  getAuth,
  getEdit,
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
userRouter.route("/edituser").post(postEdit);

export default userRouter;
