
require("dotenv").config();

const express = require("express");
const jwt = require("jsonwebtoken");
const authMiddleware = require("./middleware/authMiddleware");

const app = express();

// JSON request body ko read karne ke liye
app.use(express.json());

// Demo users
const users = [
  {
    id: 1,
    name: "Rahul",
    email: "student@example.com",
    password: "student123",
    role: "student",
  },
  {
    id: 2,
    name: "Amit",
    email: "admin@example.com",
    password: "admin123",
    role: "admin",
  },
];

// Home API
app.get("/", (req, res) => {
  res.send("JWT Authentication Project is Running");
});

// Login API
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // Check user email and password
  const user = users.find(
    (u) => u.email === email && u.password === password
  );

  if (!user) {
    return res.status(401).json({
      success: false,
      message: "Invalid email or password",
    });
  }

  // Generate JWT token
  const token = jwt.sign(
    {
      id: user.id,
      name: user.name,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "1h",
    }
  );

  res.json({
    success: true,
    message: "Login successful",
    token: token,
  });
});

// Protected Profile API
app.get("/profile", authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: "Welcome to your profile",
    user: req.user,
  });
});

// Admin Only API
app.get("/admin", authMiddleware, (req, res) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Access denied. Admin only.",
    });
  }

  res.json({
    success: true,
    message: "Welcome Admin! You have access.",
  });
});

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
