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

import { validateSchema } from "../middlewares/validateSchema.js";

import {
  viajeSchema,
  viajeUpdateSchema,
  viajeUpdateSchemaWithoutImage,
} from "../schemas/viaje.schemas.js";

import { uploadToCloudinary } from "../middlewares/uploadImage.js";
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

/* =========================
   RUTAS PUBLICAS (CATALOGO)
   ========================= */

// Lista pública para Home / Viajes
router.get("/viajes/getallviajes", getAllViajes);

// Detalle público para /viajes/:id en el frontend
router.get("/viajes/public/:id", getViajeById);

/* =========================
   RUTAS PROTEGIDAS (ADMIN)
   ========================= */

// Obtener todos los viajes (admin)
router.get("/viajes", authRequired, isAdmin, getViajes);

// Crear viaje (admin)
router.post(
  "/viajes",
  authRequired,
  isAdmin,
  uploadToCloudinary,
  validateSchema(viajeSchema),
  createViaje
);

// Actualizar viaje SIN actualizar imagen (admin)
router.put(
  "/viajes/:id",
  authRequired,
  isAdmin,
  validateSchema(viajeUpdateSchema),
  updateViajeWithoutImage
);

// Actualizar viaje CON imagen (admin)
router.put(
  "/viajes/updatewithimage/:id",
  authRequired,
  isAdmin,
  uploadToCloudinary,
  validateSchema(viajeUpdateSchema),
  updateViajeWithImage
);

// Actualizar viaje sin imagen (admin) (nota: tu ruta se llama updatewithoutimage pero usa uploadToCloudinary; la dejo como la tenías)
router.put(
  "/viajes/updatewithoutimage/:id",
  authRequired,
  isAdmin,
  uploadToCloudinary,
  validateSchema(viajeUpdateSchemaWithoutImage),
  updateViajeWithoutImage
);

// Obtener viaje por ID (admin)
router.get("/viajes/:id", authRequired, isAdmin, getViajeById);

router.get("/viajes/mis-viajes", authRequired, getViajes); 

// Eliminar viaje (admin)
router.delete("/viajes/:id", authRequired, isAdmin, deleteViaje);

export default router;
