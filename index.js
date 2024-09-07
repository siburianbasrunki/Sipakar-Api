const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const authRoutes = require("./src/routes/authRoutes");
const userRoutes = require("./src/routes/userRoutes");
const employeeRoutes = require("./src/routes/employeeRoutes");
const attendanceRoutes = require("./src/routes/attendanceRoutes");
require("dotenv").config();
const app = express();
const port = 3001;

app.use(cors());
app.use(bodyParser.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", employeeRoutes);
app.use("/api", attendanceRoutes);

app.get("/", (req, res) => {
  res.send("Welcome to the Attendance Management System API!");
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
