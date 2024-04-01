import {Router} from "express"
import {
    vistaAdmin, addAdmin, addAdminPost, mostrarLista, editLista, 
    editListaPost, deleteCita, crearMedico, insertMedico, mostrarDoctores, 
    mostrarEditarDoctor, editarDoctor, eliminarDoctor
} from "../controllers/adminController.js"
import  jwt from 'jsonwebtoken';
import pool from '../database.js';
import {generarJWT} from "../helpers/tokens.js"

const router = Router()

router.get('/adm', vistaAdmin);
router.get('/add', addAdmin);
router.post('/add', addAdminPost);
router.get('/list', mostrarLista);
router.get('/edit/:id', editLista);
router.post('/edit/:id', editListaPost);
router.get('/delete/:id', deleteCita);

//GESTION DE MEDICOS
router.get('/crear', crearMedico)
router.post('/crear', insertMedico)
router.get('/docs', mostrarDoctores)
router.get('/editar/:id', mostrarEditarDoctor)
router.post('/editar/:id', editarDoctor)
router.get('/deleteDoc/:id', eliminarDoctor)

export default router