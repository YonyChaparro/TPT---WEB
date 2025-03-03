import express from 'express'
import morgan from 'morgan'
import { engine } from 'express-handlebars'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import personasRoutes from './routes/personas.routes.js'
import clientesRoutes from './routes/clientes.routes.js'
import empleadosRoutes from './routes/empleados.routes.js'
import sociosRoutes from './routes/socios.routes.js'
import proveedoresRoutes from './routes/proveedores.routes.js'
import Tipo_AlquilerRoutes from './routes/Tipo_Alquiler.routes.js'
import Tipo_VehiculoRoutes from './routes/Tipo_Vehiculo.routes.js'
import vehiculoRoutes from './routes/vehiculos.routes.js'
import TallerRoutes from './routes/taller.routes.js'
import MantenimientoRoutes from './routes/mantenimiento.routes.js'
import alquilerRoutes from './routes/alquiler.routes.js'
import facturaRoutes from './routes/factura.routes.js'
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

app.get('/Socios', (req, res) => {
    res.render('indexSocios');
});

app.get('/Proveedores', (req, res) => {
    res.render('indexProveedores');
});

app.get('/Tipo_Alquiler', (req, res) => {
    res.render('indexTipo_Alquiler');
});

app.get('/Tipo_Vehiculo', (req, res) => {
    res.render('indexTipo_Vehiculo');
});

app.get('/Vehiculos', (req, res) => {
    res.render('indexVehiculo');
});

app.get('/Taller', (req, res) => {
    res.render('indexTaller');
});

app.get('/Mantenimiento', (req, res) => {
    res.render('indexMantenimiento');
});

app.get('/Alquiler', (req, res) => {
    res.render('indexAlquiler');
});

app.get('/Factura', (req, res) => {
    res.render('indexFactura');
});



app.use(personasRoutes);
app.use(clientesRoutes);
app.use(empleadosRoutes);
app.use(sociosRoutes);
app.use(proveedoresRoutes);
app.use(Tipo_AlquilerRoutes);
app.use(Tipo_VehiculoRoutes);
app.use(vehiculoRoutes);
app.use(TallerRoutes);
app.use(MantenimientoRoutes);
app.use(alquilerRoutes);
app.use(facturaRoutes);




// Archivos estáticos
app.use(express.static(join(__dirname, 'public')));

// Ejecutar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log('Server listening on port:', PORT));