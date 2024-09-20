

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Ensure this path is correct

router.post('/register', userController.register);// when anybody click to /register then the register function will start working under the userController
router.post('/login', userController.login)
router.post('/setAvatar/:id', userController.setAvatar);// when the post functionality is occuring in this link the setAvatar function will start under userController
router.get('/allusers/:id', userController.getAllUsers) // when any request is coming from this link then the function getAllUsers should trigger and fetch all the contacts
module.exports = router;
