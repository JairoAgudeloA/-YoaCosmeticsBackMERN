import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import { createAccessToken } from "../libs/jwt.js";
// import { validatePassword } from "../schemas/auth.schema.js";

export const register = async (req, res) => {
  const { email, password, username, confirmPassword } = req.body;
  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json(["El correo electrónico ya está registrado"]);
    }
    if (password !== confirmPassword) {
      return res.status(400).json(["Las contraseñas no coinciden"]);
    }
    // validatePassword.parse({ password, confirmPassword });
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
    const token = await createAccessToken({
      id: userSaved._id,
      role: userSaved.role,
    });

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
    res.status(500).json([error.message]);
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const userFound = await User.findOne({ email });
    if (!userFound) {
      return res.status(400).json(["Usuario no encontrado"]);
    }

    const isMatch = await bcrypt.compare(password, userFound.password);
    if (!isMatch) {
      return res.status(400).json(["Contraseña incorrecta"]);
    }

    const token = await createAccessToken({
      id: userFound._id,
      role: userFound.role,
    });

    res.cookie("token", token);
    res.json({
      id: userFound._id,
      email: userFound.email,
      username: userFound.username,
      createdAt: userFound.createdAt,
      updatedAt: userFound.updatedAt,
    });
  } catch (error) {
    res.status(500).json([error.message]);
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

  if (!userFoun) return res.status(400).json(["Usuario no encontrado"]);

  return res.json({
    id: userFoun._id,
    email: userFoun.email,
    username: userFoun.username,
    role: userFoun.role,
    createdAt: userFoun.createdAt,
    updatedAt: userFoun.updatedAt,
  });
};

export const updateProfile = async (req, res) => {
  const {
    username,
    biography,
    phone,
    birthdate,
    confirmPassword,
    newPassword,
    confirmNewPassword,
    photo,
  } = req.body;

  const profileFound = await User.findById(req.user.id);

  if (!profileFound) {
    return res.status(400).json(["Usuario no encontrado"]);
  }

  const isPasswordValid = await bcrypt.compare(
    confirmPassword,
    profileFound.password
  );
  if (!isPasswordValid) {
    return res.status(400).json(["Contraseña incorrecta"]);
  }
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json(["Las contraseñas no coinciden"]);
  }
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(newPassword, salt);

  profileFound.username = username;
  profileFound.biography = biography;
  profileFound.phone = phone;
  profileFound.birthdate = birthdate;
  profileFound.password = passwordHash;
  profileFound.photo = photo;

  const profileSaved = await profileFound.save();
  res.json({
    id: profileSaved._id,
    email: profileSaved.email,
    username: profileSaved.username,
    photo: profileSaved.photo,
    biography: profileSaved.biography,
    phone: profileSaved.phone,
    birthdate: profileSaved.birthdate,
    role: profileSaved.role,
    createdAt: profileSaved.createdAt,
    updatedAt: profileSaved.updatedAt,
  });
};
