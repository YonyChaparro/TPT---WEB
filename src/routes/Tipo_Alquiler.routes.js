// Tipo_Alquiler.routes.js
import { Router } from 'express';
import pool from '../database.js';

const routerTipo_Alquiler = Router();

// Formulario para agregar un nuevo tipo de alquiler
routerTipo_Alquiler.get('/addTipo_Alquiler', (req, res) => {
    res.render('tipo_alquiler/addTipo_Alquiler.hbs');
});

// Insertar un nuevo tipo de alquiler
routerTipo_Alquiler.post('/addTipo_Alquiler', async (req, res) => {
    try {
        const { Tip_Alq_id, Tip_Alq_nombre, Tip_Alq_costo_por_hora } = req.body;
        const newTipoAlquiler = { Tip_Alq_id, Tip_Alq_nombre, Tip_Alq_costo_por_hora };
        await pool.query('INSERT INTO Tipo_Alquiler SET ?', [newTipoAlquiler]);
        res.redirect('/listTipo_Alquiler');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener lista de tipos de alquiler
routerTipo_Alquiler.get('/listTipo_Alquiler', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM Tipo_Alquiler');
        res.render('tipo_alquiler/listTipo_Alquiler.hbs', { tipoAlquileres: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener un tipo de alquiler por ID para editar
routerTipo_Alquiler.get('/editTipo_Alquiler/:Tip_Alq_id', async (req, res) => {
    try {
        const { Tip_Alq_id } = req.params;
        const [tipoAlquiler] = await pool.query('SELECT * FROM Tipo_Alquiler WHERE Tip_Alq_id=?', [Tip_Alq_id]);
        res.render('tipo_alquiler/editTipo_Alquiler.hbs', { tipoAlquiler: tipoAlquiler[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Actualizar un tipo de alquiler
routerTipo_Alquiler.post('/editTipo_Alquiler/:Tip_Alq_id', async (req, res) => {
    try {
        const { Tip_Alq_nombre, Tip_Alq_costo_por_hora } = req.body;
        const { Tip_Alq_id } = req.params;
        const editTipoAlquiler = { Tip_Alq_nombre, Tip_Alq_costo_por_hora };
        await pool.query('UPDATE Tipo_Alquiler SET ? WHERE Tip_Alq_id = ?', [editTipoAlquiler, Tip_Alq_id]);
        res.redirect('/listTipo_Alquiler');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar un tipo de alquiler
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

