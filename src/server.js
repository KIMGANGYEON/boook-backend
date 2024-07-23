import express from "express";
import path from "path";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import rootRouter from "./router/rootRouter";
import userRooter from "./router/userRouter";
import productRouter from "./router/productRouter";

dotenv.config();

const port = 4000;
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "../uploads")));

mongoose
  .connect(process.env.MONGO_URL)
  .then(() => console.log("✅mongoose connect success"))
  .catch((error) => {
    console.log(error);
  });

app.get("/", (req, res) => {
  return res.send("hello");
});

app.use("/", rootRouter);
app.use("/users", userRooter);
app.use("/product", productRouter);

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.send(error.message || "서버에서 에러가 났습니다.");
});

app.listen(port, () => {
  console.log(`🔥app listen http://localhost:${port}/ `);
});
