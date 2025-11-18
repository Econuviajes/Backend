// src/middlewares/validateSchema.js
import { ZodError } from "zod";

export const validateSchema = (schema) => (req, res, next) => {
  try {
    // console.log("BODY EN validateSchema:", req.body);
    schema.parse(req.body);
    return next();
  } catch (error) {
    console.log("ERROR EN validateSchema:", error);

    if (error instanceof ZodError) {
      return res.status(400).json({
        message: (error.issues || []).map((issue) => issue.message),
        errors: error.issues || [],
      });
    }

    return res
      .status(500)
      .json({ message: ["Error al validar los datos del formulario"] });
  }
};
