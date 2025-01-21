import React, { useState } from 'react'
import {BrowserRouter, Route, Routes} from 'react-router-dom'
import Home from './components/Home'
import Login from './components/Login'
const App = () => {
  const [accessToken, setAccessToken] = useState(null);

  const handleSignInSuccess = (token) => {
    setAccessToken(token);
  };
  return (
    <BrowserRouter>
    <Routes>
    <Route path="/" element={<Login onSignInSuccess={handleSignInSuccess} />} />
    <Route path="/home" element={<Home accessToken={accessToken} />} />
    </Routes>
    </BrowserRouter>
  )
}

export default App