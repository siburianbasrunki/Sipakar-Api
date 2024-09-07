const cloudinary = require("../config/cloudinaryConfig");
const db = require("../config/db");
const multer = require("multer");
const path = require("path");
const jwt = require("jsonwebtoken");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "temp_uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

exports.verifyToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(403).send("No token provided");

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) return res.status(500).send("Failed to authenticate token");
    req.userId = decoded.id;
    next();
  });
};

exports.addAttendance = (req, res) => {
  upload.single("photo_in")(req, res, (err) => {
    if (err) return res.status(500).send("Error uploading file");
    if (!req.file) return res.status(400).send("No file uploaded");

    cloudinary.uploader.upload(req.file.path, (error, result) => {
      if (error) return res.status(500).send("Error uploading image");

      const user_id = req.userId;
      const date = new Date().toISOString().slice(0, 10);
      const time_in = new Date().toISOString().slice(11, 19);
      const photo_in = result.secure_url;

      const query =
        "INSERT INTO attendance (user_id, date, time_in, photo_in, created_at) VALUES (?, ?, ?, ?, ?)";
      db.query(query, [user_id, date, time_in, photo_in, new Date()], (err) => {
        if (err) return res.status(500).send("Error adding attendance");
        res.status(201).send("Attendance added successfully");
      });
    });
  });
};

exports.getAttendance = (req, res) => {
  const query =
    "SELECT a.id, a.date, a.time_in, a.photo_in, u.name, u.email " +
    "FROM attendance a " +
    "JOIN users u ON a.user_id = u.id";

  db.query(query, (err, results) => {
    if (err) return res.status(500).send("Error fetching attendance");
    res.status(200).send(results);
  });
};
