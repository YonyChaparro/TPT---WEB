import { Router } from "express";
import pool from "../database.js";

const routerServicios = Router();

// Verificar disponibilidad de un vehículo
routerServicios.get("/verificar-disponibilidad", async (req, res) => {
    const { placa } = req.query;

    try {
        // Llamar al procedimiento almacenado para verificar disponibilidad
        const [result] = await pool.query("CALL SP_Verificar_Disponibilidad(?)", [placa]);

        // Extraer el valor de disponibilidad
        const disponible = result[0][0].disponible === 1; // Convertir a booleano

        res.json({ disponible });
    } catch (error) {
        console.error("Error en la verificación de disponibilidad:", error);
        res.status(500).json({ disponible: false, error: "Error en la verificación" });
    }
});

// 📌 Mostrar formulario de creación de servicios
routerServicios.get("/addServicios", async (req, res) => {
    try {
        // Obtener lista de clientes
        const [clientes] = await pool.query(`
            SELECT Cliente.Cli_id, Persona.Per_nombre, Cliente.Cli_usuario
            FROM Cliente 
            JOIN Persona ON Cliente.Cli_per_id = Persona.Per_id
        `);

        // Obtener lista de vehículos disponibles con su tipo
        const [vehiculos] = await pool.query(`
            SELECT Vehiculo.Veh_placa, Vehiculo.Veh_marca, Vehiculo.Veh_modelo, Tipo_Vehiculo.Tip_nombre
            FROM Vehiculo 
            JOIN Tipo_Vehiculo ON Vehiculo.Veh_tipo = Tipo_Vehiculo.Tip_id
            WHERE Vehiculo.Veh_placa NOT IN (
                SELECT Alq_vehiculo_placa FROM Alquiler WHERE Alq_estado = 'Activo'
            ) 
            AND Vehiculo.Veh_placa NOT IN (
                SELECT Man_vehiculo_placa FROM Mantenimiento_Vehiculo WHERE Man_estado = 'Pendiente'
            )
        `);

        // Obtener tipos de servicio
        const [tiposServicios] = await pool.query("SELECT * FROM Tipo_Alquiler");

        res.render("servicios/addServicios", { clientes, vehiculos, tiposServicios });
    } catch (err) {
        res.status(500).send("Error al cargar los datos: " + err.message);
    }
});

// Procesar la creación de un nuevo servicio
routerServicios.post("/addServicios", async (req, res) => {
    const { cliente, vehiculo, tipo_servicio, fecha_inicio, duracion } = req.body;

    try {
        // Insertar el nuevo servicio en la base de datos
        await pool.query(`
            INSERT INTO Alquiler (Alq_cliente, Alq_vehiculo_placa, Alq_tipo, Alq_fecha_inicio, Alq_duracion, Alq_estado)
            VALUES (?, ?, ?, ?, ?, 'Activo')
        `, [cliente, vehiculo, tipo_servicio, fecha_inicio, duracion]);

        res.redirect("/listServicios");
    } catch (err) {
        res.status(500).send("Error al registrar el servicio: " + err.message);
    }
});

// Listar todos los servicios
routerServicios.get("/listServicios", async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT s.Alq_id, p.Per_id, p.Per_nombre, p.Per_telefono, p.Per_email, 
                   v.Veh_placa, v.Veh_marca, v.Veh_modelo, tv.Tip_nombre, 
                   s.Alq_tipo, s.Alq_fecha_inicio, s.Alq_duracion, s.Alq_estado
            FROM Alquiler s
            JOIN Cliente c ON s.Alq_cliente = c.Cli_id
            JOIN Persona p ON c.Cli_per_id = p.Per_id
            JOIN Vehiculo v ON s.Alq_vehiculo_placa = v.Veh_placa
            JOIN Tipo_Vehiculo tv ON v.Veh_tipo = tv.Tip_id;
        `);
        res.render("servicios/listServicios.hbs", { Servicio: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Eliminar un servicio
routerServicios.get("/deleteServicios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query("DELETE FROM Alquiler WHERE Alq_id = ?", [id]);
        res.redirect("/listServicios");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Mostrar formulario de edición de servicio
routerServicios.get("/editServicios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const [servicio] = await pool.query(`
            SELECT * FROM Alquiler WHERE Alq_id = ?
        `, [id]);

        if (servicio.length > 0) {
            res.render("servicios/editServicios.hbs", { servicio: servicio[0] });
        } else {
            res.status(404).send("Servicio no encontrado.");
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Guardar cambios en la edición de un servicio
routerServicios.post("/editServicios/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { Alq_tipo, Alq_fecha_inicio, Alq_duracion, Alq_estado } = req.body;

        await pool.query(`
            UPDATE Alquiler 
            SET Alq_tipo = ?, Alq_fecha_inicio = ?, Alq_duracion = ?, Alq_estado = ? 
            WHERE Alq_id = ?
        `, [Alq_tipo, Alq_fecha_inicio, Alq_duracion, Alq_estado, id]);

        res.redirect("/listServicios");
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default routerServicios;
