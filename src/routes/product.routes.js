import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  createProduct,
  updateProduct,
  deleteProduct,
  getProduct,
  getProducts,
} from "../controllers/product.controller.js";

const router = Router();

router.get("/product", authRequired, getProducts);
router.get("/product/:id", authRequired, getProduct);
router.post("/product", authRequired, createProduct);
router.put("/product/:id", authRequired, updateProduct);
router.delete("/product/:id", authRequired, deleteProduct);

export default router;
