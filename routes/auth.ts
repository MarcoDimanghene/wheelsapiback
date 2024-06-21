import { Router } from "express";

import { check } from "express-validator";
import { login, registrer, requestPasswordReset, resetPassword, verifyUser } from "../controllers/auth";
import { recolectarErrores } from "../middlewares/recolectarErrores";
import { existEmail } from "../helpers/validacionesDB";


const router = Router()
router.post(
    "/register",
    [
        check("nombre", "El nombre es obliogatorios").not().isEmpty(),
        check("email", "El email es obliogatorios").isEmail(),
        check("password", "El password tiene que ser al menos de 6 caracteres").isLength({min:6}),
        check("email").custom(existEmail),
        recolectarErrores
    ],
    registrer
)

router.post(
    "/login",
    [
        check("email", "El email es obliogatorios").not().isEmpty(),
        check("email", "El email no es válido").isEmail(),
        check("password", "El password tiene que ser al menos de 6 caracteres").isLength({min:6}),
        recolectarErrores
    ],
    login
)

router.patch(
    "/verify",
    [
        check("email", "El email es obliogatorios").not().isEmpty(),
        check("email", "El email no es válido").isEmail(),
        check("code", "El codigo es obliogatorios").not().isEmpty(),
        recolectarErrores
    ],
    verifyUser
)

router.post(
    "/requestpassword",
    [
        check("email", "El email es obliogatorios").not().isEmpty(),
        check("email", "El email no es válido").isEmail(),
        recolectarErrores
    ],
    requestPasswordReset
)
router.post(
    "/resetpassword",
    [
        check("email", "El email es obligatorio").not().isEmpty(),
        check("email", "El email no es válido").isEmail(),
        check("resetCode", "El código de restablecimiento es obligatorio").not().isEmpty(),
        check("newPassword", "El nuevo password tiene que ser al menos de 6 caracteres").isLength({ min: 6 }),
        recolectarErrores
    ],
    resetPassword
)

export default router