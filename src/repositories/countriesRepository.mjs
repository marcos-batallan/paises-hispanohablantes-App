
// Se importa la interfaz IRepository para implementar los métodos necesarios
import IRepository from './IRepository.mjs';

// Se importa el modelo de datos Country para interactuar con la base de datos
import Country from '../models/countryModel.mjs';

// Clase que extiende de IRepository, implementando los métodos para manejar los países
class CountriesRepository extends IRepository {

    // Método para obtener todos los países
    async getAll(filters = {}, options = {}) {
        const {
            skip = 0, //Número de documentos a omitir
            limit = 0, //Número máximo de documentos a retornar, 0 para sin límite
        } = options; // Desestructuración de opciones con valores predeterminados

        // Se realiza la consulta a la base de datos utilizando el modelo Country, aplicando los filtros, paginación y ordenamiento
        return await Country
            .find(filters) // Aplica los filtros proporcionados para obtener solo los países que cumplen con ciertas condiciones
            .skip(skip) // Omite los primeros 'skip' documentos, útil para paginación
            .limit(limit) // Si limit es 0, no se aplicará ningún límite a la cantidad de documentos retornados
            .sort({ name: 1 }); // Ordenar por nombre de país de forma ascendente
    }

    // Método para contar el número de países que cumplen con ciertos filtros
    async count(filters = {}) {
        return await Country.countDocuments(filters);
    }

    // Método para obtener un país por su ID
    async getById(id) {
        return await Country.findById(id);
    }

    // Método para crear un nuevo país en la base de datos
    async create(data) {
        const newCountry = new Country(data); // Se crea una nueva instancia del modelo Country con los datos proporcionados
        return await newCountry.save(); // Se guarda el nuevo país en la base de datos y se retorna el resultado
    }

    // Método para actualizar un país existente por su ID, aplicando las validaciones definidas en el modelo
    async update(id, data) {
        return await Country.findByIdAndUpdate(
            id, 
            data, 
            { 
                new: true,  // Retorna el documento actualizado en lugar del original
                runValidators: true // Asegura que se apliquen las validaciones definidas en el esquema al actualizar
            });
    }

    // Método para eliminar un país por su ID
    async delete(id) {
        return await Country.findByIdAndDelete(id);
    }

}

// Se exporta una instancia de CountriesRepository para ser utilizada en otras partes de la aplicación
export default new CountriesRepository();