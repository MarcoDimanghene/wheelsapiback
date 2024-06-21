import express, {Express} from "express";
import cors from "cors";
import authRoutes from "../routes/auth"
import { dbConnection } from "../database/config";

export class Server {
    app: Express
    port: string | number | undefined
    authPath: string

    constructor(){
        this.app = express();
        this.port = process.env.PORT
        this.authPath = '/auth'

        this.conectarDB()
        this.middlewars()
        this.routes()
    }

    async conectarDB(): Promise<void> {
        await dbConnection();
    }

    middlewars(): void {
        this.app.use(express.json())
        this.app.use(cors())
    }
    routes(): void{
        this.app.use(this.authPath, authRoutes)
    }

    lisente(): void{
        this.app.listen(this.port, ()=> {
            console.log(`Corriendo en puerto ${this.port}`)
        })
    }
}