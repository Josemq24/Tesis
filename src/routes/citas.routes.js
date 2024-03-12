import {Router} from 'express';
import pool from '../database.js';
// import { saludar} from "../controllers/usuarioController.js"
import { generarJWT } from '../helpers/tokens.js';
import jwt from "jsonwebtoken";
import PDFDocument from "pdfkit";
import {getAllCitas} from "../controllers/citasController.js";

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
    const doctores = await getAllDoctors().then((doctors) => {return doctors});
    console.log(doctores);
    res.render('citas/add', {doctores});
    
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
        //const decoded = jwt.verify(token, "papagaiodomar");
        return res.cookie('_token', token, {
            httpOnly: true,
        }).redirect('/User')
    }else if(email == "doctor@doctor.com" && password =='123'){
        return res.redirect('/listDoc/2')
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
       res.redirect('/listUser');
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/list', async(req, res) => {
    try {
        const [result] = await pool.query('SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.hora FROM citas c JOIN medicos m ON c.id_medico = m.id_medico');
        const doctores = await getAllDoctors().then((doctors) => {return doctors});
        console.log(doctores);
        console.log(result);
        res.render('citas/list', {citas: result, doctores});
    } 
    catch (err) {
        res.status(500).json({message: err.message});
    }

});

router.get('/listUser', async(req, res) => {
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
          
        console.log(result);
        res.render('citas/listUser', {citas: result});

    }
    catch (err) {
        res.status(500).json({message: err.message});
    }

});

router.get('/listDoc/:id', async(req, res) => {
    const {id} =req.params

    try {
        const [result] = await pool.query('SELECT citas.nombre as nombre, medicos.nombre as nombre_medico, DATE_FORMAT(citas.fecha, "%Y-%m-%d") AS fecha, citas.hora FROM citas INNER JOIN medicos ON citas.id_medico = medicos.id_medico WHERE citas.id_medico =?', [id]);
        
        console.log('RESULT LISTDOC' + result)
        res.render('citas/listDoc', {citas: result});

    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
});

router.get('/edit/:id', async(req, res) => {
    // 'SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.hora FROM citas c JOIN medicos m ON c.id_medico = m.id_medico'
    try {
        const { id } = req.params;
        const [result] = await pool.query('SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.hora, m.nombre AS nombre_medico FROM citas c JOIN medicos m ON c.id_medico = m.id_medico WHERE c.id = ?', [id]);
        const citaEdit = result[0];
        const [doctores] = await pool.query('SELECT * from medicos');
        console.log(doctores)
        res.render('citas/edit', { cita: citaEdit, doctores });
        //console.log('Esta es la salida de citaEdit' + citaEdit)
        console.log('result'+result[0])
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/edit/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.body)
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
});


router.get('/editDoc/:id', async(req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.hora, m.nombre AS nombre_medico FROM citas c JOIN medicos m ON c.id_medico = m.id_medico WHERE c.id = ?', [id]);
        const citaEdit = result[0];
        const [doctores] = await pool.query('SELECT * from medicos');
        console.log(doctores)
        res.render('citas/editDoc', { cita: citaEdit, doctores });
        //console.log('Esta es la salida de citaEdit' + citaEdit)
        console.log('result'+result[0])
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/editDoc/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.body)
        const { id_medico, nombrePaciente, fecha, hora } = req.body;
        const editCita = {
            id_medico,
            nombre: nombrePaciente,
            fecha,
            hora
        };
        await pool.query('UPDATE citas SET ? WHERE id = ?', [editCita, id]);
        res.redirect('/listDoc');
        
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.get('/editUser/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.hora, m.nombre AS nombre_medico FROM citas c JOIN medicos m ON c.id_medico = m.id_medico WHERE c.id = ?', [id]);
        const citaEdit = result[0];
        const [doctores] = await pool.query('SELECT * from medicos');
        console.log(doctores)
        res.render('citas/editUser', { cita: citaEdit, doctores });
        //console.log('Esta es la salida de citaEdit' + citaEdit)
        console.log('result'+result[0])
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

router.post('/editUser/:id', async (req, res) => {
    try {
        const { id } = req.params;
        console.log(req.body)
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

router.get('/generate-pdf', async (req, res) => {
    try {
        const currentDate = new Date();
        const currentMonth = currentDate.getMonth() + 1; // Se agrega 1 porque getMonth() devuelve un índice base cero
        
        const [citas] = await pool.query('SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.hora FROM citas c JOIN medicos m ON c.id_medico = m.id_medico');; // Obtén todas las citas de tu base de datos
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
        console.error(err);
        res.status(500).json({ message: err.message });
    }
});


export default router;