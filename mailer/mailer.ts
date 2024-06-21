import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth:{
        user: "dmgmarcodaniel@gmail.com",
        pass: "wyci gezs fdrs mnvv"
    },
    from: 'dmgmarcodaniel@gmail.com'
});

export const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
    const mailOptions = {
        from: '"WheelsOnDemands" <dmgmarcodaniel@gmail.com>',
        to,
        subject,
        text
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log("Correo Enviado");
    } catch (error) {
        console.error(`Error al enviar el correo:`, error);
    }
};

