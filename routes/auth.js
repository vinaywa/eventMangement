const express = require("express");
const router = express.Router();
const {postLoginCheck} = require("../controllers/authController")

router.post("/",postLoginCheck);

module.exports = router;