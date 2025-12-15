import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getEditores,
  createEditor,
  getEditorById,
  deleteEditor,
  updateEditorWithImage,
  updateEditorWithoutImage,
} from "../controllers/editor.controller.js";

//Importamos el validatorSchema
import { validateSchema } from "../middlewares/validateSchema.js";

//Importamos los esquemas de validación
import {
  editorSchema,
  editorUpdateSchema,
  editorUpdateSchemaWithoutImage,
} from "../schemas/editor.schemas.js";
import { registerSchema } from "../schemas/auth.schemas.js";

//Importamos el middleware para subir imagenes a Cloudinary (opcional para avatar)
import { uploadToCloudinaryOptional } from "../middlewares/uploadImageOptional.js";
//Importamos el middleware para administrador
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

//Ruta para obtener todos los editores
router.get("/editores", authRequired, isAdmin, getEditores);

//Ruta para crear un editor
router.post(
  "/editores",
  /* authRequired, */
  /*  isAdmin, */
  /* uploadToCloudinaryOptional, */
  validateSchema(registerSchema),
  createEditor
);

//Ruta para obtener un editor por ID
router.get("/editores/:id", authRequired, isAdmin, getEditorById);

//Ruta para eliminar un editor
router.delete("/editores/:id", authRequired, isAdmin, deleteEditor);

//Ruta para actualizar un editor SIN ACTUALIZAR imagen
router.put(
  "/editores/:id",
  authRequired,
  isAdmin,
  validateSchema(editorUpdateSchemaWithoutImage),
  updateEditorWithoutImage
);

//Ruta para actualizar un editor y ACTUALIZAR la imagen
router.put(
  "/editores/updatewithimage/:id",
  authRequired,
  isAdmin,
  uploadToCloudinaryOptional,
  validateSchema(editorUpdateSchema),
  updateEditorWithImage
);

export default router;
