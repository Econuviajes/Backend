import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";

// Rutas
import authRoutes from "./routes/auth.routes.js";
import viajesRoutes from "./routes/viajes.routes.js";

const app = express();

/* =========================
   CORS CONFIG (CRÍTICO)
========================= */
const allowedOrigins = [
  "http://localhost:5173",
  "https://frontend-web-3rtr.onrender.com",
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Permitir llamadas sin origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Preflight
app.options("*", cors());

/* =========================
   MIDDLEWARES
========================= */
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());

/* =========================
   ROUTES
========================= */
app.use("/api", authRoutes);
app.use("/api", viajesRoutes);

/* =========================
   HEALTH CHECK
========================= */
app.get("/api/health", (req, res) => {
  res.json({ status: "OK" });
});

/* =========================
   ERROR HANDLER
========================= */
app.use((err, req, res, next) => {
  console.error(err.message);
  res.status(500).json({
    message: "Error interno del servidor",
  });
});

export default app;
