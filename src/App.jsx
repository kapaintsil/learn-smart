import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './Pages/Home/Home';     
import SignUp from './Pages/SignUp/SignUp'; 

function App() {
  return (
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes>
  );
}

export default App;

