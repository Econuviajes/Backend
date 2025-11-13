import Viaje from "../models/viajes.models.js";
import { v2 as cloudinary } from "cloudinary";

// Función para obtener todos los viajes
export const getViajes = async (req, res) => {
  try {
    //find = Select * from viajes where user = $id
    const viaje = await Viaje.find({ user: req.user.id }); //.populate('user');  Maestro detalle, traer todos los datos
    res.json(viaje);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al obtener los viajes"] });
  }
}; //Fin de getViajes

// Función para crear un viaje
export const createViaje = async (req, res) => {
  try {
    const {
      titulo,
      destino,
      pais,
      precio,
      duracionDias,
      fechaSalida,
      fechaRegreso,
      descripcion
     } = req.body;


    const newViaje = new Viaje({
      titulo,
      destino,
      pais,
      precio,
      duracionDias,
      fechaSalida,
      fechaRegreso,
      descripcion,
      imagen: req.urlImage,
      user: req.user.id,
    }); //save = insert into viaje values (name, price, quantity);
    const savedViaje = await newViaje.save();
    res.json(savedViaje);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al crear un viaje"] });
  }
}; // Fin de createViaje

// Función para obtener UN viaje por ID
export const getViajeById = async (req, res) => {
  try {
    const viaje = await Viaje.findById(req.params.id);
    if (!viaje)
      // No se encotró el viaje en la BD
      res.status(404).json({ message: ["Viaje no eonctrado"] });
    res.json(viaje);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al obtener un viaje por ID"] });
  }
};

// Función para eliminar UN viaje por ID
export const deleteViaje = async (req, res) => {
  try {
    // delete from viaje where id = $id
    const viaje = await Viaje.findById(req.params.id);
    if (!viaje)
      // No se encotró el viaje en la BD
      res.status(404).json({ message: ["Viaje no encontrado"] });
    res.json(viaje);

    // Eliminamos la imagen de cloudinary, extraemos el nombre de la imagen sin URL ni extensión
    // Obtenemos la URL de la imagen de cloudinary
    const imageURL = viaje.imagen;
    // Dividimos por diagonales / la URL y nos quedamos con el último parámetro que contiene el nombre de la imagen con la extensión
    const urlArray = imageURL.split("/");

    // image contendrá el id de la imagen en cloudinary
    const image = urlArray[urlArray.length - 1]; // Último elemento

    // Dividimos el nombre de la imagen para quitar la extensión
    const imageName = image.split(".")[0];

    // Eliminamos la imagen de cloudinary
    const result = await cloudinary.uploader.destroy(imageName);
    if (result.result === "ok") {
      // Si se eliminó la imagen, ahora eliminamos el viaje
      const deletedViaje = await Viaje.findByIdAndDelete(req.params.id);

      if (!deletedViaje)
        // Error al eliminar el viaje
        return res
          .status(404)
          .json({ message: ["Viaje no encontrado para eliminar"] });
      res.json(deletedViaje);
    } else {
      // Error al eliminar la imagen
      return res
        .status(500)
        .json({ message: ["Error al eliminar la imagen del viaje"] });
    } // Fin del else
  } catch (error) {
    //ConsoleLogger.log(error);
    res.status(500).json({ message: ["Error al eliminar un viaje por ID"] });
  }
};

// Función para actualizar UN viaje por ID sin actualizar la imagen
export const updateViajeWithoutImage = async (req, res) => {
  try {
    const viaje = await Viaje.findById(req.params.id);
    if (!viaje)
      // No se encotró el viaje en la BD
      res.status(404).json({ message: ["Viaje no encontrado"] });

    // Obtenemos los datos a actualizar
    const dataViaje = {
      titulo: req.body.titulo,
      destino: req.body.destino,
      pais: req.body.pais,
      precio: req.body.precio,
      duracionDias: req.body.duracionDias,
      fechaSalida: req.body.fechaSalida,
      fechaRegreso: req.body.fechaRegreso,
      descripcion: req.body.descripcion,
      imagen: viaje.imagen, 
      user: req.user.id,
    };
    const updatedViaje = await Viaje.findByIdAndUpdate(
      req.params.id,
      dataViaje,
      { new: true }
    );
    res.json(updatedViaje);
  } catch (error) {
    //ConsoleLogger.log(error);
    res
      .status(500)
      .json({ message: ["Error al actualizar un viaje por ID"] });
  }
}; // Fin de updateViajeWithoutImage

// Función para actualizar UN viaje y la imagen por ID
export const updateViajeWithImage = async (req, res) => {
  try {
    const viaje = await Viaje.findById(req.params.id);
    if (!viaje)
      // No se encotró el viaje en la BD
      res.status(404).json({ message: ["Viaje no encontrado"] });

    if (!req.file)
      return res.status(500).json({
        message: ["Error al actualizar el viaje, imagen no encontrada"],
      });

    // Obtenemos la URL de la imagen de cloudinary
    const imageURL = viaje.imagen;
    const urlArray = imageURL.split("/");
    const image = urlArray[urlArray.length - 1]; // Último elemento
    const imageName = image.split(".")[0];

    const result = await cloudinary.uploader.destroy(imageName);
    if (!result.result === "ok") {
      return res
        .status(500)
        .json({ message: ["Error al eliminar la imagen del viaje"] });
    } // Fin del if(!result)

    // Obtenemos los datos a actualizar
    const dataViaje = {
      titulo: req.body.titulo,
      destino: req.body.destino,
      pais: req.body.pais,
      precio: req.body.precio,
      duracionDias: req.body.duracionDias,
      fechaSalida: req.body.fechaSalida,
      fechaRegreso: req.body.fechaRegreso,
      descripcion: req.body.descripcion,
      imagen: req.urlImage, 
      user: req.user.id,
    };
    const updatedViaje = await Viaje.findByIdAndUpdate(
      req.params.id,
      dataViaje,
      { new: true }
    );
    res.json(updatedViaje);
  } catch (error) {
    res
      .status(500)
      .json({ message: ["Error al actualizar un viaje por ID"] });
  }
};
//Función para obtener todos los viaje de todos los usuarios
//para la compra de viajes
export const getAllViajes = async (req, res) => {
  try {
    const viajes = await Viaje.find();
    res.json(viajes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al obtener todos los viajes"] });
  }
}; //Fin de getAllViajes
