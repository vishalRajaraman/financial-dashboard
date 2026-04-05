const express = require("express");
const { register, login } = require("../controllers/authController");
const router = express.Router();

//connecting the controllers with  the endpoints
router.post("/register", register);
router.post("/login", login);

module.exports = router;
