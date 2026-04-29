import type { FastifyRequest, FastifyReply, FastifyInstance } from "fastify";
import fp from "fastify-plugin";

// WHY fastify-plugin (fp)?
//
// Fastify's #1 architectural concept is ENCAPSULATION.
// When you register a plugin with app.register(), it creates an isolated
// child context. Decorators added inside that child are NOT visible to
// siblings or the parent.
//
// But auth is something EVERY route needs. We want app.authenticate to be
// visible everywhere. fp() tells Fastify: "don't encapsulate this plugin —
// share its decorators with the parent scope."
//
// Without fp: auth.ts decorates a child → routes can't see it → crash
// With fp:    auth.ts decorates the parent → routes can see it → works

async function authPlugin(app: FastifyInstance) {
	app.decorate(
		"authenticate",
		async function (req: FastifyRequest, reply: FastifyReply) {
			// jwtVerify() throws automatically if token is missing/invalid.
			// Fastify catches the thrown error and sends a 401 response.
			// No try/catch needed — letting it throw IS the correct behavior.
			await req.jwtVerify();
		},
	);
}

export default fp(authPlugin);
