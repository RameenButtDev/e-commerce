import asyncHandler from "express-async-handler";
import Category from "../models/Category.js";

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({}).sort({ name: 1 });
  res.json(categories);
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, image } = req.body;
  const slug = name.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-");
  const exists = await Category.findOne({ slug });
  if (exists) {
    res.status(400);
    throw new Error("Category already exists");
  }
  const category = await Category.create({ name, slug, image });
  res.status(201).json(category);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  category.name = req.body.name || category.name;
  category.image = req.body.image ?? category.image;
  const updated = await category.save();
  res.json(updated);
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category) {
    res.status(404);
    throw new Error("Category not found");
  }
  await category.deleteOne();
  res.json({ message: "Category removed" });
});
