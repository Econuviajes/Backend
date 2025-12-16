import multer from "multer";
import cloudinary from "cloudinary";

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpeg",
      "image/jpg",
      "image/png",
      "image/gif",
      "image/webp",
    ];
    if (!allowedMimes.includes(file.mimetype)) {
      return cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE", file.fieldname));
    }
    cb(null, true);
  },
}).fields([
  { name: "image", maxCount: 1 },  // ✅ por si mandas "image"
  { name: "images", maxCount: 10 } // ✅ por si mandas "images" (tu caso)
]);

export const uploadToCloudinary = (req, res, next) => {
  upload(req, res, async (err) => {
    try {
      if (err) {
        console.log(err);

        if (err.code === "LIMIT_FILE_SIZE") {
          return res.status(400).json({ message: ["Tamaño del archivo excedido (máx 5MB)"] });
        }

        // Si cae aquí por tipo no permitido o campo raro
        return res.status(400).json({ message: ["Error al cargar la imagen"] });
      }

      // Multer con .fields() deja archivos en req.files
      const fileFromImage = req.files?.image?.[0];
      const fileFromImages = req.files?.images?.[0];

      const file = fileFromImage || fileFromImages;

      if (!file) {
        return res.status(400).json({ message: ["No se encontró la imagen"] });
      }

      // Convertir a base64 para subir a Cloudinary
      const base64Image = Buffer.from(file.buffer).toString("base64");
      const dataUri = `data:${file.mimetype};base64,${base64Image}`;

      const uploadResponse = await cloudinary.v2.uploader.upload(dataUri);

      // Guardamos URL para controller
      req.urlImage = uploadResponse.url;

      // Por compatibilidad: si tu controller checa req.file
      req.file = file;

      return next();
    } catch (error) {
      console.log(error);
      return res.status(400).json({ message: [error.message] });
    }
  });
};
