import { eq } from "drizzle-orm";
import { db } from "../index.js";
import { chirps } from "../schema.js";
export async function createChirps(chirp) {
    const [result] = await db
        .insert(chirps)
        .values(chirp)
        .onConflictDoNothing()
        .returning();
    return result;
}
export async function getChirps() {
    const result = await db.select().from(chirps);
    return result;
}
export async function getChirpByID(chirpID) {
    const [result] = await db.select().from(chirps).where(eq(chirps.id, chirpID));
    return result;
}
