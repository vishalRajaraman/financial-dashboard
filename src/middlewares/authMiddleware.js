const jwt = require("jsonwebtoken");

// Token Verification
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"]; // accessing the token which is present in http header
  const token = authHeader && authHeader.split(" ")[1]; // guardrails to prevent crashing of server when no token is provided
  if (!token) {
    return res
      .status(401)
      .json({ status: "error", message: "No Token Provided" });
  }
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = payload; //attaching the extracted payload from the token
    next(); //passing control to next function
  } catch (error) {
    return res
      .status(403)
      .json({ status: "error", message: "invalid or expired token" });
  }
};

// checking the role of the user

const authorizeAdmin = (req, res, next) => {
  // We check if req.user exists (set by authenticateToken) and if the role matches
  if (!req.user || req.user.role !== "ADMIN") {
    return res.status(403).json({
      status: "error",
      message: "Forbidden. Admin access required to perform this action.",
    });
  }
  next(); // User is an Admin
};

// Middleware to check if user is an ANALYST or ADMIN
const authorizeAnalystOrAdmin = (req, res, next) => {
  if (!req.user || (req.user.role !== "ANALYST" && req.user.role !== "ADMIN")) {
    return res.status(403).json({
      status: "error",
      message: "Forbidden. Analyst or Admin access required.",
    });
  }
  next(); // User has sufficient privileges
};

module.exports = {
  authenticateToken,
  authorizeAdmin,
  authorizeAnalystOrAdmin,
};
