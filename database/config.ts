import mongoose from "mongoose"

export const dbConnection = async() => {
    try {
        const dbURL = process.env.DB_URL;
        if (!dbURL){
            throw new Error('La URL no esta correctamente definida en las variables de entorno')
        }

        await mongoose.connect(dbURL)
    } catch(error){
        console.log(error)
        throw new Error('Error en la conexion a la Base de Datos')
    }
}