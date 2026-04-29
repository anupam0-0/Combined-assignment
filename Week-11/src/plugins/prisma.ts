import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import type { FastifyInstance } from "fastify";
import fp from "fastify-plugin";

// Same reason as auth.ts — prisma needs to be visible to ALL routes,
// so we use fp() to break encapsulation.

async function prismaPlugin(app: FastifyInstance) {
	const connectionString = process.env.DATABASE_URL;
	if (!connectionString) {
		throw new Error("DATABASE_URL environment variable is not set");
	}

	const pool = new Pool({ connectionString });
	const adapter = new PrismaPg(pool);
	const prisma = new PrismaClient({ adapter });

	app.decorate("prisma", prisma);

	app.addHook("onClose", async () => {
		await prisma.$disconnect();
		await pool.end();
	});
}

export default fp(prismaPlugin);