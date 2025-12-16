import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getViajes,
  createViaje,
  getViajeById,
  deleteViaje,
  updateViajeWithImage,
  updateViajeWithoutImage,
  getAllViajes,
} from "../controllers/viaje.controller.js";

//Importamos el validatorSchema
import { validateSchema } from "../middlewares/validateSchema.js";

//Importamos los esquemas de validación
// Pendiente de renombrarlos a viajeSchemas
import {
  viajeSchema,
  viajeUpdateSchema,
  viajeUpdateSchemaWithoutImage,
} from "../schemas/viaje.schemas.js";

//Importamos el middleware para subir imagenes a Cloudinary
import { uploadToCloudinary } from "../middlewares/uploadImage.js";
import { uploadMultipleToCloudinary } from "../middlewares/uploadMultipleImages.js";
//Imporamos el middleware para administrador
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();
//Ruta para obtener todos los viajes
router.get("/viajes/getallviajes", getAllViajes);

// Ruta para obtener MIS viajes (de un usuario autenticado)
router.get("/viajes/mis-viajes", authRequired, getViajes);

//Ruta para crear un viaje (con múltiples imágenes)
router.post(
  "/viajes",
  authRequired,
  isAdmin,
  uploadMultipleToCloudinary,
  validateSchema(viajeSchema),
  createViaje
); //Usar middlewares para las validaciones

//Ruta para optener todos los viajes de todos los usuarios (admin)
router.get("/viajes", authRequired, isAdmin, getViajes);

//Ruta para obtener un viaje por ID
router.get("/viajes/:id", authRequired, isAdmin, getViajeById);

//Ruta para eliminar un viaje
router.delete("/viajes/:id", authRequired, isAdmin, deleteViaje);

//Rutas para actualizar un viaje SIN ACTUALIZAR imagen
router.put(
  "/viajes/:id",
  authRequired,
  isAdmin,
  validateSchema(viajeUpdateSchema),
  updateViajeWithoutImage
);

//Ruta para actualizar un viaje SIN ACTUALIZAR imágenes (ruta alternativa).
router.put(
  "/viajes/updatewithoutimage/:id",
  authRequired,
  isAdmin,
  validateSchema(viajeUpdateSchemaWithoutImage),
  updateViajeWithoutImage
);

//Ruta para actualizar un viaje y ACTUALIZAR las imágenes (múltiples).
router.put(
  "/viajes/updatewithimage/:id",
  authRequired,
  isAdmin,
  uploadMultipleToCloudinary,
  validateSchema(viajeUpdateSchema),
  updateViajeWithImage
);

export default router;
