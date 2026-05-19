import express from "express";
import {
    saveCountries,
    getAllCountries
} from "../controllers/countryControllers.mjs";

// Crear un router de Express para manejar las rutas relacionadas con los países
const router = express.Router();

// Ruta para cargar los países hispanohablantes de América desde la API y guardarlos en la base de datos
router.post("/load", saveCountries);

// Ruta para obtener la lista de todos los países almacenados en la base de datos
router.get("/", getAllCountries);

// Exportar el router para que pueda ser utilizado en el archivo principal de la aplicación
export default router;
