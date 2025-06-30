import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages_temp/Home/Home.jsx';     
import SignUp from './Pages_temp/SignUp/SignUp.jsx'; 

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<SignUp />} />
    </Routes>
  );
}

export default App;
