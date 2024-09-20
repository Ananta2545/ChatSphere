

const express = require('express');
const router = express.Router();
const messagesController = require('../controllers/messagesController'); // Ensure this path is correct

router.post('/addMsg/', messagesController.addMessage);// when anybody comes to this link then the addMessage function will run from messagesController.js
router.post('/getMsg/', messagesController.getAllMessage)
module.exports = router;
