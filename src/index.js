//conficuración básica del seervidor

import express from 'express'
import morgan from 'morgan'
import { engine } from 'express-handlebars'
import {join, dirname} from 'path'
import {fileURLToPath} from 'url'
import personasRoutes from './routes/personas.routes.js'
import clientesRoutes from './routes/clientes.routes.js'
import empleadosRoutes from './routes/empleados.routes.js'

//Se definen las rutas

//Initializacion
const app = express();
const __dirname = dirname(fileURLToPath(import.meta.url))

//Settings
app.set('port', process.env.PORT || 3000);  // si no se envia process.env.PORT entonces se hará al puerto especificado
app.set('views', join(__dirname, 'views'));
app.engine('.hbs', engine({
    defaultLayout: 'main',
    layoutsDir: join(app.get('views'), 'layouts'),
    partialsDir: join(app.get('views'), 'partials'),
    extname: '.hbs'
}));

//Middlewares
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: false }))
app.use(express.json());


//Routes
app.get('/Personas', (req, res)=>{
    res.render('indexPersona.hbs')
})

app.get('/Clientes', (req, res)=>{
    res.render('indexClientes.hbs')
})

app.get('/Empleados', (req, res)=>{
    res.render('indexEmpleados.hbs')
})

app.use(personasRoutes);
app.use(clientesRoutes);
app.use(empleadosRoutes);

//Public files
app.use(express.static(join(__dirname, 'public')))
//Run Server

app.listen(app.get('port'), ()=>
    console.log('server listening on port:', app.get('port')));