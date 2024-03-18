import Product from "../models/product.model.js";
import { uploadImage, deleteImage } from "../libs/cloudinary.js";
import fs from "fs-extra";

export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json(["Producto no encontrado"]);
  res.json(product);
};
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, date, category } = req.body;
    let image = null;
    console.log(req.files);
    if (req.files.image) {
      const result = await uploadImage(req.files.image.tempFilePath);
      await fs.remove(req.files.image.tempFilePath);
      image = {
        url: result.secure_url,
        public_id: result.public_id,
      };
    }

    const newProduct = new Product({
      name,
      price,
      description,
      image,
      date,
      category: category,
    });

    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (error) {
    res.status(500).json([error.message]);
  }
};

export const getProductsByCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const products = await Product.find({ category: categoryId });

    if (!products)
      return res
        .status(404)
        .json(["No se encontraron productos para esta categoría"]);

    res.json(products);
  } catch (error) {
    res.status(500).json([error.message]);
  }
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!product) return res.status(404).json(["Producto no encontrado"]);
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const removeProduct = await Product.findByIdAndDelete(req.params.id);
  if (!removeProduct) return res.status(404).json(["Producto no encontrado"]);
  if (removeProduct.image.public_id) {
    await deleteImage(removeProduct.image.public_id);
  }
  return res.sendStatus(204);
};
