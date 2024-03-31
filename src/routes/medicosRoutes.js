import {Router} from 'express';
import pool from '../database.js';
import { generarJWT } from '../helpers/tokens.js';
import jwt from "jsonwebtoken";
import { mostrarCitas, editarCita, editarCitaPost, eliminarCita } from '../controllers/medicoController.js';


const router = Router();

router.get('/listDoc', mostrarCitas);
router.get('/editDoc/:id', editarCita);
router.post('/editDoc/:id', editarCitaPost);
router.get('/deleteDoc/:id', eliminarCita);


router.get('/loginDoc', async (req, res)=>{
    res.render('loginMedico')
});

//AUTENTICACION MEDICOS
router.post('/authDoc', async (req, res) => { 
    // Extraemos el email y la contrasena del body
	let email = req.body.email;
	let password = req.body.password;

    // Buscamos al userClient que este registrado con el email ingresado
    const [userMedico] =  await pool.query("SELECT * FROM medicos WHERE email = ?", [email])


    // Verificamos si la contraseña ingresada es correcta para el email dado
    const passwordCorrect = userMedico.length === 0 ? false : password === userMedico[0].contrasena

    // Si el usuario no existe, o la contraseña envia mensaje de error
    if(!(userMedico && passwordCorrect)) {
        // Retornar un res.render es redundante y no es necesario
        return res.render("loginMedico", {
            error: [{msg: "Email o contraseña invalida"}]
       })
    }else{
        // Si los datos son correctos, creamos el usuario para registrar en el token
        const userForToken = {
            id: userMedico[0].id_medico,
            nombre: userMedico[0].nombre,
            apellido: userMedico[0].apellido,
            email: userMedico[0].email
        }
        const token = generarJWT(userForToken)

        // Salvamos la cookie
        return res.cookie("_token", token, {
            httpOnly: true,
            secure: true
        }).redirect("/listDoc")
    }
});
export default router;