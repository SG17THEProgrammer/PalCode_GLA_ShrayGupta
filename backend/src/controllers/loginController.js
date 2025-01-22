const nodemailer = require('nodemailer');
let otpStore = {}; 

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: 'Email is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000); //6-digit OTP

    otpStore[email] = otp; 

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.MY_MAIL, 
        pass: process.env.PASSWORD, 
      },
    });

    const receiver = {
      from: process.env.MY_MAIL,
      to: email,
      subject: 'OTP for Login',
      text: `Your OTP is: ${otp}`,
    };

    transporter.sendMail(receiver, (error, info) => {
      if (error) {
        console.error('Error sending OTP:', error);
        return res.status(500).send({ message: 'Failed to send OTP' });
      }
      res.send({ message: 'OTP sent successfully' });
    });
  } catch (error) {
    console.error('Error in sendOtp:', error);
    res.status(500).send({ message: 'Something went wrong' });
  }
};

const verifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).send({ message: 'Email and OTP are required' });
    }

    if (otpStore[email] && otpStore[email] === parseInt(otp)) {
      delete otpStore[email]; 
      
      res.send({ success: true });
    } else {
      res.status(400).send({ success: false, message: 'Invalid OTP' });
    }
  } catch (error) {
    console.error('Error in verifyOtp:', error);
    res.status(500).send({ message: 'Something went wrong' });
  }
};

module.exports = { sendOtp, verifyOtp };
