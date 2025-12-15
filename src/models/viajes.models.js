import mongoose from "mongoose";

const viajeSchema = new mongoose.Schema(
    {
        nombre: {
            type: String,
            required: true,
            trim: true
        },
        destino: {
            type: String,
            required: true,
            trim: true
        },
        descripcion: {
            type: String,
            required: true,
            trim: true
        },
        fechaInicioISO: {
            type: String, // yyyy-mm-dd format
            required: true
        },
        fechaFinISO: {
            type: String, // yyyy-mm-dd format
            required: true
        },
        precio: {
            type: Number,
            required: true,
            min: 0
        },
        capacidadAsientos: {
            type: Number,
            required: true,
            min: 1
        },
        coverImageUrl: {
            type: String,
            required: true
        },
        galleryImageUrls: {
            type: [String],
            default: []
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        }
    },
    {
        timestamps: true, // createdAt y updatedAt automáticos
    }
); //Fin del viajeSchema

export default mongoose.model('Viaje', viajeSchema);