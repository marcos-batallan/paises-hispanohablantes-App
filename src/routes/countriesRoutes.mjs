import express from "express";
import {
    saveCountries,
    getAllCountries,
    updateCountry,
    deleteCountry,
    renderDashboard
} from "../controllers/countriesControllers.mjs";

// Crear un router de Express para manejar las rutas relacionadas con los países
const router = express.Router();

// Ruta para renderizar el dashboard con la lista de países (HTML)
router.get("/", renderDashboard);

// Ruta para cargar los países hispanohablantes de América desde la API y guardarlos en la base de datos (JSON)
router.post("/load", saveCountries);

// Ruta para obtener la lista de todos los países almacenados en la base de datos (JSON)
router.get("/json", getAllCountries);

// Ruta para actualizar un país por su ID (JSON)
router.put("/:id", updateCountry);

// Ruta para eliminar un país por su ID (JSON)
router.delete("/:id", deleteCountry);

// Exportar el router para que pueda ser utilizado en el archivo principal de la aplicación
export default router;
