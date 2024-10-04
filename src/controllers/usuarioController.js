import  jwt from 'jsonwebtoken';
import pool from '../database.js';
import {generarJWT} from "../helpers/tokens.js"
import {spawn} from "child_process"
import e from 'express';


const saludar = (req,res)=>{
    console.log("hola")
}

const getAllDoctors = async () => {
    const [data] = await pool.query('SELECT * FROM medicos ORDER BY nombre');
    return data
}

const index = async (req,res) => {
    res.render('indexUser');
}

const formularioAgregarCita = async (req,res) => {
        const {_token} = req.cookies;
        const decoded = jwt.verify(_token, "papagaiodomar");
        const doctores = await getAllDoctors().then((doctors) => {return doctors});
        res.render('citas/addUser', {doctores, decoded});
};

//CREAR CITA
const agregarCita = async (req,res) => {
    try {
        const {id_medico, nombre, id_paciente, fecha, hora, dia, horaI, horaF, horaCita} = req.body;
        const newCita = {
            nombre,
            id_medico,
            id_paciente,
            fecha,
            hora,
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

                            res.redirect('/listUser');
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

const mostrarCitas = async(req, res) => {

    const {_token} = req.cookies;
    const decoded = jwt.verify(_token, "papagaiodomar");
    const doctores = await getAllDoctors().then((doctors) => {return doctors});
    try {
        const {nombre} = req.body;      
        const nombrePaciente = decoded.nombre; 
        const [result] = await pool.query(

            `SELECT c.id,
                c.id_medico,
                c.id_paciente,
                m.nombre AS nombre_medico,
                c.nombre,
                DATE_FORMAT(c.fecha, "%a %d-%m-%Y") AS fecha,
                c.hora,
                c.horaCita,
                m.especialidad,
                m.apellido,
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
                  JOIN medicos m ON c.id_medico = m.id_medico
                  WHERE c.nombre = ?
                  ORDER BY c.fecha ASC, c.horaCita ASC;`,
            [nombrePaciente]
          );
        res.render('citas/listUser', {citas: result});

    }
    catch (err) {
        res.status(500).json({message: err.message});
    }

};

const formularioEditarCita = async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.horaCita, m.nombre AS nombre_medico FROM citas c JOIN medicos m ON c.id_medico = m.id_medico WHERE c.id = ?', [id]);
        const citaEdit = result[0];
        const [doctores] = await pool.query('SELECT * from medicos ORDER BY nombre');
        console.log(citaEdit);
        res.render('citas/editUser', { cita: citaEdit, doctores, result });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const editarCita = async (req, res) => {
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
                    res.redirect('/listUser');
                } else {
                    return res.status(400).json({ message: 'La hora de la cita no está disponible' });
                }
                }}else{
                    return res.status(400).json({message: 'El doctor no atiende en ese dia'});
                }
        })

    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const eliminarCita = async (req, res) => {
    try {
        const {id} = req.params;
        await pool.query('DELETE FROM citas WHERE id = ?', [id]);
        res.redirect('/listUser');
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
};

const registro = async (req,res) => {
    const {nombrePaciente, apellidoPaciente, telefono, direccion, sexo, fechaNacimiento, email, password} = req.body

    const [existeUsuario] = await pool.query("select * from pacientes where email = ?", [email])

    const calcularEdad = (fechaNacimiento) => {
        const fechaActual = new Date();
        const anoActual = parseInt(fechaActual.getFullYear());
        const mesActual = parseInt(fechaActual.getMonth()) + 1;
        const diaActual = parseInt(fechaActual.getDate());

        const anoNacimiento = parseInt(String(fechaNacimiento).substring(0,4));
        const mesNacimiento = parseInt(String(fechaNacimiento).substring(5,7));
        const diaNacimiento = parseInt(String(fechaNacimiento).substring(8,10));

        let edad = anoActual - anoNacimiento;
        if (mesActual < mesNacimiento) {
            edad--;
        } else if (mesActual === mesNacimiento) {
            if (diaActual < diaNacimiento) {
                edad--;
            }
        }
        return edad;
    };

     if(existeUsuario.length !== 0){
         return res.render("register", {
             error: [{msg: "El email ya esta en uso, por favor introduzca otro"}]
        })
     }

    const newUsuario = {
        email,
        nombre: nombrePaciente,
        apellido: apellidoPaciente,
        contrasena: password,
        edad: calcularEdad(fechaNacimiento),
        sexo,
        telefono,
        fecha_nacimiento: fechaNacimiento,
        direccion
    }
    
    const [result] = await pool.query("Insert into pacientes set ?", [newUsuario])
    const [usuarioCreado] = await pool.query("select * from pacientes where email = ?", [email])
    const user = usuarioCreado[0]
    const token = generarJWT({id: user.id_paciente, nombre: user.nombre})
    
    return res.cookie("_token", token, {
        httpOnly: true,
        secure: true
    }).redirect("/listUser")

}
 
const formularioRegistro = async (req,res) => {
    res.render("register")
}

//CHATBOT

const bot = async (req,res)=> {
    return res.render("citas/bot")
}

const useBot = async (req,res) => {
    const vector = req.body
    console.log(vector)
    const prueba = spawn("python", vector)

    try {
        prueba.stdout.on("data", (data)=>{
            const respuesta = data.toString()
            console.log(respuesta)
            res.json({
                resultado: respuesta,
                estado: "ok"
            })
        })
    } catch(error){
        console.log(error)
    }

};


// `SELECT c.id,
            // c.id_medico,
            // c.id_paciente,
            // m.nombre AS nombre_medico,
            // c.nombre,
            // DATE_FORMAT(c.fecha, "%a %d-%m-%Y") AS fecha,
            // c.hora,
            // c.horaCita,
            // m.especialidad,
            // m.apellido,
            // CASE
            //     WHEN c.horaCita = 0 THEN '8:00 AM'
            //     WHEN c.horaCita = 1 THEN '9:00 AM'
            //     WHEN c.horaCita = 2 THEN '10:00 AM'
            //     WHEN c.horaCita = 3 THEN '11:00 AM'
            //     WHEN c.horaCita = 4 THEN '12:00 PM'
            //     WHEN c.horaCita = 5 THEN '1:00 PM'
            //     WHEN c.horaCita = 6 THEN '2:00 PM'
            //     WHEN c.horaCita = 7 THEN '3:00 PM'
            //     WHEN c.horaCita = 8 THEN '4:00 PM'
            //     WHEN c.horaCita = 9 THEN '5:00 PM'
            //     ELSE 'N/A'
            // END AS horaDelaCita
            // FROM citas c
            // JOIN medicos m ON c.id_medico = m.id_medico
            // WHERE c.nombre = ?
            // ORDER BY c.fecha ASC;`,

export { 
    index,
    formularioAgregarCita,
    agregarCita,
    mostrarCitas,
    formularioEditarCita,
    editarCita,
    eliminarCita,
    registro,
    formularioRegistro,
    useBot,
    bot
}