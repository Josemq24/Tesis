import  jwt from 'jsonwebtoken';
import pool from '../database.js';

const mostrarCitas = async(req, res) => {

    const {_token} = req.cookies;
    const decoded = jwt.verify(_token, "papagaiodomar")
    const {id} = decoded;
    try {
        const [result] = await pool.query('SELECT citas.id as id, citas.nombre as nombre, medicos.nombre as nombre_medico, DATE_FORMAT(citas.fecha, "%a %d-%m-%Y") AS fecha, citas.hora FROM citas INNER JOIN medicos ON citas.id_medico = medicos.id_medico WHERE citas.id_medico =?', [id]);

        res.render('citas/listDoc', {citas: result});
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
};

const editarCita = async(req, res) => {
    try {
        const { id } = req.params;
        const [result] = await pool.query('SELECT c.id, c.id_medico, c.id_paciente, m.nombre AS nombre_medico, c.nombre, DATE_FORMAT(c.fecha, "%Y-%m-%d") AS fecha, c.hora, m.nombre AS nombre_medico FROM citas c JOIN medicos m ON c.id_medico = m.id_medico WHERE c.id = ?', [id]);
        const citaEdit = result[0];
        // console.log(citaEdit.id_medico)
        const [doctores] = await pool.query('SELECT * from medicos WHERE id_medico = ?', [citaEdit.id_medico]);
        // console.log(doctores)
        res.render('citas/editDoc', { cita: citaEdit,doctores });
    } catch (err) {
        res.status(500).json({ message: err.message });
        console.log('este es el error: ', err)
    }
};

const editarCitaPost = async (req, res) => {
    try {
        const { id } = req.params;
        const { id_medico, nombrePaciente, fecha, hora } = req.body;
        console.log(req.body)
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
