import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import morgan from 'morgan';
import methodOverride from 'method-override';
import expressLayouts from 'express-ejs-layouts';

import countryRoutes from './routes/countriesRoutes.mjs';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =========================
// MIDDLEWARES
// =========================

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(morgan('dev'));

app.use(methodOverride('_method'));

// =========================
// EJS + LAYOUTS
// =========================

app.set('view engine', 'ejs');

app.use(expressLayouts);

app.set('layout', './layouts/main');

app.set('views', path.join(__dirname, 'views'));

// =========================
// STATIC FILES
// =========================

app.use(express.static(path.join(__dirname, '../public')));

// =========================
// ROUTES
// =========================

// Ruta para la página de inicio
app.get('/', (req, res) => {
    res.render('home', {
        title: 'Inicio'
    });
});

// Ruta para la página "Acerca de"
app.get('/about', (req, res) => {
    res.render('about', {
        title: 'Acerca de'
    });
});

// Rutas relacionadas con los países
app.use('/countries', countryRoutes);


export default app;