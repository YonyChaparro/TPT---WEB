import { Router } from 'express';
import pool from '../database.js';

const routerSocios = Router();

// Mostrar formulario para añadir socio
routerSocios.get('/addSocios', (req, res) => {
    res.render('socios/addSocios.hbs');
});

// Añadir nuevo socio
routerSocios.post('/addSocios', async (req, res) => {
    try {
        const {
            Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion,
            Per_tipo, Per_tipo_identificacion, Soc_numero_de_acciones
        } = req.body;

        // Insertar en Persona (SQLite no admite SET ?, así que usamos nombres explícitos)
        await pool.query(`
            INSERT INTO Persona (
                Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion
            ) VALUES (?, ?, ?, ?, ?, ?, ?)
        `, [Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion]);

        // Insertar en Socio
        await pool.query(`
            INSERT INTO Socio (Soc_per_id, Soc_numero_de_acciones)
            VALUES (?, ?)
        `, [Per_id, Soc_numero_de_acciones]);

        res.redirect('/listSocios');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Listar socios
routerSocios.get('/listSocios', async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT s.Soc_id, p.Per_id, p.Per_nombre, p.Per_telefono, p.Per_email, 
                   p.Per_direccion, p.Per_tipo, p.Per_tipo_identificacion, 
                   s.Soc_numero_de_acciones
            FROM Socio s
            JOIN Persona p ON s.Soc_per_id = p.Per_id
        `);
        res.render('socios/listSocios.hbs', { Socio: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mostrar formulario de edición
routerSocios.get('/editSocios/:Soc_id', async (req, res) => {
    try {
        const { Soc_id } = req.params;

        const [socio] = await pool.query(`
            SELECT s.Soc_id, p.Per_id, p.Per_nombre, p.Per_telefono, p.Per_email, 
                   p.Per_direccion, p.Per_tipo, p.Per_tipo_identificacion, 
                   s.Soc_numero_de_acciones
            FROM Socio s
            JOIN Persona p ON s.Soc_per_id = p.Per_id
            WHERE s.Soc_id = ?
        `, [Soc_id]);

        if (socio.length > 0) {
            res.render('socios/editSocios.hbs', { socio: socio[0] });
        } else {
            res.status(404).send('Socio no encontrado.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Procesar edición
routerSocios.post('/editSocios/:Soc_id', async (req, res) => {
    try {
        const { Soc_id } = req.params;
        const {
            Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion,
            Per_tipo, Per_tipo_identificacion, Soc_numero_de_acciones
        } = req.body;

        // Actualizar Persona (evitamos SET ? para compatibilidad con SQLite)
        await pool.query(`
            UPDATE Persona SET
                Per_nombre = ?, Per_telefono = ?, Per_email = ?, 
                Per_direccion = ?, Per_tipo = ?, Per_tipo_identificacion = ?
            WHERE Per_id = ?
        `, [Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion, Per_id]);

        // Actualizar Socio
        await pool.query(`
            UPDATE Socio SET
                Soc_numero_de_acciones = ?
            WHERE Soc_id = ?
        `, [Soc_numero_de_acciones, Soc_id]);

        res.redirect('/listSocios');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar socio
routerSocios.get('/deleteSocios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Socio WHERE Soc_id = ?', [id]);
        res.redirect('/listSocios');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default routerSocios;
