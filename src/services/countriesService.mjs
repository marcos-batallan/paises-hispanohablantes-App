import axios from "axios";

// URL de la API para obtener los países de América
const API_URL = "https://restcountries.com/v3.1/region/america";

export const getSpanishSpeakingCountries = async () => {
    try {
        // Realizar la solicitud a la API
        const response = await axios.get(API_URL);

        // Obtener la lista de países de la respuesta
        const countries = response.data;

        // Filtrar los países de América que son hispanohablantes
        const filtered = countries.filter(country => {

            // Verificar si el país tiene el idioma español en su lista de idiomas
            if(!country.languages) return false; // Si no tiene idiomas, no es hispanohablante

            return Object.values(country.languages).includes('Spanish');
        });

        // Normalizar los datos para que tengan una estructura consistente
        const normalized = filtered.map(country => ({

            name: country.translations?.spa?.common
                || country.name?.common
                || 'Sin nombre',

            officialName: country.translations?.spa?.official
                || country.name?.official
                || 'Sin nombre oficial',

            capital: country.capital?.[0] || 'Sin capital',

            region: country.region || 'Sin región',

            population: country.population || 0,

            borders: country.borders || [],

            area: country.area || 0,

            timezones: country.timezones || [],

            gini: country.gini
                ? Object.values(country.gini)[0]
                : null,

            flag: country.flags?.png || 'Sin bandera',
            
            // Dejar preparado el campo (pero se setea después)
            creador: null,        
        }));

        // Devolver la lista de países hispanohablantes normalizada
        return normalized;
    } catch (error) {
        console.error("Error al obtener los países hispanohablantes:", error.message);
        throw error; // Lanzar el error para que pueda ser manejado por el controlador
    }
};