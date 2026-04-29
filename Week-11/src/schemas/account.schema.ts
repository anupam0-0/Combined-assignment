import { z } from "zod";

export const postTransferSchema = z.object({
	receiverUsername: z.string().toLowerCase(),
	amount: z.number().positive("Amount must be positive"),
});

export type TransferInput = z.infer<typeof postTransferSchema>;
