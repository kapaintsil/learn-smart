import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { auth } from "./Firebase/firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import Home from "./Pages/Home/Home.jsx";
import SignIn from "./Pages/Auth/SignIn.jsx";
import SignUp from "./Pages/Auth/SignUp.jsx";
import AiTools from "./Pages/Main/AiTools.jsx";
import QuizGenerator from "./Pages/Main/Tools/QuizGenerator/QuizGenerator.jsx";
import FlashcardGenerator from "./Pages/Main/Tools/FlashcardGenerator/FlashcardGenerator.jsx";
import StudyPlanner from "./Pages/Main/Tools/StudyPlanner/StudyPlanner.jsx";
import ConceptExplainer from "./Pages/Main/Tools/ConceptExplainer/ConceptExplainer.jsx";
import History from "./Pages/Main/Tools/History/History.jsx";

// ProtectedRoute now handles async auth state
const ProtectedRoute = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined while checking
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  if (loading) return <div>Loading...</div>; // Show spinner or skeleton

  return user ? children : <Navigate to="/signin" replace />;
};

const App = () => {
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar={false}
        closeOnClick
        draggable
        pauseOnHover
      />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected AI Tools routes */}
        <Route
          path="/aitools"
          element={
            <ProtectedRoute>
              <AiTools />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="quiz-generator" replace />} />
          <Route path="quiz-generator" element={<QuizGenerator />} />
          <Route path="flashcard-generator" element={<FlashcardGenerator />} />
          <Route path="study-planner" element={<StudyPlanner />} />
          <Route path="concept-explainer" element={<ConceptExplainer />} />
          <Route path="history" element={<History />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
