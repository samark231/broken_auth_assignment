const jwt = require("jsonwebtoken");
const { generateToken } = require("../utils/tokenGenerator");

// Session storage (in-memory)
const loginSessions = {};
const otpStore = {};


const handleLogin = (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email and password required" });
    }

    // Generate session and OTP
    const loginSessionId = Math.random().toString(36).substring(7);
    const otp = Math.floor(100000 + Math.random() * 900000); // 6-digit OTP

    // Store session with 2-minute expiry
    loginSessions[loginSessionId] = {
      email,
      password,
      createdAt: Date.now(),
      expiresAt: Date.now() + 2 * 60 * 1000, // 2 minutes
    };

    // Store OTP
    otpStore[loginSessionId] = otp;

    console.log(`[OTP] Session ${loginSessionId} generated`);

    return res.status(200).json({
      message: "OTP sent",
      loginSessionId,
      otp
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Login failed",
    });
  }
}

const handleVerifyOtp = (req, res) => {
  try {
    const { loginSessionId, otp } = req.body;

    if (!loginSessionId || !otp) {
      return res
        .status(400)
        .json({ error: "loginSessionId and otp required" });
    }

    const session = loginSessions[loginSessionId];

    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }

    if (Date.now() > session.expiresAt) {
      return res.status(401).json({ error: "Session expired" });
    }

    if (parseInt(otp) !== otpStore[loginSessionId]) {
      return res.status(401).json({ error: "Invalid OTP" });
    }

    res.cookie("session_token", loginSessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 15 * 60 * 1000, // 15 minutes
    });

    delete otpStore[loginSessionId];

    return res.status(200).json({
      message: "OTP verified",
      sessionId: loginSessionId,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "OTP verification failed",
    });
  }
};

const handleToken =  (req, res) => {
  try {
    //it should read the session_token cookie instead of authorisation header.
    const session_token = req.cookies.session_token;

    if (!session_token) {
      return res
        .status(401)
        .json({ error: "Unauthorized - valid session required" });
    }

    const session = loginSessions[session_token];

    if (!session) {
      return res.status(401).json({ error: "Invalid session" });
    }

    // Generate JWT
    const secret = process.env.JWT_SECRET || "default-secret-key";

    const accessToken = jwt.sign(
      {
        email: session.email,
        sessionId: session_token,
      },
      secret,
      {
        expiresIn: "15m",
      }
    );

    return res.status(200).json({
      access_token: accessToken,
      expires_in: 900,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Token generation failed",
    });
  }
}

module.exports =  {
    handleLogin,
    handleVerifyOtp,
    handleToken
}