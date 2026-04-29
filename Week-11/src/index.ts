import Fastify from "fastify";
import jwt from "@fastify/jwt";
import sensible from "@fastify/sensible";
import "dotenv/config";
import prismaPlugin from "./plugins/prisma";
import authPlugin from "./plugins/auth";
import AuthRoutes from "./routes/user.routes";
import AccountRoutes from "./routes/account.routes";

const app = Fastify({ logger: true });

// --- Validate env vars at startup ---
const SECRET = process.env.JWT_SECRET;
if (!SECRET) {
	throw new Error("JWT_SECRET environment variable is not set");
}

// --- Register plugins (order matters!) ---
// 1. sensible — gives us proper HTTP error helpers like app.httpErrors.notFound()
app.register(sensible);

// 2. JWT — must be before auth plugin, since auth plugin calls req.jwtVerify()
app.register(jwt, { secret: SECRET });

// 3. Prisma — single DB connection pool shared across the entire app
app.register(prismaPlugin);

// 4. Auth — decorates app with `authenticate` preHandler hook
app.register(authPlugin);

// --- Register route plugins with URL prefixes ---
app.register(AuthRoutes, { prefix: "/api/user" });
app.register(AccountRoutes, { prefix: "/api/account" });

// --- Health check ---
app.get("/", async () => {
	return { status: "ok" };
});

// --- Start server ---
const start = async () => {
	try {
		await app.listen({ port: 3000, host: "0.0.0.0" });
	} catch (err) {
		app.log.error(err);
		process.exit(1);
	}
};

start();
