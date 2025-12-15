import Editor from "../models/editor.models.js";
import { v2 as cloudinary } from "cloudinary";
// Importamos los modelo de datos
import User from "../models/user.models.js";
import Role from "../models/roles.models.js";
// Dependencias
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";
import { createAccessToken } from "../libs/jwt.js";

// Función para obtener todos los editores
export const getEditores = async (req, res) => {
  try {
    const editores = await Editor.find().sort({ createdAt: -1 });
    res.json(editores);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al obtener los editores"] });
  }
};

// Función para crear un editor
export const createEditor = async (req, res) => {
  //console.log(req);
  const { username, email, password } = req.body; //Esto es desestructurar variables. Descomponer el req
  //console.log(req.body);
  //console.log(username, email, password);
  const roleAdmin = process.env.SETUP_ROLE_ADMIN;

  try {
    //Validar que el email no este registrado en la BD
    const userFound = await User.findOne({ email });
    if (userFound)
      //Ya se encuentra el email registrado en la BD
      return res.status(400).json({ message: ["El email ya esta registrado"] }); //Retornamos error en el registro

    // Encriptar la contraseña
    const passwordHash = await bcryptjs.hash(password, 10);
    //Obtenemos el rol por defecto para usuarios
    //Y lo agregamos al usuario para guardarlo en la db con ese rol
    const role = await Role.findOne({ role: roleAdmin });
    if (!role) {
      //No se encuentra el rol de usuarios inicializado
      return res
        .status(400) //Retornamos error en el registro
        .json({ message: ["El rol para usuarios no está definido"] });
    }

    const newUser = new User({
      username,
      email,
      password: passwordHash,
      role: role._id, //Asignamos el rol de usuario por defecto
    });
    //console.log(newUser);
    const userSaved = await newUser.save();

    //Generamos la cookie de inicio de seión
    const token = await createAccessToken({ id: userSaved._id });
    //Verificamos si el token de inicio de sesión lo generamos para el entorno local
    //de desarrollo, o lo generamos para el servidor en la nube
    if (process.env.ENVIRONMENT == "local") {
      res.cookie("token", token, {
        sameSite: "lax", //Para indicar que el back y front son locales para desarrollo
      });
    } else {
      //El back y front se encuentran en distintos servidores remotos
      res.cookie("token", token, {
        sameSite: "none", //Para peticiones remotas secure: true, //Para activar https en deployment
      });
    } //Fin de if (proccess. env. ENVIRONMENT)
    res.json({
      id: userSaved._id,
      username: userSaved.username,
      email: userSaved.email,
      role: role.role,
    });
  } catch (error) {
    console.log(error);
    console.log("Error al registrar");
    return res.status(400).json({ message: ["Error al registrar editor"] });
  }
};

// Función para obtener UN editor por ID
export const getEditorById = async (req, res) => {
  try {
    const editor = await Editor.findById(req.params.id);
    if (!editor) {
      return res.status(404).json({ message: ["Editor no encontrado"] });
    }
    res.json(editor);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al obtener el editor"] });
  }
};

// Función para actualizar un editor SIN actualizar la imagen
export const updateEditorWithoutImage = async (req, res) => {
  try {
    const editor = await Editor.findById(req.params.id);
    if (!editor) {
      return res.status(404).json({ message: ["Editor no encontrado"] });
    }

    const { nombre, email, telefono, rol, activo } = req.body;

    // Verificar si el email ya existe en otro editor
    if (email && email.toLowerCase() !== editor.email) {
      const editorExistente = await Editor.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.params.id },
      });
      if (editorExistente) {
        return res
          .status(400)
          .json({ message: ["El email ya está registrado"] });
      }
    }

    const dataEditor = {
      nombre: nombre ? nombre.trim() : editor.nombre,
      email: email ? email.trim().toLowerCase() : editor.email,
      telefono:
        telefono !== undefined ? telefono.trim() || undefined : editor.telefono,
      rol: rol || editor.rol,
      activo: activo !== undefined ? activo : editor.activo,
      avatarUrl: editor.avatarUrl,
    };

    const updatedEditor = await Editor.findByIdAndUpdate(
      req.params.id,
      dataEditor,
      { new: true }
    );
    res.json(updatedEditor);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al actualizar el editor"] });
  }
};

// Función para actualizar un editor Y la imagen
export const updateEditorWithImage = async (req, res) => {
  try {
    const editor = await Editor.findById(req.params.id);
    if (!editor) {
      return res.status(404).json({ message: ["Editor no encontrado"] });
    }

    // Si no hay imagen nueva, no actualizamos el avatar
    if (!req.urlImage) {
      return res.status(400).json({
        message: ["Error al actualizar el editor, imagen no encontrada"],
      });
    }

    // Eliminar imagen anterior de Cloudinary si existe
    if (editor.avatarUrl) {
      try {
        const imageURL = editor.avatarUrl;
        const urlArray = imageURL.split("/");
        const image = urlArray[urlArray.length - 1];
        const imageName = image.split(".")[0];
        await cloudinary.uploader.destroy(imageName);
      } catch (cloudinaryError) {
        console.log("Error al eliminar imagen anterior:", cloudinaryError);
        // Continuamos aunque falle la eliminación
      }
    }

    const { nombre, email, telefono, rol, activo } = req.body;

    // Verificar si el email ya existe en otro editor
    if (email && email.toLowerCase() !== editor.email) {
      const editorExistente = await Editor.findOne({
        email: email.toLowerCase(),
        _id: { $ne: req.params.id },
      });
      if (editorExistente) {
        return res
          .status(400)
          .json({ message: ["El email ya está registrado"] });
      }
    }

    const dataEditor = {
      nombre: nombre ? nombre.trim() : editor.nombre,
      email: email ? email.trim().toLowerCase() : editor.email,
      telefono:
        telefono !== undefined ? telefono.trim() || undefined : editor.telefono,
      rol: rol || editor.rol,
      activo: activo !== undefined ? activo : editor.activo,
      avatarUrl: req.urlImage,
    };

    const updatedEditor = await Editor.findByIdAndUpdate(
      req.params.id,
      dataEditor,
      { new: true }
    );
    res.json(updatedEditor);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al actualizar el editor"] });
  }
};

// Función para eliminar un editor
export const deleteEditor = async (req, res) => {
  try {
    const editor = await Editor.findById(req.params.id);
    if (!editor) {
      return res.status(404).json({ message: ["Editor no encontrado"] });
    }

    // Si tiene avatar, borrarlo de Cloudinary
    if (editor.avatarUrl) {
      try {
        const imageURL = editor.avatarUrl;
        const urlArray = imageURL.split("/");
        const image = urlArray[urlArray.length - 1];
        const imageName = image.split(".")[0];
        await cloudinary.uploader.destroy(imageName);
      } catch (cloudinaryError) {
        console.log("Error al eliminar avatar:", cloudinaryError);
        // Continuamos aunque falle la eliminación
      }
    }

    const deletedEditor = await Editor.findByIdAndDelete(req.params.id);
    if (!deletedEditor) {
      return res
        .status(404)
        .json({ message: ["Editor no encontrado para eliminar"] });
    }

    return res.json(deletedEditor);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: ["Error al eliminar el editor"] });
  }
};
