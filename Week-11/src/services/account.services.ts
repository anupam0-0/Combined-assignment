import type { PrismaClient } from "../generated/prisma/client";

// Interactive transaction: the callback receives `tx`, which is a Prisma
// client scoped to the transaction. If anything throws inside, ALL changes
// are rolled back automatically.

export const paymentTransaction = async (
	prisma: PrismaClient,
	senderId: string,
	receiverId: string,
	amount: number,
) => {
	return await prisma.$transaction(async (tx) => {
		// 1. Fetch sender's account and verify sufficient balance
		const senderAccount = await tx.account.findUnique({
			where: { userId: senderId },
		});
		if (!senderAccount) {
			throw new Error("Sender account not found");
		}

		// Decimal comparison: Prisma stores Decimal as a Decimal.js object,
		// so we convert to Number for comparison.
		if (Number(senderAccount.balance) < amount) {
			throw new Error("Insufficient balance");
		}

		// 2. Deduct from sender using Prisma's atomic `decrement`
		await tx.account.update({
			where: { userId: senderId },
			data: { balance: { decrement: amount } },
		});

		// 3. Add to receiver using Prisma's atomic `increment`
		await tx.account.update({
			where: { userId: receiverId },
			data: { balance: { increment: amount } },
		});

		return { success: true };
	});
};
