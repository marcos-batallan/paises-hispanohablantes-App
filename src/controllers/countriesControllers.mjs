import { validationResult } from "express-validator";

import countriesRepository from "../repositories/countriesRepository.mjs";

import { normalizeCountryData } from "../helpers/countriesHelper.mjs";


// Controller para renderizar el dashboard con la lista de países
export const renderDashboard = async (req, res) => {

    try {

        // =========================
        // FILTROS
        // =========================

        const {
            name,
            capital,
            region,
            minPopulation,
            maxPopulation
        } = req.query;

        // Query dinámica
        const filters = {};

        // Solo mostrar países creados por el usuario (en este caso, "MarcosBat")
        filters.creador = 'MarcosBat';

        // Nombre
        if (name) {

            filters.name = {
                $regex: name,
                $options: 'i'
            };
        }

        // Capital
        if (capital) {

            filters.capital = {
                $regex: capital,
                $options: 'i'
            };
        }

        // Región
        if (region) {

            filters.region = region;
        }

        // Población
        if (minPopulation || maxPopulation) {

            filters.population = {};

            if (minPopulation) {

                filters.population.$gte =
                    Number(minPopulation);
            }

            if (maxPopulation) {

                filters.population.$lte =
                    Number(maxPopulation);
            }
        }

        // =========================
        // PAGINACIÓN
        // =========================

        const page =
            Number(req.query.page) || 1;

        const limit = 10;

        const skip =
            (page - 1) * limit;

        // =========================
        // CONSULTA
        // =========================

        const countries = await countriesRepository.getAll(
            filters,
            { 
                skip,
                limit 
            }
        );

        // =========================
        // TOTAL DE DOCUMENTOS
        // =========================

        const totalCountries =
            await countriesRepository.count(filters);

        const totalPages =
            Math.ceil(totalCountries / limit); // Redondear hacia arriba para obtener el total de páginas necesarias

        // =========================
        // PROMEDIO GINI
        // =========================
        
        // Filtrar solo los países que tienen un valor de índice Gini definido (no nulo)
        const countriesWithGini =
            countries.filter(
                country =>
                    country.gini !== null // Asegura que el país tenga un valor de índice Gini definido
            );

        let averageGini = 0;

        if (countriesWithGini.length > 0) {

            const totalGini =
                countriesWithGini.reduce( // Sumar los valores de índice Gini de los países filtrados

                    (accumulator, country) => { // El acumulador comienza en 0 y se va sumando el índice Gini de cada país

                        return accumulator + country.gini; // Sumar el índice Gini del país actual al acumulador

                    },
                    0 // Valor inicial del acumulador, en este caso 0 para comenzar la suma
                );
            
            // Calcular el promedio dividiendo la suma total del índice Gini entre la cantidad de países que tienen ese dato
            averageGini =
                totalGini / countriesWithGini.length;
        }

        // =========================
        // RENDER
        // =========================

        res.render(
            'countries/dashboard',
            {
                title: 'Dashboard',
                countries,
                filters: req.query,
                averageGini,
                page,
                totalPages
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).render(
            'feedback/feedback',
            {
                type: 'error',
                title: 'Error inesperado',
                message: 'No se pudo cargar el dashboard.',
                redirect: '/countries'
            }
        );
    }
};


// CONTROLLER PARA RENDERIZAR EL FORMULARIO DE CREACIÓN DE UN NUEVO PAÍS //
export const renderCreate = (req, res) => {

    res.render(
        'countries/create',
        {
            title: 'Crear País',
            oldData: {},
            errors: {}
        }
    );

};


// CONTROLLER PARA CREAR UN NUEVO PAÍS //
export const createCountry = async (req, res) => {

    // VALIDACIONES //
    const errors = validationResult(req);

    // Si hay errores
    if (!errors.isEmpty()) {

        return res.render(
            'countries/create',
            {
                title: 'Crear País',
                // Mantener valores escritos
                oldData: req.body,
                // Errores organizados por campo
                errors: errors.mapped()
            }
        );
    }

    // Transformar campos 'borders' y 'timezones' en arrays utilizando la función de normalización.
    const normalizedData = normalizeCountryData(req.body);

    // GUARDAR EN DB // 
    try {

        await countriesRepository.create(normalizedData); // Guardar el país utilizando el repositorio, pasando los datos normalizados.

        res.render(
            'feedback/feedback',
            {
                type: 'success',
                title: 'País creado',
                message: 'El país fue agregado correctamente.',
                redirect: '/countries'
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).render(
            'feedback/feedback',
            {
                type: 'error',
                title: 'Error al crear',
                message: 'No se pudo guardar el país.',
                redirect: '/countries/create'
            }
        );

    }

};


// CONTROLLER PARA MANEJAR LA ACTUALIZACIÓN DE UN PAÍS EXISTENTE //
export const updateCountry = async (req, res) => {

    // VALIDACIONES //
    const errors = validationResult(req);

    // Transformar campos 'borders' y 'timezones' en arrays utilizando la función de normalización.
    const normalizedData = normalizeCountryData(req.body);

    try {

        const { id } = req.params;

        // Si hay errores de validación, volver a renderizar el formulario de edición con los datos ingresados y los mensajes de error correspondientes.
        if (!errors.isEmpty()) {

            return res.render(
                'countries/edit',
                {
                    title: 'Editar País',
                    country: {
                        _id: id
                    },
                    oldData: req.body,
                    errors: errors.mapped()
                }
            );
        }

        // Actualizar el país utilizando el repositorio, pasando el ID del país a actualizar y los datos normalizados.
        await countriesRepository.update(
            id, 
            normalizedData
        );

        res.render(
            'feedback/feedback',
            {
                type: 'success',
                title: 'País actualizado',
                message:
                    'Los datos fueron actualizados correctamente.',
                redirect: '/countries'
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).render(
            'feedback/feedback',
            {
                type: 'error',
                title: 'Error al actualizar',
                message:
                    'No se pudo actualizar el país.',
                redirect: '/countries'
            }
        );
    }
};


// CONTROLLER PARA RENDERIZAR EL FORMULARIO DE EDICIÓN DE UN PAÍS EXISTENTE //
export const renderEdit = async (req, res) => {

    try {

        const { id } = req.params;

        const country = await countriesRepository.getById(id);

        if (!country) {

            return res.status(404).render(
                'feedback/feedback',
                {
                    type: 'error',
                    title: 'País no encontrado',
                    message: 'El país solicitado no existe.',
                    redirect: '/countries'
                }
            );

        }

        res.render(
            'countries/edit',
            {
                title: 'Editar País',
                country,
                oldData: country,
                errors: {}
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).render(
            'feedback/feedback',
            {
                type: 'error',
                title: 'Error inesperado',
                message: 'No se pudo cargar el formulario.',
                redirect: '/countries'
            }
        );

    }

};


// CONTROLLER PARA ELIMINAR UN PAÍS //
export const deleteCountry = async (req, res) => {

    try {

        const { id } = req.params;

        await countriesRepository.delete(id);

        // Log para confirmar que el país fue eliminado correctamente
        console.log(`País con ID ${id} eliminado correctamente.`);

        res.render(
            'feedback/feedback',
            {
                type: 'success',
                title: 'País eliminado',
                message: 'El país fue eliminado correctamente.',
                redirect: '/countries'
            }
        );

    } catch (error) {

        console.error(error);

        res.status(500).render(
            'feedback/feedback',
            {
                type: 'error',
                title: 'Error al eliminar',
                message: 'No se pudo eliminar el país.',
                redirect: '/countries'
            }
        );

    }

};


// CONTROLLER PARA EXPORTAR LOS PAÍSES FILTRADOS A UN ARCHIVO CSV //
export const exportCountriesCSV = async (req, res) => {

    try {
        // =========================
        // FILTROS
        // =========================

        const {
            name,
            capital,
            region,
            minPopulation,
            maxPopulation
        } = req.query;

        const filters = {};

        // Solo mis países

        filters.creador = 'MarcosBat';

        // Nombre

        if (name) {
            filters.name = {
                $regex: name, // Permite buscar coincidencias parciales en el nombre del país (por ejemplo, "arg" coincidiría con "Argentina")
                $options: 'i' // Hace que la búsqueda no distinga entre mayúsculas y minúsculas, por lo que "argentina", "Argentina" o "ARGENTINA" serían considerados iguales
            };
        }

        // Capital

        if (capital) {
            filters.capital = {
                $regex: capital,
                $options: 'i'
            };
        }

        // Región

        if (region) {
            filters.region = region;
        }

        // Población

        if (
            minPopulation || // Si se especifica un valor mínimo o máximo de población, se crea un objeto de filtros para la población
            maxPopulation
        ) {

            filters.population = {};
            if (minPopulation) {

                filters.population.$gte = // El operador $gte (greater than or equal) se utiliza para filtrar países cuya población sea mayor o igual al valor especificado en minPopulation
                    Number(minPopulation);
            }

            if (maxPopulation) {

                filters.population.$lte = // El operador $lte (less than or equal) se utiliza para filtrar países cuya población sea menor o igual al valor especificado en maxPopulation
                    Number(maxPopulation);
            }
        }

        // =========================
        // CONSULTA
        // =========================

        const countries =
            await countriesRepository.getAll(
                filters
            );

        // =========================
        // CSV
        // =========================

        let csv =
            'Nombre,Capital,Region,Poblacion,Gini,Creador\n';

        // Filas
        countries.forEach(Country => {

            csv +=
                `"${Country.name || ''}",` +

                `"${Country.capital || ''}",` +

                `"${Country.region || ''}",` +

                `"${Country.population || ''}",` +

                `"${Country.gini || ''}",` +
                
                `"${Country.creador || ''}"\n`;

        });

        // Headers descarga
        res.header(
            'Content-Type',
            'text/csv'
        );

        // Forzar descarga con nombre de archivo
        res.attachment('countries.csv');

        //Log para verificar el contenido del CSV generado
        console.log(`CSV exportado con ${countries.length} registros`);

        // Enviar el contenido CSV
        res.send(csv);

    } catch (error) {

        console.error(error);

        res.status(500).render(
            'feedback/feedback',
            {
                type: 'error',
                title: 'Error exportando CSV',
                message:
                    'No se pudo exportar el archivo.',
                redirect: '/countries'
            }
        );
    }
};
