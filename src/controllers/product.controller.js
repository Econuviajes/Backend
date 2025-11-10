import Product from "../models/products.models.js";
import { v2 as cloudinary } from "cloudinary";

// Función para obtener todos los productos
export const getProducts = async (req, res) => {
  try {
    //find = Select * from products where user = $id
    const product = await Product.find({ user: req.user.id }); //.populate('user');  Maestro detalle, traer todos los datos
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al obtener los productos"] });
  }
}; //Fin de getProducts

// Función para crear un producto
export const createProduct = async (req, res) => {
  try {
    const { name, price, quantity } = req.body;
    const newProduct = new Product({
      name,
      price,
      quantity,
      image: req.urlImage,
      user: req.user.id,
    }); //save = insert into product values (name, price, quantity);
    const savedProduct = await newProduct.save();
    res.json(savedProduct);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al crear un producto"] });
  }
}; // Fin de createProduct

// Función para obtener UN producto por ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      // No se encotró el producto en la BD
      res.status(404).json({ message: ["Producto no eonctrado"] });
    res.json(product);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al obtener un producto por ID"] });
  }
};

// Función para eliminar UN producto por ID
export const deleteProduct = async (req, res) => {
  try {
    // delete from products where id = $id
    const product = await Product.findById(req.params.id);
    if (!product)
      // No se encotró el producto en la BD
      res.status(404).json({ message: ["Producto no encontrado"] });
    res.json(product);

    // Eliminamos la imagen de cloudinary, extraemos el nombre de la imagen sin URL ni extensión
    // Obtenemos la URL de la imagen de cloudinary
    const imageURL = product.image;
    // Dividimos por diagonales / la URL y nos quedamos con el último parámetro que contiene el nombre de la imagen con la extensión
    const urlArray = imageURL.split("/");

    // image contendrá el id de la imagen en cloudinary
    const image = urlArray[urlArray.length - 1]; // Último elemento

    // Dividimos el nombre de la imagen para quitar la extensión
    const imageName = image.split(".")[0];

    // Eliminamos la imagen de cloudinary
    const result = await cloudinary.uploader.destroy(imageName);
    if (result.result === "ok") {
      // Si se eliminó la imagen, ahora eliminamos el producto
      const deletedProduct = await Product.findByIdAndDelete(req.params.id);

      if (!deletedProduct)
        // Error al eliminar el producto
        return res
          .status(404)
          .json({ message: ["Producto no encontrado para eliminar"] });
      res.json(deletedProduct);
    } else {
      // Error al eliminar la imagen
      return res
        .status(500)
        .json({ message: ["Error al eliminar la imagen del producto"] });
    } // Fin del else
  } catch (error) {
    //ConsoleLogger.log(error);
    res.status(500).json({ message: ["Error al eliminar un producto por ID"] });
  }
};

// Función para actualizar UN producto por ID sin actualizar la imagen
export const updateProductWithoutImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      // No se encotró el producto en la BD
      res.status(404).json({ message: ["Producto no encontrado"] });

    // Obtenemos los datos a actualizar
    const dataProduct = {
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      image: req.body.image,
      user: req.user.id,
    };
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      dataProduct,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    ConsoleLogger.log(error);
    res
      .status(500)
      .json({ message: ["Error al actualizar un producto por ID"] });
  }
};

// Función para actualizar UN producto y la imagen por ID
export const updateProductWithImage = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product)
      // No se encotró el producto en la BD
      res.status(404).json({ message: ["Producto no encontrado"] });

    if (!req.file)
      return res.status(500).json({
        message: ["Error al actualizar el producto, imagen no encontrada"],
      });

    // Obtenemos la URL de la imagen de cloudinary
    const imageURL = product.image;
    const urlArray = imageURL.split("/");

    const image = urlArray[urlArray.length - 1]; // Último elemento

    const imageName = image.split(".")[0];

    const result = await cloudinary.uploader.destroy(imageName);
    if (!result.result === "ok") {
      return res
        .status(500)
        .json({ message: ["Error al eliminar la imagen del producto"] });
    } // Fin del if(!result)

    // Obtenemos los datos a actualizar
    const dataProduct = {
      name: req.body.name,
      price: req.body.price,
      quantity: req.body.quantity,
      image: req.urlImage, // Actualizamos la nueva URL de la imagen
      user: req.user.id,
    };
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      dataProduct,
      { new: true }
    );
    res.json(updatedProduct);
  } catch (error) {
    res
      .status(500)
      .json({ message: ["Error al actualizar un producto por ID"] });
  }
};
//Función para obtener todos los productos de todos los usuarios
//para la compra de productos
export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: ["Error al obtener todos los productos"] });
  }
}; //Fin de getAllProducts
