// export const validateSchema = (schema) => (req, res, next) => {
//   try {
//     // Verifica que req.body no sea undefined
//     if (!req.body) {
//       throw new Error("Datos del formulario no proporcionados");
//     }

//     schema.parse(req.body);
//     next();
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

export const validateSchema = (schema) => (req, res, next) => {
  try {
    schema.parse(req.body);
    next();
  } catch (error) {
    res.status(400).json({ error: error.errors.map((error) => error.message) });
  }
};
