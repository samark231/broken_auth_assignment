const express = require('express');
const  { handleLogin, handleToken, handleVerifyOtp } =  require('../controllers/auth.controllers');
const router = express.Router();

router.get("/", (req,res)=>{
    res.json({
        message: "auth is working"
    })
})
router.post('/login', handleLogin );
router.post('/verify-otp', handleVerifyOtp);
router.post('/token', handleToken);

module.exports = router;