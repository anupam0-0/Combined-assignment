import type { PrismaClient } from "../generated/prisma/client";

// Services receive the prisma client as a parameter.
// They don't know about Fastify — they only know about the database.
// This keeps them testable and decoupled from the web framework.

export const findUserByUsername = async (
	prisma: PrismaClient,
	username: string,
) => {
	// findUnique works because `username` has @unique in the Prisma schema.
	// findOne does NOT exist in Prisma — it's findUnique or findFirst.
	const user = await prisma.user.findUnique({
		where: { username },
	});
	return user; // Returns the user object, or null if not found
};
