import Category from "../models/category.models.js";
import { uploadImage, deleteImage } from "../libs/cloudinary.js";
import fs from "fs-extra";

export const getCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (error) {
    res.status(500).json(["Error al obtener las categorías"]);
  }
};

export const getCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.findById(categoryId).populate("products");
    if (!category) {
      return res.status(404).json(["Categoría no encontrada"]);
    }
    res.json(category);
  } catch (error) {
    res.status(500).json(["Error al obtener la categoría"]);
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, date } = req.body;
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

    const newCategory = new Category({
      name,
      description,
      // image,
      date,
    });

    const savedCategory = await newCategory.save();

    res.json(savedCategory);
  } catch (error) {
    res.status(500).json([error.message]);
  }
};

export const updateCategory = async (req, res) => {
  try {
    const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!category) {
      return res.status(404).json(["Categoría no encontrada"]);
    }
    res.json(category);
  } catch (error) {
    res.status(500).json(["Error al actualizar la categoría"]);
  }
};

export const deleteCategory = async (req, res) => {
  try {
    const remoteCategory = await Category.findByIdAndDelete(req.params.id);
    if (!remoteCategory) {
      return res.status(404).json(["Categoría no encontrada"]);
    }
    // if (remoteCategory.image.public_id) {
    // await deleteImage(remoteCategory.image.public_id);
    // }
    return res.sendStatus(204);
  } catch (error) {
    res.status(500).json([error.message]);
  }
};
