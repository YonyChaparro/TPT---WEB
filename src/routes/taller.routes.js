// Taller.routes.js
import { Router } from 'express';
import pool from '../database.js';

const routerTaller = Router();

// Formulario para agregar un nuevo taller
routerTaller.get('/addTaller', (req, res) => {
    res.render('taller/addTaller.hbs');
});

// Insertar un nuevo taller
routerTaller.post('/addTaller', async (req, res) => {
    try {
        const { Tal_id, Tal_nombre, Tal_direccion } = req.body;
        const newTaller = { Tal_id, Tal_nombre, Tal_direccion };
        await pool.query('INSERT INTO Taller SET ?', [newTaller]);
        res.redirect('/listTaller');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener lista de talleres
routerTaller.get('/listTaller', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM Taller');
        res.render('taller/listTaller.hbs', { talleres: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener un taller por ID para editar
routerTaller.get('/editTaller/:Tal_id', async (req, res) => {
    try {
        const { Tal_id } = req.params;
        const [taller] = await pool.query('SELECT * FROM Taller WHERE Tal_id=?', [Tal_id]);
        res.render('taller/editTaller.hbs', { taller: taller[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Actualizar un taller
routerTaller.post('/editTaller/:Tal_id', async (req, res) => {
    try {
        const { Tal_nombre, Tal_direccion } = req.body;
        const { Tal_id } = req.params;
        const editTaller = { Tal_nombre, Tal_direccion };
        await pool.query('UPDATE Taller SET ? WHERE Tal_id = ?', [editTaller, Tal_id]);
        res.redirect('/listTaller');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar un taller
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
