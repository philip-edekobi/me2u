import config from "config";

import { Connection, createConnection } from "typeorm";

import { User, UserSession } from "./entities";

let connection: Connection;

export const initConnection = async () => {
    connection = await createConnection({
        name: "default",
        entities: [User, UserSession],
        type: "mysql",
        url: config.get("USERS_SERVICE_DB_URL") as string
    });
}

const getConnection = () => connection;

export default getConnection;
