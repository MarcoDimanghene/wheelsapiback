import { Request, Response } from "express"
import Usuario, { IUser } from "../models/usuario"
import bcryptjs from "bcryptjs"
import { ROLES } from "../helpers/constants"
import randomstring from "randomstring"
import { sendEmail } from "../mailer/mailer"
import { generarJWT } from "../helpers/generarJWT"

export const registrer = async (req: Request, res: Response) =>{
    const {nombre, email, password, rol}: IUser =req.body
    
    const usuario = new Usuario ({nombre, email, password, rol});
    
    const salt = bcryptjs.genSaltSync();

    usuario.password = bcryptjs.hashSync(password, salt);

    const adminKey = req.headers["admin-key"]

    if (adminKey === process.env.KEYFORADMIN) {
        usuario.rol = ROLES.admin
    }

    const newCode = randomstring.generate(6)

    usuario.code =  newCode

    await usuario.save();

    const emailSubject = "Código de verificación";
    const emailText = `
        Bienvenido,

        Tu código de verificación es: ${newCode}
        
        Te esperamos.
        Saludos,
        Wheels on Demand
    `;

    await sendEmail(email, emailSubject, emailText);

    res.status(201).json({
        usuario
    })
}

export const login = async(req:Request, res: Response): Promise<void> =>{
    const {email, password}: IUser =req.body;

    try {
        const usuario = await Usuario.findOne({email});
        if(!usuario) {
            res.status(404).json({
                msg: "El email no existe en nuestra base de datos"
            });
            return
        }
        const valPass = bcryptjs.compareSync(password, usuario.password);

        if (!valPass) {
            res.status(401).json({
                msg: "La contraseña es incorrecta"
            });
            return
        };

            const token = await generarJWT(usuario.id)
            res.status(202).json({
                usuario,
                token
            });
        } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
            res.status(500).json({
                msg: "ERROR EN EL SERVIDOR"
            });
    }
}

export const verifyUser = async(req:Request, res: Response) => {
    const {email, code} = req.body
    try {
        const usuario = await Usuario.findOne({email});
        if(!usuario) {
            res.status(404).json({
                msg: "El email no existe en nuestra base de datos"
            });
            return
        }

        if(usuario.verified){
            res.status(400).json({
                msg: "El usuario ya esta verificado"
            });
            return
        }
        if (code !== usuario.code){
            res.status(401).json({
                msg: "El codigo de verificacion no coincide"
            });
            return
        }

        await Usuario.findOneAndUpdate(
            {email},
            {verified: true}
        );
        res.status(200).json({
            msg: "Usuario verificado con éxito"
        })

    } catch (error) {
            console.log('====================================');
            console.log(error);
            console.log('====================================');
            res.status(500).json({
                msg: "ERROR EN EL SERVIDOR"
            });
    }
}
export const requestPasswordReset = async(req: Request, res:Response) =>{
    const {email} = req.body;
    try {
        const usuario = await Usuario.findOne({email})
        if(!usuario){
            res.status(404).json({
                msg:"El mail no correponde a un usuario"
            });
            return
        }
        const resetCode =randomstring.generate(6);
        usuario.resetCode = resetCode;
        await usuario.save();
        const emailText = `Tu código para crear una nueva contraseña es: ${resetCode}`;

        await sendEmail(email, "Código de restablecimiento de contraseña", emailText);
        
        res.status(200).json({
            msg: "Código de restablecimiento enviado al correo electrónico",
        });

    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        res.status(500).json({
            msg: "ERROR EN EL SERVIDOR"
        });
    }
}
export const resetPassword = async(req: Request, res:Response) =>{
    const {email, resetCode, newPassword} = req.body;

    try {
        const usuario = await Usuario.findOne({email});
        if (!usuario){
            res.status(404).json({
                msg: "El usuario no existe en nuestra basede datos"
            });
            return;
        }
        if (resetCode !== usuario.resetCode) {
            res.status(401).json({
                msg: "El codigo de restablecimiento no coincide"
            });
            return
        }
        const salt = bcryptjs.genSaltSync();
        usuario.password= bcryptjs.hashSync(newPassword, salt);
        usuario.resetCode= undefined; // por seguridad pasamos el resetCode a undifine después de que se ha utilizado para restablecer la contraseña
        await usuario.save();
        res.status(200).json({
            msg: "Contraseña restablecida con éxito",
        })

    } catch (error) {
        console.log('====================================');
        console.log(error);
        console.log('====================================');
        res.status(500).json({
            msg: "ERROR EN EL SERVIDOR",
        });
    }
}