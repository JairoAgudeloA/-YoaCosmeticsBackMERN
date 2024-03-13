import Category from "../models/category.models.js";

export const getCategories = async (req, res) => {
  const categories = await Category.find();
  res.json(categories);
};

export const getCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const category = await Category.findById(categoryId).populate("products");
    if (!category) {
      return res.status(404).json({ message: "Categoría no encontrada" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: "Error al obtener la categoría" });
  }
};

export const createCategory = async (req, res) => {
  const { name, description, date } = req.body;
  try {
    const newCategory = new Category({
      name,
      description,
      date,
    });

    const savedCategory = await newCategory.save();

    res.json(savedCategory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateCategory = async (req, res) => {
  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!category) {
    return res.status(404).json({ message: "Categoría no encontrada" });
  }
  res.json(category);
};

export const deleteCategory = async (req, res) => {
  const category = await Category.findByIdAndDelete(req.params.id);
  if (!category) {
    return res.status(404).json({ message: "Categoría no encontrada" });
  }
  return res.sendStatus(204);
};
