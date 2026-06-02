
// Contrato para el repositorio, define los métodos que deben ser implementados por cualquier clase que herede de IRepository
class IRepository {

    // Método para obtener todos los registros
    async getAll() {
        throw new Error('Method not implemented');
    }

    // Método para obtener un registro por su ID
    async getById(id) {
        throw new Error('Method not implemented');
    }

    // Método para crear un nuevo registro
    async create(data) {
        throw new Error('Method not implemented');
    }

    // Método para actualizar un registro existente por su ID
    async update(id, data) {
        throw new Error('Method not implemented');
    }

    // Método para eliminar un registro por su ID
    async delete(id) {
        throw new Error('Method not implemented');
    }
}

export default IRepository;