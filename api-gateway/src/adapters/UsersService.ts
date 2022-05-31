import config from "config";
import axios from "axios";

const USERS_SERVICE_URI = <string>config.get("USERS_SERVICE_URI");

export default class UsersService {
    static async fetchUSer({ userId } : { userId: string }): Promise< User | null>{
        try {
            const response = await axios.get(`${USERS_SERVICE_URI}/users/${userId}`);
            const user = await response.data;

            if(response.status !== 200) throw new Error(user.message);

            return user;
        } catch(err){
            console.log(err);
            return null;
        }
    }

    static async fetchUserSession({ sessionId }: { sessionId: string }): Promise<UserSession | null> { 
        try{
            const response = await axios.get(`${USERS_SERVICE_URI}/sessions/${sessionId}`);
            const body = await response.data;
            if(response.status !== 200) throw new Error(body.message);
        
            return body;
        } catch (err) {
            console.log(err);
            return null;
        }
    }
}

export interface UserSession {
    createdAt: string;
    expiresAt: string;
    id: string;
    userId: string;
}

export interface User {
    id: string;
    username: string;
    createdAt: string;
}