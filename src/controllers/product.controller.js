import Product from "../models/product.model.js";
// import Category from "../models/category.models.js";
// import { uploadImage, deleteImage } from "../libs/cloudinary.js";
import fs from "fs-extra";

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
    // // Construir la URL completa de la imagen
    // const imageUrl = `http://localhost:5000/api/uploads/productImage-1711094555474.png`;

    // // Crear un nuevo objeto de producto que incluya la URL de la imagen
    // const productWithImageUrl = {
    //   ...product.toObject(),
    //   imageUrl: imageUrl,
    // };

    // res.json(productWithImageUrl);
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
  try {
    const productId = req.params.id;

    // Verificar si el ID del producto es válido
    if (!productId) return res.status(404).json(["Producto no encontrado"]);

    // Obtener el producto de la base de datos
    const product = await Product.findById(productId);

    // Verificar si el producto existe
    if (!product) return res.status(404).json(["Producto no encontrado"]);

    // Si hay una imagen asociada en el producto, eliminar la imagen anterior
    if (product.productImage) {
      await fs.unlink(product.productImage);
    }

    // Obtener los datos del cuerpo de la solicitud
    const { name, price, description, date, category } = req.body;
    let productImage = "";

    // Verificar si se ha cargado una nueva imagen
    if (req.file !== undefined) {
      productImage = req.file.path;
    }

    // Construir el objeto con los valores actualizados
    const updatedValues = {
      name: name,
      price: price,
      description: description,
      date: date,
      category: category,
    };

    // Si se proporcionó una nueva imagen, agregarla al objeto de valores actualizados
    if (productImage !== "") {
      updatedValues.productImage = productImage;
    }

    // Actualizar el producto en la base de datos
    const updatedProduct = await Product.findByIdAndUpdate(
      productId,
      updatedValues,
      { new: true }
    );

    // Devolver el producto actualizado como respuesta
    res.status(200).json(updatedProduct);
  } catch (error) {
    res.status(500).json([error.message]);
  }
};

export const deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    // Buscar el producto para obtener la ruta de la imagen antes de eliminarlo
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json(["Producto no encontrado"]);

    // Verificar si existe una imagen asociada al producto y eliminarla
    console.log(product.productImage);
    if (product.productImage) {
      await fs.unlink(product.productImage); // Intentar eliminar la imagen
    }

    // Eliminar el producto de la base de datos
    await Product.findByIdAndDelete(productId);

    res.sendStatus(204); // Producto eliminado con éxito
  } catch (error) {
    console.error("Error al eliminar el producto:", error);
    res.status(500).json(["Error al eliminar el producto"]);
  }
};

// export const updateProduct = async (req, res) => {
//   const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
//     new: true,
//   });
//   if (!product) return res.status(404).json(["Producto no encontrado"]);
//   res.json(product);
// };

// export const deleteProduct = async (req, res) => {
//   const removeProduct = await Product.findByIdAndDelete(req.params.id);
//   if (!removeProduct) return res.status(404).json(["Producto no encontrado"]);
//   // if (removeProduct.image.public_id) {
//   //   await deleteImage(removeProduct.image.public_id);
//   // }
//   return res.sendStatus(204);
// };
