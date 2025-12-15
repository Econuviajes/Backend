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
      nombre,
      destino,
      descripcion,
      fechaInicioISO,
      fechaFinISO,
      precio,
      capacidadAsientos
     } = req.body;

    // Si hay múltiples imágenes, usar la primera como cover y todas como gallery
    // Si solo hay una imagen (req.urlImage), usarla como cover y gallery
    let coverImageUrl = "";
    let galleryImageUrls = [];

    if (req.imageUrls && req.imageUrls.length > 0) {
      // Múltiples imágenes subidas
      coverImageUrl = req.imageUrls[0];
      galleryImageUrls = req.imageUrls;
    } else if (req.urlImage) {
      // Una sola imagen subida
      coverImageUrl = req.urlImage;
      galleryImageUrls = [req.urlImage];
    } else {
      return res.status(400).json({ message: ["Se requiere al menos una imagen"] });
    }

    const newViaje = new Viaje({
      nombre: nombre.trim(),
      destino: destino.trim(),
      descripcion: descripcion.trim(),
      fechaInicioISO,
      fechaFinISO,
      precio: Number(precio),
      capacidadAsientos: Number(capacidadAsientos),
      coverImageUrl,
      galleryImageUrls,
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
      res.status(404).json({ message: ["Viaje no encontrado"] });
    res.json(viaje);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al obtener un viaje por ID"] });
  }
};

// Función para eliminar UN viaje por ID
export const deleteViaje = async (req, res) => {
  try {
    // Buscar el viaje
    const viaje = await Viaje.findById(req.params.id);
    if (!viaje) {
      return res.status(404).json({ message: ["Viaje no encontrado"] });
    }

    // Si tiene imágenes, borrarlas de Cloudinary
    if (viaje.galleryImageUrls && viaje.galleryImageUrls.length > 0) {
      for (const imageUrl of viaje.galleryImageUrls) {
        try {
          const urlArray = imageUrl.split("/");
          const image = urlArray[urlArray.length - 1];
          const imageName = image.split(".")[0];
          await cloudinary.uploader.destroy(imageName);
        } catch (cloudinaryError) {
          console.log("Error al eliminar imagen:", cloudinaryError);
          // Continuamos aunque falle la eliminación de alguna imagen
        }
      }
    }

    // Borrar el viaje de la BD
    const deletedViaje = await Viaje.findByIdAndDelete(req.params.id);

    if (!deletedViaje) {
      return res
        .status(404)
        .json({ message: ["Viaje no encontrado para eliminar"] });
    }

    // Respuesta final 
    return res.json(deletedViaje);
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .json({ message: ["Error al eliminar un viaje por ID"] });
  }
};


// Función para actualizar UN viaje por ID sin actualizar las imágenes
export const updateViajeWithoutImage = async (req, res) => {
  try {
    const viaje = await Viaje.findById(req.params.id);
    if (!viaje) {
      return res.status(404).json({ message: ["Viaje no encontrado"] });
    }

    const {
      nombre,
      destino,
      descripcion,
      fechaInicioISO,
      fechaFinISO,
      precio,
      capacidadAsientos
    } = req.body;

    // Obtenemos los datos a actualizar
    const dataViaje = {
      nombre: nombre ? nombre.trim() : viaje.nombre,
      destino: destino ? destino.trim() : viaje.destino,
      descripcion: descripcion ? descripcion.trim() : viaje.descripcion,
      fechaInicioISO: fechaInicioISO || viaje.fechaInicioISO,
      fechaFinISO: fechaFinISO || viaje.fechaFinISO,
      precio: precio !== undefined ? Number(precio) : viaje.precio,
      capacidadAsientos: capacidadAsientos !== undefined ? Number(capacidadAsientos) : viaje.capacidadAsientos,
      coverImageUrl: viaje.coverImageUrl,
      galleryImageUrls: viaje.galleryImageUrls,
      user: req.user.id,
    };
    const updatedViaje = await Viaje.findByIdAndUpdate(
      req.params.id,
      dataViaje,
      { new: true }
    );
    res.json(updatedViaje);
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .json({ message: ["Error al actualizar un viaje por ID"] });
  }
}; // Fin de updateViajeWithoutImage

// Función para actualizar UN viaje y las imágenes por ID
export const updateViajeWithImage = async (req, res) => {
  try {
    const viaje = await Viaje.findById(req.params.id);
    if (!viaje) {
      return res.status(404).json({ message: ["Viaje no encontrado"] });
    }

    // Verificar si hay imágenes nuevas
    let coverImageUrl = viaje.coverImageUrl;
    let galleryImageUrls = viaje.galleryImageUrls;

    if (req.imageUrls && req.imageUrls.length > 0) {
      // Eliminar imágenes antiguas de Cloudinary
      if (viaje.galleryImageUrls && viaje.galleryImageUrls.length > 0) {
        for (const oldImageUrl of viaje.galleryImageUrls) {
          try {
            const urlArray = oldImageUrl.split("/");
            const image = urlArray[urlArray.length - 1];
            const imageName = image.split(".")[0];
            await cloudinary.uploader.destroy(imageName);
          } catch (cloudinaryError) {
            console.log("Error al eliminar imagen antigua:", cloudinaryError);
            // Continuamos aunque falle la eliminación
          }
        }
      }
      // Usar las nuevas imágenes
      coverImageUrl = req.imageUrls[0];
      galleryImageUrls = req.imageUrls;
    } else if (req.urlImage) {
      // Una sola imagen nueva
      // Eliminar imágenes antiguas
      if (viaje.galleryImageUrls && viaje.galleryImageUrls.length > 0) {
        for (const oldImageUrl of viaje.galleryImageUrls) {
          try {
            const urlArray = oldImageUrl.split("/");
            const image = urlArray[urlArray.length - 1];
            const imageName = image.split(".")[0];
            await cloudinary.uploader.destroy(imageName);
          } catch (cloudinaryError) {
            console.log("Error al eliminar imagen antigua:", cloudinaryError);
          }
        }
      }
      coverImageUrl = req.urlImage;
      galleryImageUrls = [req.urlImage];
    }

    const {
      nombre,
      destino,
      descripcion,
      fechaInicioISO,
      fechaFinISO,
      precio,
      capacidadAsientos
    } = req.body;

    // Obtenemos los datos a actualizar
    const dataViaje = {
      nombre: nombre ? nombre.trim() : viaje.nombre,
      destino: destino ? destino.trim() : viaje.destino,
      descripcion: descripcion ? descripcion.trim() : viaje.descripcion,
      fechaInicioISO: fechaInicioISO || viaje.fechaInicioISO,
      fechaFinISO: fechaFinISO || viaje.fechaFinISO,
      precio: precio !== undefined ? Number(precio) : viaje.precio,
      capacidadAsientos: capacidadAsientos !== undefined ? Number(capacidadAsientos) : viaje.capacidadAsientos,
      coverImageUrl,
      galleryImageUrls,
      user: req.user.id,
    };
    const updatedViaje = await Viaje.findByIdAndUpdate(
      req.params.id,
      dataViaje,
      { new: true }
    );
    res.json(updatedViaje);
  } catch (error) {
    console.log(error);
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
