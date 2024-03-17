import { Router } from "express";
import {
  register,
  login,
  logout,
  profile,
  updateProfile,
} from "../controllers/auth.controller.js";
import { authRequired } from "../middlewares/validateToken.js";
import {
  loginSchema,
  registerSchema,
  updateProfileSchema,
} from "../schemas/auth.schema.js";
import { validateSchema } from "../middlewares/validator.middleware.js";

const router = Router();

router.post("/register", validateSchema(registerSchema), register);
router.post("/login", validateSchema(loginSchema), login);
router.post("/logout", logout);
router.get("/profile", authRequired, profile);
router.put(
  "/profile",
  validateSchema(updateProfileSchema),
  authRequired,
  updateProfile
);

export default router;
