import 'dotenv/config';
import app from './src/app.mjs';
import connectDB from './src/config/dbConfig.mjs';
import { getSpanishSpeakingCountries } from './src/services/countriesService.mjs';

// Puerto en el que se ejecutará el servidor
const PORT = process.env.PORT || 3000;

// Conectar a la base de datos antes de iniciar el servidor
connectDB();

// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

// Función de prueba para verificar que la función getSpanishSpeakingCountries funciona correctamente
const test = async () => {
  const data = await getSpanishSpeakingCountries();
  console.log(`Se cargaron ${data.length} países`);
};

test();
