import  jwt from 'jsonwebtoken';
import pool from '../database.js';

const mostrarCitas = async(req, res) => {

    const {_token} = req.cookies;
    const decoded = jwt.verify(_token, "papagaiodomar")
    const {id} = decoded;
    try {
        const [result] = await pool.query(
            `SELECT citas.id as id,
                citas.nombre as nombre, 
                medicos.nombre as nombre_medico,
                medicos.apellido as apellido_medico,
                pacientes.apellido AS apellido_paciente, 
                DATE_FORMAT(citas.fecha, "%a %d-%m-%Y") AS fecha, 
                citas.horaCita,
                CASE
                WHEN citas.horaCita = 0 THEN '8:00 AM'
                WHEN citas.horaCita = 1 THEN '9:00 AM'
                WHEN citas.horaCita = 2 THEN '10:00 AM'
                WHEN citas.horaCita = 3 THEN '11:00 AM'
                WHEN citas.horaCita = 4 THEN '12:00 PM'
                WHEN citas.horaCita = 5 THEN '1:00 PM'
                WHEN citas.horaCita = 6 THEN '2:00 PM'
                WHEN citas.horaCita = 7 THEN '3:00 PM'
                WHEN citas.horaCita = 8 THEN '4:00 PM'
                WHEN citas.horaCita = 9 THEN '5:00 PM'
                ELSE 'N/A'
                END AS horaDelaCita
                FROM citas 
                INNER JOIN medicos ON citas.id_medico = medicos.id_medico
                INNER JOIN pacientes ON citas.id_paciente = pacientes.id_paciente
                WHERE citas.id_medico =?
                ORDER BY citas.fecha ASC, citas.horaCita ASC;`,
             [id]);

        res.render('citas/listDoc', {citas: result});
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
};

const editarCita = async(req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.horaCita, m.nombre AS nombre_medico FROM citas c JOIN medicos m ON c.id_medico = m.id_medico WHERE c.id = ?', [id]);
        const citaEdit = result[0];
        const [doctores] = await pool.query('SELECT * from medicos WHERE id_medico = ?', [citaEdit.id_medico]);

        res.render('citas/editDoc', { cita: citaEdit,doctores });
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log('este es el error: ', err)
    }
};

const editarCitaPost = async (req, res) => {
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
                    res.redirect('/listDoc');
                } else {
                    return res.status(400).json({ message: 'La hora de la cita no está disponible' });
                }
                }}else{
                    return res.status(400).json({message: 'El doctor no atiende en ese dia'});
                }
        });
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
}

const eliminarCita = async (req, res) => {
        try {
            const {id} = req.params;
            await pool.query('DELETE FROM citas WHERE id = ?', [id]);
            res.redirect('/listDoc');
        }
        catch (err) {
            res.status(500).json({message: err.message});
        }
    
};
export {

    mostrarCitas,
    editarCita,
    editarCitaPost,
    eliminarCita
};
