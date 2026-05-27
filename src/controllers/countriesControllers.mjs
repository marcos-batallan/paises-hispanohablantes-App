import countryModel from "../models/countryModel.mjs";

import { getSpanishSpeakingCountries } from "../services/countriesService.mjs";

import { validationResult } from "express-validator";


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

        const countries = await countryModel.find(filters)

            .skip(skip)

            .limit(limit)

            .sort({ name: 1 });

        // =========================
        // TOTAL DE DOCUMENTOS
        // =========================

        const totalCountries =
            await countryModel.countDocuments(filters);

        const totalPages =
            Math.ceil(totalCountries / limit);

        // =========================
        // PROMEDIO GINI
        // =========================

        const countriesWithGini =
            countries.filter(
                country =>
                    country.gini !== null
            );

        let averageGini = 0;

        if (countriesWithGini.length > 0) {

            const totalGini =
                countriesWithGini.reduce(

                    (accumulator, country) => {

                        return accumulator + country.gini;

                    },
                    0
                );

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

// Controller para renderizar el formulario de creación
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


// Controller para manejar la creación de un nuevo país
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

    // TRANSFORMAR ARRAYS //

    if (req.body.borders !== undefined) { // Solo transformar si el campo fue enviado (puede ser vacío)

        req.body.borders = req.body.borders

            ? req.body.borders
                .split(',')
                .map(border => border.trim())
                .filter(border => border !== '')
            : [];
    }

    if (req.body.timezones !== undefined) {

        req.body.timezones = req.body.timezones

            ? req.body.timezones
                .split(',')
                .map(zone => zone.trim())
                .filter(zone => zone !== '')
            : [];
    }

    // GUARDAR EN DB // 

    try {

        await countryModel.create(req.body);

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


// Controller para manejar la actualización de un país existente
export const updateCountry = async (req, res) => {

    // VALIDACIONES //

    const errors = validationResult(req);

    // TRANSFORMAR ARRAYS //

    if (req.body.borders !== undefined) { // Solo transformar si el campo fue enviado (puede ser vacío)

        req.body.borders = req.body.borders

            ? req.body.borders
                .split(',')
                .map(border => border.trim())
                .filter(border => border !== '')
            : []; // Si el campo está vacío, asignar un array vacío
    }

    if (req.body.timezones !== undefined) {

        req.body.timezones = req.body.timezones

            ? req.body.timezones
                .split(',')
                .map(zone => zone.trim())
                .filter(zone => zone !== '')
            : [];
    }

    try {

        const { id } = req.params;

        // SI HAY ERRORES //

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

        // ACTUALIZAR //

        await countryModel.findByIdAndUpdate(
            id,
            req.body,
            {
                new: true,
                runValidators: true
            }
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


// Controller para renderizar el formulario de edición
export const renderEdit = async (req, res) => {

    try {

        const { id } = req.params;

        const country = await countryModel.findById(id);

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


// Controller para eliminar un país
export const deleteCountry = async (req, res) => {

    try {

        const { id } = req.params;

        await countryModel.findByIdAndDelete(id);

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


// Controller para exportar la lista de países a CSV
export const exportCountriesCSV = async (req, res) => {

    try {

        // Obtener todos los países (sin filtros para exportar todo)
        const countries =
            await countryModel.find();

        // Encabezados CSV
        let csv =
            'Nombre,Capital,Region,Poblacion,Gini\n';

        // Filas
        countries.forEach(country => {

            csv +=
                `"${country.name || ''}",` +

                `"${country.capital || ''}",` +

                `"${country.region || ''}",` +

                `"${country.population || ''}",` +

                `"${country.gini || ''}"\n`;

        });

        // Headers descarga
        res.header(
            'Content-Type',
            'text/csv'
        );

        // Forzar descarga con nombre de archivo
        res.attachment('countries.csv');
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
