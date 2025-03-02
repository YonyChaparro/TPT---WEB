// mantenimiento.routes.js
import { Router } from 'express';
import pool from '../database.js';

const routerMantenimiento = Router();

// Añadir mantenimiento
routerMantenimiento.get('/addMantenimiento', async (req, res) => {
    const [vehiculos] = await pool.query('SELECT Veh_placa FROM Vehiculo');
    const [talleres] = await pool.query('SELECT Tal_id, Tal_nombre FROM Taller');
    res.render('mantenimiento/addMantenimiento.hbs', { vehiculos, talleres });
});

routerMantenimiento.post('/addMantenimiento', async (req, res) => {
    try {
        const mantenimiento = {
            ...req.body,
            Man_cambio_de_aceite: req.body.Man_cambio_de_aceite ? 1 : 0,
            Man_cambio_frenos: req.body.Man_cambio_frenos ? 1 : 0,
            Man_alineación_y_balanceo: req.body.Man_alineación_y_balanceo ? 1 : 0,
            Man_revision_sistema_electrico: req.body.Man_revision_sistema_electrico ? 1 : 0,
            Man_revision_neumaticos: req.body.Man_revision_neumaticos ? 1 : 0,
            Man_certificacion_ambiental: req.body.Man_certificacion_ambiental ? 1 : 0,
            Man_certificacion_mecanica: req.body.Man_certificacion_mecanica ? 1 : 0
        };
        await pool.query('INSERT INTO Mantenimiento_Vehiculo SET ?', [mantenimiento]);
        res.redirect('/listMantenimiento');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Listar mantenimientos
routerMantenimiento.get('/listMantenimiento', async (req, res) => {
    try {
        const [mantenimientos] = await pool.query(`
            SELECT mv.*, v.Veh_marca, v.Veh_modelo, t.Tal_nombre
            FROM Mantenimiento_Vehiculo mv
            JOIN Vehiculo v ON mv.Man_vehiculo_placa = v.Veh_placa
            JOIN Taller t ON mv.Man_taller = t.Tal_id
        `);
        res.render('mantenimiento/listMantenimiento.hbs', { mantenimientos });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Editar mantenimiento
routerMantenimiento.get('/editMantenimiento/:Man_id', async (req, res) => {
    try {
        const { Man_id } = req.params;
        const [mantenimiento] = await pool.query('SELECT * FROM Mantenimiento_Vehiculo WHERE Man_id = ?', [Man_id]);
        const [vehiculos] = await pool.query('SELECT Veh_placa FROM Vehiculo');
        const [talleres] = await pool.query('SELECT Tal_id, Tal_nombre FROM Taller');

        if (mantenimiento.length > 0) {
            res.render('mantenimiento/editMantenimiento.hbs', { mantenimiento: mantenimiento[0], vehiculos, talleres });
        } else {
            res.status(404).send('Mantenimiento no encontrado.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

routerMantenimiento.post('/editMantenimiento/:Man_id', async (req, res) => {
    try {
        const { Man_id } = req.params;
        const mantenimiento = {
            ...req.body,
            Man_cambio_de_aceite: req.body.Man_cambio_de_aceite ? 1 : 0,
            Man_cambio_frenos: req.body.Man_cambio_frenos ? 1 : 0,
            Man_alineación_y_balanceo: req.body.Man_alineación_y_balanceo ? 1 : 0,
            Man_revision_sistema_electrico: req.body.Man_revision_sistema_electrico ? 1 : 0,
            Man_revision_neumaticos: req.body.Man_revision_neumaticos ? 1 : 0,
            Man_certificacion_ambiental: req.body.Man_certificacion_ambiental ? 1 : 0,
            Man_certificacion_mecanica: req.body.Man_certificacion_mecanica ? 1 : 0
        };
        await pool.query('UPDATE Mantenimiento_Vehiculo SET ? WHERE Man_id = ?', [mantenimiento, Man_id]);
        res.redirect('/listMantenimiento');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar mantenimiento
routerMantenimiento.get('/deleteMantenimiento/:Man_id', async (req, res) => {
    try {
        await pool.query('DELETE FROM Mantenimiento_Vehiculo WHERE Man_id = ?', [req.params.Man_id]);
        res.redirect('/listMantenimiento');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default routerMantenimiento;
