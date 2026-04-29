# =============================================================
# API Test Script — Tests all endpoints for the Fastify app
# Run with: powershell -File test-api.ps1
# =============================================================

$BASE = "http://localhost:3000/api"
$PASS = 0
$FAIL = 0

# Generate unique username
$TIMESTAMP = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$USER1 = "testuser_${TIMESTAMP}@test.com"
$USER2 = "receiver_${TIMESTAMP}@test.com"

Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Fastify + Prisma API Test Suite" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""

function Test-Endpoint {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Url,
        [int]$ExpectedCode,
        [string]$Body = $null,
        [string]$Token = $null
    )

    $headers = @{ "Content-Type" = "application/json" }
    if ($Token) {
        $headers["Authorization"] = "Bearer $Token"
    }

    try {
        $params = @{
            Uri = $Url
            Method = $Method
            Headers = $headers
            ErrorAction = "Stop"
        }
        if ($Body) {
            $params["Body"] = $Body
        }

        $response = Invoke-WebRequest @params
        $code = $response.StatusCode
        $content = $response.Content
    } catch {
        $code = $_.Exception.Response.StatusCode.value__
        try {
            $content = $_.ErrorDetails.Message
        } catch {
            $content = $_.Exception.Message
        }
    }

    if ($code -eq $ExpectedCode) {
        Write-Host "  PASS" -NoNewline -ForegroundColor Green
        Write-Host " - $Name (HTTP $code)"
        $script:PASS++
    } else {
        Write-Host "  FAIL" -NoNewline -ForegroundColor Red
        Write-Host " - $Name (expected $ExpectedCode, got $code)"
        Write-Host "    Response: $content" -ForegroundColor DarkGray
        $script:FAIL++
    }

    return $content
}

# ─────────────────────────────────────
# 1. Health Check
# ─────────────────────────────────────
Write-Host "--- Health Check ---" -ForegroundColor Yellow

Test-Endpoint -Name "GET / health check" -Method GET -Url "http://localhost:3000/" -ExpectedCode 200

# ─────────────────────────────────────
# 2. Signup
# ─────────────────────────────────────
Write-Host "`n--- Signup ---" -ForegroundColor Yellow

$signupBody1 = @{ username=$USER1; password="password123"; firstName="John"; lastName="Doe" } | ConvertTo-Json
$result = Test-Endpoint -Name "POST /signup - valid user" -Method POST -Url "$BASE/user/signup" -ExpectedCode 201 -Body $signupBody1
$TOKEN1 = ($result | ConvertFrom-Json -ErrorAction SilentlyContinue).token

$signupBody2 = @{ username=$USER2; password="password456"; firstName="Jane"; lastName="Smith" } | ConvertTo-Json
$result = Test-Endpoint -Name "POST /signup - second user" -Method POST -Url "$BASE/user/signup" -ExpectedCode 201 -Body $signupBody2
$TOKEN2 = ($result | ConvertFrom-Json -ErrorAction SilentlyContinue).token

Test-Endpoint -Name "POST /signup - duplicate should fail" -Method POST -Url "$BASE/user/signup" -ExpectedCode 409 -Body $signupBody1

$badBody = @{ username="bad" } | ConvertTo-Json
Test-Endpoint -Name "POST /signup - bad body should fail" -Method POST -Url "$BASE/user/signup" -ExpectedCode 500 -Body $badBody

# ─────────────────────────────────────
# 3. Login
# ─────────────────────────────────────
Write-Host "`n--- Login ---" -ForegroundColor Yellow

$loginBody = @{ username=$USER1; password="password123" } | ConvertTo-Json
$result = Test-Endpoint -Name "POST /login - valid credentials" -Method POST -Url "$BASE/user/login" -ExpectedCode 200 -Body $loginBody
$loginToken = ($result | ConvertFrom-Json -ErrorAction SilentlyContinue).token
if ($loginToken) { $TOKEN1 = $loginToken }

$wrongPw = @{ username=$USER1; password="wrongpassword" } | ConvertTo-Json
Test-Endpoint -Name "POST /login - wrong password" -Method POST -Url "$BASE/user/login" -ExpectedCode 401 -Body $wrongPw

$noUser = @{ username="nobody@test.com"; password="password123" } | ConvertTo-Json
Test-Endpoint -Name "POST /login - user not found" -Method POST -Url "$BASE/user/login" -ExpectedCode 401 -Body $noUser

# ─────────────────────────────────────
# 4. Update Profile (auth required)
# ─────────────────────────────────────
Write-Host "`n--- Update Profile ---" -ForegroundColor Yellow

$updateBody = @{ firstName="Johnny" } | ConvertTo-Json
Test-Endpoint -Name "PUT /user - no token should fail" -Method PUT -Url "$BASE/user/" -ExpectedCode 401 -Body $updateBody
Test-Endpoint -Name "PUT /user - update name with token" -Method PUT -Url "$BASE/user/" -ExpectedCode 200 -Body $updateBody -Token $TOKEN1

# ─────────────────────────────────────
# 5. Bulk Users
# ─────────────────────────────────────
Write-Host "`n--- Bulk Users ---" -ForegroundColor Yellow

Test-Endpoint -Name "GET /bulk?filter=John - search" -Method GET -Url "$BASE/user/bulk?filter=John" -ExpectedCode 200
Test-Endpoint -Name "GET /bulk - all users" -Method GET -Url "$BASE/user/bulk" -ExpectedCode 200

# ─────────────────────────────────────
# 6. Balance (auth required)
# ─────────────────────────────────────
Write-Host "`n--- Balance ---" -ForegroundColor Yellow

Test-Endpoint -Name "GET /balance - no token should fail" -Method GET -Url "$BASE/account/balance" -ExpectedCode 401
Test-Endpoint -Name "GET /balance - with token" -Method GET -Url "$BASE/account/balance" -ExpectedCode 200 -Token $TOKEN1

# ─────────────────────────────────────
# 7. Transfer (auth required)
# ─────────────────────────────────────
Write-Host "`n--- Transfer ---" -ForegroundColor Yellow

$transferBody = @{ receiverUsername=$USER2; amount=10 } | ConvertTo-Json
Test-Endpoint -Name "POST /transfer - no token should fail" -Method POST -Url "$BASE/account/transfer" -ExpectedCode 401 -Body $transferBody
Test-Endpoint -Name "POST /transfer - insufficient balance" -Method POST -Url "$BASE/account/transfer" -ExpectedCode 400 -Body $transferBody -Token $TOKEN1

$ghostTransfer = @{ receiverUsername="ghost@test.com"; amount=10 } | ConvertTo-Json
Test-Endpoint -Name "POST /transfer - receiver not found" -Method POST -Url "$BASE/account/transfer" -ExpectedCode 404 -Body $ghostTransfer -Token $TOKEN1

$selfTransfer = @{ receiverUsername=$USER1; amount=10 } | ConvertTo-Json
Test-Endpoint -Name "POST /transfer - self-transfer should fail" -Method POST -Url "$BASE/account/transfer" -ExpectedCode 400 -Body $selfTransfer -Token $TOKEN1

# ─────────────────────────────────────
# Results
# ─────────────────────────────────────
Write-Host ""
Write-Host "========================================" -ForegroundColor Yellow
Write-Host "  Results: $PASS passed, $FAIL failed" -ForegroundColor $(if ($FAIL -eq 0) { "Green" } else { "Red" })
Write-Host "========================================" -ForegroundColor Yellow
Write-Host ""
