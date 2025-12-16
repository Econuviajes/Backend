import express from "express";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import cors from "cors";

// Rutas
import authRoutes from "./routes/user.routes.js";
import viajeRoutes from "./routes/viajes.routes.js";
import editorRoutes from "./routes/editor.routes.js";
import clienteRoutes from "./routes/cliente.routes.js";

const app = express();

/**
 * ===============================
 * CORS CONFIG (PROD + DEV)
 * ===============================
 */
const allowedOrigins = [
  process.env.BASE_URL_FRONTEND, // https://frontend-web-3rtr.onrender.com
  "http://localhost:5173", // desarrollo
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      // Permitir requests sin origin (Postman, curl, mobile apps)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error(`CORS bloqueado para el origen: ${origin}`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Manejo explícito de preflight
app.options("*", cors());

/**
 * ===============================
 * MIDDLEWARES
 * ===============================
 */
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: false }));

/**
 * ===============================
 * ROUTES
 * ===============================
 */
app.use("/api", authRoutes);
app.use("/api", viajeRoutes);
app.use("/api", editorRoutes);
app.use("/api", clienteRoutes);

/**
 * ===============================
 * ERROR HANDLER (CORS)
 * ===============================
 */
app.use((err, req, res, next) => {
  if (err.message?.includes("CORS")) {
    return res.status(403).json({
      message: err.message,
    });
  }
  next(err);
});

export default app;
