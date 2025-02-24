import {Router} from 'express'
import pool from '../database.js'

const router = Router();

// Añadimos a la lista
router.get('/add', (req,res)=>{
    res.render('personas/add.hbs')
})

router.post('/add', async(req, res)=>{
    try {
        const {name, lastname, age, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion} = req.body;
        const newPersona = {
            name, lastname, age, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion
        }
        await pool.query('INSERT INTO personas SET ?', [newPersona]);
        res.redirect('/list')
    } catch (err) {
        res.status(500).json({message:err.message})
    }
});

// Obtenemos lista
router.get('/list', async(req,res)=>{
    try{
        const [result] = await pool.query('SELECT * FROM personas');
        res.render('personas/list.hbs', {personas: result})
    }
    catch(err){
        res.status(500).json({message:err.message});
    }
})
// Select para editar por id
router.get('/edit/:id', async(req, res)=>{
    try {
        const {id} = req.params;
        const [persona]=await pool.query('SELECT * FROM personas WHERE id=?', [id]);
        const personaEdit = persona[0];
        res.render('personas/edit.hbs', {persona: personaEdit});
    } catch (err) {
        res.status(500).json({message:err.message});
    }
});

// Actualizamos de la lista
router.post('/edit/:id', async(req, res)=>{
    try {
        const {name, lastname, age, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion} = req.body;
        const {id} = req.params;
        const editPersona = {name, lastname, age, Per_telefono, Per_email, Per_direccion, Per_tipo, Per_tipo_identificacion};
        await pool.query('UPDATE personas SET ? WHERE id = ?', [editPersona, id]);
        res.redirect('/list')
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})

// Borramos de la lista

router.get('/delete/:id', async(req, res)=>{
    try {
        const {id} = req.params;
        await pool.query('DELETE FROM personas WHERE id = ?', [id]);
        res.redirect('/list')
    } catch (err) {
        res.status(500).json({message:err.message});
    }
})

export default router;