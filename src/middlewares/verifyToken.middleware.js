import Jwt from "jsonwebtoken";
import { TOKEN_SECRET } from "../config.js";

export const verifyToken = (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) return res.status(401).json(["Autorización denegada"]);

    Jwt.verify(token, TOKEN_SECRET, (err, user) => {
      if (err) {
        return res.status(401).json(["Token inválido"]);
      }
      req.user = user;
      next();
    });
  } catch (error) {
    return res.status(500).json([error.message]);
  }
};
