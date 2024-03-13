import Product from "../models/product.model.js";

export const getProducts = async (req, res) => {
  const products = await Product.find();
  res.json(products);
};

export const getProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product)
    return res.status(404).json({ message: "Producto no encontrado" });
  res.json(product);
};
export const createProduct = async (req, res) => {
  const { name, price, description, productImage, date, category } = req.body;
  try {
    const newProduct = new Product({
      name,
      price,
      description,
      productImage,
      date,
      category: category,
    });

    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error al crear el producto" });
  }
};

export const getProductsByCategory = async (req, res) => {
  const categoryId = req.params.categoryId;
  try {
    const products = await Product.find({ category: categoryId });
    res.json(products);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error al obtener los productos" });
  }
};

export const updateProduct = async (req, res) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!product)
    return res.status(404).json({ message: "Producto no encontrado" });
  res.json(product);
};

export const deleteProduct = async (req, res) => {
  const product = await Product.findByIdAndDelete(req.params.id);
  if (!product)
    return res.status(404).json({ message: "Producto no encontrado" });
  return res.sendStatus(204);
};
