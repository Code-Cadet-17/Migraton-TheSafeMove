const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authAdmin = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Unauthorized: Missing token" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log("✅ Decoded JWT:", decoded);

    const user = await User.findById(decoded.id).lean();  // ✅ FIXED HERE
    console.log("👤 MongoDB returned:", user);

    if (!user) {
      console.log("⛔ No user found in DB");
      return res.status(403).json({ message: "Forbidden: Admin user not found" });
    }

    if (user.role !== "admin") {
      console.log("⛔ Role mismatch. Found role:", user.role);
      return res.status(403).json({ message: "Forbidden: Not an admin" });
    }

    req.admin = user;
    next();
  } catch (err) {
    console.error("❌ JWT error:", err.message);
    return res.status(401).json({ message: "Invalid token" });
  }
};

module.exports = authAdmin;
