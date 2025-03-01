// empleados.routes.js
import { Router } from 'express';
import pool from '../database.js';

const routerEmpleados = Router();

// Añadir empleado
routerEmpleados.get('/addEmpleados', (req, res) => {
    res.render('empleados/addEmpleados.hbs');
});

routerEmpleados.post('/addEmpleados', async (req, res) => {
    try {
        const { Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion, Emp_puesto, Emp_salario, Emp_fecha_contratacion } = req.body;

        const newPersona = { Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion };
        await pool.query('INSERT INTO Persona SET ?', [newPersona]);

        await pool.query('INSERT INTO Empleado (Emp_per_id, Emp_puesto, Emp_salario, Emp_fecha_contratacion) VALUES (?, ?, ?, ?)',
            [Per_id, Emp_puesto, Emp_salario, Emp_fecha_contratacion]);

        res.redirect('/listEmpleados');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Listar empleados
routerEmpleados.get('/listEmpleados', async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT e.Emp_id, p.Per_id, p.Per_nombre, p.Per_telefono, p.Per_email, p.Per_direccion, p.Per_tipo, p.Per_tipo_identificacion, e.Emp_puesto, e.Emp_salario, e.Emp_fecha_contratacion
            FROM Empleado e
            JOIN Persona p ON e.Emp_per_id = p.Per_id;
        `);
        res.render('empleados/listEmpleados.hbs', { Empleado: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Editar empleado
routerEmpleados.get('/editEmpleados/:Emp_id', async (req, res) => {
    try {
        const { Emp_id } = req.params;
        const [empleado] = await pool.query(`
            SELECT e.Emp_id, p.Per_id, p.Per_nombre, p.Per_telefono, p.Per_email, p.Per_direccion, p.Per_tipo, p.Per_tipo_identificacion, e.Emp_puesto, e.Emp_salario, e.Emp_fecha_contratacion
            FROM Empleado e
            JOIN Persona p ON e.Emp_per_id = p.Per_id
            WHERE e.Emp_id = ?
        `, [Emp_id]);

        if (empleado.length > 0) {
            res.render('empleados/editEmpleados.hbs', { empleado: empleado[0] });
        } else {
            res.status(404).send('Empleado no encontrado.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

routerEmpleados.post('/editEmpleados/:Emp_id', async (req, res) => {
    try {
        const { Emp_id } = req.params;
        const { Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion, Emp_puesto, Emp_salario, Emp_fecha_contratacion } = req.body;

        const editPersona = { Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion };
        await pool.query('UPDATE Persona SET ? WHERE Per_id = ?', [editPersona, Per_id]);

        const editEmpleado = { Emp_puesto, Emp_salario, Emp_fecha_contratacion };
        await pool.query('UPDATE Empleado SET ? WHERE Emp_id = ?', [editEmpleado, Emp_id]);

        res.redirect('/listEmpleados');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar empleado
routerEmpleados.get('/deleteEmpleados/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Empleado WHERE Emp_id = ?', [id]);
        res.redirect('/listEmpleados');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default routerEmpleados;
