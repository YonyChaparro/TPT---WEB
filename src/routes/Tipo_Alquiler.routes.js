import { Router } from 'express';
import pool from '../database.js';

const routerTipo_Alquiler = Router();

// Mostrar formulario para agregar un nuevo tipo de alquiler
routerTipo_Alquiler.get('/addTipo_Alquiler', (req, res) => {
    res.render('tipo_alquiler/addTipo_Alquiler.hbs');
});

// Insertar un nuevo tipo de alquiler (SQLite no admite SET ?)
routerTipo_Alquiler.post('/addTipo_Alquiler', async (req, res) => {
    try {
        const { Tip_Alq_id, Tip_Alq_nombre, Tip_Alq_costo_por_hora } = req.body;

        await pool.query(`
            INSERT INTO Tipo_Alquiler (Tip_Alq_id, Tip_Alq_nombre, Tip_Alq_costo_por_hora)
            VALUES (?, ?, ?)
        `, [Tip_Alq_id, Tip_Alq_nombre, Tip_Alq_costo_por_hora]);

        res.redirect('/listTipo_Alquiler');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Listar tipos de alquiler
routerTipo_Alquiler.get('/listTipo_Alquiler', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM Tipo_Alquiler');
        res.render('tipo_alquiler/listTipo_Alquiler.hbs', { tipoAlquileres: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener tipo de alquiler por ID para edición
routerTipo_Alquiler.get('/editTipo_Alquiler/:Tip_Alq_id', async (req, res) => {
    try {
        const { Tip_Alq_id } = req.params;
        const [tipoAlquiler] = await pool.query('SELECT * FROM Tipo_Alquiler WHERE Tip_Alq_id = ?', [Tip_Alq_id]);

        if (tipoAlquiler.length > 0) {
            res.render('tipo_alquiler/editTipo_Alquiler.hbs', { tipoAlquiler: tipoAlquiler[0] });
        } else {
            res.status(404).send('Tipo de alquiler no encontrado.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Actualizar tipo de alquiler (SQLite no admite SET ?)
routerTipo_Alquiler.post('/editTipo_Alquiler/:Tip_Alq_id', async (req, res) => {
    try {
        const { Tip_Alq_nombre, Tip_Alq_costo_por_hora } = req.body;
        const { Tip_Alq_id } = req.params;

        await pool.query(`
            UPDATE Tipo_Alquiler 
            SET Tip_Alq_nombre = ?, Tip_Alq_costo_por_hora = ?
            WHERE Tip_Alq_id = ?
        `, [Tip_Alq_nombre, Tip_Alq_costo_por_hora, Tip_Alq_id]);

        res.redirect('/listTipo_Alquiler');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar tipo de alquiler
routerTipo_Alquiler.get('/deleteTipo_Alquiler/:Tip_Alq_id', async (req, res) => {
    try {
        const { Tip_Alq_id } = req.params;
        await pool.query('DELETE FROM Tipo_Alquiler WHERE Tip_Alq_id = ?', [Tip_Alq_id]);
        res.redirect('/listTipo_Alquiler');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default routerTipo_Alquiler;
