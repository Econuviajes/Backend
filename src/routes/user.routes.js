import { Router } from 'express'
import { login, register, logout, profile } from '../controllers/auth.controller.js';
import { authRequired } from '../middlewares/validateToken.js';

// Importamos el middleware de esquemas
import { validateSchema } from '../middlewares/validateSchema.js';

// Importamos los esquemas de validación
import { registerSchema, loginSchema} from "../schemas/auth.schemas.js"

const router = Router();

// Middlewares si funciona pasa, si no funciona se corta
//Ruta para registrar usuarios
router.post('/register', validateSchema(registerSchema), register);

//Ruta para iniciar sesión
router.post('/login', validateSchema(loginSchema), login);

//Ruta para cerrar sesión
router.post('/logout', logout);

//Ruta para obtener el perfil del usuario
router.get('/profile', authRequired, profile); // Tipo GET porque no envía, solo obtiene

export default router;
