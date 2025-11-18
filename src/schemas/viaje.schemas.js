// src/schemas/viaje.schemas.js
import { z } from "zod";

// Schema base para los campos de texto de un viaje
const viajeBaseSchema = z.object({
  titulo: z
    .string({
      required_error: "El título del viaje es requerido",
      invalid_type_error: "El título debe ser una cadena de texto",
    })
    .min(3, { message: "El título debe tener al menos 3 caracteres" }),

  destino: z
    .string({
      required_error: "El destino es requerido",
      invalid_type_error: "El destino debe ser una cadena de texto",
    })
    .min(3, { message: "El destino debe tener al menos 3 caracteres" }),

  pais: z
    .string({
      required_error: "El país es requerido",
      invalid_type_error: "El país debe ser una cadena de texto",
    })
    .min(3, { message: "El país debe tener al menos 3 caracteres" }),

  // OJO: como viene de form-data, usamos coerce.number()
  precio: z.coerce
    .number({
      required_error: "El precio es requerido",
      invalid_type_error: "El precio debe ser un número",
    })
    .positive({ message: "El precio debe ser mayor a 0" }),

  duracionDias: z.coerce
    .number({
      required_error: "La duración en días es requerida",
      invalid_type_error: "La duración debe ser un número",
    })
    .int({ message: "La duración debe ser un número entero" })
    .min(1, { message: "La duración debe ser al menos 1 día" }),

  fechaSalida: z
    .string({
      required_error: "La fecha de salida es requerida",
      invalid_type_error: "La fecha de salida debe ser una cadena",
    })
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: "La fecha de salida no es válida",
    }),

  fechaRegreso: z
    .string({
      required_error: "La fecha de regreso es requerida",
      invalid_type_error: "La fecha de regreso debe ser una cadena",
    })
    .refine((val) => !Number.isNaN(Date.parse(val)), {
      message: "La fecha de regreso no es válida",
    }),

  descripcion: z
    .string({
      required_error: "La descripción es requerida",
      invalid_type_error: "La descripción debe ser una cadena de texto",
    })
    .min(10, {
      message: "La descripción debe tener al menos 10 caracteres",
    }),
});

// Crear viaje (CON imagen, pero la imagen viene por file, no en el body)
export const viajeSchema = viajeBaseSchema;

// Update CON imagen (igual: el body solo trae texto, la imagen la maneja Cloudinary)
export const viajeUpdateSchema = viajeBaseSchema;

// Update SIN cambiar imagen (mismas validaciones de texto)
export const viajeUpdateSchemaWithoutImage = viajeBaseSchema;
