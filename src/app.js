import express from "express";
import morgan from "morgan";
import authRoutes from "./routes/auth.routes.js";
import cookieParser from "cookie-parser";
import productRoutes from "./routes/catego-prod.routes.js";
import usersRoutes from "./routes/users.routes.js";
// import multer from "multer";
// import fileUpload from "express-fileupload";
import cors from "cors";

// const app = express();

const app = express();

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
// app.use(
//   fileUpload({
//     useTempFiles: true,
//     tempFileDir: "./upload",
//   })
// );

app.use("/api", authRoutes);
app.use("/api", productRoutes);
// app.use("/api/admin", usersRoutes); //cuando se necesite proteger rutas
app.use("/api", usersRoutes);

export default app;
