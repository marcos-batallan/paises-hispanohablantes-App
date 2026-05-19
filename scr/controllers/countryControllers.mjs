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
                    name: country.nombre,
                    creador: 'Sistema'
                },
                {
                    ...country,
                    creador: 'Sistema'
                },
                {
                    // La opción upsert: true permite crear un nuevo documento si no existe uno que coincida con el filtro
                    upsert: true
                }
            );
        }
        // Devolver una respuesta indicando que los países se han guardado correctamente
        res.status(200).json({ message: "Países guardados correctamente" });

    } catch (error) {
        console.error(error);

        // Devolver una respuesta de error si ocurre algún problema al guardar los países
        res.status(500).json({ message: "Error al guardar los países" });
    }
};

// Controlador para obtener lista de todos los países almacenados en la base de datos
export const getAllCountries = async (req, res) => {
    try {
        // Obtener todos los países de la base de datos
        const countries = await countryModel.find();
        // Devolver la lista de países en la respuesta
        res.status(200).json(countries);

    } catch (error) {
        console.error(error);

        // Devolver una respuesta de error si ocurre algún problema al obtener los países
        res.status(500).json({ message: "Error al obtener los países" });
    }
};


