import {Router} from 'express'
import pool from '../database.js'

const routerEmpleados = Router();

// Añadimos a la lista
routerEmpleados.get('/addEmpleados', (req,res)=>{
    res.render('empleados/addEmpleados.hbs')
})



// Procesar formulario para agregar persona y empleado
routerEmpleados.post('/addEmpleados', async (req, res) => {
    try {
        const {
            Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion,
            Per_tipo, Per_tipo_identificacion,
            Emp_puesto, Emp_salario, Emp_fecha_contratacion
        } = req.body;

        // Insertar en la tabla personas
        const newPersona = { Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion };
        await pool.query('INSERT INTO personas SET ?', [newPersona]);

        // Insertar en la tabla empleados
        const newEmpleado = { Emp_per_id: Per_id, Emp_puesto, Emp_salario, Emp_fecha_contratacion };
        await pool.query('INSERT INTO Empleado SET ?', [newEmpleado]);

        res.redirect('/listEmpleados');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtenemos lista
routerEmpleados.get('/listEmpleados', async(req,res)=>{
    try{
        const [result] = await pool.query('SELECT * FROM Empleado');
        res.render('Empleados/listEmpleados.hbs', {Empleado: result})
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})


// Select para editar por id
routerEmpleados.get('/edit/:Per_id', async(req, res)=>{
    try {
        const {Per_id} = req.params;
        const [Empleado]=await pool.query('SELECT * FROM Empleado WHERE Per_id=?', [Per_id]);
        const EmpleadosEdit = EmpleadosEdit[0];
        res.render('Empleado/edit.hbs', {Empleado: EmpleadosEdit});
    } catch (err) {
        res.status(500).json({message:err.message});
    }
});







// Actualizamos de la lista
routerEmpleados.post('/edit/:Per_id', async(req, res)=>{
    try {
        const {Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion} = req.body;
        const {Per_id} = req.params;
        const EmpleadosEdit = {Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion};
        await pool.query('UPDATE Empleado SET ? WHERE Per_id = ?', [EmpleadosEdit, Per_id]);
        res.redirect('/list')
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})

// Borramos de la lista

routerEmpleados.get('/delete/:Per_id', async(req, res)=>{
    try {
        const {Per_id} = req.params;
        await pool.query('DELETE FROM Empleado WHERE Per_id = ?', [Per_id]);
        res.redirect('/list')
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})


export default routerEmpleados;

// *****************************************RUTAS CLIENTES*********************






