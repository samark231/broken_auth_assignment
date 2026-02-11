# Auth Flow Test Commands

This file contains `curl` commands to test the full authentication flow for the assignment.

## Start server (PowerShell)
```powershell
cd "d:\Practice 1\broken_auth_assignment"
$env:APPLICATION_SECRET="your-app-secret"
$env:JWT_SECRET="your-jwt-secret"
npm install
node server.js
```

## Start server (cmd)
```cmd
cd "d:\Practice 1\broken_auth_assignment"
set APPLICATION_SECRET=your-app-secret
set JWT_SECRET=your-jwt-secret
npm install
node server.js
```

Base URL: http://localhost:3000

### 1) POST /auth/login
Request a login session and OTP (OTP is logged to server console).
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@test.com","password":"password123"}'
```

Example response:
```json
{ "message": "OTP sent", "loginSessionId": "abc123" }
```

### 2) POST /auth/verify-otp
Capture cookies to `cookies.txt` when verifying OTP.
```bash
curl -c cookies.txt -X POST http://localhost:3000/auth/verify-otp \
  -H "Content-Type: application/json" \
  -d '{"loginSessionId":"<loginSessionId>","otp":"<otp_from_logs>"}'
```

Example response:
```json
{ "message": "OTP verified", "sessionId": "abc123" }
```

### 3) POST /auth/token
Use the cookie jar from the previous step to request an access token.
```bash
curl -b cookies.txt -X POST http://localhost:3000/auth/token
```

Alternative (if server expects Authorization header — intentional bug):
```bash
curl -X POST http://localhost:3000/auth/token \
  -H "Authorization: Bearer <loginSessionId_or_token>"
```

Expected response:
```json
{ "access_token": "<jwt>", "expires_in": 900 }
```

### 4) GET /protected
Access the protected endpoint using the cookie jar or Authorization header.
```bash
# With cookie
curl -b cookies.txt http://localhost:3000/protected

# With Authorization header
curl -H "Authorization: Bearer <jwt_or_session>" http://localhost:3000/protected
```

### 5) Legacy /token endpoint
```bash
curl -X POST http://localhost:3000/token \
  -H "Content-Type: application/json" \
  -d '{"email":"candidate@gmail.com"}'
```

### Debugging tips
- Check server console logs for OTP and error details.
- Use browser DevTools > Network > Cookies to inspect response cookies.
- Use `cookies.txt` with `-c` and `-b` to persist and send cookies with `curl`.
- Decode JWTs at https://jwt.io to inspect claims and expiry.
- Compare headers vs cookies if requests fail with 401 — intentional bugs often check the wrong location.
