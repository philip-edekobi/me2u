import { Express } from "express";;
import { getRepository } from "typeorm";

import User from "#root/db/entities/User";

export default function setupRoutes(app: Express) {
    const userRepository = getRepository(User);

    app.get("/users/:userId", async (req, res, next) => {
        try {
            const user = await userRepository.findOne(req.params.userId);

            if(!user) return next(new Error('invalid user id'));

            return res.status(200).json({ "user": user })
        } catch(err){
            return next(err);
        }
    });
}