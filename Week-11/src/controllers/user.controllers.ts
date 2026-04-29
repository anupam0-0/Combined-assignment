import type { FastifyRequest, FastifyReply } from "fastify";
import bcrypt from "bcrypt";
import { signupSchema, signinSchema, updateProfileSchema } from "../schemas/user.schema";
import { findUserByUsername } from "../services/user.services";

// In Fastify, route handlers receive (request, reply).
// The `this` context inside a handler IS the FastifyInstance (app),
// but only if you use a regular `function`, not an arrow function.
// With arrow functions, we access the app via `request.server`.

const signup = async (req: FastifyRequest, reply: FastifyReply) => {
	// req.server gives us the FastifyInstance — this is how controllers
	// access plugins like prisma without importing them directly.
	const prisma = req.server.prisma;

	// Zod validates the body. If invalid, .parse() throws a ZodError.
	// Fastify catches it and returns a 500. In production you'd add an
	// error handler to format Zod errors as 400s — but this works for learning.
	const body = signupSchema.parse(req.body);

	// Check if username already exists
	const existingUser = await findUserByUsername(prisma, body.username);
	if (existingUser) {
		return reply.code(409).send({ message: "Username already taken" });
		// 409 Conflict is more semantically correct than 400 for "already exists"
	}

	// Hash the password — bcrypt.hash(plaintext, saltRounds)
	// Salt rounds = 10 means 2^10 iterations. Higher = slower but more secure.
	const hashedPassword = await bcrypt.hash(body.password, 10);

	// Use a transaction to create both User and Account atomically.
	// If Account creation fails, the User is rolled back too.
	const user = await prisma.$transaction(async (tx) => {
		const newUser = await tx.user.create({
			data: {
				username: body.username,
				firstName: body.firstName,
				lastName: body.lastName,
				password: hashedPassword,
			},
		});

		await tx.account.create({
			data: {
				userId: newUser.id,
				balance: 0,
			},
		});

		return newUser;
	});

	// Sign a JWT with the user's ID as the payload
	const token = await reply.jwtSign({ userId: user.id });

	return reply.code(201).send({ token });
	// 201 Created — because we created a new resource
};

const login = async (req: FastifyRequest, reply: FastifyReply) => {
	const prisma = req.server.prisma;

	const { username, password } = signinSchema.parse(req.body);

	// For login: user MUST exist — if not found, credentials are wrong
	const user = await findUserByUsername(prisma, username);
	if (!user) {
		return reply.code(401).send({ message: "Invalid credentials" });
		// Don't say "user not found" — that leaks whether an email is registered
	}

	// bcrypt.compare(plaintext, hash) — order matters!
	// You had them reversed: compare(hash, plaintext) always returns false
	const isMatch = await bcrypt.compare(password, user.password);
	if (!isMatch) {
		return reply.code(401).send({ message: "Invalid credentials" });
	}

	const token = await reply.jwtSign({ userId: user.id });

	return { token };
};

const updateProfile = async (req: FastifyRequest, reply: FastifyReply) => {
	const prisma = req.server.prisma;

	// After jwtVerify(), the decoded payload is in req.user
	const { userId } = req.user as { userId: string };

	const body = updateProfileSchema.parse(req.body);

	// Build the update data object — only include fields that were provided
	const updateData: Record<string, unknown> = {};
	if (body.firstName) updateData.firstName = body.firstName;
	if (body.lastName) updateData.lastName = body.lastName;
	if (body.password) {
		updateData.password = await bcrypt.hash(body.password, 10);
	}

	if (Object.keys(updateData).length === 0) {
		return reply.code(400).send({ message: "No fields to update" });
	}

	const updatedUser = await prisma.user.update({
		where: { id: userId },
		data: updateData,
		omit: { password: true },
		// omit: excludes password from the returned object — never send hashes to clients
	});

	return { user: updatedUser };
};

const getBulkUsers = async (req: FastifyRequest, reply: FastifyReply) => {
	const prisma = req.server.prisma;

	// Query params come from req.query, not req.body
	const { filter } = req.query as { filter?: string };

	const users = await prisma.user.findMany({
		where: filter
			? {
					OR: [
						{ firstName: { contains: filter, mode: "insensitive" } },
						{ lastName: { contains: filter, mode: "insensitive" } },
					],
				}
			: {},
		omit: { password: true },
	});

	return { users };
};

export { signup, login, updateProfile, getBulkUsers };
