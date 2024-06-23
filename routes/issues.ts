import { Router } from "express";
import { postNewIssue } from "../controllers/issues";
import validarJWT from "../middlewares/validarJWT";
import { isAdmin } from "../middlewares/validarRol";
import { recolectarErrores } from "../middlewares/recolectarErrores";
import { check } from "express-validator";

const router = Router()

router.post(
    "/",
    [
        validarJWT,
        isAdmin,
        check("title", "El titulo es obligatrorio").not().isEmpty(),
        check("description", "La descripción es obligatoria").not().isEmpty(),
        check("priority", "La Prioridad es obligatrorio").not().isEmpty(),
        recolectarErrores
    ],
    postNewIssue
)

export default router