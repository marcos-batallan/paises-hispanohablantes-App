import 'dotenv/config';
import app from './scr/app.mjs';
import connectDB from './scr/config/dbConfig.mjs';
import { getSpanishSpeakingCountries } from './scr/services/countriesService.mjs';

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
