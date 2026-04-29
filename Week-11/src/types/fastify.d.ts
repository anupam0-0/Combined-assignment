import type { PrismaClient } from "../generated/prisma/client";

// This file teaches TypeScript about the custom properties we add to Fastify
// via app.decorate(). Without this, app.prisma and app.authenticate would
// show "Property does not exist" errors.
declare module "fastify" {
	interface FastifyInstance {
		prisma: PrismaClient;
		authenticate: (
			req: import("fastify").FastifyRequest,
			reply: import("fastify").FastifyReply,
		) => Promise<void>;
	}
}
