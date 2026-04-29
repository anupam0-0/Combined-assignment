// =============================================================
// API Test Script — Tests all endpoints
// Run with: bun run test-api.ts
// =============================================================

const BASE = "http://localhost:3000/api";
let pass = 0;
let fail = 0;

const TIMESTAMP = Date.now();
const USER1 = `testuser_${TIMESTAMP}@test.com`;
const USER2 = `receiver_${TIMESTAMP}@test.com`;

let TOKEN1 = "";
let TOKEN2 = "";

async function test(
	name: string,
	method: string,
	url: string,
	expectedCode: number,
	body?: object,
	token?: string,
): Promise<string> {
	const headers: Record<string, string> = { "Content-Type": "application/json" };
	if (token) headers["Authorization"] = `Bearer ${token}`;

	const opts: RequestInit = { method, headers };
	if (body) opts.body = JSON.stringify(body);

	try {
		const res = await fetch(url, opts);
		const text = await res.text();
		const code = res.status;

		if (code === expectedCode) {
			console.log(`  \x1b[32m✓ PASS\x1b[0m — ${name} (HTTP ${code})`);
			pass++;
		} else {
			console.log(`  \x1b[31m✗ FAIL\x1b[0m — ${name} (expected ${expectedCode}, got ${code})`);
			console.log(`    Response: ${text.slice(0, 200)}`);
			fail++;
		}
		return text;
	} catch (err) {
		console.log(`  \x1b[31m✗ FAIL\x1b[0m — ${name} (network error: ${err})`);
		fail++;
		return "";
	}
}

async function run() {
	console.log("\n\x1b[33m========================================\x1b[0m");
	console.log("\x1b[33m  Fastify + Prisma API Test Suite\x1b[0m");
	console.log("\x1b[33m========================================\x1b[0m\n");

	// ── 1. Health Check ──
	console.log("\x1b[33m--- 1. Health Check ---\x1b[0m");
	await test("GET / health check", "GET", "http://localhost:3000/", 200);

	// ── 2. Signup ──
	console.log("\n\x1b[33m--- 2. Signup ---\x1b[0m");

	let result = await test("POST /signup — valid user 1", "POST", `${BASE}/user/signup`, 201, {
		username: USER1, password: "password123", firstName: "John", lastName: "Doe"
	});
	try { TOKEN1 = JSON.parse(result).token; } catch {}

	result = await test("POST /signup — valid user 2", "POST", `${BASE}/user/signup`, 201, {
		username: USER2, password: "password456", firstName: "Jane", lastName: "Smith"
	});
	try { TOKEN2 = JSON.parse(result).token; } catch {}

	await test("POST /signup — duplicate should fail", "POST", `${BASE}/user/signup`, 409, {
		username: USER1, password: "password123", firstName: "John", lastName: "Doe"
	});

	await test("POST /signup — bad body should fail", "POST", `${BASE}/user/signup`, 500, {
		username: "bad"
	});

	// ── 3. Login ──
	console.log("\n\x1b[33m--- 3. Login ---\x1b[0m");

	result = await test("POST /login — valid credentials", "POST", `${BASE}/user/login`, 200, {
		username: USER1, password: "password123"
	});
	try { TOKEN1 = JSON.parse(result).token || TOKEN1; } catch {}

	await test("POST /login — wrong password", "POST", `${BASE}/user/login`, 401, {
		username: USER1, password: "wrongpassword"
	});

	await test("POST /login — non-existent user", "POST", `${BASE}/user/login`, 401, {
		username: "nobody@test.com", password: "password123"
	});

	// ── 4. Update Profile ──
	console.log("\n\x1b[33m--- 4. Update Profile (auth required) ---\x1b[0m");

	await test("PUT /user — no token should 401", "PUT", `${BASE}/user/`, 401, {
		firstName: "Johnny"
	});

	await test("PUT /user — update name with token", "PUT", `${BASE}/user/`, 200, {
		firstName: "Johnny"
	}, TOKEN1);

	// ── 5. Bulk Users ──
	console.log("\n\x1b[33m--- 5. Bulk Users ---\x1b[0m");

	await test("GET /bulk?filter=John — search", "GET", `${BASE}/user/bulk?filter=John`, 200);
	await test("GET /bulk — all users", "GET", `${BASE}/user/bulk`, 200);

	// ── 6. Balance ──
	console.log("\n\x1b[33m--- 6. Balance (auth required) ---\x1b[0m");

	await test("GET /balance — no token should 401", "GET", `${BASE}/account/balance`, 401);
	await test("GET /balance — with token", "GET", `${BASE}/account/balance`, 200, undefined, TOKEN1);

	// ── 7. Transfer ──
	console.log("\n\x1b[33m--- 7. Transfer (auth required) ---\x1b[0m");

	await test("POST /transfer — no token should 401", "POST", `${BASE}/account/transfer`, 401, {
		receiverUsername: USER2, amount: 10
	});

	await test("POST /transfer — insufficient balance", "POST", `${BASE}/account/transfer`, 400, {
		receiverUsername: USER2, amount: 100
	}, TOKEN1);

	await test("POST /transfer — receiver not found", "POST", `${BASE}/account/transfer`, 404, {
		receiverUsername: "ghost@test.com", amount: 10
	}, TOKEN1);

	await test("POST /transfer — self-transfer should fail", "POST", `${BASE}/account/transfer`, 400, {
		receiverUsername: USER1, amount: 10
	}, TOKEN1);

	// ── Results ──
	console.log("\n\x1b[33m========================================\x1b[0m");
	const color = fail === 0 ? "\x1b[32m" : "\x1b[31m";
	console.log(`${color}  Results: ${pass} passed, ${fail} failed\x1b[0m`);
	console.log("\x1b[33m========================================\x1b[0m\n");

	process.exit(fail > 0 ? 1 : 0);
}

run();
