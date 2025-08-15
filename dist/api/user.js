import { BadRequestError } from "./errors.js";
import { createUser } from "../db/queries/users.js";
export async function handleUserCreate(req, res) {
    const email = req.body.email;
    if (!email) {
        throw new BadRequestError("Email is required");
    }
    const newUser = {
        email,
    };
    const user = await createUser(newUser);
    if (user) {
        res.status(201).json(user);
    }
}
