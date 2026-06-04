import { validationResult } from "express-validator";

import countriesRepository from "../repositories/countriesRepository.mjs";

import { 
    normalizeCountryData, 
    buildCountryFilters,
    buildPagination
} from "../helpers/countriesHelper.mjs";

import { 
    calculateAverageGini,
    generateCountriesCSV
} from "../services/countriesService.mjs";


// CONTROLLER PARA RENDERIZAR EL DASHBOARD DE PAÍSES, APLICANDO FILTROS Y PAGINACIÓN //
export const renderDashboard = async (req, res) => {

    try {

        // Construir los filtros a partir de los parámetros de consulta utilizando la función helper
        const filters = buildCountryFilters(req.query) ;


        // Construir las opciones de paginación (page, limit, skip) a partir de los parámetros de consulta utilizando la función helper
        const { page, limit, skip } = buildPagination(req.query) ;


        // Consultar la base de datos utilizando el repositorio, pasando los filtros y las opciones de paginación (skip y limit)
        const countries = await countriesRepository.getAll(
            filters,
            { 
                skip,
                limit 
            }
        );

        // Contar el total de países que coinciden con los filtros para calcular el total de páginas necesarias para la paginación
        const totalCountries =
            await countriesRepository.count(filters);
   
        // Total de páginas necesarias para mostrar todos los países que coinciden con los filtros.
        // Podría vivir en el herlper, pero como es algo específico de esta consulta lo dejo aquí por ahora
        const totalPages =
            Math.ceil(totalCountries / limit); // Redondear hacia arriba para obtener el total de páginas necesarias

        // Llamar al servicio para calcular el promedio de Gini
        const averageGini = calculateAverageGini(countries);


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

        // Si hay errores de validación, volver a renderizar el formulario de edición 
        // con los datos ingresados y los mensajes de error correspondientes.
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
        // Construir los filtros a partir de los parámetros de consulta utilizando la función helper
        const filters = buildCountryFilters(req.query);

        // Consultar la base de datos utilizando el repositorio, pasando los filtros aplicados.
        const countries = await countriesRepository.getAll(filters);

        // Llamar al servicio para generar el CSV a partir de la lista de países filtrados
        const csv = generateCountriesCSV(countries);

        // Configurar las cabeceras para indicar que se está enviando un archivo CSV
        res.header(
            'Content-Type',
            'text/csv'
        );

        // Configugar la descarga del archivo con un nombre específico countries.csv
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
