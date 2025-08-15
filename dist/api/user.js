import { BadRequestError, NotFoundError, UnauthorizedError } from "./errors.js";
import { createUser, findUserByEmail } from "../db/queries/users.js";
import { checkPasswordHash, hashPassword } from "../auth.js";
export async function handleUserCreate(req, res) {
    const email = req.body.email;
    const password = req.body.password;
    const hashedPassword = await hashPassword(password);
    if (!email) {
        throw new BadRequestError("Email is required");
    }
    if (!password) {
        throw new BadRequestError("Password is required");
    }
    const newUser = {
        email,
        password: hashedPassword,
    };
    const user = await createUser(newUser);
    if (!user) {
        throw new Error("Could not create user");
    }
    res.status(201).json(user);
}
export async function handleUserLogin(req, res) {
    const param = req.body;
    const password = param.password;
    const email = param.email;
    if (!password) {
        throw new BadRequestError("Password is required");
    }
    if (!email) {
        throw new BadRequestError("Email is required");
    }
    const user = await findUserByEmail(email);
    if (!user) {
        throw new NotFoundError(`User with email: ${email} doesn't exist`);
    }
    const isPasswordCorrect = await checkPasswordHash(password, user.password);
    if (!isPasswordCorrect) {
        throw new UnauthorizedError("Incorrect email or password");
    }
    const userWithoutPassword = user;
    res.status(200).json(userWithoutPassword);
}
