import Role from "../models/roles.models.js";
import User from "../models/user.models.js";
import bcryptjs from "bcryptjs";
import dotenv from "dotenv";

export const initializeSetup = async () => {
  try {
    // Configuramos la lectura de variables de entorno
    dotenv.config();
    const roleAdmin = process.env.SETUP_ROLE_ADMIN;
    const roleUser = process.env.SETUP_ROLE_USER;

    // Buscamos si existen los roles en la BD
    const countRoles = await Role.estimatedDocumentCount();

    // Si countRoles es cero, significa que no hay roles creados
    if (countRoles == 0) {
      // Hay que crear los roles de usuarios
      console.log("Creando roles de usuarios");
      await Promise.all([
        new Role({ role: roleUser }).save(),
        new Role({ role: roleAdmin }).save(),
      ]);
    } // Fin de if(countRoles)

    // Importamos los datos del administrador inicial
    const setupAdminUsername = process.env.SETUP_ADMIN_USERNAME;
    const setupAdminPwd = process.env.SETUP_ADMIN_PWD;
    const setupAdminEmail = process.env.SETUP_ADMIN_EMAIL;

    // Buscamos si ya existe un usuario admin
    const userAdmin = await User.findOne({ username: setupAdminUsername });
    if (userAdmin == null) {
      // No existe un usuario administrador
      // Se crea un usuario admin tomando las variables del ambiente
      console.log("Creando usuario admin");
      const roleAdminDB = await Role.findOne({ role: roleAdmin });
      const passwdAdmin = await bcryptjs.hash(setupAdminPwd, 10);

      const newUserAdmin = new User({
        username: setupAdminUsername,
        email: setupAdminEmail,
        password: passwdAdmin,
        role: roleAdminDB._id,
      });
      await newUserAdmin.save();
      console.log("Roles y admin inicializado");
    } // Fin de if(serAdmin==null)
  } catch (error) {
    console.log(error);
    console.log("Error al inicializar los roles de usuario");
  }
}; // Fin de initializeSetup
