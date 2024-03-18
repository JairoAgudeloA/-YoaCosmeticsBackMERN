import Jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";
import { verifyToken } from "./verifyToken.middleware.js";

export const authRequired = (req, res, next) => {
  verifyToken(req, res, next);
};

export const authAdmin = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json(["Autorización denegada"]);

    Jwt.verify(token, TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json(["Token inválido"]);
      }
      req.user = user;

      if (user.role !== "admin") {
        return res.status(401).json({
          message: "Autorización denegada. Se requiere rol de administrador",
        });
      }

      // Si el usuario es un administrador, llamar a next() para pasar al siguiente middleware
      next();
    });
  } catch (error) {
    return res.status(500).json([error.message]);
  }
};
