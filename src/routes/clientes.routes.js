import {Router} from 'express'
import pool from '../database.js'

const routerClientes = Router();

routerClientes.get('/addClientes', (req,res)=>{
    res.render('clientes/addClientes.hbs')
})

routerClientes.post('/addClientes', async(req, res)=>{
    try {
        const { Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion, Cli_usuario, Cli_contrasena } = req.body;

        const newPersona = {
            Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion
        }
        await pool.query('INSERT INTO Persona SET ?', [newPersona]);

        await pool.query('INSERT INTO Cliente (Cli_per_id, Cli_usuario, Cli_contrasena) VALUES (?, ?, ?)', [Per_id, Cli_usuario, Cli_contrasena]);

        res.redirect('/listClientes');

    } catch (err) {
        res.status(500).json({message:err.message})
    }
});

routerClientes.get('/listClientes', async(req,res)=>{
    try{
        const [result] = await pool.query(`
            SELECT
                c.Cli_id,
                c.Cli_usuario,
                c.Cli_contrasena,  -- Ahora también obtenemos la contraseña
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
        res.render('clientes/listClientes.hbs', {Cliente: result})
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})

routerClientes.get('/editClientes/:Cli_id', async (req, res) => {
    try {
        const { Cli_id } = req.params;
        const [cliente] = await pool.query(`
            SELECT c.Cli_id, c.Cli_usuario, c.Cli_contrasena, p.Per_id, p.Per_nombre, p.Per_telefono, p.Per_email, p.Per_direccion, p.Per_tipo, p.Per_tipo_identificacion
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
        const { Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion, Cli_usuario, Cli_contrasena } = req.body;

        const editPersona = { Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion };
        await pool.query('UPDATE Persona SET ? WHERE Per_id = ?', [editPersona, Per_id]);

        const editCliente = { Cli_usuario, Cli_contrasena };
        await pool.query('UPDATE Cliente SET ? WHERE Cli_id = ?', [editCliente, Cli_id]);

        res.redirect('/listClientes');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

routerClientes.get('/deleteClientes/:id', async(req, res)=>{
    try {
        const {id} = req.params;
        await pool.query('DELETE FROM Cliente WHERE Cli_id = ?', [id]);
        res.redirect('/listClientes')
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})

export default routerClientes;
