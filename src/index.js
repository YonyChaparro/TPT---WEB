import express from 'express'
import morgan from 'morgan'
import { engine } from 'express-handlebars'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import personasRoutes from './routes/personas.routes.js'
import clientesRoutes from './routes/clientes.routes.js'
import empleadosRoutes from './routes/empleados.routes.js'

// Initialización
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url));

// Configuración de Handlebars con helpers personalizados
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(__dirname, 'views', 'layouts'),
    partialsDir: join(__dirname, 'views', 'partials'),
    extname: '.hbs',
    helpers: {
        eq: (a, b) => a === b
    }
}));

app.set('view engine', '.hbs');
app.set('views', join(__dirname, 'views'));

// Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Rutas
app.get('/Personas', (req, res) => {
    res.render('indexPersona');
});

app.get('/Clientes', (req, res) => {
    res.render('indexClientes');
});

app.get('/Empleados', (req, res) => {
    res.render('indexEmpleados');
});

app.use(personasRoutes);
app.use(clientesRoutes);
app.use(empleadosRoutes);

// Archivos estáticos
app.use(express.static(join(__dirname, 'public')));

// Ejecutar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server listening on port:', PORT));
