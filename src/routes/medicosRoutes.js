import {Router} from 'express';
import pool from '../database.js';
import { generarJWT } from '../helpers/tokens.js';
import jwt from "jsonwebtoken";
import { mostrarCitas, editarCita, editarCitaPost, eliminarCita } from '../controllers/medicoController.js';

const router = Router();

router.get('/listDoc/:id', mostrarCitas);
router.get('/editDoc/:id', editarCita);
router.post('/editDoc/:id', editarCitaPost);
router.get('/deleteDoc/:id', eliminarCita);

export default router;