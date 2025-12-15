// src/schemas/viaje.schemas.js
import { z } from "zod";

// Schema base para los campos de texto de un viaje
const viajeBaseSchema = z.object({
  nombre: z
    .string({
      required_error: "El nombre del viaje es requerido",
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),

  destino: z
    .string({
      required_error: "El destino es requerido",
      invalid_type_error: "El destino debe ser una cadena de texto",
    })
    .min(2, { message: "El destino debe tener al menos 2 caracteres" }),

  descripcion: z
    .string({
      required_error: "La descripción es requerida",
      invalid_type_error: "La descripción debe ser una cadena de texto",
    })
    .min(1, {
      message: "La descripción es requerida",
    }),

  fechaInicioISO: z
    .string({
      required_error: "La fecha de inicio es requerida",
      invalid_type_error: "La fecha de inicio debe ser una cadena",
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "La fecha de inicio debe estar en formato yyyy-mm-dd",
    }),

  fechaFinISO: z
    .string({
      required_error: "La fecha de fin es requerida",
      invalid_type_error: "La fecha de fin debe ser una cadena",
    })
    .regex(/^\d{4}-\d{2}-\d{2}$/, {
      message: "La fecha de fin debe estar en formato yyyy-mm-dd",
    }),

  // OJO: como viene de form-data, usamos coerce.number()
  precio: z.coerce
    .number({
      required_error: "El precio es requerido",
      invalid_type_error: "El precio debe ser un número",
    })
    .positive({ message: "El precio debe ser mayor a 0" }),

  capacidadAsientos: z.coerce
    .number({
      required_error: "La capacidad de asientos es requerida",
      invalid_type_error: "La capacidad debe ser un número",
    })
    .int({ message: "La capacidad debe ser un número entero" })
    .min(1, { message: "La capacidad debe ser al menos 1 asiento" }),
}).refine((data) => {
  // Validar que fechaFinISO sea mayor o igual a fechaInicioISO
  if (data.fechaInicioISO && data.fechaFinISO) {
    return new Date(data.fechaFinISO) >= new Date(data.fechaInicioISO);
  }
  return true;
}, {
  message: "La fecha de fin debe ser mayor o igual a la fecha de inicio",
  path: ["fechaFinISO"],
});

// Crear viaje (CON imágenes, pero las imágenes vienen por files, no en el body)
export const viajeSchema = viajeBaseSchema;

// Update CON imágenes (igual: el body solo trae texto, las imágenes las maneja Cloudinary)
export const viajeUpdateSchema = viajeBaseSchema;

// Update SIN cambiar imágenes (mismas validaciones de texto)
export const viajeUpdateSchemaWithoutImage = viajeBaseSchema;
