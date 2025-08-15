import { BadRequestError } from "../errors.js";
export async function handleVAlidateChirp(req, res) {
    const params = req.body;
    const profaneWords = ["kerfuffle", "sharbert", "fornax"];
    const splitted = params.body.split(" ");
    const cleaned = splitted.map((item) => {
        return profaneWords.includes(item.toLowerCase()) ? "****" : item;
    });
    const joined = cleaned.join(" ");
    if (params.body.length > 140) {
        throw new BadRequestError("Chirp is too long. Max length is 140");
    }
    res.header("Content-Type", "application/json");
    res.status(200).send(JSON.stringify({
        cleanedBody: joined,
    }));
}
