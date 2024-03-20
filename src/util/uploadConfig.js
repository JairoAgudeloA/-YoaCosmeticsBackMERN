import multer from "multer";
import path from "path";
import fs from "fs";

// Directorio de destino para las imágenes
const uploadDir = "uploads/";

// Verificar si el directorio de destino existe, si no existe, crearlo
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configurar Multer para la carga de imágenes con restricciones de formato
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir); // Directorio donde se guardarán las imágenes
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    ); // Nombre de archivo único
  },
});

// Función de filtro para aceptar solo ciertos tipos de archivos
const fileFilter = function (req, file, cb) {
  // Array de tipos MIME permitidos
  const allowedMimes = [
    "image/svg+xml",
    "image/png",
    "image/jpeg",
    "image/webp",
  ];
  // Verificar si el tipo MIME del archivo está en el array de tipos permitidos
  if (allowedMimes.includes(file.mimetype)) {
    // Si es un tipo de archivo permitido, aceptarlo
    cb(null, true);
  } else {
    // Si no es un tipo de archivo permitido, rechazarlo
    cb(new Error("Solo se permiten archivos de imagen SVG, PNG, JPEG o WEBP"));
  }
};

// Configurar Multer con el almacenamiento y el filtro de archivos
export const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
});

// import multer from "multer";

// export const upload = multer({ storage: multer.memoryStorage() });

// import multer from "multer";
// import path from "path";

// // Configurar Multer para la carga de imágenes con restricciones de formato
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, "uploads/"); // Directorio donde se guardarán las imágenes
//   },
//   filename: function (req, file, cb) {
//     cb(
//       null,
//       file.fieldname + "-" + Date.now() + path.extname(file.originalname)
//     ); // Nombre de archivo único
//   },
// });

// // Función de filtro para aceptar solo ciertos tipos de archivos
// const fileFilter = function (req, file, cb) {
//   // Array de tipos MIME permitidos
//   const allowedMimes = [
//     "image/svg+xml",
//     "image/png",
//     "image/jpeg",
//     "image/webp",
//   ];
//   // Verificar si el tipo MIME del archivo está en el array de tipos permitidos
//   if (allowedMimes.includes(file.mimetype)) {
//     // Si es un tipo de archivo permitido, aceptarlo
//     cb(null, true);
//   } else {
//     // Si no es un tipo de archivo permitido, rechazarlo
//     cb(new Error("Solo se permiten archivos de imagen SVG, PNG, JPEG o WEBP"));
//   }
// };

// // Configurar Multer con el almacenamiento y el filtro de archivos
// export const upload = multer({
//   storage: storage,
//   fileFilter: fileFilter,
// });
