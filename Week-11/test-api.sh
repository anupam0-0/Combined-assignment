#!/bin/bash
# =============================================================
# API Test Script — Tests all endpoints for the Fastify app
# Run with: bash test-api.sh
# Requires: curl, jq (optional, for pretty JSON)
# =============================================================

BASE="http://localhost:3000/api"
PASS=0
FAIL=0

# Colors
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Generate unique username to avoid conflicts on re-runs
TIMESTAMP=$(date +%s)
USER1="testuser_${TIMESTAMP}@test.com"
USER2="receiver_${TIMESTAMP}@test.com"

echo -e "\n${YELLOW}========================================${NC}"
echo -e "${YELLOW}  Fastify + Prisma API Test Suite${NC}"
echo -e "${YELLOW}========================================${NC}\n"

# Helper: check response
check() {
    local test_name="$1"
    local expected_code="$2"
    local actual_code="$3"
    local body="$4"

    if [ "$actual_code" == "$expected_code" ]; then
        echo -e "${GREEN}✓ PASS${NC} — $test_name (HTTP $actual_code)"
        PASS=$((PASS + 1))
    else
        echo -e "${RED}✗ FAIL${NC} — $test_name (expected $expected_code, got $actual_code)"
        echo -e "  Response: $body"
        FAIL=$((FAIL + 1))
    fi
}

# ─────────────────────────────────────
# 1. Health Check
# ─────────────────────────────────────
echo -e "${YELLOW}--- Health Check ---${NC}"

RESPONSE=$(curl -s -w "\n%{http_code}" http://localhost:3000/)
BODY=$(echo "$RESPONSE" | head -1)
CODE=$(echo "$RESPONSE" | tail -1)
check "GET / — health check" "200" "$CODE" "$BODY"

# ─────────────────────────────────────
# 2. Signup
# ─────────────────────────────────────
echo -e "\n${YELLOW}--- Signup ---${NC}"

# 2a. Valid signup — User 1
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE/user/signup" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$USER1\",\"password\":\"password123\",\"firstName\":\"John\",\"lastName\":\"Doe\"}")
BODY=$(echo "$RESPONSE" | head -1)
CODE=$(echo "$RESPONSE" | tail -1)
check "POST /signup — valid user" "201" "$CODE" "$BODY"
TOKEN1=$(echo "$BODY" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# 2b. Valid signup — User 2 (for transfer tests later)
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE/user/signup" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$USER2\",\"password\":\"password456\",\"firstName\":\"Jane\",\"lastName\":\"Smith\"}")
BODY=$(echo "$RESPONSE" | head -1)
CODE=$(echo "$RESPONSE" | tail -1)
check "POST /signup — second user" "201" "$CODE" "$BODY"
TOKEN2=$(echo "$BODY" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)

# 2c. Duplicate signup — should fail 409
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE/user/signup" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$USER1\",\"password\":\"password123\",\"firstName\":\"John\",\"lastName\":\"Doe\"}")
BODY=$(echo "$RESPONSE" | head -1)
CODE=$(echo "$RESPONSE" | tail -1)
check "POST /signup — duplicate should fail" "409" "$CODE" "$BODY"

# 2d. Bad body — missing fields
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE/user/signup" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"bad\"}")
BODY=$(echo "$RESPONSE" | head -1)
CODE=$(echo "$RESPONSE" | tail -1)
check "POST /signup — bad body should fail" "500" "$CODE" "$BODY"

# ─────────────────────────────────────
# 3. Login
# ─────────────────────────────────────
echo -e "\n${YELLOW}--- Login ---${NC}"

# 3a. Valid login
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE/user/login" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$USER1\",\"password\":\"password123\"}")
BODY=$(echo "$RESPONSE" | head -1)
CODE=$(echo "$RESPONSE" | tail -1)
check "POST /login — valid credentials" "200" "$CODE" "$BODY"
# Update token in case signup token was different
LOGIN_TOKEN=$(echo "$BODY" | grep -o '"token":"[^"]*"' | cut -d'"' -f4)
if [ -n "$LOGIN_TOKEN" ]; then TOKEN1="$LOGIN_TOKEN"; fi

# 3b. Wrong password
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE/user/login" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"$USER1\",\"password\":\"wrongpassword\"}")
BODY=$(echo "$RESPONSE" | head -1)
CODE=$(echo "$RESPONSE" | tail -1)
check "POST /login — wrong password" "401" "$CODE" "$BODY"

# 3c. Non-existent user
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE/user/login" \
    -H "Content-Type: application/json" \
    -d "{\"username\":\"nobody@test.com\",\"password\":\"password123\"}")
BODY=$(echo "$RESPONSE" | head -1)
CODE=$(echo "$RESPONSE" | tail -1)
check "POST /login — user not found" "401" "$CODE" "$BODY"

