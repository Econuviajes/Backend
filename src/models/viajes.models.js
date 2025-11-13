import mongoose from "mongoose";

const viajeSchema = new mongoose.Schema(
    {
        titulo:{
            type: String,
            required: true,
            trim: true
        },
        destino: {
            type: String,
            required: true,
            trim: true
        },
        pais: {
            type: String,
            required: true,
            trim: true
        },
        precio: {
            type: Number,
            required: true,
            min: 0
        },
        duracionDias: {
            type: Number,
            required: true,
            min: 1
        },
        fechaSalida: {
            type: Date,
            required: true
        },
        fechaRegreso: {
            type: Date,
            required: true
        },
        descripcion: {
            type: String,
            required: true,
            trim: true
        },
        imagen: {
            type: String,
            required: true
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