import { body } from 'express-validator';

export const countryValidationRules = [

    body('name')
        .trim()
        .notEmpty()
        .withMessage(
            'El nombre es obligatorio'
        )
        .isLength({ min: 3, max: 90 })
        .withMessage(
            'El nombre debe tener entre 3 y 90 caracteres'
        ),
    
    body('capital')
        .trim()
        .notEmpty()
        .withMessage(
            'La capital es obligatoria'
        )
        .isLength({ min: 3, max: 90 })
        .withMessage(
            'La capital debe tener entre 3 y 90 caracteres'
        ),

    body('area')
        .notEmpty()
        .withMessage(
            'El área es obligatoria'
        )
        .isFloat({ min: 0.1 }) // Acepta números decimales mayores a 0
        .withMessage(
            'El área debe ser un número positivo'
        ),

    body('population')
        .notEmpty()
        .withMessage(
            'La población es obligatoria'
        )
        .isInt({ min: 1 }) // Acepta solo números enteros mayores a 0
        .withMessage(
            'La población debe ser un número entero positivo'
        ),

    body('gini')
        .optional({ values: 'falsy' }) // Permite que el campo sea opcional, pero si se proporciona, no puede ser un valor falsy (como una cadena vacía)
        .isFloat({ min: 0, max: 100 }) // Acepta números decimales entre 0 y 100
        .withMessage(
            'El índice Gini debe estar entre 0 y 100'
        ),

    body('borders')
        .trim()
        .optional({ values: 'falsy' })
        .matches(/^([A-Z]{3})(,\s?[A-Z]{3})*$/) // Valida que sea una lista de códigos de 3 letras mayúsculas separados por comas
        .withMessage(
            'Las fronteras deben contener códigos de 3 letras mayúsculas separados por comas'
        ),

    body('timezones')
        .optional({ values: 'falsy' })
        .trim()
        .custom((value) => {

            const timezones = value
                .split(',') // Convertir la cadena en un array usando la coma como separador
                .map(tz => tz.trim()) // Eliminar espacios extra
                .filter(Boolean); // Eliminar entradas vacías

            const regex = /^UTC([+-]([0-9]|0[0-9]|1[0-4])(:[0-5][0-9])?)?$/; // Valida formatos como UTC, UTC+3, UTC-05:00, etc.

            const invalid = timezones.find(tz => !regex.test(tz)); // Busca el primer valor que no cumpla con el formato

            if (invalid) { // Si se encuentra un valor inválido, lanza un error con un mensaje específico
                throw new Error(
                    'Formato inválido en zonas horarias. Ej: UTC-3, UTC+05:00, UTC'
                );
            }

            return true;
        }),

    body('creador')
        .trim()
        .notEmpty()
        .withMessage('El creador es obligatorio')
        .isLength({ min: 3, max: 30 })
        .withMessage('El creador debe tener entre 3 y 30 caracteres')

];