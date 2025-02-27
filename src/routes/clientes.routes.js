import {Router} from 'express'
import pool from '../database.js'

const routerClientes = Router();

// Añadimos a la lista
routerClientes.get('/addClientes', (req,res)=>{
    res.render('clientes/addClientes.hbs')
})

routerClientes.post('/addClientes', async(req, res)=>{
    try {
        const { Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion} = req.body;

        const newPersona = {
            Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion
        }
        await pool.query('INSERT INTO personas SET ?', [newPersona]);

        // Insertamos en la tabla Cliente usando el Per_id recién agregado
        await pool.query('INSERT INTO Cliente (Cli_per_id) VALUES (?)', [Per_id]);

        res.redirect('/listClientes');

    } catch (err) {
        res.status(500).json({message:err.message})
    }
});

// Obtenemos lista
routerClientes.get('/listClientes', async(req,res)=>{
    try{
        const [result] = await pool.query('SELECT * FROM Cliente');
        res.render('clientes/listClientes.hbs', {Cliente: result})
    }
    catch(err){
        res.status(500).json({message:err.message});
    }


})
// Select para editar por id
routerClientes.get('/editClientes/:Per_id', async(req, res)=>{
    try {
        const {Per_id} = req.params;
        const [persona]=await pool.query('SELECT * FROM personas WHERE Per_id=?', [Per_id]);
        const personaEdit = persona[0];
        res.render('clientes/editClientes.hbs', {persona: personaEdit});
    } catch (err) {
        res.status(500).json({message:err.message});
    }
});

// Actualizamos de la lista
routerClientes.post('/editClientes/:Cli_per_id', async(req, res)=>{
    try {
        const {Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion} = req.body;
        const {Per_id} = req.params;
        const editPersona = {Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion};
        await pool.query('UPDATE personas SET ? WHERE Cli_per_id = ?', [editPersona, Cli_per_id]);
        res.redirect('/listClientes')
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})

export default routerClientes;