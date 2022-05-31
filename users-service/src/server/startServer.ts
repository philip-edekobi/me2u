import http from "http";
import express, {Request, Response, NextFunction} from "express";
import cors from "cors";

import accessEnv from "#root/helpers/accessEnv";
import setupRoutes from "./routes"

const PORT = parseInt(accessEnv("PORT", "7101"), 10);

export default async function startServer(){
    try {
    const app = express();

    await app.use(express.json());
    await app.use(express.urlencoded({ extended: true }));

    await app.use(cors({
        origin: "*",
        credentials: true
    }));

    await setupRoutes(app);

    await app.use((err: Error, req: Request, res: Response, next :NextFunction) => {
        return res.status(500).json({"message": err.message});
    });

    const server = await http.createServer(app);

    await server.listen(PORT, "0.0.0.0", () => {
        console.info(`Users service is listening on port ${PORT}`);
    });
} catch(err) {
    console.error(err);
    }
}