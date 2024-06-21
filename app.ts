import dotenv from "dotenv";
import { Server } from "./models/server";
import router from "./routes/auth";

import { check } from "express-validator";
dotenv.config();

const server = new Server();



server.lisente()