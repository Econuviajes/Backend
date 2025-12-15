// Importamos los modelo de datos
import User from "../models/user.models.js";
import Role from "../models/roles.models.js";
// Dependencias
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { createAccessToken } from "../libs/jwt.js";

//Configuramos env
dotenv.config();

//Obtenemos el rol por defecto para los usuarios
const roleUser = process.env.SETUP_ROLE_USER;

// helper: setear cookie según entorno
const setTokenCookie = (res, token) => {
  const isLocal = process.env.ENVIRONMENT === "locales";

  res.cookie("token", token, {
    httpOnly: true,
    path: "/",
    sameSite: isLocal ? "lax" : "none",
    secure: !isLocal, 
  });
};

// Función para registrar usuarios
export const register = async (req, res) => {
  const { username, email, password } = req.body;

  try {
    //Validar que el email no este registrado en la BD
    const userFound = await User.findOne({ email });
    if (userFound)
      return res.status(400).json({ message: ["El email ya esta registrado"] });

    // Encriptar la contraseña
    const passwordHash = await bcryptjs.hash(password, 10);

    //Obtenemos el rol por defecto para usuarios
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

    // Generamos token y cookie
    const token = await createAccessToken({ id: userSaved._id });
    setTokenCookie(res, token);

    return res.json({
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

// Función para inciar sesión
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const userFound = await User.findOne({ email });
    if (!userFound)
      return res.status(400).json({ message: ["Usuario no encontrado"] });

    const isMatch = await bcryptjs.compare(password, userFound.password);
    if (!isMatch)
      return res.status(400).json({ message: ["Password no coincide"] });

    // Generamos token y cookie
    const token = await createAccessToken({ id: userFound._id });
    setTokenCookie(res, token);

    //Obtenemos el rol para el usuario
    const role = await Role.findById(userFound.role);
    if (!role)
      return res
        .status(400)
        .json({ message: ["El rol para el usuario no está definido"] });

    return res.json({
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

// Función para cerrar sesión
export const logout = (req, res) => {
  const isLocal = process.env.ENVIRONMENT === "locales";

  res.cookie("token", "", {
    httpOnly: true,
    path: "/",
    sameSite: isLocal ? "lax" : "none",
    secure: !isLocal,
    expires: new Date(0),
  });

  return res.sendStatus(200);
};

// Función para el perfil del usuario
export const profile = async (req, res) => {
  try {
    const userFound = await User.findById(req.user.id).populate("role");

    if (!userFound)
      return res.status(400).json({ message: ["Usuario no encontrado"] });

    // Obtenemos el rol para el usuario
    const role = await Role.findById(userFound.role);
    if (!role) {
      return res
        .status(400)
        .json({ message: ["El rol para el usuario no está definido"] });
    }

    return res.json({
      id: userFound._id,
      username: userFound.username,
      email: userFound.email,
      role: role.role,
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: ["Error al obtener el perfil"] });
  }
};
