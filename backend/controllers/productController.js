import asyncHandler from "express-async-handler";
import Product from "../models/Product.js";

// @desc Get all products (search, filter, pagination)
// @route GET /api/products
export const getProducts = asyncHandler(async (req, res) => {
  const pageSize = Number(req.query.limit) || 12;
  const page = Number(req.query.page) || 1;

  const keyword = req.query.keyword
    ? { name: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const category = req.query.category ? { category: req.query.category } : {};

  const priceFilter = {};
  if (req.query.minPrice) priceFilter.$gte = Number(req.query.minPrice);
  if (req.query.maxPrice) priceFilter.$lte = Number(req.query.maxPrice);
  const price = Object.keys(priceFilter).length ? { price: priceFilter } : {};

  const filter = { isActive: true, ...keyword, ...category, ...price };

  let sort = { createdAt: -1 };
  if (req.query.sort === "price_asc") sort = { price: 1 };
  if (req.query.sort === "price_desc") sort = { price: -1 };
  if (req.query.sort === "rating") sort = { rating: -1 };

  const count = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate("category", "name slug")
    .sort(sort)
    .limit(pageSize)
    .skip(pageSize * (page - 1));

  res.json({ products, page, pages: Math.ceil(count / pageSize), total: count });
});

// @desc Get featured products
// @route GET /api/products/featured
export const getFeaturedProducts = asyncHandler(async (req, res) => {
  const products = await Product.find({ isFeatured: true, isActive: true }).limit(8);
  res.json(products);
});

// @desc Get single product by slug or id
// @route GET /api/products/:id
export const getProductById = asyncHandler(async (req, res) => {
  const query = req.params.id.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: req.params.id }
    : { slug: req.params.id };
  const product = await Product.findOne(query).populate("category", "name slug");

  if (product) {
    res.json(product);
  } else {
    res.status(404);
    throw new Error("Product not found");
  }
});

// @desc Create a product review
// @route POST /api/products/:id/reviews
export const createProductReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;
  const product = await Product.findById(req.params.id);

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const alreadyReviewed = product.reviews.find(
    (r) => r.user.toString() === req.user._id.toString()
  );
  if (alreadyReviewed) {
    res.status(400);
    throw new Error("You already reviewed this product");
  }

  product.reviews.push({
    user: req.user._id,
    name: req.user.name,
    rating: Number(rating),
    comment,
  });

  product.numReviews = product.reviews.length;
  product.rating =
    product.reviews.reduce((acc, r) => acc + r.rating, 0) / product.reviews.length;

  await product.save();
  res.status(201).json({ message: "Review added" });
});

// ---------- ADMIN ----------

// @desc Create product (admin)
// @route POST /api/products
export const createProduct = asyncHandler(async (req, res) => {
  const { name, description, category, brand, images, price, discountPrice, countInStock, sku, isFeatured } =
    req.body;

  const slug = name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "") + "-" + Date.now().toString().slice(-5);

  const product = new Product({
    name,
    slug,
    description,
    category,
    brand,
    images: images || [],
    price,
    discountPrice: discountPrice || 0,
    countInStock,
    sku,
    isFeatured: !!isFeatured,
  });

  const created = await product.save();
  res.status(201).json(created);
});

// @desc Update product (admin)
// @route PUT /api/products/:id
export const updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  const fields = [
    "name",
    "description",
    "category",
    "brand",
    "images",
    "price",
    "discountPrice",
    "countInStock",
    "sku",
    "isFeatured",
    "isActive",
  ];
  fields.forEach((f) => {
    if (req.body[f] !== undefined) product[f] = req.body[f];
  });

  const updated = await product.save();
  res.json(updated);
});

// @desc Delete product (admin)
// @route DELETE /api/products/:id
export const deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }
  await product.deleteOne();
  res.json({ message: "Product removed" });
});
