// alquiler.routes.js
import { Router } from 'express';
import pool from '../database.js';

const routerAlquiler = Router();

// Añadir alquiler
routerAlquiler.get('/addAlquiler', async (req, res) => {
    const [clientes] = await pool.query('SELECT Cliente.Cli_id, Persona.Per_nombre FROM Cliente INNER JOIN Persona ON Cliente.Cli_per_id = Persona.Per_id');
    const [vehiculos] = await pool.query('SELECT Veh_placa, Veh_marca, Veh_modelo FROM Vehiculo');
    const [tipos] = await pool.query('SELECT Tip_Alq_id, Tip_Alq_nombre FROM Tipo_Alquiler');
    res.render('alquiler/addAlquiler.hbs', { clientes, vehiculos, tipos });
});

routerAlquiler.post('/addAlquiler', async (req, res) => {
    try {
        const alquiler = req.body;
        const keys = Object.keys(alquiler);
        const values = Object.values(alquiler);
        const placeholders = keys.map(() => '?').join(', ');
        const sql = `INSERT INTO Alquiler (${keys.join(', ')}) VALUES (${placeholders})`;
        await pool.query(sql, values);
        res.redirect('/listAlquileres');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Listar alquileres
routerAlquiler.get('/listAlquileres', async (req, res) => {
    try {
        const [alquileres] = await pool.query(`
            SELECT a.*, p.Per_nombre, v.Veh_marca, v.Veh_modelo, t.Tip_Alq_nombre 
            FROM Alquiler a
            JOIN Cliente c ON a.Alq_cliente = c.Cli_id
            JOIN Persona p ON c.Cli_per_id = p.Per_id
            JOIN Vehiculo v ON a.Alq_vehiculo_placa = v.Veh_placa
            JOIN Tipo_Alquiler t ON a.Alq_tipo = t.Tip_Alq_id
        `);
        res.render('alquiler/listAlquileres.hbs', { alquileres });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Editar alquiler
routerAlquiler.get('/editAlquiler/:Alq_id', async (req, res) => {
    try {
        const { Alq_id } = req.params;
        const [alquiler] = await pool.query('SELECT * FROM Alquiler WHERE Alq_id = ?', [Alq_id]);
        const [clientes] = await pool.query('SELECT Cliente.Cli_id, Persona.Per_nombre FROM Cliente INNER JOIN Persona ON Cliente.Cli_per_id = Persona.Per_id');
        const [vehiculos] = await pool.query('SELECT Veh_placa, Veh_marca, Veh_modelo FROM Vehiculo');
        const [tipos] = await pool.query('SELECT Tip_Alq_id, Tip_Alq_nombre FROM Tipo_Alquiler');

        if (alquiler.length > 0) {
            res.render('alquiler/editAlquiler.hbs', { alquiler: alquiler[0], clientes, vehiculos, tipos });
        } else {
            res.status(404).send('Alquiler no encontrado.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

routerAlquiler.post('/editAlquiler/:Alq_id', async (req, res) => {
    try {
        const { Alq_id } = req.params;
        const keys = Object.keys(req.body);
        const values = Object.values(req.body);
        const setClause = keys.map(key => `${key} = ?`).join(', ');
        const sql = `UPDATE Alquiler SET ${setClause} WHERE Alq_id = ?`;
        await pool.query(sql, [...values, Alq_id]);
        res.redirect('/listAlquileres');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar alquiler
routerAlquiler.get('/deleteAlquiler/:Alq_id', async (req, res) => {
    try {
        await pool.query('DELETE FROM Alquiler WHERE Alq_id = ?', [req.params.Alq_id]);
        res.redirect('/listAlquileres');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default routerAlquiler;
