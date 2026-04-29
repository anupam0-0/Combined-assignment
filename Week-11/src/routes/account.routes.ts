import type { FastifyInstance } from "fastify";
import { getBalance, postTransfer } from "../controllers/account.controllers";

// Must be async — Fastify needs to know when plugin setup is complete.
// Without async (or a done callback), Fastify can't track loading order.

export default async function accountRoutes(app: FastifyInstance) {
	// GET /api/account/balance — auth required
	app.get("/balance", { preHandler: [app.authenticate] }, getBalance);

	// POST /api/account/transfer — auth required (fixed typo: was "transer")
	app.post("/transfer", { preHandler: [app.authenticate] }, postTransfer);
}
