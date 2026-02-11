const express = require("express");
const cookieParser = require("cookie-parser");
const requestLogger = require("./middleware/logger");
const authMiddleware = require("./middleware/auth");
const authRoutes = require("./routes/auth.routes.js");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(requestLogger);
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.json({
    challenge: "Complete the Authentication Flow",
    instruction:
      "Complete the authentication flow and obtain a valid access token.",
  });
});

// CHANGE 1: /auth/login endpoint
app.use('/auth', authRoutes);

// Protected route example
app.get("/protected", authMiddleware, (req, res) => {
  return res.json({
    message: "Access granted",
    user: req.user,
    success_flag: `FLAG-${Buffer.from(req.user.email + "_COMPLETED_ASSIGNMENT").toString('base64')}`,
  });
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
