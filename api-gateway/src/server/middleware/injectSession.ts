import UsersService from "#root/adapters/UsersService";
import { Request, Response, NextFunction } from "express";

const injectSession = async (req: Request, res: Response, next: NextFunction) => {
    if(req.cookies.userSessionId){
        const userSession = await UsersService.fetchUserSession({ sessionId: req.cookies.userSessionId });
        res.locals.userSession = userSession;
        console.log("userSession injected", userSession);
    }
    return next();
}

export default injectSession;