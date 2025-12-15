import Editor from "../models/editor.models.js";
import { v2 as cloudinary } from "cloudinary";

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
  try {
    const { nombre, email, telefono, rol, activo } = req.body;

    // Verificar si el email ya existe
    const editorExistente = await Editor.findOne({ email: email.toLowerCase() });
    if (editorExistente) {
      return res.status(400).json({ message: ["El email ya está registrado"] });
    }

    const newEditor = new Editor({
      nombre: nombre.trim(),
      email: email.trim().toLowerCase(),
      telefono: telefono ? telefono.trim() : undefined,
      rol: rol || "Editor",
      activo: activo !== undefined ? activo : true,
      avatarUrl: req.urlImage || undefined,
    });

    const savedEditor = await newEditor.save();
    res.json(savedEditor);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al crear el editor"] });
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
        _id: { $ne: req.params.id }
      });
      if (editorExistente) {
        return res.status(400).json({ message: ["El email ya está registrado"] });
      }
    }

    const dataEditor = {
      nombre: nombre ? nombre.trim() : editor.nombre,
      email: email ? email.trim().toLowerCase() : editor.email,
      telefono: telefono !== undefined ? (telefono.trim() || undefined) : editor.telefono,
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
        _id: { $ne: req.params.id }
      });
      if (editorExistente) {
        return res.status(400).json({ message: ["El email ya está registrado"] });
      }
    }

    const dataEditor = {
      nombre: nombre ? nombre.trim() : editor.nombre,
      email: email ? email.trim().toLowerCase() : editor.email,
      telefono: telefono !== undefined ? (telefono.trim() || undefined) : editor.telefono,
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
      return res.status(404).json({ message: ["Editor no encontrado para eliminar"] });
    }

    return res.json(deletedEditor);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: ["Error al eliminar el editor"] });
  }
};

