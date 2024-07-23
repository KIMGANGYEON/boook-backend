import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = mongoose.Schema({
  email: {
    type: String,
    trim: true,
    unique: true,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  password: {
    type: String,
  },
  cart: {
    type: Array,
    default: [],
  },
  history: {
    type: Array,
    default: [],
  },
});

userSchema.pre("save", async function (next) {
  let user = this;
  if (user.isModified("password")) {
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
  }
  next();
});

userSchema.methods.comparePassword = async function (plainPassword) {
  let user = this;
  const match = bcrypt.compare(plainPassword, user.password);
  return match;
};

const User = mongoose.model("User", userSchema);

export default User;
