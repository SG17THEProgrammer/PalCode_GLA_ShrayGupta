const nodemailer = require('nodemailer');
let otpStore = {};  // Store OTPs temporarily in memory

const sendOtp = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).send({ message: 'Email is required' });
    }

    // Generate OTP
    const otp = Math.floor(100000 + Math.random() * 900000); // Generate a 6-digit OTP

    otpStore[email] = otp; // Store OTP for this email

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'pqrx159@gmail.com', // Your email
        pass: 'sjblglwgmatwrlqs',  // App password (not your Gmail password)
      },
    });

    const receiver = {
      from: 'pqrx159@gmail.com',
      to: email,
      subject: 'OTP for Login',
      text: `Your OTP is: ${otp}`,
    };

    // Send the OTP email
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

    // Check if the OTP is correct
    if (otpStore[email] && otpStore[email] === parseInt(otp)) {
      delete otpStore[email]; // OTP is used, remove it from the store
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
