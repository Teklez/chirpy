import { BadRequestError, NotFoundError, UnauthorizedError } from "./errors.js";
import { createChirps, getChirpByID, getChirps } from "../db/queries/chirps.js";
export async function handleChirpCreate(req, res) {
    const params = req.body;
    const body = params.body;
    const userId = params.userId;
    const profaneWords = ["kerfuffle", "sharbert", "fornax"];
    const splitted = params.body.split(" ");
    const cleaned = splitted.map((item) => {
        return profaneWords.includes(item.toLowerCase()) ? "****" : item;
    });
    const joined = cleaned.join(" ");
    if (params.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    if (!body) {
        throw new BadRequestError("Body is required");
    }
    if (!userId) {
        throw new UnauthorizedError("Not logged in");
    }
    const newChirp = {
        body: joined,
        userId,
    };
    const chirp = await createChirps(newChirp);
    if (!chirp) {
        throw new Error("Could not create user");
    }
    res.status(201).json(chirp);
}
export async function handleGetChirps(_, res) {
    const chirps = await getChirps();
    res.status(200).json(chirps);
}
export async function handleGetChirpsByID(req, res) {
    const chirpID = req.params.chirpID;
    const chirp = await getChirpByID(chirpID);
    if (!chirp) {
        throw new NotFoundError("Chirp not found");
    }
    res.status(200).json(chirp);
}
