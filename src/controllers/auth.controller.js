import User from "../models/user.models.js";
import Role from "../models/roles.models.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { createAccessToken } from "../libs/jwt.js";

dotenv.config();

const roleUser = process.env.SETUP_ROLE_USER;

const setAuthCookie = (res, token) => {
  const isLocal = process.env.ENVIRONMENT === "local";

  res.cookie("token", token, {
    httpOnly: true,
    secure: !isLocal,
    sameSite: isLocal ? "lax" : "none",
    path: "/",
  });
};

export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (userFound)
      return res.status(400).json({ message: ["El email ya esta registrado"] });

    const passwordHash = await bcryptjs.hash(password, 10);

    const role = await Role.findOne({ role: roleUser });
    if (!role) {
      return res
        .status(400)
        .json({ message: ["El rol para usuarios no está definido"] });
    }

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      role: role._id,
    });

    const userSaved = await newUser.save();

    const token = await createAccessToken({ id: userSaved._id });
    setAuthCookie(res, token);

    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      role: role.role,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: ["Error al registrar un usuario"] });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound)
      return res.status(400).json({ message: ["Usuario no encontrado"] });

    const isMatch = await bcryptjs.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: ["Password no coincide"] });

    const token = await createAccessToken({ id: userFound._id });
    setAuthCookie(res, token);

    const role = await Role.findById(userFound.role);
    if (!role) {
      return res
        .status(400)
        .json({ message: ["El rol para el usuario no está definido"] });
    }

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: role.role,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: ["Error al iniciar sesión"] });
  }
};

export const logout = (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    path: "/",
  });
  return res.sendStatus(200);
};

export const profile = async (req, res) => {
  try {
    const userFound = await User.findById(req.user.id);
    if (!userFound)
      return res.status(400).json({ message: ["Usuario no encontrado"] });

    const roleDoc = await Role.findById(userFound.role);

    res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: roleDoc?.role || "user",
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: ["Error al obtener el perfil"] });
  }
};
