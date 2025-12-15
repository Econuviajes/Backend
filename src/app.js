import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

// Importamos las rutas para usuarios
import authRoutes from "./routes/user.routes.js";
// Importamos las rutas para viajes
import viajeRoutes from "./routes/viajes.routes.js";
// Importamos las rutas para editores
import editorRoutes from "./routes/editor.routes.js";
// Importamos las rutas para clientes
import clienteRoutes from "./routes/cliente.routes.js";

const app = express();
app.use(
  cors({
    credentials: true,
    origin: [
      process.env.BASE_URL_BACKEND, //la dejamos para que funcione postman
      process.env.BASE_URL_FRONTEND,
    ],
  })
);
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser()); //Cookies en formato JSON
app.use(express.urlencoded({ extended: false }));

// Indicamos que inicie el objeto authRoutes
// https://localhost:3000/api/login     o /api/register
app.use("/api/", authRoutes);
app.use("/api/", viajeRoutes);
app.use("/api/", editorRoutes);
app.use("/api/", clienteRoutes);

export default app;
