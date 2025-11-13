import { z } from "zod";

// Schema para crear un viaje
export const viajeSchema = z.object({
  titulo: z
    .string({ message: ["El título del viaje es requerido"] })
    .min(3, { message: ["El título debe tener al menos 3 caracteres"] }),

  destino: z
    .string({ message: ["El destino es requerido"] })
    .min(3, { message: ["El destino debe tener al menos 3 caracteres"] }),

  pais: z
    .string({ message: ["El país es requerido"] })
    .min(3, { message: ["El país debe tener al menos 3 caracteres"] }),

  precio: z
    .string()
    .transform((val) => parseFloat(val))
    .pipe(
      z
        .number({ message: ["El precio es requerido"] })
        .positive({ message: ["El precio debe ser mayor a 0"] })
        .refine((val) => !isNaN(val), {
          message: ["El precio debe ser un número válido"],
        })
    ),

  duracionDias: z
    .string()
    .transform((val) => parseInt(val))
    .pipe(
      z
        .number({ message: ["La duración en días es requerida"] })
        .int({ message: ["La duración debe ser un número entero"] })
        .min(1, { message: ["La duración debe ser al menos 1 día"] })
        .refine((val) => !isNaN(val), {
          message: ["La duración debe ser un número válido"],
        })
    ),

  fechaSalida: z
    .string({ message: ["La fecha de salida es requerida"] })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: ["La fecha de salida no es válida"],
    }),

  fechaRegreso: z
    .string({ message: ["La fecha de regreso es requerida"] })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: ["La fecha de regreso no es válida"],
    }),

  descripcion: z
    .string({ message: ["La descripción es requerida"] })
    .min(10, { message: ["La descripción debe tener al menos 10 caracteres"] }),
});

// Schema para actualizar un viaje (con imagen)
export const viajeUpdateSchema = z.object({
  titulo: z
    .string({ message: ["El título del viaje es requerido"] })
    .min(3, { message: ["El título debe tener al menos 3 caracteres"] }),

  destino: z
    .string({ message: ["El destino es requerido"] })
    .min(3, { message: ["El destino debe tener al menos 3 caracteres" ]}),

  pais: z
    .string({ message: ["El país es requerido"] })
    .min(3, { message: ["El país debe tener al menos 3 caracteres"] }),

  precio: z
    .number({ message: ["El precio es requerido"] })
    .positive({ message: ["El precio debe ser mayor a 0"] })
    .refine((val) => !isNaN(val), {
      message: ["El precio debe ser un número válido"],
    }),

  duracionDias: z
    .number({ message: ["La duración en días es requerida"] })
    .int({ message: ["La duración debe ser un número entero"] })
    .min(1, { message: ["La duración debe ser al menos 1 día"] })
    .refine((val) => !isNaN(val), {
      message: ["La duración debe ser un número válido"],
    }),

  fechaSalida: z
    .string({ message: ["La fecha de salida es requerida"] })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: ["La fecha de salida no es válida"],
    }),

  fechaRegreso: z
    .string({ message: ["La fecha de regreso es requerida"] })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: ["La fecha de regreso no es válida"],
    }),

  descripcion: z
    .string({ message: ["La descripción es requerida"] })
    .min(10, { message: ["La descripción debe tener al menos 10 caracteres"] }),

  imagen: z.string({ message: ["La URL de la imagen es requerida"] }),
});

// Schema para actualizar viaje SIN cambiar imagen
export const viajeUpdateSchemaWithoutImage = z.object({
  titulo: z
    .string({ message: ["El título del viaje es requerido"] })
    .min(3, { message: ["El título debe tener al menos 3 caracteres"] }),

  destino: z
    .string({ message: ["El destino es requerido"] })
    .min(3, { message: ["El destino debe tener al menos 3 caracteres"] }),

  pais: z
    .string({ message: ["El país es requerido"] })
    .min(3, { message: ["El país debe tener al menos 3 caracteres"] }),

  precio: z
    .number({ message: ["El precio es requerido"] })
    .positive({ message: ["El precio debe ser mayor a 0"] })
    .refine((val) => !isNaN(val), {
      message: ["El precio debe ser un número válido"],
    }),

  duracionDias: z
    .number({ message: ["La duración en días es requerida"] })
    .int({ message: ["La duración debe ser un número entero"] })
    .min(1, { message: ["La duración debe ser al menos 1 día"] })
    .refine((val) => !isNaN(val), {
      message: ["La duración debe ser un número válido"],
    }),

  fechaSalida: z
    .string({ message: ["La fecha de salida es requerida"] })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: ["La fecha de salida no es válida"],
    }),

  fechaRegreso: z
    .string({ message: ["La fecha de regreso es requerida"] })
    .refine((val) => !isNaN(Date.parse(val)), {
      message: ["La fecha de regreso no es válida"],
    }),

  descripcion: z
    .string({ message: ["La descripción es requerida"] })
    .min(10, { message: ["La descripción debe tener al menos 10 caracteres"] }),
});
