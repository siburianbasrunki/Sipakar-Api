const db = require("../config/db");

exports.createUser = (req, res) => {
  const { name, email, password } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const query =
    "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)";
  db.query(query, [name, email, hashedPassword, 2], (err, result) => {
    if (err) return res.status(500).send("Error creating user");
    res.status(201).send("User created successfully");
  });
};

exports.getAllUsers = (req, res) => {
  const query = "SELECT * FROM users";
  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Error fetching users");
    res.status(200).send(results);
  });
};

exports.updateUser = (req, res) => {
  const { id } = req.params;
  const { name, email, role_id } = req.body;

  const query =
    "UPDATE users SET name = ?, email = ?, role_id = ? WHERE id = ?";
  db.query(query, [name, email, role_id, id], (err, result) => {
    if (err) return res.status(500).send("Error updating user");
    res.status(200).send("User updated successfully");
  });
};

exports.deleteUser = (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM users WHERE id = ?";
  db.query(query, [id], (err, result) => {
    if (err) return res.status(500).send("Error deleting user");
    res.status(200).send("User deleted successfully");
  });
};
