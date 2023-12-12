const express = require("express");
const router = express.Router();

const messagesController = require("../controllers/messagesController");

router.get("/member", messagesController.member_messages_get);

router.get("/non-member", messagesController.non_member_messages_get);

router.post("/create", messagesController.messages_create);

router.post("/delete", messagesController.messages_delete);

module.exports = router;
