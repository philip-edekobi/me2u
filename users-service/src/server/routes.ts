import { Express } from "express";;
import { getRepository, getConnection } from "typeorm";
import { omit } from "lodash";

import dayjs from "dayjs";
import config from "config";

import User from "#root/db/entities/User";
import UserSession from "#root/db/entities/UserSession";
import { passwordCompareSync, hashPassword } from "#root/helpers/passwordUtils";
import generateUUID from "#root/helpers/generateUUID";

const SESSION_DURATION = <number>config.get("USER_SESSION_EXPIRY_HOURS");

export default function setupRoutes(app: Express) {
    const userRepository = getRepository(User);
    const userSessionRepository = getRepository(UserSession);

    app.post("/sessions/", async (req, res, next) => {
        if(!req.body.username || !req.body.password){
            return next(new Error("Invalid body"));
        }

        try {
            const user = await userRepository.findOne({ username: req.body.username }, 
                {select: ["id", "passwordHash"]
            });

            if(!user) return next(new Error("Invalid username!!"));

            const existingSession = await userSessionRepository.findOne({ userId: user.id });
            if(existingSession && new Date(existingSession.expiresAt) > new Date()) return res.status(200).json(existingSession);
            console.log(existingSession);

            if(!(passwordCompareSync(req.body.password, user.passwordHash))){
                return next(new Error("Invalid password!"));
            }

            const expiresAt = dayjs().add(SESSION_DURATION, "hour").toISOString();

            const sessionToken = generateUUID() as string;

            const userSession = {
                expiresAt: expiresAt,                
                id: sessionToken,
                userId: user.id,
            }

            await getConnection()
                    .createQueryBuilder()
                    .insert()
                    .into(UserSession)
                    .values(userSession)
                    .execute();

            return res.status(200).json(userSession);
        } catch(err){ 
            return next(err);
        }
    });

    app.delete("/sessions/:sessionId/", async (req, res, next) => {
        try {
            const userSession = await userSessionRepository.findOne(req.params.sessionId);

            if(!userSession) return next(new Error("Invalid session id"));
            await userSessionRepository.remove(userSession);

            return res.end();
        } catch(err){
            return next(err);
        }
    });

    app.get("/sessions/:sessionId/", async (req, res, next) => {
        try {
            const userSession = await userSessionRepository.findOne(req.params.sessionId);

            if(!userSession) return next(new Error("Invalid session id"));

            return res.status(200).json(userSession);
        } catch(err){
            return next(err);
        }
    });

    app.post("/users", async (req, res, next) => {
        if( !req.body.username || !req.body.password){
            return next(new Error("Invalid body"));
        }

        try {
            const newUser = {
                id: generateUUID() as string,
                username: req.body.username,
                passwordHash: hashPassword(req.body.password)
            }

            await getConnection().createQueryBuilder().insert().into(User).values([newUser]).execute()

            return res.status(201).json(omit(newUser, ["passwordHash"]))
        } catch (error) {
            return next(error);
        }
    });

    app.get("/users/:userId", async (req, res, next) => {
        try {
            const user = await userRepository.findOne(req.params.userId);

            if(!user) return next(new Error('invalid user id'));

            return res.status(200).json(omit(user, ["passwordHash"]))
        } catch(err){
            return next(err);
        }
    });
}