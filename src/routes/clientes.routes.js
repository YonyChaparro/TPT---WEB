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

        const [result] = await pool.query(`SELECT * FROM Vista_personas_Clientes1;`);
        res.render('clientes/listClientes.hbs', {Cliente: result})
    }
    catch(err){
        res.status(500).json({message:err.message});
    }


})


//Obtener cliente por ID para edición
routerClientes.get('/editClientes/:Cli_id', async (req, res) => {
    try {
        const { Cli_id } = req.params;
        const [cliente] = await pool.query(`
            SELECT c.Cli_id, p.Per_id, p.Per_nombre, p.Per_telefono, p.Per_email, p.Per_direccion, p.Per_tipo, p.Per_tipo_identificacion
            FROM Cliente c
            JOIN personas p ON c.Cli_per_id = p.Per_id
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
        const { Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion } = req.body;

        console.log('Datos recibidos:', req.body);

        if (!Per_id) {
            return res.status(400).json({ message: "Falta el ID de la persona" });
        }

        // Verificar si la persona existe
        const persona = await pool.query('SELECT * FROM personas WHERE Per_id = ?', [Per_id]);

        if (persona.length === 0) {
            return res.status(404).json({ message: "La persona no existe" });
        }

        const editPersona = { Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion };

        // Ejecutar actualización
        const result = await pool.query('UPDATE personas SET ? WHERE Per_id = ?', [editPersona, Per_id]);

        console.log('Filas afectadas:', result.affectedRows); // 👈 Depuración

        if (result.affectedRows === 0) {
            return res.status(400).json({ message: "No se actualizó ningún registro" });
        }

        res.redirect('/listClientes');
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Borramos de la lista



routerClientes.get('/deleteClientes/:id', async(req, res)=>{
    try {
        const {id} = req.params;
        await pool.query('DELETE FROM Cliente WHERE Cli_id = ?', [id]);
        res.redirect('/listClientes')
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})




// ESTAMOS ARREGLANDO EL DELETE DE CLIENTES

export default routerClientes;