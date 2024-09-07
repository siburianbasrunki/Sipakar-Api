const bcrypt = require("bcryptjs");
const db = require("../config/db");

exports.createEmployee = (req, res) => {
  const { name, email, password, division } = req.body;
  const hashedPassword = bcrypt.hashSync(password, 8);

  const userQuery =
    "INSERT INTO users (name, email, password, role_id) VALUES (?, ?, ?, ?)";
  db.query(userQuery, [name, email, hashedPassword, 2], (err, result) => {
    if (err) return res.status(500).send("Error creating user");

    const userId = result.insertId;
    const employeeQuery =
      "INSERT INTO employees (user_id, division) VALUES (?, ?)";
    db.query(employeeQuery, [userId, division], (err) => {
      if (err) return res.status(500).send("Error creating employee");
      res.status(201).send("Employee created successfully");
    });
  });
};

exports.getAllEmployees = (req, res) => {
  const query = `
    SELECT users.id, users.name, users.email, employees.division
    FROM users
    INNER JOIN employees ON users.id = employees.user_id`;
  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Error fetching employees");
    res.status(200).send(results);
  });
};

exports.updateEmployee = (req, res) => {
  const { id } = req.params;
  const { name, email, division } = req.body;

  const userQuery = "UPDATE users SET name = ?, email = ? WHERE id = ?";
  db.query(userQuery, [name, email, id], (err) => {
    if (err) return res.status(500).send("Error updating user");

    const employeeQuery = "UPDATE employees SET division = ? WHERE user_id = ?";
    db.query(employeeQuery, [division, id], (err) => {
      if (err) return res.status(500).send("Error updating employee");
      res.status(200).send("Employee updated successfully");
    });
  });
};

exports.deleteEmployee = (req, res) => {
  const { id } = req.params;

  const employeeQuery = "DELETE FROM employees WHERE user_id = ?";
  db.query(employeeQuery, [id], (err) => {
    if (err) return res.status(500).send("Error deleting employee");

    const userQuery = "DELETE FROM users WHERE id = ?";
    db.query(userQuery, [id], (err) => {
      if (err) return res.status(500).send("Error deleting user");
      res.status(200).send("Employee deleted successfully");
    });
  });
};
