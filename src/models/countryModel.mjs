import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({

    name: {
        type: String,
        required: [true, 'El nombre es obligatorio'],
        trim: true,
        validate: {
            validator: function(value) {
                return value.length >= 3
                    && value.length <= 90;
            },
            message:
                'El nombre debe tener entre 3 y 90 caracteres'
        }
    },

    officialName: {
        type: String,
        trim: true,
        validate: {
            validator: function(value) {
                return value.length >= 3
                    && value.length <= 90;
            },
            message:
                'El nombre oficial debe tener entre 3 y 90 caracteres'
        }
    },

    capital: {
        type: String,
        required: [true, 'La capital es obligatoria'],
        trim: true,
        validate: {
            validator: function(value) {
                return value.length >= 3
                    && value.length <= 90;
            },
            message:
                'La capital debe tener entre 3 y 90 caracteres'
        }
    },

    region: {
        type: String,
        trim: true,
    },

    population: {
        type: Number,
        required: [
            true,
            'La población es obligatoria'
        ],
        validate: {
            validator: function(value) {
                return Number.isInteger(value)
                    && value > 0;
            },
            message:
                'La población debe ser un número entero positivo'
        }
    },

    borders: {
        type: [String],
        validate: {
            validator: function(borders) {
                if (!borders || borders.length === 0) {
                    return true;
                }
                return borders.every(border =>
                    /^[A-Z]{3}$/.test(border)
                );
            },
            message:
                'Cada frontera debe contener 3 letras mayúsculas'
        }
    },

    area: {

        type: Number,
        required: [
            true,
            'El área es obligatoria'
        ],
        validate: {
            validator: function(value) {

                return value > 0;
            },
            message:
                'El área debe ser un número positivo'
        }
    },

    timezones: {
        type: [String],
        default: [],
    },

    gini: {
        type: Number,
        validate: {
            validator: function(value) {
                return value == null
                    || (value >= 0 && value <= 100);
            },
            message:
                'El índice Gini debe estar entre 0 y 100'
        }
    },

    /*flag: {
        type: String,
        trim: true,
    },*/

    creador: {
        type: String,
        required: [
            true,
            'El creador es obligatorio'
        ],
        trim: true,
        validate: {
            validator: function(value) {
                return value.length >= 3
                    && value.length <= 30;
            },
            message:
                'El creador debe tener entre 3 y 30 caracteres'
        }
    },

}, {
    timestamps: true,
    versionKey: false,
});

// Este índice interpreta una combinación única que no permite que un mismo usuario
// duplique elementos iguales en la base de datos 
countrySchema.index(
  { name: 1, creador: 1 },
  { unique: true }
);

export default mongoose.model(
    'Country',
    countrySchema,
    'Grupo-02'
);