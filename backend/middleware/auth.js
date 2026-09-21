const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.JWT_SECRET || "dbacoach_secret_key_change_in_prod";

function protect(req, res, next) {
  const header = req.headers.authorization;
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Not authorised — no token" });
  }
  const token = header.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.admin = decoded;
    next();
  } catch {
    return res.status(401).json({ success: false, error: "Not authorised — invalid token" });
  }
}

module.exports = { protect, JWT_SECRET };
