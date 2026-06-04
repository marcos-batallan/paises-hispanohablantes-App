
// Esta función toma un objeto de datos de país y normaliza los campos 'borders' y 'timezones' 
// para que sean arrays en lugar de cadenas separadas por comas.
// Si los campos no están definidos, se establecen como arrays vacíos.
export const normalizeCountryData = (data) => {

    const normalized = { ...data };

    if (normalized.borders !== undefined) { // Verifica si el campo 'borders' está definido

        normalized.borders = normalized.borders // Si 'borders' está definido, lo procesa; de lo contrario, lo establece como un array vacío

        ? normalized. borders
            .split(',') // Elimina espacios en blanco alrededor de cada frontera y filtra las entradas vacías
            .map(border => border.trim()) // Elimina espacios en blanco alrededor de cada frontera
            .filter(border => border !== '') // Filtra las entradas vacías que podrían resultar de una cadena con comas consecutivas o espacios
        : []; // Si 'borders' no está definido, lo establece como un array vacío
    }

    if (normalized.timezones !== undefined) { // Verifica si el campo 'timezones' está definido

        normalized.timezones = normalized.timezones // Si 'timezones' está definido, lo procesa; de lo contrario, lo establece como un array vacío

        ? normalized.timezones
            .split(',')
            .map(zone => zone.trim())
            .filter(zone => zone !== '')
        : [];
    }

    // Devuelve el objeto normalizado con los campos 'borders' y 'timezones' como arrays
    return normalized;
};

// Esta función construye un objeto de filtros basado en los parámetros de consulta proporcionados en el objeto 'query'.
// Los filtros se utilizan para realizar consultas en la base de datos, permitiendo buscar países por nombre, capital, región y rango de población.
export const buildCountryFilters = (query) => {

    // Extraer los parámetros de consulta para construir los filtros
    const {
        name,
        capital,
        region,
        minPopulation,
        maxPopulation,
    } = query;

    // Construir un objeto de filtros basado en los parámetros de consulta
    const filters = {};

    // Agregar un filtro fijo para el campo 'creador' que aseguran que solo se consulten los países creados por el usuario 'MarcosBat'
    // Podría mejorarse para que sea dinámico, pero por ahora lo dejo fijo para asegurar que solo se consulten los países creados por mi
    filters.creador = 'MarcosBat';

    if (name) {
        filters.name = {
            $regex: name, // Utilizar una expresión regular para buscar coincidencias parciales en el nombre del país
            $options: 'i', // 'i' para búsqueda sin distinguir mayúsculas o minúsculas
        };
    }

    if (capital) {
        filters.capital = {
            $regex: capital, // Utilizar una expresión regular para buscar coincidencias parciales en la capital del país
            $options: 'i', // 'i' para búsqueda sin distinguir mayúsculas o minúsculas
        };
    }

    if (region) {
        filters.region = region; // Filtrar por región si se proporciona
    }

    if (minPopulation || maxPopulation) { // Si se proporciona un rango de población, construir el filtro para el campo 'population'
        filters.population = {};

        if (minPopulation) {
            filters.population.$gte = Number(minPopulation); //Operador $gte para filtrar países con población mayor o igual al valor proporcionado
        }

        if (maxPopulation) {
            filters.population.$lte = Number(maxPopulation); //Operador $lte para filtrar países con población menor o igual al valor proporcionado
        }
    }

    return filters; // Devolver el objeto de filtros construido
};


// Esta función construye un objeto de paginación basado en los parámetros de consulta proporcionados en el objeto 'query'.
// La paginación se utiliza para limitar la cantidad de resultados devueltos por página y calcular el número de 
// documentos a omitir (skip) para la consulta en la base de datos.
export const buildPagination = (query) => {

    const page = Number(query.page) || 1; // Página actual, por defecto 1

    const limit = 10; // Cantidad de países por página, por defecto 10

    const skip = (page - 1) * limit; // Calcular el número de documentos a omitir para la paginación

    return { page, limit, skip }; // Devolver un objeto con la información de paginación
};

