import config from "config";

import { Connection, createConnection } from "typeorm";

let connection: Connection;

export const initConnection = async () => {
    connection = await createConnection({
        type: "mysql",
        url: config.get("USERS_SERVICE_DB_URL") as string
    });
}

const getConnection = () => connection;

export default getConnection;
