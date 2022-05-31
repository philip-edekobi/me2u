import config from "config";
import axios from "axios";

const USERS_SERVICE_URI = <string>config.get("USERS_SERVICE_URI");

export default class UsersService {
    static async fetchUserSession({ sessionId }: { sessionId: string }) {
        const response = await axios.get(`${USERS_SERVICE_URI}/sessions/${sessionId}`);
        const body = await response.data;
        
        return body;
    }
}