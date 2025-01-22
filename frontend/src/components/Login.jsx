import React, { useState } from 'react';
import VerifyOtp from './VerifyOtp';
import EmailForm from './EmailForm';

const Login = () => {
  const [email, setEmail] = useState('');
  const [otpSent, setOtpSent] = useState(false);

  const handleOtpSent = (email) => {
    setEmail(email);
    setOtpSent(true);
  };

  const handleSignInSuccess = (token) => {
    localStorage.setItem('accessToken', token);
  };

  return (
    <div className='otrDiv'>
    <div className="otp-login-container">
      <h1  className="title">OTP Login</h1>
      {!otpSent ? (
        <EmailForm onOtpSent={handleOtpSent} />
      ) : (
        <VerifyOtp email={email} onSignInSuccess={handleSignInSuccess} />
      )}
    </div>
    </div>
  );
};

export default Login;
