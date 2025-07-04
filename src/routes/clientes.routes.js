import { Router } from 'express';
import pool from '../database.js';

const routerClientes = Router();

routerClientes.get('/addClientes', (req, res) => {
    res.render('clientes/addClientes.hbs');
});

routerClientes.post('/addClientes', async (req, res) => {
    try {
        const {
            Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion,
            Per_tipo, Per_tipo_identificacion, Cli_usuario, Cli_contrasena
        } = req.body;

        // Insertar Persona (forma válida en SQLite)
        const personaFields = ['Per_id', 'Per_nombre', 'Per_telefono', 'Per_email', 'Per_direccion', 'Per_tipo', 'Per_tipo_identificacion'];
        const personaValues = [Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion];
        const personaPlaceholders = personaFields.map(() => '?').join(', ');
        const personaSQL = `INSERT INTO Persona (${personaFields.join(', ')}) VALUES (${personaPlaceholders})`;
        await pool.query(personaSQL, personaValues);

        // Insertar Cliente
        await pool.query(
            'INSERT INTO Cliente (Cli_per_id, Cli_usuario, Cli_contrasena) VALUES (?, ?, ?)',
            [Per_id, Cli_usuario, Cli_contrasena]
        );

        res.redirect('/listClientes');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

routerClientes.get('/listClientes', async (req, res) => {
    try {
        const [result] = await pool.query(`
            SELECT
                c.Cli_id,
                c.Cli_usuario,
                c.Cli_contrasena,
                p.Per_id,
                p.Per_nombre,
                p.Per_telefono,
                p.Per_email,
                p.Per_direccion,
                p.Per_tipo,
                p.Per_tipo_identificacion
            FROM Cliente c
            INNER JOIN Persona p ON c.Cli_per_id = p.Per_id
        `);
        res.render('clientes/listClientes.hbs', { Cliente: result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

routerClientes.get('/editClientes/:Cli_id', async (req, res) => {
    try {
        const { Cli_id } = req.params;
        const [cliente] = await pool.query(`
            SELECT c.Cli_id, c.Cli_usuario, c.Cli_contrasena, p.Per_id, p.Per_nombre, p.Per_telefono,
                   p.Per_email, p.Per_direccion, p.Per_tipo, p.Per_tipo_identificacion
            FROM Cliente c
            JOIN Persona p ON c.Cli_per_id = p.Per_id
            WHERE c.Cli_id = ?
        `, [Cli_id]);

        if (cliente.length > 0) {
            res.render('clientes/editClientes.hbs', { cliente: cliente[0] });
        } else {
            res.status(404).send('Cliente no encontrado.');
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

routerClientes.post('/editClientes/:Cli_id', async (req, res) => {
    try {
        const { Cli_id } = req.params;
        const {
            Per_id, Per_nombre, Per_telefono, Per_email,
            Per_direccion, Per_tipo, Per_tipo_identificacion,
            Cli_usuario, Cli_contrasena
        } = req.body;

        // Actualizar Persona
        const personaFields = ['Per_nombre', 'Per_telefono', 'Per_email', 'Per_direccion', 'Per_tipo', 'Per_tipo_identificacion'];
        const personaValues = [Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion];
        const setPersonaClause = personaFields.map(f => `${f} = ?`).join(', ');
        const personaSQL = `UPDATE Persona SET ${setPersonaClause} WHERE Per_id = ?`;
        await pool.query(personaSQL, [...personaValues, Per_id]);

        // Actualizar Cliente
        const clienteSQL = 'UPDATE Cliente SET Cli_usuario = ?, Cli_contrasena = ? WHERE Cli_id = ?';
        await pool.query(clienteSQL, [Cli_usuario, Cli_contrasena, Cli_id]);

        res.redirect('/listClientes');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

routerClientes.get('/deleteClientes/:id', async (req, res) => {
    try {
        const { id } = req.params;
        await pool.query('DELETE FROM Cliente WHERE Cli_id = ?', [id]);
        res.redirect('/listClientes');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

export default routerClientes;
