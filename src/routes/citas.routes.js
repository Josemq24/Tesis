import {Router} from 'express';
import pool from '../database.js';
import { generarJWT } from '../helpers/tokens.js';
import jwt from "jsonwebtoken";
import PDFDocument from "pdfkit";
import {getAllCitas} from "../controllers/citasController.js";
import {index, agregarCita, formularioAgregarCita, mostrarCitas, formularioEditarCita, editarCita, eliminarCita, registro, formularioRegistro, useBot, bot} from "../controllers/usuarioController.js";

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
router.get('/bot', bot);
router.post('/usebot', useBot);

router.post("/registro", registro)

router.get('/User', isLogged, index);

router.get('/addUser', isLogged, formularioAgregarCita);

router.post('/addUser', isLogged, agregarCita);
  
router.get('/listUser', isLogged, mostrarCitas);

router.get('/editUser/:id', isLogged, formularioEditarCita);

router.post('/editUser/:id', isLogged, editarCita);

router.get('/deleteUser/:id', isLogged, eliminarCita);


//ADMINISTRADOR

const getPacienteLogged = async (email) => {
    const [data] = await pool.query(`SELECT * FROM pacientes WHERE email = "${email}"`);
    return data
}


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

        //Extraemos la fecha actual
        const currentDate = new Date();

        //Extraemos el mes actual
        const currentMonth = currentDate.getMonth() + 1; // Se agrega 1 porque getMonth() devuelve un índice base cero
        const meses = ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"];
        const mesActual = meses[currentMonth - 1];

        //
        const [citas] = await pool.query(`SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, m.apellido as apellido_medico,
            c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.hora,
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
            FROM citas c JOIN medicos m ON c.id_medico = m.id_medico`); // Obtén todas las citas de tu base de datos
        console.log(citas)
        const citasDelMes = citas.filter(cita => {
            const citaDate = new Date(cita.fecha);
            const citaMonth = citaDate.getMonth() + 1; // Se agrega 1 porque getMonth() devuelve un índice base cero
            return citaMonth === currentMonth;
        });
        
        const doc = new PDFDocument();
        const filename = 'citas.pdf';
        doc.image("./src/routes/logo.jpg", 35, 15, {scale: 0.40})
        // Configurar encabezados de la respuesta
        res.setHeader('Content-disposition', 'attachment; filename="' + filename + '"');
        res.setHeader('Content-type', 'application/pdf');


        // Iniciar el stream de PDFDocument
        doc.pipe(res);


        // Generar contenido del documento PDF
        doc.font('Helvetica-Bold').fontSize(20).text('CLÍNICA DOCENTE LOS JARALES', { align: 'center' }).moveDown();
        doc.font('Helvetica-Bold').fontSize(9).text('Lista de Citas del Mes '+ mesActual, { align: 'center' }).moveDown();

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
            doc.text(cita.apellido_medico, startX + 40, rowY);
            doc.text(cita.nombre, startX + 150, rowY);
            doc.text(cita.fecha, startX + 300, rowY);
            doc.text(cita.horaDelaCita, startX + 450, rowY);
        });

        // Finalizar el stream de PDFDocument
        doc.end();
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


export default router;