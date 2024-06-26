import { Request, Response } from "express";
import { ObjectId } from "mongoose";
import Order, { IOrder } from "../models/order";

export const getOrders = async (req: Request, res: Response) =>{
    const usuarioId: ObjectId = req.body.usuarioConfirmado._id;

    const consulta = { usar: usuarioId};

    const orders = await Order.find(consulta)

    res.status(200).json({
        data:{
            ...orders
        }
    })
}

export const createOrder = async (req: Request, res: Response) =>{
    const usuarioId: ObjectId = req.body.usuarioConfirmado._id;
    const orderData: IOrder = req.body

    const data = {
        ...orderData,
        user: usuarioId,
        createrAt: new Date(),
        status: "prending"

    }

    const order = new Order(data);

    await order.save();

    res.status(201).json({
        order
    })
}