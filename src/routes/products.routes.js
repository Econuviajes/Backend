import { Router } from "express";
import { authRequired } from "../middlewares/validateToken.js";
import {
  getProducts,
  createProduct,
  getProductById,
  deleteProduct,
  updateProductWithImage,
  updateProductWithoutImage,
  getAllProducts,
} from "../controllers/product.controller.js";
//Importamos el validatorSchema
import { validateSchema } from "../middlewares/validateSchema.js";
//Importamos los esquemas de validación
import {
  productSchema,
  productUpdateSchema,
  productUpdateSchemaWithoutImage,
} from "../schemas/product.schemas.js";
//Importamos el middleware para subir imagenes a Cloudinary
import { uploadToCloudinary } from "../middlewares/uploadImage.js";
//Imporamos el middleware para administrador
import { isAdmin } from "../middlewares/isAdmin.js";

const router = Router();
//Ruta para obtener todos los productos
router.get("/products", authRequired, isAdmin, getProducts);

//Ruta para crear un producto
router.post(
  "/products",
  authRequired,
  isAdmin,
  uploadToCloudinary,
  validateSchema(productSchema),
  createProduct
); //Usar middlewares para las validaciones

//Ruta para optener todos los productosde todos los usuarios (admin)
router.get("/products/getallproducts", getAllProducts);

//Ruta para obtener un producto por ID
router.get("/products/:id", authRequired, isAdmin, getProductById);

//Ruta para eliminar un producto
router.delete("/products/:id", authRequired, isAdmin, deleteProduct);

//Ruta para actualizar un producto SIN ACTUALIZAR imagen
router.put(
  "/products/:id",
  authRequired,
  isAdmin,
  validateSchema(productUpdateSchema),
  updateProductWithoutImage
);

//Ruta para actualizar un producto y ACTUALIZAR la imagen.
router.put(
  "/products/updatewithoutimage/:id",
  authRequired,
  isAdmin,
  uploadToCloudinary,
  validateSchema(productUpdateSchemaWithoutImage),
  updateProductWithoutImage
);

//Ruta para actualizar un producto y ACTUALIZAR la imagen.
router.put(
  "/products/updatewithimage/:id",
  authRequired,
  isAdmin,
  uploadToCloudinary,
  validateSchema(productUpdateSchema),
  updateProductWithImage
);

export default router;
