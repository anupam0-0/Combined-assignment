import type { FastifyRequest, FastifyReply } from "fastify";
import { postTransferSchema } from "../schemas/account.schema";
import { findUserByUsername } from "../services/user.services";
import { paymentTransaction } from "../services/account.services";

const getBalance = async (req: FastifyRequest, reply: FastifyReply) => {
	const prisma = req.server.prisma;

	// Get user ID from the JWT token — NOT from the request body.
	// Never trust the client to tell you who they are.
	// The JWT was signed by us, so req.user is trustworthy.
	const { userId } = req.user as { userId: string };

	const account = await prisma.account.findUnique({
		where: { userId },
	});

	if (!account) {
		return reply.code(404).send({ message: "Account not found" });
	}

	return { balance: Number(account.balance) };
	// Convert Decimal to Number for JSON serialization
};

const postTransfer = async (req: FastifyRequest, reply: FastifyReply) => {
	const prisma = req.server.prisma;

	const { userId: senderId } = req.user as { userId: string };

	const body = postTransferSchema.parse(req.body);

	// Look up receiver by username
	const receiver = await findUserByUsername(prisma, body.receiverUsername);
	if (!receiver) {
		return reply.code(404).send({ message: "Receiver not found" });
	}

	// Can't transfer to yourself
	if (receiver.id === senderId) {
		return reply.code(400).send({ message: "Cannot transfer to yourself" });
	}

	// Execute the atomic transaction (handles balance check internally)
	try {
		await paymentTransaction(prisma, senderId, receiver.id, body.amount);
	} catch (err) {
		const message = err instanceof Error ? err.message : "Transfer failed";
		return reply.code(400).send({ message });
	}

	return { message: "Transfer successful" };
};

export { getBalance, postTransfer };
