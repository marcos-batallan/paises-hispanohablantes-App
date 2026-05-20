import 'dotenv/config';
import app from './src/app.mjs';
import connectDB from './src/config/dbConfig.mjs';
import { getSpanishSpeakingCountries } from './src/services/countriesService.mjs';

const PORT = process.env.PORT || 3000;

connectDB();

app.listen(PORT, () => {
  console.log(`Servidor escuchando en el puerto ${PORT}`);
});

const test = async () => {
  const data = await getSpanishSpeakingCountries();
  console.log(data);
};

test();
