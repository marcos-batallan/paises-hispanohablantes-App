import countryModel from "../models/countryModel.mjs";
import { getSpanishSpeakingCountries } from "../services/countriesService.mjs";

// Crear una instancia del modelo de país
export const saveCountries = async (req, res) => {
    try {

        // Obtener los países hispanohablantes de América desde la API
        const countries = await getSpanishSpeakingCountries();
        // Guardar cada país en la base de datos, evitando duplicados por nombre y creador
        for (const country of countries) {

            await countryModel.updateOne(
                {
                    name: country.name,
                    creador: null // Aquí se puede reemplazar con el ID, Nombre o Nick del usuario autenticado si se implementa autenticación
                },
                {
                    ...country, // Usar el operador spread para mantener la estructura del país y agregar el campo creador
                    creador: null
                },
                {
                    upsert: true // La opción upsert: true permite crear un nuevo documento si no existe uno que coincida con el filtro
                }
            );
        }
        // Devolver una respuesta indicando que los países se han guardado correctamente
        res.status(200).json({ message: "Países guardados correctamente" });

    } catch (error) {
        console.error(error);

        // Devolver una respuesta de error si ocurre algún problema al guardar los países
        res.status(500).json({
            message: "Error al guardar los países",
            error: error.message,
        });
    }
};

// Controlador para obtener lista de todos los países almacenados en la base de datos (JSON)
export const getAllCountries = async (req, res) => {
    try {
        // Obtener todos los países de la base de datos
        const countries = await countryModel.find();
        // Devolver la lista de países en la respuesta
        res.status(200).json(countries);

    } catch (error) {
        console.error(error);

        // Devolver una respuesta de error si ocurre algún problema al obtener los países
        res.status(500).json({
            message: "Error al obtener los países",
            error: error.message,
        });
    }
};

// Controlador para actualizar un país por su ID (JSON)
export const updateCountry = async (req, res) => {
    try {
        // Obtener el ID del país a actualizar desde los parámetros de la ruta
        const { id } = req.params;
        // Actualizar el país en la base de datos con los datos proporcionados en el cuerpo de la solicitud
        const updatedCountry = await countryModel.findByIdAndUpdate(id, req.body, {
            // La opción new: true devuelve el documento actualizado en lugar del original
            new: true,
            // La opción runValidators: true asegura que se apliquen las validaciones definidas en el esquema del modelo al actualizar el documento
            runValidators: true
        });

        if (!updatedCountry) {
            return res.status(404).json({ message: "País no encontrado" });
        }

        res.status(200).json(updatedCountry);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al actualizar el país",
            error: error.message
        });
    }
};

// Controlador para eliminar un país por su ID (JSON)
export const deleteCountry = async (req, res) => {
    try {
        // Obtener el ID del país a eliminar desde los parámetros de la ruta
        const { id } = req.params;
        // Eliminar el país de la base de datos por su ID
        const deletedCountry = await countryModel.findByIdAndDelete(id);

        if (!deletedCountry) {
            return res.status(404).json({ message: "País no encontrado" });
        }

        res.status(200).json({ message: "País eliminado correctamente" });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error al eliminar el país",
            error: error.message
        });
    }
};

// Controlador para renderizar el dashboard con la lista de países (HTML)
export const renderDashboard = async (req, res) => {
    try {
        // Obtener todos los países de la base de datos, ordenados por nombre
        const countries = await countryModel.find(
            {
                capital: { $exists: true, $ne: '' } // Filtrar países que tienen un campo capital definido y no vacío  }
            })
            .sort({ name: 1 }); // Ordenar por nombre de país en orden ascendente

            // Renderizar la vista del dashboard con la lista de países
            res.render("countries/dashboard", {
                title: "Dashboard",
                countries
            });

    } catch (error) {
        // Manejar errores y renderizar una vista de error si ocurre algún problema al cargar el dashboard
        res.status(500).render('feedback/feedback', {
            type: 'error',
            title: 'Error inesperado',
            message: 'No se pudo completar la operación.',
            redirect: '/countries/dashboard'
        });
    }
};


