import  jwt from 'jsonwebtoken';
import pool from '../database.js';

const saludar = (req,res)=>{
    console.log("hola")
}

const getAllDoctors = async () => {
    const [data] = await pool.query('SELECT * FROM medicos');
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
    }

const agregarCita = async (req,res) => {
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
        res.redirect('/listUser');
     }
     catch (err) {
         res.status(500).json({message: err.message});
     }
};

const mostrarCitas = async(req, res) => {

    try {
        const {nombre} = req.body;
        // const [result] = await pool.query('SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.hora FROM citas c JOIN medicos m ON c.id_medico = m.id_medico');
        // const [result] = await pool.query(
        //     `SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.hora
        //     FROM citas c
        //     JOIN medicos m ON c.id_medico = m.id_medico
        //     WHERE c.id_paciente = ?`,[id]
            
        //   );

        
        const nombrePaciente = "Joselinho"
        //USAR ESTE

        // const [result] = await pool.query(
        // `SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.hora
        // FROM citas c
        // JOIN medicos m ON c.id_medico = m.id_medico
        // WHERE c.nombre = ?`,
        // [nombrePaciente]
        // );

        const [result] = await pool.query(
            `SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.hora
            FROM citas c
            JOIN medicos m ON c.id_medico = m.id_medico
            WHERE c.nombre = ?`,
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
        const [result] = await pool.query('SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.hora, m.nombre AS nombre_medico FROM citas c JOIN medicos m ON c.id_medico = m.id_medico WHERE c.id = ?', [id]);
        const citaEdit = result[0];
        const [doctores] = await pool.query('SELECT * from medicos');
        res.render('citas/editUser', { cita: citaEdit, doctores });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
};

const editarCita = async (req, res) => {
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
        res.redirect('/listUser');
        
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
    
    await pool.query("Insert into pacientes set ?", [newUsuario])
    res.redirect("/listUser")

}

const formularioRegistro = async (req,res) => {
    res.render("register")
}

export { 
    index,
    formularioAgregarCita,
    agregarCita,
    mostrarCitas,
    formularioEditarCita,
    editarCita,
    eliminarCita,
    registro,
    formularioRegistro
}