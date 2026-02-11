# The Silent Server (Backend Debugging Assignment)

This API is intentionally broken.
Your task is to debug it and complete the authentication flow.

## Setup

```bash
npm install
npm start
```

Server runs at: `http://localhost:3000`

## Assignment

Complete the authentication flow and obtain a valid access token.

The API has multiple endpoints that don't work correctly.
Use your browser's developer tools, network inspection, and server logs to understand what's happening.

You'll need to:
1. Inspect the server responses
2. Check cookies and headers
3. Decode JWT payloads
4. Understand the session lifecycle

After debugging and fixing all issues, you should be able to:
- Authenticate successfully
- Receive a valid JWT token
- Access protected endpoints

**Hints:**
- Check the network tab in DevTools
- Look at request headers and response cookies
- Run the server and watch console logs
- Decode JWT tokens to see claims
