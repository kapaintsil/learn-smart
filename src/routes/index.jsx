import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorPage from '../Pages/Error/ErrorPage';

// Lazy load components for code splitting
const Home = lazy(() => import('../Pages/Home/Home'));
const SignIn = lazy(() => import('../Pages/Auth/SignIn'));
const SignUp = lazy(() => import('../Pages/Auth/SignUp'));
const AiTools = lazy(() => import('../Pages/Main/AiTools'));
const QuizGenerator = lazy(() =>
  import('../Pages/Main/Tools/QuizGenerator/QuizGenerator')
);
const FlashcardGenerator = lazy(() =>
  import('../Pages/Main/Tools/FlashcardGenerator/FlashcardGenerator')
);
const StudyPlanner = lazy(() =>
  import('../Pages/Main/Tools/StudyPlanner/StudyPlanner')
);
const ConceptExplainer = lazy(() =>
  import('../Pages/Main/Tools/ConceptExplainer/ConceptExplainer')
);
const History = lazy(() => import('../Pages/Main/Tools/History/History'));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <Home />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/signin',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <SignIn />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/signup',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <SignUp />
      </Suspense>
    ),
    errorElement: <ErrorPage />,
  },
  {
    path: '/aitools',
    element: (
      <ProtectedRoute>
        <Suspense fallback={<LoadingSpinner />}>
          <AiTools />
        </Suspense>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Navigate to='quiz-generator' replace />,
      },
      {
        path: 'quiz-generator',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <QuizGenerator />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: 'flashcard-generator',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <FlashcardGenerator />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: 'study-planner',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <StudyPlanner />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: 'concept-explainer',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <ConceptExplainer />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
      {
        path: 'history',
        element: (
          <Suspense fallback={<LoadingSpinner />}>
            <History />
          </Suspense>
        ),
        errorElement: <ErrorPage />,
      },
    ],
  },
]);
