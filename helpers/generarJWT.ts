import jwt from "jsonwebtoken"

export const generarJWT = (id: string = ""): Promise<string> =>{

    return new Promise((res, rej)=>{
        const  payload = {id}

        jwt.sign(
            payload,
            process.env.CLAVESECRETA as string,
            {
                expiresIn: "6h"

            },
            (err: Error | null, token: string | undefined) =>{
                if(err){
                    console.log('====================================');
                    console.log(err);
                    console.log('====================================');
                    rej("No se pudo generar el JWT")
                } else {
                    res(token as string)
                }
            }
        )
    })

    

}