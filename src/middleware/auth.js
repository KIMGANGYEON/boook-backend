import jwt from "jsonwebtoken";
import User from "../model/User";

let auth = async (req, res, next) => {
  const authHeader = req.headers["authorization"];

  const token = authHeader && authHeader.split(" ")[1];

  if (token === null) return res.sendStatus(401);

  try {
    const decode = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findOne({ _id: decode.userId });
    if (!user) {
      return res.status(400).send("없는 유저입니다.");
    }
    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
};

export default auth;
