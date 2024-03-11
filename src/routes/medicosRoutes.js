import {Router} from "express"
import { crearMedico, insertMedico, mostrarDoctores, mostrarEditarDoctor, editarDoctor, eliminarDoctor } from "../controllers/medicoController.js"

const router = Router()

router.get("/crear", crearMedico)
router.post("/crear", insertMedico)

router.get("/editar/:id", mostrarEditarDoctor)
router.post("/editar/:id", editarDoctor)

router.get("/delete/:id", eliminarDoctor)

router.get("/", mostrarDoctores)

export default router