import {Router} from 'express'
import pool from '../database.js'

const router = Router();

// Añadimos a la lista
router.get('/add', (req,res)=>{
    res.render('personas/add.hbs')
})

router.post('/add', async(req, res)=>{
    try {
        const { Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion} = req.body;
        const newPersona = {
            Per_id, Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion
        }
        await pool.query('INSERT INTO Persona SET ?', [newPersona]);
        res.redirect('/list')
    } catch (err) {
        res.status(500).json({message:err.message})
    }
});

// Obtenemos lista
router.get('/list', async(req,res)=>{
    try{
        const [result] = await pool.query('SELECT * FROM Persona');
        res.render('personas/list.hbs', {personas: result})
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})
// Select para editar por id
router.get('/edit/:Per_id', async(req, res)=>{
    try {
        const {Per_id} = req.params;
        const [persona]=await pool.query('SELECT * FROM Persona WHERE Per_id=?', [Per_id]);
        const personaEdit = persona[0];
        res.render('personas/edit.hbs', {persona: personaEdit});
    } catch (err) {
        res.status(500).json({message:err.message});
    }
});

// Actualizamos de la lista
router.post('/edit/:Per_id', async(req, res)=>{
    try {
        const {Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion} = req.body;
        const {Per_id} = req.params;
        const editPersona = {Per_nombre, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion};
        await pool.query('UPDATE Persona SET ? WHERE Per_id = ?', [editPersona, Per_id]);
        res.redirect('/list')
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})

// Borramos de la lista

router.get('/delete/:Per_id', async(req, res)=>{  //Hacer todo el SQL Acá;
    try {
        const {Per_id} = req.params;
        await pool.query('DELETE FROM Persona WHERE Per_id = ?', [Per_id]);
        res.redirect('/list')
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})


export default router;

// *****************************************RUTAS CLIENTES*********************






