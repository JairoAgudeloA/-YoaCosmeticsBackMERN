import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
// import { createAccessToken } from "../libs/jwt.js";

export const getUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error al obtener usuarios" });
  }
};

export const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.json(user);
  } catch (error) {
    res
      .status(500)
      .json({ message: error.message || "Error al obtener usuario" });
  }
};

export const createUser = async (req, res) => {
  const { username, email, password, role } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "El correo electrónico ya está registrado" });
    }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      role,
    });
    const userSaved = await newUser.save();
    res.json(userSaved);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUser = async (req, res) => {
  const { username, password, role } = req.body;
  try {
    // const existingUser = await User.findOne({ email });
    // if (existingUser) {
    //   return res
    //     .status(400)
    //     .json({ message: "El correo electrónico ya está registrado" });
    // }
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.findById(req.params.id);
    user.username = username;
    // user.email = email;
    user.password = password;
    user.role = role;
    user.password = passwordHash;
    await user.save();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ message: "Usuario eliminado" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
