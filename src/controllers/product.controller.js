import Product from "../models/product.model.js";
// import Category from "../models/category.models.js";
// import { uploadImage, deleteImage } from "../libs/cloudinary.js";
// import fs from "fs-extra";

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find().populate("category", "name"); // Modifica aquí para poblar el campo de 'category' con solo el nombre
    res.json(products);
  } catch (error) {
    res.status(500).json([error.message]);
  }
};
export const getProduct = async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findById(productId).populate(
      "category",
      "name"
    );
    if (!product) return res.status(404).json(["Producto no encontrado"]);
    res.json(product);
  } catch (error) {
    res.status(500).json([error.message]);
  }
};

export const createProduct = async (req, res) => {
  try {
    const { name, price, description, date, category } = req.body;

    const imagePath = req.file.path;
    console.log(imagePath);
    // let image = null;
    // console.log(req.files);
    // if (req.files.image) {
    //   const result = await uploadImage(req.files.image.tempFilePath);
    //   await fs.remove(req.files.image.tempFilePath);
    //   image = {
    //     url: result.secure_url,
    //     public_id: result.public_id,
    //   };
    // }

    const newProduct = new Product({
      name,
      price,
      description,
      productImage: imagePath,
      date,
      category: category,
    });

    const savedProduct = await newProduct.save();
    res.status(201).json(savedProduct);
  } catch (error) {
    res.status(500).json([error.message]);
  }
};

export const getProductsByCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const products = await Product.find({ category: categoryId });
    // const categoryName = await Category.findOne({ name });

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
  // if (removeProduct.image.public_id) {
  //   await deleteImage(removeProduct.image.public_id);
  // }
  return res.sendStatus(204);
};
