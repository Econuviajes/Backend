import { z } from "zod";

// Schema para crear cliente
export const clienteSchema = z.object({
  nombre: z
    .string({
      required_error: "El nombre es requerido",
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" }),

  apellidos: z
    .string({
      required_error: "Los apellidos son requeridos",
      invalid_type_error: "Los apellidos deben ser una cadena de texto",
    })
    .min(2, { message: "Los apellidos deben tener al menos 2 caracteres" }),

  telefono: z
    .string({
      required_error: "El teléfono es requerido",
      invalid_type_error: "El teléfono debe ser una cadena de texto",
    })
    .min(8, { message: "El teléfono debe tener al menos 8 caracteres" }),

  email: z
    .string()
    .email({ message: "El email no es válido" })
    .optional()
    .or(z.literal("")),

  curp: z.string().optional().or(z.literal("")),
  rfc: z.string().optional().or(z.literal("")),

  fechaNacimientoISO: z
    .string()
    .refine((val) => !val || !Number.isNaN(Date.parse(val)), {
      message: "La fecha de nacimiento no es válida",
    })
    .optional()
    .or(z.literal("")),

  notas: z.string().optional().or(z.literal("")),

  status: z
    .enum(["Activo", "Inactivo"], {
      errorMap: () => ({ message: "El status debe ser Activo o Inactivo" }),
    })
    .optional()
    .default("Activo"),
});

// Schema para actualizar cliente
export const clienteUpdateSchema = z.object({
  nombre: z
    .string({
      invalid_type_error: "El nombre debe ser una cadena de texto",
    })
    .min(2, { message: "El nombre debe tener al menos 2 caracteres" })
    .optional(),

  apellidos: z
    .string({
      invalid_type_error: "Los apellidos deben ser una cadena de texto",
    })
    .min(2, { message: "Los apellidos deben tener al menos 2 caracteres" })
    .optional(),

  telefono: z
    .string({
      invalid_type_error: "El teléfono debe ser una cadena de texto",
    })
    .min(8, { message: "El teléfono debe tener al menos 8 caracteres" })
    .optional(),

  email: z
    .string()
    .email({ message: "El email no es válido" })
    .optional()
    .or(z.literal("")),

  curp: z.string().optional().or(z.literal("")),
  rfc: z.string().optional().or(z.literal("")),

  fechaNacimientoISO: z
    .string()
    .refine((val) => !val || !Number.isNaN(Date.parse(val)), {
      message: "La fecha de nacimiento no es válida",
    })
    .optional()
    .or(z.literal("")),

  notas: z.string().optional().or(z.literal("")),

  status: z
    .enum(["Activo", "Inactivo"], {
      errorMap: () => ({ message: "El status debe ser Activo o Inactivo" }),
    })
    .optional(),
});

// Schema para actualizar cliente sin imagen (mismo que updateSchema)
export const clienteUpdateSchemaWithoutImage = clienteUpdateSchema;

