import { UserSessionType } from "#root/graphql/types";
import UsersService from "#root/adapters/UsersService";

const UserSession = {
    user: async(userSession: UserSessionType) => {
        return await UsersService.fetchUSer({ userId: userSession.userId });
    }
}

export default UserSession;