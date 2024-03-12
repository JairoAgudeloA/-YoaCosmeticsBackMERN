import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";

const router = Router();

router.get("/product", authRequired, (req, res) => res.send("productos"));

export default router;
