const express = require("express");
const {
  addAttendance,
  getAttendance,
} = require("../controllers/attendanceController");
const router = express.Router();
const { verifyToken } = require("../controllers/attendanceController");

router.post("/attendance", verifyToken, addAttendance);
router.get("/attendance", getAttendance);

module.exports = router;
