const express = require("express");
const {
  createUser,
  getAllUsers,
  updateUser,
  deleteUser,
} = require("../controllers/userController");
const { verifyToken } = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/users", verifyToken, getAllUsers);
router.post("/users", verifyToken, createUser);
router.put("/users/:id", verifyToken, updateUser);
router.delete("/users/:id", verifyToken, deleteUser);

module.exports = router;
