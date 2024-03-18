import { Router } from "express";
import {
  authAdmin,
  //   authRequired,
  //   authLogin,
} from "../middlewares/validateToken.js";
import {
  getUsers,
  getUser,
  updateUser,
  createUser,
  deleteUser,
} from "../controllers/users.controller.js";

const router = Router();

//rutas protegidas
// router.get("/users", authAdmin, getUsers);
// router.get("/user/:id", authAdmin, getUser);
// router.post("/user", authAdmin, createUser);
// router.put("/user/:id", authAdmin, updateUser);
// router.delete("/user/:id", authAdmin, deleteUser);

router.get("/users", getUsers);
router.get("/user/:id", getUser);
router.post("/user", createUser);
router.put("/user/:id", updateUser);
router.delete("/user/:id", deleteUser);

export default router;
