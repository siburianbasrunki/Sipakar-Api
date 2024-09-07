const express = require("express");
const {
  createEmployee,
  getAllEmployees,
  updateEmployee,
  deleteEmployee,
} = require("../controllers/employeeController");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/employees", verifyToken, getAllEmployees);
router.post("/employees", verifyToken, createEmployee);
router.put("/employees/:id", verifyToken, updateEmployee);
router.delete("/employees/:id", verifyToken, deleteEmployee);

module.exports = router;
