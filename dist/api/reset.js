import { config } from "../config.js";
export async function handleReset(_, res) {
    config.fileserverHits = 0;
    res.send("Successfully reset");
    res.status(200);
    res.end();
}
