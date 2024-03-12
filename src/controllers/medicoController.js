import pool from "../database.js"

const crearMedico = async (req,res) =>{
    res.render("medicos/add.hbs")
}

const insertMedico = async (req,res) => {
    console.log(req.body)
    try{
        const {nombre, especialidad, telefono, direccion} = req.body
        const newMedico = {
            nombre,
            especialidad,
            telefono,
            direccion
        }
        await pool.query("INSERT INTO medicos set ?", [newMedico])
        res.redirect("/medico")
    }catch(error){

    }
}

const getAllDoctors = async () => {
    const [data] = await pool.query('SELECT * FROM medicos');
    return data
}

const mostrarDoctores = async (req,res) =>{
    const doctores = await getAllDoctors().then((doctors) => {return doctors})
    console.log(doctores)
    res.render("medicos/main", {doctores})
}

const mostrarEditarDoctor = async(req,res) =>{
    try {


        const {id} = req.params;
        console.log(id)
        const [medico] = await pool.query('SELECT * FROM medicos WHERE id_medico = ?', [id]);
        const medicoEdit = medico[0];
        console.log(medicoEdit, medico);
        res.render('medicos/edit', {medico: medicoEdit});
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
};

const editarDoctor = async (req,res) =>{
    try {
        const {id} = req.params;
        const {nombre, especialidad, telefono, direccion} = req.body;
        const editMedico = {
            nombre,
            especialidad,
            telefono,
            direccion
        };
        await pool.query('UPDATE medicos set ? WHERE id_medico = ?', [editMedico, id]);
        res.redirect('/medico');
    }
    catch (err) {
        res.status(500).json({message: err.message});
    }
}

const eliminarDoctor = async(req,res)=>{
    try{
        const {id} = req.params
        await pool.query("DELETE FROM medicos WHERE id_medico = ?", [id])
        res.redirect("/medico")
    }catch(error){
        res.status(500).json({message: error.message});
    }
}

export {
    crearMedico,
    insertMedico,
    mostrarDoctores,
    mostrarEditarDoctor,
    editarDoctor,
    eliminarDoctor
}