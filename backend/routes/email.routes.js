const router = require('express').Router();
const emailController = require('../controllers/email.Controller');




router.post('/', emailController.sendEmail);


module.exports = router;