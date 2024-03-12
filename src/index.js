import app from "./app.js";
import { connectDB } from "./db.js";

const PUERTO = 5000;

connectDB();
app.listen(PUERTO, () => {
  console.log(`Servidor desplegado en http://localhost:${PUERTO}`);
});
