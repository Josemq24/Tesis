import {Router} from "express"
import {vistaAdmin} from "../controllers/adminController.js"

const router = Router()

router.get("/adm", vistaAdmin)

export default router