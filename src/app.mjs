import express from 'express';
import path from 'path';
import morgan from 'morgan';
import methodOverride from 'method-override';
import countryRoutes from './routes/countryRoutes.mjs';

const app = express();

// Configuración básica de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para registrar las solicitudes HTTP
app.use(morgan('dev'));

// Middleware para soportar métodos HTTP como PUT y DELETE
app.use(methodOverride('_method'));

// Rutas para manejar las operaciones relacionadas con los países
app.use('/countries', countryRoutes);

// Motor de vistas
app.set('view-engine', 'ejs');
app.set('views', path.resolve('src/views'));

// Archivos estáticos
app.use(express.static('public'));

export default app;