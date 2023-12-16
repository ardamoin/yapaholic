const express = require("express");
const router = express.Router();

const usersController = require("../controllers/usersController");

router.post("/sign-up", usersController.sign_up);

router.post("/log-in", usersController.log_in);

router.post("/log-out", usersController.log_out);

module.exports = router;
