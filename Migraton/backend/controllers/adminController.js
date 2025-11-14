const AdminOTP = require("../models/AdminOTP");
const User = require("../models/User");
const Client = require("../models/Client");
const PG = require("../models/PG");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

// ✅ Send OTP to admin
exports.sendOTP = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email, role: "admin" });
  if (!user) return res.status(403).json({ message: "Not authorized" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  await AdminOTP.deleteMany({ email });
  await AdminOTP.create({ email, otp });

  await sendEmail(email, "Your Admin OTP", `Your HoodWise admin OTP is: ${otp}`);
  res.json({ message: "OTP sent to your email" });
};

// ✅ Verify OTP and generate token
exports.verifyOTP = async (req, res) => {
  const { email, otp } = req.body;

  const record = await AdminOTP.findOne({ email, otp });
  if (!record) return res.status(400).json({ message: "Invalid or expired OTP" });

  const user = await User.findOne({ email, role: "admin" });
  if (!user) return res.status(403).json({ message: "Not authorized" });

  const token = jwt.sign(
    {
      id: user._id,
      role: "admin",
      name: user.name,
      email: user.email
    },
    process.env.JWT_SECRET,
    { expiresIn: "2h" }
  );

  await AdminOTP.deleteMany({ email });
  res.json({ message: "OTP verified", token });
};

// ✅ Get all pending PGs
exports.getPendingPGs = async (req, res) => {
  try {
    const pendingPGs = await PG.find({ approved: false }).sort({ createdAt: -1 });
    res.status(200).json(pendingPGs);
  } catch (err) {
    console.error("❌ Error fetching pending PGs:", err);
    res.status(500).json({ message: "Failed to load pending PGs" });
  }
};

// ✅ Approve PG
exports.approvePG = async (req, res) => {
  try {
    const pg = await PG.findById(req.params.id);
    if (!pg) return res.status(404).json({ message: "PG not found" });

    pg.approved = true;
    await pg.save();

    res.json({ message: "PG approved successfully", pg });
  } catch (err) {
    console.error("❌ Error approving PG:", err);
    res.status(500).json({ message: "Failed to approve PG" });
  }
};

// ✅ Dashboard Stats
exports.getStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments({ role: "user" });
    const totalClients = await Client.countDocuments();
    const totalPGs = await PG.countDocuments();
    const approvedPGs = await PG.countDocuments({ approved: true });
    const pendingPGs = await PG.countDocuments({ approved: false });

    res.json({
      totalUsers,
      totalClients,
      totalPGs,
      approvedPGs,
      pendingPGs
    });
  } catch (err) {
    console.error("❌ Error fetching stats:", err);
    res.status(500).json({ message: "Failed to fetch stats" });
  }
};

// ✅ Get all clients with PG count (FIXED to use "owner" field)
exports.getAllClients = async (req, res) => {
  try {
    const clients = await Client.find().select("-password").sort({ createdAt: -1 });

    const enrichedClients = await Promise.all(
      clients.map(async (client) => {
        const pgCount = await PG.countDocuments({ owner: client._id }); // ✅ Fixed here
        return {
          _id: client._id,
          name: client.name,
          email: client.email,
          phone: client.phone,
          createdAt: client.createdAt,
          pgCount
        };
      })
    );

    res.json(enrichedClients);
  } catch (err) {
    console.error("❌ Error fetching clients:", err);
    res.status(500).json({ message: "Failed to load clients" });
  }
};

// ✅ Delete a client and their PGs
exports.deleteClient = async (req, res) => {
  try {
    const clientId = req.params.id;

    await PG.deleteMany({ owner: clientId });           // ✅ Fixed to match schema
    await Client.findByIdAndDelete(clientId);

    res.json({ message: "Client deleted successfully" });
  } catch (err) {
    console.error("❌ Error deleting client:", err);
    res.status(500).json({ message: "Failed to delete client" });
  }
};
