import mongoose from 'mongoose';
import dns from 'node:dns/promises';

// Solución a la conexión DNS
dns.setServers(["1.1.1.1", "8.8.8.8"]);

// Función para conectar a MongoDB
const connectDB = async () => {
    try {
        // Intentar conectar a MongoDB
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Conexión a MongoDB establecida');
        
    } catch (error) {
        // Manejar errores de conexión
        console.error('Error al conectar a MongoDB:', error);
        process.exit(1); // Salir del proceso con error
    }
};

// Exportar la función de conexión
export default connectDB;