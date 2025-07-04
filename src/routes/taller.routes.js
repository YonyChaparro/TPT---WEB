import { Router } from 'express';
import pool from '../database.js';

const routerTaller = Router();

// Mostrar formulario para agregar un nuevo taller
routerTaller.get('/addTaller', (req, res) => {
    res.render('taller/addTaller.hbs');
});

// Insertar un nuevo taller (SQLite: no se usa SET ?)
routerTaller.post('/addTaller', async (req, res) => {
    try {
        const { Tal_id, Tal_nombre, Tal_direccion } = req.body;

        await pool.query(`
            INSERT INTO Taller (Tal_id, Tal_nombre, Tal_direccion)
            VALUES (?, ?, ?)
        `, [Tal_id, Tal_nombre, Tal_direccion]);

        res.redirect('/listTaller');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Listar talleres
routerTaller.get('/listTaller', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM Taller');
        res.render('taller/listTaller.hbs', { talleres: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener taller por ID para edición
routerTaller.get('/editTaller/:Tal_id', async (req, res) => {
    try {
        const { Tal_id } = req.params;
        const [taller] = await pool.query('SELECT * FROM Taller WHERE Tal_id = ?', [Tal_id]);

        if (taller.length > 0) {
            res.render('taller/editTaller.hbs', { taller: taller[0] });
        } else {
            res.status(404).send('Taller no encontrado.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Actualizar taller (SQLite: no se usa SET ?)
routerTaller.post('/editTaller/:Tal_id', async (req, res) => {
    try {
        const { Tal_nombre, Tal_direccion } = req.body;
        const { Tal_id } = req.params;

        await pool.query(`
            UPDATE Taller 
            SET Tal_nombre = ?, Tal_direccion = ?
            WHERE Tal_id = ?
        `, [Tal_nombre, Tal_direccion, Tal_id]);

        res.redirect('/listTaller');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar taller
routerTaller.get('/deleteTaller/:Tal_id', async (req, res) => {
    try {
        const { Tal_id } = req.params;
        await pool.query('DELETE FROM Taller WHERE Tal_id = ?', [Tal_id]);
        res.redirect('/listTaller');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default routerTaller;
