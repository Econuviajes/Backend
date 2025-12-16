import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

import authRoutes from "./routes/user.routes.js";
import viajeRoutes from "./routes/viajes.routes.js";

const app = express();

/*
  CORS
  - En local: VITE en 5173
  - En prod: tu dominio de Render (frontend-web-3rtr.onrender.com)
*/
const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-web-3rtr.onrender.com",
];

// Si tienes otro dominio (www, custom domain), agrégalo aquí también.

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) return callback(null, true);

      return callback(new Error(`CORS bloqueado para origin: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight
app.options("*", cors());

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

// Rutas
app.use("/api", authRoutes);
app.use("/api", viajeRoutes);

export default app;
