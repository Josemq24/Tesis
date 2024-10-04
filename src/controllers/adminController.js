import  jwt from 'jsonwebtoken';
import pool from '../database.js';
import {generarJWT} from "../helpers/tokens.js"

const getAllDoctors = async () => {
    const [data] = await pool.query('SELECT * FROM medicos ORDER BY nombre');
    return data

};

const getAllPacientes = async () => {
    const [data] = await pool.query('SELECT * FROM pacientes ORDER BY nombre');
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

    try{
        const {nombre, apellido, sexo, email, contrasena, especialidad, telefono, direccion, dia, horaI, horaF} = req.body
        const newMedico = {
            nombre,
            apellido,
            sexo,
            email,
            contrasena,
            especialidad,
            telefono,
            direccion,
            dia,
            horaI,
            horaF,
            cantCitas: horaF - horaI
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
        const {nombre, apellido, sexo, email, contrasena, especialidad, telefono, direccion, dia, horaI, horaF} = req.body;
        const editMedico = {
            nombre,
            apellido,
            sexo,
            email,
            contrasena,
            especialidad,
            telefono,
            direccion, 
            dia,
            horaI,
            horaF
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
    const pacientes = await getAllPacientes().then((pacientes) => {return pacientes});
    res.render('citas/add', {doctores, pacientes});
    
};

const addAdminPost = async (req, res) => {
    try {
       const {id_medico, nombre, id_paciente, fecha, horaCita} = req.body;
       
       const newCita = {
           nombre,
           id_medico,
           id_paciente,
           fecha,
           horaCita
       };

       //OBTENGO LA HORA DE LA CITA
       const horaDeCita = newCita.horaCita;

       //OBTENGO LAS HORAS DISPONIBLES
       const horasDisponibles = [8,9,10,11,12,13,14,15,16,17];
       
       //GUARDO LA HORA DE LA CITA
       const horaSemana = horasDisponibles[horaDeCita];

       //OBTENGO LA HORA DE INICIO Y FIN DEL DOCTOR
       const[horaDoctor] = await pool.query('SELECT horaI, horaF FROM medicos WHERE id_medico = ?', [id_medico]);
       
       //CONVIERTO LA HORA DE INICIO Y FIN DEL DOCTOR EN UN ARRAY
       const horaDoctorDisponible = [];
       for (let i = horaDoctor[0].horaI; i <= horaDoctor[0].horaF; i++) {
           horaDoctorDisponible.push(i);
       }

       //OBTENIENDO EL DIA ACTUAL
       const fechaActual = new Date(Date.now() - (4 * 60 * 60 * 1000));

       //OBTENGO EL DIA DE LA CITA
       const numeroDia = new Date(newCita.fecha);
       const Dia = numeroDia.getDay();
       const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
      

       //ESTE ES EL DIA DE LA CITA
       const diaSemana = diasSemana[Dia];
       const diaSemanaCita = diaSemana.toLowerCase();


       //QUERY DONDE EXTRAIGO EL DIA QUE EL DOCTOR PASA CONSULTA 
       const [diaDoc] = await pool.query('SELECT dia FROM medicos WHERE id_medico = ?', [id_medico]);


       //CONVIERTO EL DIA DEL DOCTOR EN UN ARRAY
       const diaDoctor = diaDoc[0].dia;
       const diaDoctorSinEspacios = diaDoctor.replace(/\s+/g, "");
       const diaArray = diaDoctorSinEspacios.split(',');

       //VERIFICO SI YA EXISTE UNA CITA EN ESA FECHA Y HORA
       await pool.query('SELECT * FROM citas WHERE fecha = ? AND horaCita = ? AND id_medico = ?', [fecha, horaCita, id_medico]).then((result) => {
           
        //VERIFICO SI LA FECHA DE LA CITA ES MAYOR A LA FECHA ACTUAL
        if (numeroDia >= fechaActual) {

            //VERIFICO SI EL DOCTOR ATIENDE EN ESE DIA
            if (diaArray.includes(diaSemanaCita)) {
                if (result[0].length !== 0) {
                    return res.status(400).json({ message: 'Ya existe una cita en esa fecha y hora' });
                } else {
                    //VERIFICO SI LA HORA DE LA CITA ESTÁ DISPONIBLE
                    if (horaDoctorDisponible.includes(horaSemana)) {
                        pool.query('INSERT INTO citas set ?', [newCita]);
                        console.log(newCita)
                        res.redirect('/list');
                    } else {
                        return res.status(400).json({ message: 'La hora de la cita no está disponible' });
                    }
                }
            } else {
                return res.status(400).json({ message: 'El doctor no atiende en ese día' });
            }
        } else {
            res.status(400).json({ message: 'No puede agendar una cita en una fecha anterior a la actual o el mismo día' });
        }
       })

    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
};

const mostrarLista = async(req, res) => {
    try {
        const [result] = await pool.query(
            `SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, 
                DATE_FORMAT(c.fecha, "%a %d-%m-%Y") AS fecha, c.horaCita, m.especialidad, m.apellido,
                CASE
                    WHEN c.horaCita = 0 THEN '8:00 AM'
                    WHEN c.horaCita = 1 THEN '9:00 AM'
                    WHEN c.horaCita = 2 THEN '10:00 AM'
                    WHEN c.horaCita = 3 THEN '11:00 AM'
                    WHEN c.horaCita = 4 THEN '12:00 PM'
                    WHEN c.horaCita = 5 THEN '1:00 PM'
                    WHEN c.horaCita = 6 THEN '2:00 PM'
                    WHEN c.horaCita = 7 THEN '3:00 PM'
                    WHEN c.horaCita = 8 THEN '4:00 PM'
                    WHEN c.horaCita = 9 THEN '5:00 PM'
                    ELSE 'N/A'
                  END AS horaDelaCita
                FROM citas c
                JOIN medicos m ON c.id_medico = m.id_medico;`
            );
            console.log(result)

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
        const [result] = await pool.query('SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.horaCita, m.nombre AS nombre_medico FROM citas c JOIN medicos m ON c.id_medico = m.id_medico WHERE c.id = ?', [id]);
        const citaEdit = result[0];
        const [doctores] = await pool.query('SELECT * from medicos ORDER BY nombre');
        res.render('citas/edit', { cita: citaEdit, doctores, result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const editListaPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_medico, nombrePaciente, fecha, horaCita } = req.body;
        const editCita = {
            id_medico,
            nombre: nombrePaciente,
            fecha,
            horaCita
        };

        
        //OBTENGO LA HORA DE LA CITA
        const horaDeCita = editCita.horaCita;

        //OBTENGO LAS HORAS DISPONIBLES
        const horasDisponibles = [8,9,10,11,12,13,14,15,16,17];
        
        //GUARDO LA HORA DE LA CITA
        const horaSemana = horasDisponibles[horaDeCita];

        //OBTENGO LA HORA DE INICIO Y FIN DEL DOCTOR
        const[horaDoctor] = await pool.query('SELECT horaI, horaF FROM medicos WHERE id_medico = ?', [id_medico]);
        
        //CONVIERTO LA HORA DE INICIO Y FIN DEL DOCTOR EN UN ARRAY
        const horaDoctorDisponible = [];
        for (let i = horaDoctor[0].horaI; i <= horaDoctor[0].horaF; i++) {
            horaDoctorDisponible.push(i);
        }
        const numeroDia = new Date(editCita.fecha);
        const Dia = numeroDia.getDay();
        const diasSemana = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
       

        //ESTE ES EL DIA DE LA CITA
        const diaSemana = diasSemana[Dia];
        const diaSemanaCita = diaSemana.toLowerCase();


        //QUERY DONDE EXTRAIGO EL DIA DEL DOCTOR
        const [diaDoc] = await pool.query('SELECT dia FROM medicos WHERE id_medico = ?', [id_medico]);


        //CONVIERTO EL DIA DEL DOCTOR EN UN ARRAY
        const diaDoctor = diaDoc[0].dia;
        const diaDoctorSinEspacios = diaDoctor.replace(/\s+/g, "");
        const diaArray = diaDoctorSinEspacios.split(',');

        await pool.query('SELECT * FROM citas WHERE fecha = ? AND horaCita = ? AND id_medico = ?', [fecha, horaCita, id_medico]).then((result) => {
            if(diaArray.includes(diaSemanaCita)){
                if (result[0].length !== 0) {
                    return res.status(400).json({message: 'Ya existe una cita en esa fecha y hora'});
                }else{
                    if (horaDoctorDisponible.includes(horaSemana)) {
                    pool.query('UPDATE citas set ? WHERE id =?', [editCita, id]);
                    res.redirect('/list');
                } else {
                    return res.status(400).json({ message: 'La hora de la cita no está disponible' });
                }
                }}else{
                    return res.status(400).json({message: 'El doctor no atiende en ese dia'});
                }
        })
        // await pool.query('UPDATE citas SET ? WHERE id = ?', [editCita, id]);
        // res.redirect('/list');
        
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