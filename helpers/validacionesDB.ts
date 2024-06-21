import { sendEmail } from "../mailer/mailer"
import Usuario, { IUser } from "../models/usuario"

export const existEmail = async (email:string):Promise<void> => {
    const existEmail: IUser | null = await Usuario.findOne({email})
    if(existEmail && existEmail.verified) {
        throw new Error (`El correo ${email} ya esta registrado`)
    }

    if (existEmail && !existEmail.verified) {
        const emailSubject = "Código de verificación";
        const emailText = `
            Buenas,
            
            Tu código de verificación es: ${existEmail.code}
            
            Saludos,
            Wheels On Demands
        `;

        await sendEmail(email, emailSubject, emailText);
        throw new Error(`El usuario ya está registrado pero no verificado, enviamos un nuevo código a ${email}`);
    }

}