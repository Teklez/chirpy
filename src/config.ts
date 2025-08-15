process.loadEnvFile();
import type { MigrationConfig } from "drizzle-orm/migrator";

const migrationConfig: MigrationConfig = {
  migrationsFolder: "./src/db/migrations",
};

export type APIConfig = {
  fileserverHits: number;
  db: DBConfig;
  platform: string;
};

export const config: APIConfig = {
  fileserverHits: 0,
  db: {
    url: process.env.DB_URL || "",
    migrationConfig,
  },
  platform: process.env.PLATFORM || "",
};

type DBConfig = {
  url: string;
  migrationConfig: MigrationConfig;
};
