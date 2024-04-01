import  jwt from 'jsonwebtoken';
import pool from '../database.js';
import {generarJWT} from "../helpers/tokens.js"

const getAllDoctors = async () => {
    const [data] = await pool.query('SELECT * FROM medicos');
    return data

};

const crearMedico = async (req,res) =>{
    res.render("medicos/add.hbs")
;}

const mostrarDoctores = async (req,res) =>{
    const doctores = await getAllDoctors().then((doctors) => {return doctors})
    res.render("citas/docs.hbs", {doctores})
};

const insertMedico = async (req,res) => {
    console.log(req.body)
    try{
        const {nombre, apellido, sexo, email, contrasena, especialidad, telefono, direccion} = req.body
        const newMedico = {
            nombre,
            apellido,
            sexo,
            email,
            contrasena,
            especialidad,
            telefono,
            direccion
        }
        await pool.query("INSERT INTO medicos set ?", [newMedico])
        res.redirect("/docs")
    }catch(error){
        console.log(error)
    }
};

const mostrarEditarDoctor = async(req,res) =>{
    try {
        const {id} = req.params;
        const [medico] = await pool.query('SELECT * FROM medicos WHERE id_medico = ?', [id]);
        const medicoEdit = medico[0];
        res.render('medicos/edit.hbs', {medico: medicoEdit});
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
};

const editarDoctor = async (req,res) =>{
    try {
        const { id } = req.params;
        const {nombre, apellido, sexo, email, contrasena, especialidad, telefono, direccion} = req.body;
        const editMedico = {
            nombre,
            apellido,
            sexo,
            email,
            contrasena,
            especialidad,
            telefono,
            direccion
        };
        await pool.query('UPDATE medicos set ? WHERE id_medico = ?', [editMedico, id]);
        res.redirect('/docs');
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
}

const eliminarDoctor = async (req,res)=>{
    try{
        const {id} = req.params
        await pool.query("DELETE FROM medicos WHERE id_medico = ?", [id])
        res.redirect("/docs")
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

const vistaAdmin = async (req, res) => {
    res.render('index');
};

const addAdmin = async (req, res) => {
    const doctores = await getAllDoctors().then((doctors) => {return doctors});
    res.render('citas/add', {doctores});
    
};

const addAdminPost = async (req, res) => {
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
};

const mostrarLista = async(req, res) => {
    try {
        const [result] = await pool.query('SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%a %d-%m-%Y") AS fecha, c.hora FROM citas c JOIN medicos m ON c.id_medico = m.id_medico');
        const doctores = await getAllDoctors().then((doctors) => {return doctors});
        res.render('citas/list', {citas: result, doctores});
    } 
    catch (err) {
        res.status(500).json({message: err.message});
    }

};

const editLista = async(req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.hora, m.nombre AS nombre_medico FROM citas c JOIN medicos m ON c.id_medico = m.id_medico WHERE c.id = ?', [id]);
        const citaEdit = result[0];
        const [doctores] = await pool.query('SELECT * from medicos');

        res.render('citas/edit', { cita: citaEdit, doctores });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const editListaPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_medico, nombrePaciente, fecha, hora } = req.body;
        const editCita = {
            id_medico,
            nombre: nombrePaciente,
            fecha,
            hora
        };
        await pool.query('UPDATE citas SET ? WHERE id = ?', [editCita, id]);
        res.redirect('/list');
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const deleteCita = async (req, res) => {
    try {
        const {id} = req.params;
        await pool.query('DELETE FROM citas WHERE id = ?', [id]);
        res.redirect('/list');
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
};

export {
    vistaAdmin,
    addAdmin,
    addAdminPost,
    mostrarLista,
    editLista,
    editListaPost,
    deleteCita,
    crearMedico,
    insertMedico,
    mostrarDoctores, 
    mostrarEditarDoctor,
    editarDoctor,
    eliminarDoctor
}