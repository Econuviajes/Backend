import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getClientes,
  createCliente,
  getClienteById,
  deleteCliente,
  updateClienteWithImage,
  updateClienteWithoutImage,
} from "../controllers/cliente.controller.js";

//Importamos el validatorSchema
import { validateSchema } from "../middlewares/validateSchema.js";

//Importamos los esquemas de validación
import {
  clienteSchema,
  clienteUpdateSchema,
  clienteUpdateSchemaWithoutImage,
} from "../schemas/cliente.schemas.js";

//Importamos el middleware para subir imagenes a Cloudinary (opcional para avatar)
import { uploadToCloudinaryOptional } from "../middlewares/uploadImageOptional.js";
//Importamos el middleware para administrador
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();

//Ruta para obtener todos los clientes
router.get("/clientes", authRequired, isAdmin, getClientes);

//Ruta para crear un cliente
router.post(
  "/clientes",
  authRequired,
  isAdmin,
  uploadToCloudinaryOptional,
  validateSchema(clienteSchema),
  createCliente
);

//Ruta para obtener un cliente por ID
router.get("/clientes/:id", authRequired, isAdmin, getClienteById);

//Ruta para eliminar un cliente
router.delete("/clientes/:id", authRequired, isAdmin, deleteCliente);

//Ruta para actualizar un cliente SIN ACTUALIZAR imagen
router.put(
  "/clientes/:id",
  authRequired,
  isAdmin,
  validateSchema(clienteUpdateSchemaWithoutImage),
  updateClienteWithoutImage
);

//Ruta para actualizar un cliente y ACTUALIZAR la imagen
router.put(
  "/clientes/updatewithimage/:id",
  authRequired,
  isAdmin,
  uploadToCloudinaryOptional,
  validateSchema(clienteUpdateSchema),
  updateClienteWithImage
);

export default router;

