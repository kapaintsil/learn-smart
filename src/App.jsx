import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { auth } from './Firebase/firebase.js'; // Adjust path based on your structure
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Home from './Pages/Home/Home.jsx';
import SignIn from './Pages/Auth/SignIn.jsx';
import SignUp from './Pages/Auth/SignUp.jsx';
import AiTools from './Pages/Main/AiTools.jsx';
import QuizGenerator from './Pages/Main/Tools/QuizGenerator/QuizGenerator.jsx';
import FlashcardGenerator from './Pages/Main/Tools/FlashcardGenerator/FlashcardGenerator.jsx';
import StudyPlanner from './Pages/Main/Tools/StudyPlanner/StudyPlanner.jsx';
import ConceptExplainer from './Pages/Main/Tools/ConceptExplainer/ConceptExplainer.jsx';

// ProtectedRoute component to guard authenticated routes
const ProtectedRoute = ({ children }) => {
  return auth.currentUser ? children : <Navigate to="/signin" replace />;
};

const App = () => {
  return (
    <>
      {/* Global ToastContainer for notifications */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} closeOnClick draggable pauseOnHover />

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Home />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />

        {/* Protected AI Tools layout with nested routes */}
        <Route
          path="/aitools"
          element={
            <ProtectedRoute>
              <AiTools />
            </ProtectedRoute>
          }
        >
          {/* Default route for /aitools */}
          <Route index element={<Navigate to="quiz-generator" replace />} />
          <Route
            path="quiz-generator"
            element={
              <ProtectedRoute>
                <QuizGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="flashcard-generator"
            element={
              <ProtectedRoute>
                <FlashcardGenerator />
              </ProtectedRoute>
            }
          />
          <Route
            path="study-planner"
            element={
              <ProtectedRoute>
                <StudyPlanner />
              </ProtectedRoute>
            }
          />
          <Route
            path="concept-explainer"
            element={
              <ProtectedRoute>
                <ConceptExplainer />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;