# ─────────────────────────────────────
# 4. Update Profile (auth required)
# ─────────────────────────────────────
echo -e "\n${YELLOW}--- Update Profile ---${NC}"

# 4a. Without token — should fail
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$BASE/user/" \
    -H "Content-Type: application/json" \
    -d "{\"firstName\":\"Johnny\"}")
BODY=$(echo "$RESPONSE" | head -1)
CODE=$(echo "$RESPONSE" | tail -1)
check "PUT /user — no token should fail" "401" "$CODE" "$BODY"

# 4b. With token — valid update
RESPONSE=$(curl -s -w "\n%{http_code}" -X PUT "$BASE/user/" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN1" \
    -d "{\"firstName\":\"Johnny\"}")
BODY=$(echo "$RESPONSE" | head -1)
CODE=$(echo "$RESPONSE" | tail -1)
check "PUT /user — update name with token" "200" "$CODE" "$BODY"

# ─────────────────────────────────────
# 5. Bulk Users
# ─────────────────────────────────────
echo -e "\n${YELLOW}--- Bulk Users ---${NC}"

# 5a. Search with filter
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE/user/bulk?filter=John")
BODY=$(echo "$RESPONSE" | head -1)
CODE=$(echo "$RESPONSE" | tail -1)
check "GET /bulk?filter=John — search users" "200" "$CODE" "$BODY"

# 5b. No filter — returns all
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE/user/bulk")
BODY=$(echo "$RESPONSE" | head -1)
CODE=$(echo "$RESPONSE" | tail -1)
check "GET /bulk — all users" "200" "$CODE" "$BODY"

# ─────────────────────────────────────
# 6. Get Balance (auth required)
# ─────────────────────────────────────
echo -e "\n${YELLOW}--- Balance ---${NC}"

# 6a. Without token — should fail
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE/account/balance")
BODY=$(echo "$RESPONSE" | head -1)
CODE=$(echo "$RESPONSE" | tail -1)
check "GET /balance — no token should fail" "401" "$CODE" "$BODY"

# 6b. With token
RESPONSE=$(curl -s -w "\n%{http_code}" "$BASE/account/balance" \
    -H "Authorization: Bearer $TOKEN1")
BODY=$(echo "$RESPONSE" | head -1)
CODE=$(echo "$RESPONSE" | tail -1)
check "GET /balance — with token" "200" "$CODE" "$BODY"

# ─────────────────────────────────────
# 7. Transfer (auth required)
# ─────────────────────────────────────
echo -e "\n${YELLOW}--- Transfer ---${NC}"

# 7a. Without token — should fail
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE/account/transfer" \
    -H "Content-Type: application/json" \
    -d "{\"receiverUsername\":\"$USER2\",\"amount\":10}")
BODY=$(echo "$RESPONSE" | head -1)
CODE=$(echo "$RESPONSE" | tail -1)
check "POST /transfer — no token should fail" "401" "$CODE" "$BODY"

# 7b. Transfer with zero balance — should fail (insufficient)
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE/account/transfer" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN1" \
    -d "{\"receiverUsername\":\"$USER2\",\"amount\":100}")
BODY=$(echo "$RESPONSE" | head -1)
CODE=$(echo "$RESPONSE" | tail -1)
check "POST /transfer — insufficient balance" "400" "$CODE" "$BODY"

# 7c. Transfer to non-existent user
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE/account/transfer" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN1" \
    -d "{\"receiverUsername\":\"ghost@test.com\",\"amount\":10}")
BODY=$(echo "$RESPONSE" | head -1)
CODE=$(echo "$RESPONSE" | tail -1)
check "POST /transfer — receiver not found" "404" "$CODE" "$BODY"

# 7d. Transfer to self — should fail
RESPONSE=$(curl -s -w "\n%{http_code}" -X POST "$BASE/account/transfer" \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN1" \
    -d "{\"receiverUsername\":\"$USER1\",\"amount\":10}")
BODY=$(echo "$RESPONSE" | head -1)
CODE=$(echo "$RESPONSE" | tail -1)
check "POST /transfer — self-transfer should fail" "400" "$CODE" "$BODY"

# ─────────────────────────────────────
# Results
# ─────────────────────────────────────
echo -e "\n${YELLOW}========================================${NC}"
echo -e "  Results: ${GREEN}$PASS passed${NC}, ${RED}$FAIL failed${NC}"
echo -e "${YELLOW}========================================${NC}\n"

if [ $FAIL -eq 0 ]; then
    echo -e "${GREEN}All tests passed! 🎉${NC}\n"
else
    echo -e "${RED}Some tests failed. Check the output above.${NC}\n"
fi
