const express = require('express');
const { sendOtp, verifyOtp } = require('./controllers/loginController');
const { oauth2callback, auth } = require('./controllers/tokenController');
const router = new express.Router()

router.post('/sendOtp' , sendOtp) ; 
router.post('/verifyOtp' , verifyOtp) ; 

router.get('/oauth2callback' , oauth2callback) ; 
router.get('/auth' , auth) ; 

module.exports = router