const express = require("express");
const router = express.Router();
const {postCreateUser,getUsers,getUserById,PutUpdateUser,deleteUser} = require("../controllers/userController");

router.post("/", postCreateUser);
router.get("/", getUsers);
router.get("/:id", getUserById);
router.put("/:id", PutUpdateUser);
router.delete("/:id", deleteUser);

module.exports = router;
