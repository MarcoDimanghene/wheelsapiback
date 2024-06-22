import {Router} from "express"
import validarJWT from "../middlewares/validarJWT";
import { recolectarErrores } from "../middlewares/recolectarErrores";
import { createOrder, getOrders } from "../controllers/orders";
import { isVerified } from "../middlewares/validarVerificado";
import { check } from "express-validator";

const router = Router();
    router.get("/",
        [
            validarJWT,
            recolectarErrores
        ]
    ,getOrders)

    router.post(
        "/",
        [
            validarJWT,
            isVerified,
            check("price", "El precio es obligatrorio").not().isEmpty(),
            check("shippingCost", "El costo de envio es obligatrorio").not().isEmpty(),
            check("shippingDetails", "El detalle de envio es obligatrorio").not().isEmpty(),
            check("total", "El precio total es obligatrorio").not().isEmpty(),
            check("items", "El array de productos es obligatrorio").not().isEmpty(),
            recolectarErrores
        ],
        createOrder
    )
export default router