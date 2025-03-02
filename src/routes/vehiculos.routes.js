import { Router } from 'express';
import pool from '../database.js';

const routerVehiculos = Router();

// Obtener formulario para agregar vehículo con lista de tipos de vehículo
routerVehiculos.get('/addVehiculos', async (req, res) => {
    try {
        const [tipos] = await pool.query('SELECT * FROM Tipo_Vehiculo');
        res.render('vehiculos/addVehiculos.hbs', { tipos });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Agregar un nuevo vehículo
routerVehiculos.post('/addVehiculos', async (req, res) => {
    try {
        const { Veh_placa, Veh_cuidad_de_registro, Veh_tipo, Veh_marca, Veh_modelo, Veh_año, Veh_kilometraje, Veh_certificado_runt, Veh_soat_vigencia, Veh_rtm_vigencia, Veh_norma_ambiental, Veh_gps_instalado } = req.body;
        
        const newVehiculo = {
            Veh_placa, Veh_cuidad_de_registro, Veh_tipo, Veh_marca, Veh_modelo, Veh_año, Veh_kilometraje, Veh_certificado_runt, Veh_soat_vigencia, Veh_rtm_vigencia, Veh_norma_ambiental, Veh_gps_instalado
        };
        
        await pool.query('INSERT INTO Vehiculo SET ?', [newVehiculo]);
        res.redirect('/listVehiculos');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Listar todos los vehículos
routerVehiculos.get('/listVehiculos', async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT v.*, t.Tip_nombre 
            FROM Vehiculo v 
            INNER JOIN Tipo_Vehiculo t ON v.Veh_tipo = t.Tip_id
        `);
        res.render('vehiculos/listVehiculos.hbs', { Vehiculo: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Obtener formulario de edición de un vehículo con tipos de vehículos
routerVehiculos.get('/editVehiculos/:Veh_placa', async (req, res) => {
    try {
        const { Veh_placa } = req.params;
        const [vehiculo] = await pool.query('SELECT * FROM Vehiculo WHERE Veh_placa = ?', [Veh_placa]);
        const [tipos] = await pool.query('SELECT * FROM Tipo_Vehiculo');

        if (vehiculo.length > 0) {
            res.render('vehiculos/editVehiculos.hbs', { vehiculo: vehiculo[0], tipos });
        } else {
            res.status(404).send('Vehículo no encontrado.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Editar un vehículo
routerVehiculos.post('/editVehiculos/:Veh_placa', async (req, res) => {
    try {
        const { Veh_placa } = req.params;
        const { Veh_cuidad_de_registro, Veh_tipo, Veh_marca, Veh_modelo, Veh_año, Veh_kilometraje, Veh_certificado_runt, Veh_soat_vigencia, Veh_rtm_vigencia, Veh_norma_ambiental, Veh_gps_instalado } = req.body;
        
        const editVehiculo = { Veh_cuidad_de_registro, Veh_tipo, Veh_marca, Veh_modelo, Veh_año, Veh_kilometraje, Veh_certificado_runt, Veh_soat_vigencia, Veh_rtm_vigencia, Veh_norma_ambiental, Veh_gps_instalado };
        
        await pool.query('UPDATE Vehiculo SET ? WHERE Veh_placa = ?', [editVehiculo, Veh_placa]);
        res.redirect('/listVehiculos');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar un vehículo
routerVehiculos.get('/deleteVehiculos/:Veh_placa', async (req, res) => {
    try {
        const { Veh_placa } = req.params;
        await pool.query('DELETE FROM Vehiculo WHERE Veh_placa = ?', [Veh_placa]);
        res.redirect('/listVehiculos');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default routerVehiculos;
