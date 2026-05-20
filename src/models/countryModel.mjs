import mongoose from "mongoose";

const countrySchema = new mongoose.Schema({

    name: {
        type: String,
        required: true,
        trim: true,
    },
    officialName: {
        type: String,
        trim: true,
    },
    capital: {
        type: String,
        trim: true,
    },
    region: {
        type: String,
        trim: true,
    },
    population: {
        type: Number,
        min: 0,
    },
    borders: {
        type: [String],
        default: [],
    },
    area: {
    type: Number,
    min: 0
    },
    timezones: {
        type: [String],
        default: [],
    },
    gini: {
        type: Number,
        min: 0,
        max: 100
    },
    flag: {
        type: String,
        trim: true,
    },
    creador: {
        type: String,
        required: true,
        trim: true,
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