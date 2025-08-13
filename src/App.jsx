import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './Pages/Home/Home.jsx';
import SignIn from './Pages/Login/SignIn.jsx';
import SignUp from './Pages/Login/SignUp.jsx';
import AiTools from './Pages/Main/AiTools.jsx';
import QuizGenerator from './Pages/Main/Tools/QuizGenerator/QuizGenerator.jsx';
import FlashcardGenerator from './Pages/Main/Tools/FlashcardGenerator/FlashcardGenerator.jsx';
import StudyPlanner from './Pages/Main/Tools/StudyPlanner/StudyPlanner.jsx';
import ConceptExplainer from './Pages/Main/Tools/ConceptExplainer/ConceptExplainer.jsx';

function App() {
  return (
    <Routes>
      {/* Public routes */}
      <Route path="/" element={<Home />} />
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<SignUp />} />

      {/* AI Tools layout with nested routes */}
      <Route path="/aitools" element={<AiTools />}>
        {/* Default tool to show on /aitools */}
        <Route index element={<Navigate to="quiz-generator" replace />} />
        <Route path="quiz-generator" element={<QuizGenerator />} />
        <Route path="flashcard-generator" element={<FlashcardGenerator />} />
        <Route path="study-planner" element={<StudyPlanner />} />
        <Route path="concept-explainer" element={<ConceptExplainer />} />
      </Route>
    </Routes>
  );
}

export default App;
