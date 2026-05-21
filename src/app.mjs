import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import methodOverride from 'method-override';
import expressLayouts from 'express-ejs-layouts';
import countryRoutes from './routes/countriesRoutes.mjs';

// Crear una instancia de Express
const app = express();

// Obtener el nombre del archivo y el directorio actual
const __filename = fileURLToPath(import.meta.url);

// Obtener el directorio actual
const __dirname = path.dirname(__filename);

// Configuración básica de Express
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para registrar las solicitudes HTTP
app.use(morgan('dev'));

// Middleware para soportar métodos HTTP como PUT y DELETE
app.use(methodOverride('_method'));

// Rutas para manejar las operaciones relacionadas con los países
app.use('/countries', countryRoutes);

// Configuración de EJS como motor de plantillas
app.set('view engine', 'ejs');

// Configuración de express-ejs-layouts para usar un layout principal
app.use(expressLayouts);
app.set('layout', 'layouts/main');

// Configurar la carpeta de vistas
app.set('views', path.join(__dirname, 'views'));

// Archivos estáticos
app.use(express.static(path.join(__dirname, '../public')));

// Ruta para la página de inicio
app.get('/', (req, res) => {
    res.render('home', {
        title: 'Inicio'
    });
});

export default app;