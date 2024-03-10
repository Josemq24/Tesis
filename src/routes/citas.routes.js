import {Router} from 'express';
import pool from '../database.js';

const router = Router();

const getAllDoctors = async () => {
    const [data] = await pool.query('SELECT * FROM medicos');
    return data
}

router.get('/adm', (req, res) => {
    res.render('index');
});
router.get('/User', (req, res) => {
    res.render('indexUser');
});

router.get('/add', getAllDoctors);

router.get('/addUser', (req, res) => {
    res.render('citas/addUser');
});

router.post('/auth',(req, res) => {
	let email = req.body.email;
	let password = req.body.password;
    if(email == "admin@admin.com" && password == "123"){
        return res.redirect('/adm')
    }else if (email == "usuario@usuario.com" && password == '123'){
        return res.redirect('/User')
    }else if(email == "doctor@doctor.com" && password =='123'){
        return res.redirect('/listDoc')
    }
        return res.redirect('/')
}, )

router.post('/add', async (req, res) => {
    try {
       const {id_medico, id_paciente, fecha, hora} = req.body;
       const newCita = {
           id_medico,
           id_paciente,
           fecha,
           hora
       };
       await pool.query('INSERT INTO citas set ?', [newCita]);
       res.redirect('/list');
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.post('/addUser', async (req, res) => {
    try {
       const {nombreDoctor, nombrePaciente, fecha, hora} = req.body;
       const newCita = {
           nombreDoctor,
           nombrePaciente,
           fecha,
           hora
       };
       await pool.query('INSERT INTO citas set ?', [newCita]);
       res.redirect('/listUser');
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/list', async(req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM citas');
        res.render('citas/list', {citas: result});

    }
    catch (err) {
        res.status(500).json({message: err.message});
    }

});

router.get('/listUser', async(req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM citas WHERE nombrePaciente ="Alexander Sanchez"');
        res.render('citas/listUser', {citas: result});

    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/listDoc', async(req, res) => {
    try {
        const [result] = await pool.query('SELECT * FROM citas WHERE nombreDoctor = "Miguel Quintero"');
        res.render('citas/listDoc', {citas: result});

    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/edit/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const [cita] = await pool.query('SELECT * FROM citas WHERE id = ?', [id]);
        const citaEdit = cita[0];
        res.render('citas/edit', {cita: citaEdit});
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.post('/edit/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {nombreDoctor, nombrePaciente, fecha, hora} = req.body;
        const editCita = {
            nombreDoctor,
            nombrePaciente,
            fecha,
            hora
        };
        await pool.query('UPDATE citas set ? WHERE id = ?', [editCita, id]);
        res.redirect('/list');
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/editDoc/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const [cita] = await pool.query('SELECT * FROM citas WHERE id = ?', [id]);
        const citaEdit = cita[0];
        res.render('citas/editDoc', {cita: citaEdit});
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.post('/editDoc/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {nombreDoctor, nombrePaciente, fecha, hora} = req.body;
        const editCita = {
            nombreDoctor,
            nombrePaciente,
            fecha,
            hora
        };
        await pool.query('UPDATE citas set ? WHERE nombreDoctor = "Miguel Quintero"', [editCita, id]);
        res.redirect('/listDoc');
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/editUser/:id', async(req, res) => {
    try {
        const {id} = req.params;
        const [cita] = await pool.query('SELECT * FROM citas WHERE id = ?', [id]);
        const citaEdit = cita[0];
        res.render('citas/editUser', {cita: citaEdit});
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.post('/editUser/:id', async (req, res) => {
    try {
        const {id} = req.params;
        const {nombreDoctor, nombrePaciente, fecha, hora} = req.body;
        const editCita = {
            nombreDoctor,
            nombrePaciente,
            fecha,
            hora
        };
        await pool.query('UPDATE citas set ? WHERE nombrePaciente = "Alexander Sanchez"', [editCita, id]);
        res.redirect('/listUser');
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/delete/:id', async (req, res) => {
    try {
        const {id} = req.params;
        await pool.query('DELETE FROM citas WHERE id = ?', [id]);
        res.redirect('/list');
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/deleteUser/:id', async (req, res) => {
    try {
        const {id} = req.params;
        await pool.query('DELETE FROM citas WHERE id = ?', [id]);
        res.redirect('/listUser');
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/deleteDoc/:id', async (req, res) => {
    try {
        const {id} = req.params;
        await pool.query('DELETE FROM citas WHERE id = ?', [id]);
        res.redirect('/listDoc');
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

export default router;