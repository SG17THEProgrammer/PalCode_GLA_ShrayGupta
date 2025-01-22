import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import { db, collection, addDoc } from '../firebase';

const VerifyOtp = ({ email }) => {
  const [otp, setOtp] = useState('');
  const navigate = useNavigate();

  const handleVerifyOtp = async () => {
    if (!otp) {
      toast.error('OTP is required');
      return;
    }

    try {
      const res = await axios.post(`${import.meta.env.VITE_BACKEND_URL}/verifyOtp`, { email, otp });
      if (res.data.success) {

        await addDoc(collection(db, 'users'), {
          email,
          createdAt: new Date(),
        });

        toast.success(`Login Successful`);
        navigate("/home")

      } else {
        toast.error('Invalid OTP');
      }
    } catch (err) {
      toast.error('Error verifying OTP');
    }
  };


  

  return (
    <div className="verify-otp-form">
      <h3 className="subtitle">Enter OTP sent to {email}</h3>
      <input
        type="text"
        placeholder="Enter OTP"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
          className="otp-input"
      />
      <button onClick={handleVerifyOtp} className="verify-otp-button">Verify OTP</button>
    </div>
  );
};

export default VerifyOtp;
