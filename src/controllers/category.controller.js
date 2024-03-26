import Category from "../models/category.models.js";
import Product from "../models/product.model.js";
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
    const category = await Category.findById(categoryId);
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

    const imagePath = req.file.path;
    console.log(imagePath);

    const newCategory = new Category({
      name,
      description,
      categoryImage: imagePath,
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
    const categoryId = req.params.id;

    const category = await Category.findById(categoryId);

    if (!category) return res.status(404).json(["Categoría no encontrada"]);

    if (category.categoryImage) {
      await fs.unlink(category.categoryImage);
    }

    const { name, description, date } = req.body;
    let categoryImage = "";

    if (req.file !== undefined) {
      categoryImage = req.file.path;
    }
    const updatedValues = {
      name: name,
      description: description,
      date: date,
    };

    if (categoryImage !== "") {
      updatedValues.categoryImage = categoryImage;
    }

    const updateCategory = await Category.findByIdAndUpdate(
      categoryId,
      updatedValues,
      { new: true }
    );

    res.status(200).json(updateCategory);
  } catch (error) {
    res.status(500).json([error.message]);
  }
};
export const deleteCategory = async (req, res) => {
  try {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);

    if (!category) return res.status(404).json(["Categoría no encontrada"]);

    await Product.updateMany(
      { category: categoryId },
      { $unset: { category: "" } }
    );

    if (category.categoryImage) {
      await fs.unlink(category.categoryImage);
    }

    await Category.findByIdAndDelete(categoryId);
    res.json({ message: "Categoría eliminada" });
  } catch (error) {
    console.error("Error al eliminar la categoría:", error.message);
    res.status(500).json([error.message]);
  }
};
