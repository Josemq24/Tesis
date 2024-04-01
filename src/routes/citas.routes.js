import {Router} from 'express';
import pool from '../database.js';
import { generarJWT } from '../helpers/tokens.js';
import jwt from "jsonwebtoken";
import PDFDocument from "pdfkit";
import {getAllCitas} from "../controllers/citasController.js";
import {index, agregarCita, formularioAgregarCita, mostrarCitas, formularioEditarCita, editarCita, eliminarCita, registro, formularioRegistro, useBot} from "../controllers/usuarioController.js";

const router = Router();

// MIDDLEWARE QUE VERIFICA SI UN USUARIO ESTA REGISTRADO

const isLogged = async (req, res, next) => {
    const {_token} = req.cookies
    if(_token){
        next()
    }else{
        res.redirect('/')
    }
}

router.get('/registro', formularioRegistro);
//USUARIO
router.get('/bot',useBot);

router.post("/registro", registro)

router.get('/User', isLogged, index);

router.get('/addUser', isLogged, formularioAgregarCita);

router.post('/addUser', isLogged, agregarCita);
  
router.get('/listUser', isLogged, mostrarCitas);

router.get('/editUser/:id', isLogged, formularioEditarCita);

router.post('/editUser/:id', isLogged, editarCita);

router.get('/deleteUser/:id', isLogged, eliminarCita);

//MEDICO

//router.get('/listDoc/:id', );

//router.get('/editDoc/:id', );

//router.post('/editDoc/:id', );

//router.get('/deleteDoc/:id', );


//ADMINISTRADOR

const getPacienteLogged = async (email) => {
    const [data] = await pool.query(`SELECT * FROM pacientes WHERE email = "${email}"`);
    return data
}


// router.post('/add', async (req, res) => {
//     try {
//        const {id_medico, nombre,id_paciente, fecha, hora} = req.body;
//        const newCita = {
//            nombre,
//            id_medico,
//            id_paciente,
//            fecha,
//            hora
//        };
//        await pool.query('INSERT INTO citas set ?', [newCita]);
//        res.redirect('/list');
//     }
//     catch (err) {
//         res.status(500).json({message: err.message});
//     }
// });

// router.get('/add', async (req, res) => {
//     const doctores = await getAllDoctors().then((doctors) => {return doctors});
//     res.render('citas/add', {doctores});
    
// });

// router.get('/list', async(req, res) => {
//     try {
//         const [result] = await pool.query('SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.hora FROM citas c JOIN medicos m ON c.id_medico = m.id_medico');
//         const doctores = await getAllDoctors().then((doctors) => {return doctors});
//         res.render('citas/list', {citas: result, doctores});
//     } 
//     catch (err) {
//         res.status(500).json({message: err.message});
//     }

// });

// router.get('/edit/:id', async(req, res) => {
//     try {
//         const { id } = req.params;
//         const [result] = await pool.query('SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.hora, m.nombre AS nombre_medico FROM citas c JOIN medicos m ON c.id_medico = m.id_medico WHERE c.id = ?', [id]);
//         const citaEdit = result[0];
//         const [doctores] = await pool.query('SELECT * from medicos');

//         res.render('citas/edit', { cita: citaEdit, doctores });
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// router.post('/edit/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const { id_medico, nombrePaciente, fecha, hora } = req.body;
//         const editCita = {
//             id_medico,
//             nombre: nombrePaciente,
//             fecha,
//             hora
//         };
//         await pool.query('UPDATE citas SET ? WHERE id = ?', [editCita, id]);
//         res.redirect('/list');
        
//     } catch (err) {
//         res.status(500).json({ message: err.message });
//     }
// });

// router.get('/delete/:id', async (req, res) => {
//     try {
//         const {id} = req.params;
//         await pool.query('DELETE FROM citas WHERE id = ?', [id]);
//         res.redirect('/list');
//     }
//     catch (err) {
//         res.status(500).json({message: err.message});
//     }
// });

router.get('/logout', async(req, res) => {
    // Destruyes la cookie y redireccionas a la vista que quieras
    res.cookie('_token','', {
        maxAge: 0
    }).redirect('/')
})
 
//AUTENTICACION DE LOS CLIENTES
router.post('/auth', async (req, res) => { 
    // Extraemos el email y la contrasena del body
	let email = req.body.email;
	let password = req.body.password;

    // Buscamos al userClient que este registrado con el email ingresado
    const [userCliente] =  await pool.query("SELECT * FROM pacientes WHERE email = ?", [email])

    // verificamos por console.log
    // console.log(userCliente)

    // Verificamos si la contraseña ingresada es correcta para el email dado
    const passwordCorrect = userCliente.length === 0 ? false : password === userCliente[0].contrasena

    // Si el usuario no existe, o la contraseña envia mensaje de error
    if(!(userCliente && passwordCorrect)) {
        // Retornar un res.render es redundante y no es necesario
        return res.render("login", {
            error: [{msg: "Email o contraseña invalida"}]
       })
    }else{
        // Si los datos son correctos, creamos el usuario para registrar en el token
        const userForToken = {
            id: userCliente[0].id_paciente,
            nombre: userCliente[0].nombre,
            apellido: userCliente[0].apellido,
            email: userCliente[0].email,
        }
        const token = generarJWT(userForToken)

        // Salvamos la cookie
        return res.cookie("_token", token, {
            httpOnly: true,
            secure: true
        }).redirect("/listUser")
    }
});

//GENERACION DE PDF

router.get('/generate-pdf', async (req, res) => {
    try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Se agrega 1 porque getMonth() devuelve un índice base cero
        
        const [citas] = await pool.query('SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.hora FROM citas c JOIN medicos m ON c.id_medico = m.id_medico'); // Obtén todas las citas de tu base de datos
        const citasDelMes = citas.filter(cita => {
            const citaDate = new Date(cita.fecha);
            const citaMonth = citaDate.getMonth() + 1; // Se agrega 1 porque getMonth() devuelve un índice base cero
            return citaMonth === currentMonth;
        });
        
        const doc = new PDFDocument();
        const filename = 'citas.pdf';

        // Configurar encabezados de la respuesta
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');

        // Iniciar el stream de PDFDocument
        doc.pipe(res);

        // Generar contenido del documento PDF
        doc.font('Helvetica-Bold').fontSize(12).text('Lista de Citas del Mes Actual', { align: 'center' }).moveDown();

        // Definir posición inicial de la tabla
        let startX = 50;
        let startY = doc.y + 50;

        // Definir tamaño de columnas
        let columnWidths = [50, 150, 150, 100, 100];

        // Definir encabezados de la tabla
        let headers = ['Médico', 'Paciente', 'Fecha', 'Hora'];
        doc.font('Helvetica-Bold');
        headers.forEach((header, i) => {
            doc.text(header, startX + i * 150, startY);
        });
        doc.moveDown();

        // Definir filas de la tabla
        doc.font('Helvetica');
        citasDelMes.forEach((cita, rowIndex) => {
            let rowY = startY + (rowIndex + 1) * 30;
            // Acceder a las columnas correctas y mostrar los datos correspondientes
            doc.text(cita.nombre_medico, startX +0, rowY);
            doc.text(cita.nombre, startX + 150, rowY);
            doc.text(cita.fecha, startX + 300, rowY);
            doc.text(cita.hora, startX + 450, rowY);
        });

        // Finalizar el stream de PDFDocument
        doc.end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export default router;