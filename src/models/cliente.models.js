import mongoose from "mongoose";

const clienteSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },
        apellidos: {
            type: String,
            required: true,
            trim: true
        },
        telefono: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            trim: true,
            lowercase: true
        },
        curp: {
            type: String,
            trim: true,
            uppercase: true
        },
        rfc: {
            type: String,
            trim: true,
            uppercase: true
        },
        fechaNacimientoISO: {
            type: String // yyyy-mm-dd format
        },
        notas: {
            type: String,
            trim: true
        },
        status: {
            type: String,
            enum: ["Activo", "Inactivo"],
            required: true,
            default: "Activo"
        },
        avatarUrl: {
            type: String
        }
    },
    {
        timestamps: true, // createdAt y updatedAt automáticos
    }
); //Fin del clienteSchema

export default mongoose.model('Cliente', clienteSchema);

