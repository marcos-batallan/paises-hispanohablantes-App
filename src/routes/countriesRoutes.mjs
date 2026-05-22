import express from "express";

import {
    renderDashboard,
    renderCreate,
    createCountry,
    renderEdit,
    //saveCountries,
    //getAllCountries,
    updateCountry,
    deleteCountry,

} from "../controllers/countriesControllers.mjs";

// Crear un router de Express para manejar las rutas relacionadas con los países
const router = express.Router();

// Ruta para renderizar el dashboard con la lista de países
router.get("/", renderDashboard);

// Ruta para renderizar el formulario de creación de un nuevo país
router.get('/create', renderCreate);

// Ruta para manejar la creación de un nuevo país
router.post('/create', createCountry);

// Ruta para renderizar el formulario de edición de un país existente
router.get('/edit/:id', renderEdit);

// Ruta para manejar la actualización de un país existente por su ID
router.put("/:id", updateCountry);

// Ruta para manejar la eliminación de un país por su ID
router.delete("/:id", deleteCountry);

/*
// Ruta para cargar los países hispanohablantes de América desde la API y guardarlos en la base de datos (JSON)
router.post("/load", saveCountries);

// Ruta para obtener la lista de todos los países almacenados en la base de datos (JSON)
router.get("/json", getAllCountries);
*/


// Exportar el router para que pueda ser utilizado en el archivo principal de la aplicación
export default router;
