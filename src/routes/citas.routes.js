import {Router} from 'express';
import pool from '../database.js';
// import { saludar} from "../controllers/usuarioController.js"
import { generarJWT } from '../helpers/tokens.js';
import jwt from "jsonwebtoken";

const router = Router();

const getAllDoctors = async () => {
    const [data] = await pool.query('SELECT * FROM medicos');
    return data
}

const getPacienteLogged = async (email) => {
    const [data] = await pool.query(`SELECT * FROM pacientes WHERE email = "${email}"`);
    return data
}

router.get('/adm', (req, res) => {
    res.render('index');
});

router.get('/User', (req, res) => {
    res.render('indexUser');
});

router.get('/add', async (req, res) => {
    const {_token} = req.cookies;
    const decoded = jwt.verify(_token, "papagaiodomar");
    console.log(decoded)
    const doctores = await getAllDoctors().then((doctors) => {return doctors});
    console.log(doctores);
    res.render('citas/add', {doctores, decoded});
    
});

router.get('/addUser', async (req, res) => {
    const {_token} = req.cookies;
    const decoded = jwt.verify(_token, "papagaiodomar");
    console.log(decoded)
    const doctores = await getAllDoctors().then((doctors) => {return doctors});
    console.log(doctores);
    res.render('citas/addUser', {doctores, decoded});
    
});

router.post('/auth', async (req, res) => {
	let email = req.body.email;
	let password = req.body.password;
    if(email == "admin@admin.com" && password == "123"){
        return res.redirect('/list')
    }else if (email == "usuario@usuario.com" && password == '123'){
        const paciente = await getPacienteLogged(req.body.email).then((paciente) => {return paciente})
        const token = generarJWT({id: paciente[0].id_paciente, nombre: paciente[0].nombre});
        // const decoded = jwt.verify(token, "papagaiodomar");
        return res.cookie('_token', token, {
            httpOnly: true,
        }).redirect('/User')
    }else if(email == "doctor@doctor.com" && password =='123'){
        return res.redirect('/listDoc')
    }
        return res.redirect('/')
})

router.post('/add', async (req, res) => {
    console.log(req.body)
    try {
       const {id_medico, nombre,id_paciente, fecha, hora} = req.body;
       const newCita = {
           nombre,
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
    console.log(req.body)
    try {
       const {id_medico, nombre,id_paciente, fecha, hora} = req.body;
       const newCita = {
           nombre,
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
        const [result] = await pool.query('SELECT * FROM citas');
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
        console.log(citaEdit, cita);
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