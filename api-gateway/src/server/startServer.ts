import http from "http";
import express, {Request, Response, NextFunction} from "express";
import cors from "cors";
import config from "config";
import { ApolloServer } from "apollo-server-express";
import cookieParser from "cookie-parser";

import formatGraphQLErrors from "./formatGraphQLErrors";
import resolvers from "#root/graphql/resolvers";
import schema from "#root/graphql/schema";
import injectSession from "./middleware/injectSession";

const PORT = <number>config.get("PORT");

export default async function startServer(){
    try {
    const apolloServer = new ApolloServer({
        context: a => a,
        formatError: formatGraphQLErrors,
        resolvers,
        typeDefs: schema
    });

    const app = express();

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(cookieParser());

    app.use(cors({ 
        origin: "*",
        credentials: true
    }));

    app.use(injectSession);

    app.use((err: Error, req: Request, res: Response, next :NextFunction) => {
        return res.status(500).json({"message": err.message});
    });

    await apolloServer.start(); 
    apolloServer.applyMiddleware({app, cors: false, path: "/graphql"});

    const server = http.createServer(app);

    server.listen(PORT, "0.0.0.0", () => {
        console.info(`Api gateway is listening on port ${PORT}`);
    });
} catch(err) {
    console.error(err);
    }
}