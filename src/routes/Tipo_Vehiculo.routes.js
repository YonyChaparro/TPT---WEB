// Tipo_Vehiculo.routes.js
import { Router } from 'express';
import pool from '../database.js';

const routerTipo_Vehiculo = Router();

// Formulario para agregar un nuevo tipo de vehículo
routerTipo_Vehiculo.get('/addTipo_Vehiculo', (req, res) => {
    res.render('tipo_vehiculo/addTipo_Vehiculo.hbs');
});

// Insertar un nuevo tipo de vehículo
routerTipo_Vehiculo.post('/addTipo_Vehiculo', async (req, res) => {
    try {
        const { Tip_id, Tip_nombre, Tip_tarifa, Tip_capacidad_carga, Tip_combustible } = req.body;
        const newTipoVehiculo = { Tip_id, Tip_nombre, Tip_tarifa, Tip_capacidad_carga, Tip_combustible };
        await pool.query('INSERT INTO Tipo_Vehiculo SET ?', [newTipoVehiculo]);
        res.redirect('/listTipo_Vehiculo');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener lista de tipos de vehículos
routerTipo_Vehiculo.get('/listTipo_Vehiculo', async (req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM Tipo_Vehiculo');
        res.render('tipo_vehiculo/listTipo_Vehiculo.hbs', { tipoVehiculos: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener un tipo de vehículo por ID para editar
routerTipo_Vehiculo.get('/editTipo_Vehiculo/:Tip_id', async (req, res) => {
    try {
        const { Tip_id } = req.params;
        const [tipoVehiculo] = await pool.query('SELECT * FROM Tipo_Vehiculo WHERE Tip_id=?', [Tip_id]);
        res.render('tipo_vehiculo/editTipo_Vehiculo.hbs', { tipoVehiculo: tipoVehiculo[0] });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Actualizar un tipo de vehículo
routerTipo_Vehiculo.post('/editTipo_Vehiculo/:Tip_id', async (req, res) => {
    try {
        const { Tip_nombre, Tip_tarifa, Tip_capacidad_carga, Tip_combustible } = req.body;
        const { Tip_id } = req.params;
        const editTipoVehiculo = { Tip_nombre, Tip_tarifa, Tip_capacidad_carga, Tip_combustible };
        await pool.query('UPDATE Tipo_Vehiculo SET ? WHERE Tip_id = ?', [editTipoVehiculo, Tip_id]);
        res.redirect('/listTipo_Vehiculo');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar un tipo de vehículo
routerTipo_Vehiculo.get('/deleteTipo_Vehiculo/:Tip_id', async (req, res) => {
    try {
        const { Tip_id } = req.params;
        await pool.query('DELETE FROM Tipo_Vehiculo WHERE Tip_id = ?', [Tip_id]);
        res.redirect('/listTipo_Vehiculo');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default routerTipo_Vehiculo;
