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

export const getProduct = async (req, res) => {
  const order = req.query.order ? req.query.order : "desc";
  const sortBy = req.query.sortBy ? req.query.sortBy : "_id";
  const limit = req.query.limit ? Number(req.query.limit) : 20;
  const skip = req.query.skip ? Number(req.query.skip) : 0;
  const term = req.query.searchTerm;

  let findArgs = {};
  for (let key in req.query.filters) {
    if (req.query.filters[key].length > 0) {
      if (key === "price") {
        findArgs[key] = {
          $gte: req.query.filters[key][0],
          $lte: req.query.filters[key][1],
        };
      } else {
      }
      findArgs[key] = req.query.filters[key];
    }
  }
  if (term) {
    findArgs["$text"] = { $search: term };
  }

  try {
    const products = await Product.find(findArgs)
      .populate("writer")
      .sort([[sortBy, order]])
      .skip(skip)
      .limit(limit);

    const productsTotal = await Product.countDocuments(findArgs);
    const hasMore = skip + limit < productsTotal ? true : false;
    return res.status(200).json({
      products,
      hasMore,
    });
  } catch (error) {}
};

export const showProduct = async (req, res, next) => {
  const type = req.query.type;
  let productIds = req.params.id;

  if (type === "array") {
    let ids = productIds.split(",");
    productIds = ids.map((item) => {
      return item;
    });
  }

  try {
    const product = await Product.find({ _id: { $in: productIds } }).populate(
      "writer"
    );

    return res.status(200).send(product);
  } catch (error) {
    next(error);
  }
};

export const postImage = async (req, res) => {
  upload(req, res, (err) => {
    if (err) {
      return req.status(500).send(err);
    }
    return res.json({ filename: req.file.filename });
  });
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
