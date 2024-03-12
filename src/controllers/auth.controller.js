import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";

export const register = async (req, res) => {
  const { email, password, username, confirmPassword } = req.body;
  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está registrado" });
    }
    if (password !== confirmPassword) {
      return res.status(400).json({ message: "Las contraseñas no coinciden" });
    }
    if (
      password.length < 6 ||
      !/\d/.test(password) || // Al menos un número
      !/[A-Z]/.test(password) || // Al menos una letra mayúscula
      !/[^a-zA-Z0-9]/.test(password) // Al menos un carácter especial
    ) {
      return res.status(400).json({
        message:
          "La contraseña debe tener al menos 8 caracteres, una letra mayúscula, un número y un caracter especial",
      });
    }

    // Generar hash de la contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear nuevo usuario con rol por defecto "user"
    const newUser = new User({
      username,
      email,
      password: passwordHash,
      role: "user", // Asignar el rol por defecto de "user"
    });

    // Guardar el nuevo usuario en la base de datos
    const userSaved = await newUser.save();

    // Crear token de acceso para el nuevo usuario
    const token = await createAccessToken({ id: userSaved._id });

    // Establecer el token en la cookie de respuesta
    res.cookie("token", token);

    // Enviar respuesta con los detalles del usuario registrado
    res.status(201).json({
      id: userSaved._id,
      email: userSaved.email,
      username: userSaved.username,
      role: userSaved.role, // Incluir el rol del usuario en la respuesta
      createdAt: userSaved.createdAt,
      updatedAt: userSaved.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return res.status(400).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }

    const token = await createAccessToken({ id: userFound._id });

    res.cookie("token", token);
    res.json({
      id: userFound._id,
      email: userFound.email,
      username: userFound.username,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  const userFoun = await User.findById(req.user.id);

  if (!userFoun)
    return res.status(400).json({ message: "Usuario no encontrado" });

  return res.json({
    id: userFoun._id,
    email: userFoun.email,
    username: userFoun.username,
    role: userFoun.role,
    createdAt: userFoun.createdAt,
    updatedAt: userFoun.updatedAt,
  });
};
