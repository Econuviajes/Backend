import mongoose from 'mongoose';

export const connectDB = async () =>{
    try {
        await mongoose.connect('mongodb://127.0.0.1/productos');
        console.log("Base de datos conectada");
    } catch (error) {
        console.log("Error al conectare a la base de datos");
        console.log(error);
    }
} //Fin de connectDB;
