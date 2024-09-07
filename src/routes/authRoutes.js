const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const checkUserQuery = "SELECT * FROM users WHERE email = ?";
    db.query(checkUserQuery, [email], (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Database error", error: err });
      }
      if (result.length > 0) {
        return res.status(400).json({ message: "Email already exists" });
      }

      const insertQuery =
        "INSERT INTO users (name, email, password) VALUES (?, ?, ?)";
      db.query(insertQuery, [name, email, hashedPassword], (err) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Database error", error: err });
        }
        res.status(201).json({ message: "User registered successfully" });
      });
    });
  } catch (err) {
    res.status(500).json({ message: "Internal server error", error: err });
  }
});

router.post("/login", (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, result) => {
    if (err)
      return res.status(500).json({ message: "Database error", error: err });
    if (result.length === 0)
      return res.status(400).json({ message: "User not found" });

    const user = result[0];

    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err)
        return res
          .status(500)
          .json({ message: "Error comparing passwords", error: err });
      if (!isMatch)
        return res.status(400).json({ message: "Invalid password" });

      const role = user.role_id === 1 ? "admin" : "user";

      const token = jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ message: "Login successful", token, role });
    });
  });
});

module.exports = router;
