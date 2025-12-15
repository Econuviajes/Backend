import Cliente from "../models/cliente.models.js";
import { v2 as cloudinary } from "cloudinary";

// Función para obtener todos los clientes
export const getClientes = async (req, res) => {
  try {
    const clientes = await Cliente.find().sort({ createdAt: -1 });
    res.json(clientes);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al obtener los clientes"] });
  }
};

// Función para crear un cliente
export const createCliente = async (req, res) => {
  try {
    const {
      nombre,
      apellidos,
      telefono,
      email,
      curp,
      rfc,
      fechaNacimientoISO,
      notas,
      status,
    } = req.body;

    const newCliente = new Cliente({
      nombre: nombre.trim(),
      apellidos: apellidos.trim(),
      telefono: telefono.trim(),
      email: email ? email.trim().toLowerCase() : undefined,
      curp: curp ? curp.trim().toUpperCase() : undefined,
      rfc: rfc ? rfc.trim().toUpperCase() : undefined,
      fechaNacimientoISO: fechaNacimientoISO || undefined,
      notas: notas ? notas.trim() : undefined,
      status: status || "Activo",
      avatarUrl: req.urlImage || undefined,
    });

    const savedCliente = await newCliente.save();
    res.json(savedCliente);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al crear el cliente"] });
  }
};

// Función para obtener UN cliente por ID
export const getClienteById = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: ["Cliente no encontrado"] });
    }
    res.json(cliente);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al obtener el cliente"] });
  }
};

// Función para actualizar un cliente SIN actualizar la imagen
export const updateClienteWithoutImage = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: ["Cliente no encontrado"] });
    }

    const {
      nombre,
      apellidos,
      telefono,
      email,
      curp,
      rfc,
      fechaNacimientoISO,
      notas,
      status,
    } = req.body;

    const dataCliente = {
      nombre: nombre ? nombre.trim() : cliente.nombre,
      apellidos: apellidos ? apellidos.trim() : cliente.apellidos,
      telefono: telefono ? telefono.trim() : cliente.telefono,
      email:
        email !== undefined
          ? email.trim()
            ? email.trim().toLowerCase()
            : undefined
          : cliente.email,
      curp:
        curp !== undefined
          ? curp.trim()
            ? curp.trim().toUpperCase()
            : undefined
          : cliente.curp,
      rfc:
        rfc !== undefined
          ? rfc.trim()
            ? rfc.trim().toUpperCase()
            : undefined
          : cliente.rfc,
      fechaNacimientoISO:
        fechaNacimientoISO !== undefined
          ? fechaNacimientoISO
          : cliente.fechaNacimientoISO,
      notas: notas !== undefined ? notas.trim() || undefined : cliente.notas,
      status: status || cliente.status,
      avatarUrl: cliente.avatarUrl,
    };

    const updatedCliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      dataCliente,
      { new: true }
    );
    res.json(updatedCliente);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al actualizar el cliente"] });
  }
};

// Función para actualizar un cliente Y la imagen
export const updateClienteWithImage = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: ["Cliente no encontrado"] });
    }

    // Si no hay imagen nueva, no actualizamos el avatar
    if (!req.urlImage) {
      return res.status(400).json({
        message: ["Error al actualizar el cliente, imagen no encontrada"],
      });
    }

    // Eliminar imagen anterior de Cloudinary si existe
    if (cliente.avatarUrl) {
      try {
        const imageURL = cliente.avatarUrl;
        const urlArray = imageURL.split("/");
        const image = urlArray[urlArray.length - 1];
        const imageName = image.split(".")[0];
        await cloudinary.uploader.destroy(imageName);
      } catch (cloudinaryError) {
        console.log("Error al eliminar imagen anterior:", cloudinaryError);
        // Continuamos aunque falle la eliminación
      }
    }

    const {
      nombre,
      apellidos,
      telefono,
      email,
      curp,
      rfc,
      fechaNacimientoISO,
      notas,
      status,
    } = req.body;

    const dataCliente = {
      nombre: nombre ? nombre.trim() : cliente.nombre,
      apellidos: apellidos ? apellidos.trim() : cliente.apellidos,
      telefono: telefono ? telefono.trim() : cliente.telefono,
      email:
        email !== undefined
          ? email.trim()
            ? email.trim().toLowerCase()
            : undefined
          : cliente.email,
      curp:
        curp !== undefined
          ? curp.trim()
            ? curp.trim().toUpperCase()
            : undefined
          : cliente.curp,
      rfc:
        rfc !== undefined
          ? rfc.trim()
            ? rfc.trim().toUpperCase()
            : undefined
          : cliente.rfc,
      fechaNacimientoISO:
        fechaNacimientoISO !== undefined
          ? fechaNacimientoISO
          : cliente.fechaNacimientoISO,
      notas: notas !== undefined ? notas.trim() || undefined : cliente.notas,
      status: status || cliente.status,
      avatarUrl: req.urlImage,
    };

    const updatedCliente = await Cliente.findByIdAndUpdate(
      req.params.id,
      dataCliente,
      { new: true }
    );
    res.json(updatedCliente);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al actualizar el cliente"] });
  }
};

// Función para eliminar un cliente
export const deleteCliente = async (req, res) => {
  try {
    const cliente = await Cliente.findById(req.params.id);
    if (!cliente) {
      return res.status(404).json({ message: ["Cliente no encontrado"] });
    }

    // Si tiene avatar, borrarlo de Cloudinary
    if (cliente.avatarUrl) {
      try {
        const imageURL = cliente.avatarUrl;
        const urlArray = imageURL.split("/");
        const image = urlArray[urlArray.length - 1];
        const imageName = image.split(".")[0];
        await cloudinary.uploader.destroy(imageName);
      } catch (cloudinaryError) {
        console.log("Error al eliminar avatar:", cloudinaryError);
        // Continuamos aunque falle la eliminación
      }
    }

    const deletedCliente = await Cliente.findByIdAndDelete(req.params.id);
    if (!deletedCliente) {
      return res
        .status(404)
        .json({ message: ["Cliente no encontrado para eliminar"] });
    }

    return res.json(deletedCliente);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: ["Error al eliminar el cliente"] });
  }
};
