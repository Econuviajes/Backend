import { z } from "zod";

// Schema para crear editor
export const editorSchema = z.object({
  nombre: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" }),

  email: z
    .string({
      required_error: "El email es requerido",
      invalid_type_error: "El email debe ser una cadena de texto",
    })
    .email({ message: "El email no es válido" }),

  telefono: z
    .string()
    .min(8, { message: "El teléfono debe tener al menos 8 caracteres" })
    .optional()
    .or(z.literal("")),

  rol: z
    .enum(["Admin", "Editor"], {
      errorMap: () => ({ message: "El rol debe ser Admin o Editor" }),
    })
    .optional()
    .default("Editor"),

  activo: z.coerce.boolean().optional().default(true),
});

// Schema para actualizar editor
export const editorUpdateSchema = z.object({
  nombre: z
    .string({
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .min(3, { message: "El nombre debe tener al menos 3 caracteres" })
    .optional(),

  email: z
    .string({
      invalid_type_error: "El email debe ser una cadena de texto",
    })
    .email({ message: "El email no es válido" })
    .optional(),

  telefono: z
    .string()
    .min(8, { message: "El teléfono debe tener al menos 8 caracteres" })
    .optional()
    .or(z.literal("")),

  rol: z
    .enum(["Admin", "Editor"], {
      errorMap: () => ({ message: "El rol debe ser Admin o Editor" }),
    })
    .optional(),

  activo: z.coerce.boolean().optional(),
});

// Schema para actualizar editor sin imagen (mismo que updateSchema)
export const editorUpdateSchemaWithoutImage = editorUpdateSchema;

