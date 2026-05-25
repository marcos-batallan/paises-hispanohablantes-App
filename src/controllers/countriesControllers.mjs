import countryModel from "../models/countryModel.mjs";

import { getSpanishSpeakingCountries } from "../services/countriesService.mjs";

import { validationResult } from "express-validator";


// Controller para renderizar el dashboard con la lista de países
export const renderDashboard = async (req, res) => {

    try {

        const countries = await countryModel.find({

            capital: {
                $exists: true,
                $ne: ''
            }

        })
        .sort({ name: 1 });

        res.render(
            'countries/dashboard',
            {
                title: 'Dashboard',
                countries
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

    if (req.body.borders) {
        req.body.borders = req.body.borders
            .split(',') // Convertir la cadena en un array usando la coma como separador
            .map(border => border.trim()) // Eliminar espacios extra
            .filter(border => border !== ''); // Eliminar entradas vacías
    }

    if (req.body.timezones) {
        req.body.timezones = req.body.timezones
            .split(',')
            .map(tz => tz.trim()) // Eliminar espacios extra
            .filter(tz => tz !== ''); // Eliminar entradas vacías
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

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.render('countries/edit', {
            title: 'Editar País',
            country: { _id: req.params.id },
            oldData: req.body,
            errors: errors.mapped()
        });
    }

    try {

        const { id } = req.params;

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
                message: 'Los datos fueron actualizados correctamente.',
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
                message: 'No se pudo actualizar el país.',
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

