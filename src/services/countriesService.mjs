import axios from "axios";

// URL de la API para obtener los países de América
const API_URL = "https://restcountries.com/v3.1/region/america";

// Esta función filtra los países de América que son hispanohablantes,
// normaliza sus datos y devuelve una lista de objetos con la información relevante de cada país.
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

// Esta función calcula el promedio del índice de Gini de una lista de países.
// El índice de Gini es una medida de la desigualdad en la distribución del ingreso en un país, 
// donde 0 representa igualdad perfecta y 100 representa desigualdad total.
export const calculateAverageGini = (countries) => {

    const countriesWithGini = countries.filter(
        country => country.gini !== null
    );

    if (countriesWithGini.length === 0) {
        return 0; // Evitar división por cero
    }

    const totalGini = countriesWithGini.reduce(
        (accumulator, country) =>

            accumulator + country.gini,

        0
    );

    return (totalGini / countriesWithGini.length);
};

// Esta función genera un archivo CSV a partir de una lista de países, incluyendo 
// los campos 'name', 'capital', 'region', 'population', 'gini' y 'creador'.
export const generateCountriesCSV = (countries) => {

    let csv = "Nombre,Capital,Region,Poblacion,Gini,Creador\n\n"; // Encabezados del CSV

    countries.forEach(country => { // Iterar sobre cada país para agregar su información al CSV

        // Agregar una nueva línea al CSV con los datos del país, asegurándose de manejar 
        // los casos donde los datos puedan ser nulos o no estar disponibles
        csv += 
            `"${country.name}",` + // El nombre del país, entre comillas para manejar casos donde el nombre pueda contener comas
            `"${country.capital}",` +
            `"${country.region}",` +
            `"${country.population}",` +
            `"${country.gini}",` +
            `"${country.creador}"\n`;
    });

    // Devolver el contenido del CSV generado
    return csv;
};