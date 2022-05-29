import "reflect-metadata";

import { initConnection } from "#root/db/connection";
import startServer from "#root/server/startServer";

(async () => {
    await initConnection();
    await startServer();
})();