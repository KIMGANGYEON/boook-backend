import Product from "../model/Product";
import multer from "multer";

const storage = multer.diskStorage({
  destination: function (req, file, cd) {
    cd(null, "uploads/");
  },
  filename: function (req, file, cd) {
    cd(null, `${Date.now()}_${file.originalname}`);
  },
});

const upload = multer({ storage: storage }).single("file");

export const postImage = async (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return req.status(500).send(err);
    }
    return res.json({ filename: req.file.filename });
  });
};

export const getproduct = async (req, res) => {
  const order = req.query.order ? req.query.order : "desc";
  const sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  try {
    const products = await Product.find()
      .populate("writer")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit);

    const productsTotal = await Product.countDocuments();
    const hasMore = skip + limit < productsTotal ? true : false;
    return res.status(200).json({
      products,
      hasMore,
    });
  } catch (error) {}
};

export const postUpload = async (req, res) => {
  try {
    const product = new Product(req.body);
    product.save();
    return res.sendStatus(201);
  } catch (error) {
    next(error);
  }
};
