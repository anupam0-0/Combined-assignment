import type { FastifyInstance } from "fastify";
import { signup, login, updateProfile, getBulkUsers } from "../controllers/user.controllers";

// This is a Fastify route plugin. It receives the app instance automatically
// when registered with app.register(). The `prefix` option in index.ts
// means all routes here are scoped under /api/user.

export default async function userRoutes(app: FastifyInstance) {
	// POST /api/user/signup — no auth needed
	app.post("/signup", signup);

	// POST /api/user/login — no auth needed
	app.post("/login", login);

	// PUT /api/user/ — auth required (must be logged in to update own profile)
	app.put("/", { preHandler: [app.authenticate] }, updateProfile);

	// GET /api/user/bulk?filter=john — public search
	app.get("/bulk", getBulkUsers);
}
