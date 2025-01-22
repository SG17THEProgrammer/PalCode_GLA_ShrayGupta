import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const EmailForm = ({ onOtpSent }) => {
  const [email, setEmail] = useState('');
  const [loading , setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (!email) {
      toast.error('Email is required');
      return;
    }

    var emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    
    if (!emailPattern.test(email)) {
        toast.error("Please enter a valid email address.")
        return;
    }

    try {
      setLoading(true);
      await axios.post(`${import.meta.env.VITE_BACKEND_URL}/sendOtp`, { email });
      onOtpSent(email);
      toast.success('OTP sent successfully');
    } catch (err) {
      console.error(err);
      toast.error('Failed to send OTP. Please try again.');
    }
    finally{
      setLoading(false)
    }
  };

  return (
    <div className='email-form'>
      <h3 className='subtitle'>Enter your Email</h3>
      <input
        type="email"
        placeholder="Your Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className='email-input'
        required
      />
      <button onClick={handleSendOtp} className="send-otp-button">{!loading?"Send OTP":"Sending OTP ...."}</button>
    </div>
  );
};

export default EmailForm;
