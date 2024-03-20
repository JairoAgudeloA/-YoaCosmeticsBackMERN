import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import { upload } from "../util/uploadConfig.js";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProducts,
  getProductsByCategory,
} from "../controllers/product.controller.js";

import {
  createCategory,
  getCategory,
  getCategories,
  updateCategory,
  deleteCategory,
} from "../controllers/category.controller.js";

const router = Router();
// //ruta de productos
// router.get("/products", authRequired, getProducts);
// router.get("/product/:id", authRequired, getProduct);
// router.post("/product", authRequired, createProduct);
// router.put("/product/:id", authRequired, updateProduct);
// router.delete("/product/:id", authRequired, deleteProduct);

router.get("/products", getProducts);
router.get("/product/:id", getProduct);
router.post("/product", upload.single("productImage"), createProduct);
router.put("/product/:id", upload.single("productImage"), updateProduct);
router.delete("/product/:id", deleteProduct);

//ruta de categorías
router.get("/categories", getCategories);
router.get("/category/:id", getCategory);
router.post("/category", createCategory);
router.put("/category/:id", updateCategory);
router.delete("/category/:id", deleteCategory);
router.get("/category/products/:categoryId", getProductsByCategory);

export default router;
