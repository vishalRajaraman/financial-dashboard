const express = require("express");
const {
  createRecord,
  getRecords,
  updateRecord,
  deleteRecord,
} = require("../controllers/financialRecordsController");

const {
  authenticateToken,
  authorizeAdmin,
  authorizeAnalystOrAdmin,
} = require("../middlewares/authMiddleware");

const router = express.Router();

// All routes require the user to be logged in
router.use(authenticateToken);

// Analysts and Admins can view/filter records
router.get("/", authorizeAnalystOrAdmin, getRecords);

// ONLY Admins can modify records
router.post("/", authorizeAdmin, createRecord);
router.patch("/:id", authorizeAdmin, updateRecord); //patch instead of put aa it provides the feature of partial updation
router.delete("/:id", authorizeAdmin, deleteRecord);

module.exports = router;
