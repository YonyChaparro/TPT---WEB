// factura.routes.js
import { Router } from 'express';
import pool from '../database.js';

const routerFactura = Router();

// Añadir factura
routerFactura.get('/addFactura', async (req, res) => {
    const [alquileres] = await pool.query('SELECT Alq_id FROM Alquiler');
    res.render('factura/addFactura.hbs', { alquileres });
});

routerFactura.post('/addFactura', async (req, res) => {
    try {
        const factura = req.body;
        await pool.query('INSERT INTO Factura SET ?', [factura]);
        res.redirect('/listFactura');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Listar facturas
routerFactura.get('/listFactura', async (req, res) => {
    try {
        const [facturas] = await pool.query(`
            SELECT f.*, a.Alq_id
            FROM Factura f
            JOIN Alquiler a ON f.Fac_alquiler_id = a.Alq_id
        `);
        res.render('factura/listFactura.hbs', { facturas });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Editar factura
routerFactura.get('/editFactura/:Fac_id', async (req, res) => {
    try {
        const { Fac_id } = req.params;
        const [factura] = await pool.query('SELECT * FROM Factura WHERE Fac_id = ?', [Fac_id]);
        const [alquileres] = await pool.query('SELECT Alq_id FROM Alquiler');

        if (factura.length > 0) {
            res.render('factura/editFactura.hbs', { factura: factura[0], alquileres });
        } else {
            res.status(404).send('Factura no encontrada.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

routerFactura.post('/editFactura/:Fac_id', async (req, res) => {
    try {
        const { Fac_id } = req.params;
        await pool.query('UPDATE Factura SET ? WHERE Fac_id = ?', [req.body, Fac_id]);
        res.redirect('/listFactura');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar factura
routerFactura.get('/deleteFactura/:Fac_id', async (req, res) => {
    try {
        await pool.query('DELETE FROM Factura WHERE Fac_id = ?', [req.params.Fac_id]);
        res.redirect('/listFactura');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default routerFactura;
