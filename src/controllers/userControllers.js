import User from "../model/User";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

export const getAuth = async (req, res, next) => {
  return res.json({
    id: req.user._id,
    email: req.user.email,
    name: req.user.name,
    cart: req.user.cart,
    history: req.user.history,
  });
};

export const postJoin = async (req, res, next) => {
  const { email, name, password, password2 } = req.body;
  try {
    if (password != password2) {
      return res.status(400).send("비밀번호가 일치하지 않습니다");
    }

    const useremailExists = await User.exists({ email });
    if (useremailExists) {
      return res.status(400).send("해당 이메일은 다른 유저가 사용중 입니다");
    }

    const user = new User(req.body);
    await user.save();
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const postLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(400).send("해당 이메일을 찾을수 없습니다");
    }

    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(400).send("잘못된 비밀번호 입니다");
    }

    const payload = {
      userId: user._id.toHexString(),
    };
    const accessToken = jwt.sign(payload, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    return res.json({ user, accessToken });
  } catch (error) {
    next(error);
  }
};

export const postLogout = async (req, res, next) => {
  try {
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const postEdit = async (req, res, next) => {
  let { id, email, name, password, password2 } = req.body;

  if (!email && !name && !password && !password2) {
    return res.status(400).send("변경된 게 없습니다");
  }

  const user = await User.findById({ _id: id });
  if (!user) {
    return res.status(400).send("해당 유저를 찾을수 없습니다");
  }
  try {
    if (!email) {
      email = user.email;
    }
    if (email) {
      if (email !== user.email) {
        const useremailExists = await User.exists({ email });
        if (useremailExists) {
          return res
            .status(400)
            .send("해당 이메일은 다른 유저가 사용중 입니다");
        }
      }
    }

    if (!name) {
      name = user.name;
    }

    if (!password && !password2) {
      password = user.password;
      password2 = user.password;
    }
    let hashedPassword = user.password;
    if (password) {
      if (password !== password2) {
        return res.status(400).send("비밀번호가 일치하지 않습니다");
      }

      const saltRounds = 10;
      hashedPassword = await bcrypt.hash(password, saltRounds);

      const isMatch = await bcrypt.compare(password, user.password);
      if (isMatch) {
        return res.status(400).send("이전 비밀번호와 일치합니다");
      }
    }

    const updateUser = await User.findByIdAndUpdate(
      id,
      {
        email,
        name,
        password: hashedPassword,
      },
      { new: true }
    );
    req.body = updateUser;
    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
};

export const postAddCart = async (req, res, next) => {
  try {
    const userInfo = await User.findOne({ _id: req.user._id });

    let duplicate = false;
    userInfo.cart.forEach((item) => {
      if (item.id === req.body.productId) {
        duplicate = true;
      }
    });
    if (duplicate) {
      const user = await User.findOneAndUpdate(
        {
          _id: req.user._id,
          "cart.id": req.body.productId,
        },
        { $inc: { "cart.$.quantity": 1 } },
        {
          new: true,
        }
      );
      return res.status(201).send(user.cart);
    } else {
      const user = await User.findOneAndUpdate(
        {
          _id: req.user._id,
        },
        {
          $push: {
            cart: {
              id: req.body.productId,
              quantity: 1,
              data: Date.now(),
            },
          },
        },
        { new: true }
      );
      return res.status(201).send(user.cart);
    }
  } catch (error) {
    next(error);
  }
};
