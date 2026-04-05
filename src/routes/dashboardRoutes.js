const express = require("express");
const { getDashboardSummary } = require("../controllers/dashboardController");
const { authenticateToken } = require("../middlewares/authMiddleware");

const router = express.Router();
//only login authentication is neccesary to access this endpoint
router.get("/", authenticateToken, getDashboardSummary);

module.exports = router;
