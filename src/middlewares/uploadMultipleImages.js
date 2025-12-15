import multer from "multer";
import cloudinary from "cloudinary";

const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB por imagen
  },
}).array("images", 20); // Permite hasta 20 imágenes

export const uploadMultipleToCloudinary = async (req, res, next) => {
  try {
    const allowedMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    
    upload(req, res, async (err) => {
      if (err) {
        console.log(err);
        if (err.code == "LIMIT_FILE_SIZE") {
          return res
            .status(400)
            .json({ message: ["Tamaño del archivo excedido (máx 5MB por imagen)"] });
        } else if (err.code == "LIMIT_FILE_COUNT") {
          return res
            .status(400)
            .json({ message: ["Demasiadas imágenes (máx 20)"] });
        } else {
          return res
            .status(400)
            .json({ message: ["Error al cargar las imágenes"] });
        }
      } // Fin del if(err)

      if (!req.files || req.files.length === 0) {
        return res.status(400).json({ message: ["No se encontraron imágenes"] });
      }

      // Validar tipos de archivo
      for (const file of req.files) {
        if (!allowedMimes.includes(file.mimetype)) {
          return res
            .status(400)
            .json({ message: ["Formato de imagen no permitido"] });
        }
      }

      // Subir todas las imágenes a Cloudinary
      const uploadPromises = req.files.map(async (file) => {
        const base64Image = Buffer.from(file.buffer).toString("base64");
        const dataUri = "data:" + file.mimetype + ";base64," + base64Image;
        const uploadResponse = await cloudinary.v2.uploader.upload(dataUri);
        return uploadResponse.url;
      });

      try {
        const imageUrls = await Promise.all(uploadPromises);
        // Guardamos las URLs en el objeto request
        req.imageUrls = imageUrls;
        next();
      } catch (uploadError) {
        console.log(uploadError);
        return res
          .status(500)
          .json({ message: ["Error al subir las imágenes a Cloudinary"] });
      }
    }); //Fin del upload
  } catch (error) {
    return res.status(400).json({ message: [error.message] });
  }
};

