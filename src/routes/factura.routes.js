import { Router } from "express";
import pool from "../database.js";

const routerFactura = Router();

// Listar todas las facturas con detalles
routerFactura.get("/listFactura", async (req, res) => {
    try {
        const [facturas] = await pool.query(`
            SELECT F.Fac_id, F.Fac_fecha, F.Fac_impuesto, F.Fac_descuento, 
                   (A.Alq_duracion * T.Tip_Alq_costo_por_hora) AS Fac_subtotal,
                   ((A.Alq_duracion * T.Tip_Alq_costo_por_hora) + F.Fac_impuesto - F.Fac_descuento) AS Fac_total,
                   F.Fac_metodo_pago, P.Per_nombre, V.Veh_placa, V.Veh_marca, V.Veh_modelo
            FROM Factura F
            JOIN Alquiler A ON F.Fac_alquiler_id = A.Alq_id
            JOIN Cliente C ON A.Alq_cliente = C.Cli_id
            JOIN Persona P ON C.Cli_per_id = P.Per_id
            JOIN Vehiculo V ON A.Alq_vehiculo_placa = V.Veh_placa
            JOIN Tipo_Alquiler T ON A.Alq_tipo = T.Tip_Alq_id
            ORDER BY F.Fac_fecha DESC;
        `);

        res.render("factura/listFactura.hbs", { facturas });
    } catch (err) {
        console.error("Error al obtener facturas:", err);
        res.status(500).json({ message: err.message });
    }
});

export default routerFactura;
