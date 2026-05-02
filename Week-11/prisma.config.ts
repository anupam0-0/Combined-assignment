// This file is generated at the repository root so Prisma can discover the schema
// even when commands are run from nested folders.
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { defineConfig, env } from "prisma/config";

const currentDirectory = dirname(fileURLToPath(import.meta.url));
const envFilePath = join(currentDirectory, ".env");

if (!process.env.DATABASE_URL) {
	const envFileContents = readFileSync(envFilePath, "utf8");
	const databaseUrlLine = envFileContents
		.split(/\r?\n/)
		.find((line) => line.startsWith("DATABASE_URL="));

	if (databaseUrlLine) {
		process.env.DATABASE_URL = databaseUrlLine.slice("DATABASE_URL=".length).trim();
	}
}

export default defineConfig({
	schema: "prisma/schema.prisma",
	migrations: {
		path: "prisma/migrations",
	},
	datasource: {
		url: env("DATABASE_URL"),
	},
});