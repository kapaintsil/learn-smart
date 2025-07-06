import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home.jsx';     
import SignIn from './Pages/Login/SignIn.jsx';
import SignUp from './Pages/Login/SignUp.jsx';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
