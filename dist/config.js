process.loadEnvFile();
const migrationConfig = {
    migrationsFolder: "./src/db/migrations",
};
export const config = {
    fileserverHits: 0,
    db: {
        url: process.env.DB_URL || "",
        migrationConfig,
    },
    platform: process.env.PLATFORM || "",
};
