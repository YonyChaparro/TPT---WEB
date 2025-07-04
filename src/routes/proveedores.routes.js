import { Router } from 'express';
import pool from '../database.js';

const routerProveedores = Router();

// Mostrar formulario para añadir proveedor
routerProveedores.get('/addProveedores', (req, res) => {
    res.render('proveedores/addProveedores.hbs');
});

// Agregar proveedor
routerProveedores.post('/addProveedores', async (req, res) => {
    try {
        const {
            Per_id,
            Per_nombre,
            Per_telefono,
            Per_email,
            Per_direccion,
            Per_tipo,
            Per_tipo_identificacion,
            Pro_costo_servicio,
            Pro_servicio
        } = req.body;

        await pool.query(`
            INSERT INTO Persona (
                Per_id, Per_nombre, Per_telefono, Per_email,
                Per_direccion, Per_tipo, Per_tipo_identificacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [
            Per_id, Per_nombre, Per_telefono, Per_email,
            Per_direccion, Per_tipo, Per_tipo_identificacion
        ]);

        await pool.query(`
            INSERT INTO Proveedor (
                Pro_per_id, Pro_costo_servicio, Pro_servicio
            ) VALUES (?, ?, ?)
        `, [Per_id, Pro_costo_servicio, Pro_servicio]);

        res.redirect('/listProveedores');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Listar proveedores
routerProveedores.get('/listProveedores', async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT pr.Pro_id, p.Per_id, p.Per_nombre, p.Per_telefono, p.Per_email, 
                   p.Per_direccion, p.Per_tipo, p.Per_tipo_identificacion, 
                   pr.Pro_costo_servicio, pr.Pro_servicio
            FROM Proveedor pr
            INNER JOIN Persona p ON pr.Pro_per_id = p.Per_id
        `);
        res.render('proveedores/listProveedores.hbs', { Proveedor: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Formulario para editar proveedor
routerProveedores.get('/editProveedores/:Pro_id', async (req, res) => {
    try {
        const { Pro_id } = req.params;

        const [proveedor] = await pool.query(`
            SELECT pr.Pro_id, p.Per_id, p.Per_nombre, p.Per_telefono, p.Per_email,
                   p.Per_direccion, p.Per_tipo, p.Per_tipo_identificacion,
                   pr.Pro_costo_servicio, pr.Pro_servicio
            FROM Proveedor pr
            INNER JOIN Persona p ON pr.Pro_per_id = p.Per_id
            WHERE pr.Pro_id = ?
        `, [Pro_id]);

        if (proveedor.length > 0) {
            res.render('proveedores/editProveedores.hbs', { proveedor: proveedor[0] });
        } else {
            res.status(404).send('Proveedor no encontrado.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Editar proveedor
routerProveedores.post('/editProveedores/:Pro_id', async (req, res) => {
    try {
        const { Pro_id } = req.params;
        const {
            Per_id,
            Per_nombre,
            Per_telefono,
            Per_email,
            Per_direccion,
            Per_tipo,
            Per_tipo_identificacion,
            Pro_costo_servicio,
            Pro_servicio
        } = req.body;

        await pool.query(`
            UPDATE Persona SET 
                Per_nombre = ?, 
                Per_telefono = ?, 
                Per_email = ?, 
                Per_direccion = ?, 
                Per_tipo = ?, 
                Per_tipo_identificacion = ?
            WHERE Per_id = ?
        `, [
            Per_nombre,
            Per_telefono,
            Per_email,
            Per_direccion,
            Per_tipo,
            Per_tipo_identificacion,
            Per_id
        ]);

        await pool.query(`
            UPDATE Proveedor SET 
                Pro_costo_servicio = ?, 
                Pro_servicio = ?
            WHERE Pro_id = ?
        `, [Pro_costo_servicio, Pro_servicio, Pro_id]);

        res.redirect('/listProveedores');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar proveedor
routerProveedores.get('/deleteProveedores/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Proveedor WHERE Pro_id = ?', [id]);
        res.redirect('/listProveedores');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default routerProveedores;
