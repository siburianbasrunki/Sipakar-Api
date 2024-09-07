const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

exports.register = (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const query =
    "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)";
  db.query(query, [name, email, hashedPassword, 2], (err, result) => {
    if (err) return res.status(500).send("Error creating user");
    res.status(201).send("User registered successfully");
  });
};

exports.login = (req, res) => {
  const { email, password } = req.body;

  const query = "SELECT * FROM users WHERE email = ?";
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).send("Error on the server");
    if (results.length === 0) return res.status(404).send("User not found");

    const user = results[0];
    const isPasswordValid = bcrypt.compareSync(password, user.password);
    if (!isPasswordValid) return res.status(401).send("Invalid credentials");

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );
    res.status(200).send({ auth: true, token });
  });
};
