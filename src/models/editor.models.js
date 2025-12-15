import mongoose from "mongoose";

const editorSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true,
            unique: true,
            lowercase: true
        },
        telefono: {
            type: String,
            trim: true
        },
        rol: {
            type: String,
            enum: ["Admin", "Editor"],
            required: true,
            default: "Editor"
        },
        activo: {
            type: Boolean,
            default: true
        },
        avatarUrl: {
            type: String
        }
    },
    {
        timestamps: true, // createdAt y updatedAt automáticos
    }
); //Fin del editorSchema

export default mongoose.model('Editor', editorSchema);

