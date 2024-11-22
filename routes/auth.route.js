const express = require("express");
const router = express.Router();
const { signUp, Login } = require("../controller/Auth.controller");

router.post("/signup", signUp);
router.post("/login", Login);

module.exports = router;
