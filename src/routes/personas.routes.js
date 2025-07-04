import { Router } from 'express';
import pool from '../database.js';

const router = Router();

// Formulario para agregar persona
router.get('/add', (req, res) => {
    res.render('personas/add.hbs');
});

// Agregar persona a la base de datos
router.post('/add', async (req, res) => {
    try {
        const {
            Per_id,
            Per_nombre,
            Per_telefono,
            Per_email,
            Per_direccion,
            Per_tipo,
            Per_tipo_identificacion
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

        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Listar personas
router.get('/list', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM Persona');
        res.render('personas/list.hbs', { personas: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mostrar formulario de edición
router.get('/edit/:Per_id', async (req, res) => {
    try {
        const { Per_id } = req.params;
        const [persona] = await pool.query('SELECT * FROM Persona WHERE Per_id = ?', [Per_id]);

        if (persona.length > 0) {
            res.render('personas/edit.hbs', { persona: persona[0] });
        } else {
            res.status(404).send('Persona no encontrada');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Actualizar persona
router.post('/edit/:Per_id', async (req, res) => {
    try {
        const { Per_id } = req.params;
        const {
            Per_nombre,
            Per_telefono,
            Per_email,
            Per_direccion,
            Per_tipo,
            Per_tipo_identificacion
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

        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar persona
router.get('/delete/:Per_id', async (req, res) => {
    try {
        const { Per_id } = req.params;
        await pool.query('DELETE FROM Persona WHERE Per_id = ?', [Per_id]);
        res.redirect('/list');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default router;
