import mongoose from "mongoose";

export const connectDB = async () => {
  const mongoURL = process.env.MONGODB_URL;
  if (!mongoURL) {
    console.log("La variable de entorno MONGODB_URL no está definida");
    return;
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Base de datos conectada");
  } catch (error) {
    console.log("Error al conectare a la base de datos");
    console.log(error);
  }
}; //Fin de connectDB;
