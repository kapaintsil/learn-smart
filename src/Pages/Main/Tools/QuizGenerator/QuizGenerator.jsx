import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { handleFileUpload } from '../../../../utils/handleFileUpload';
import { downloadPlan } from '../../../../utils/downloadPlan';
import { saveToFirestore } from '../../../../utils/saveToFirestore';
import { addQuiz } from '../../../../utils/localStorage';
import { auth, model } from '../../../../Firebase/firebase';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import {
  FiUpload,
  FiFileText,
  FiDownload,
  FiPlay,
  FiFile,
} from 'react-icons/fi';

/**
 * QuizGenerator Component
 * A React component that generates quizzes using AI based on uploaded files or text input
 */
function QuizGenerator() {
  // State management using React hooks
  const { state } = useLocation();
  const [file, setFile] = useState(null); // Stores uploaded file
  const [textInput, setTextInput] = useState(''); // Stores text input
  const [useText, setUseText] = useState(false); // Toggle between file/text input
  const [questionCount, setQuestionCount] = useState(10); // Number of questions
  const [difficulty, setDifficulty] = useState('medium'); // Quiz difficulty
  const [format, setFormat] = useState('mcq'); // Quiz format (MCQ/True-False)
  const [quiz, setQuiz] = useState(''); // Stores generated quiz
  const [loading, setLoading] = useState(false); // Loading state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Auth state

  // Monitor authentication state changes
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => {
      setIsAuthenticated(!!user);
    });
    return () => unsubscribe();
  }, []);

  // Load saved quiz data from History state
  useEffect(() => {
    if (state?.savedData) {
      const { title, content, quiz, questionCount, difficulty, format } =
        state.savedData;
      setQuiz(quiz || '');
      setTextInput(content || '');
      setQuestionCount(questionCount || 5);
      setDifficulty(difficulty || 'medium');
      setFormat(format || 'mcq');
      setUseText(!!content);
    }
  }, [state]);

  /**
   * Handles quiz generation process
   * Validates input, generates quiz using AI, and saves result
   */
  const handleGenerateQuiz = async () => {
    // Input validation
    if (!useText && !file) {
      toast.error('Please upload a file or enter text content.');
      return;
    }
    if (useText && !textInput.trim()) {
      toast.error('Please enter text content.');
      return;
    }

    setLoading(true);
    setQuiz('');

    try {
      // Get content from file or text input
      const content = useText ? textInput : await handleFileUpload(file);

      // Construct prompt for AI
      const prompt = `Generate a neatly formatted ${questionCount}-question ${
        format === 'tf' ? 'true/false' : 'multiple-choice'
      } quiz with answers and explanations. Difficulty: ${difficulty}.\n\n${content}`;

      // Generate quiz using AI
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      setQuiz(text);

      // Handle unauthenticated users
      if (!isAuthenticated || !auth.currentUser) {
        toast.info('Quiz generated but not saved (please sign in).');
        addQuiz({
          title: `Quiz (${difficulty}) - ${new Date().toLocaleDateString()}`,
          type: 'quiz',
          content,
          quiz: text,
          questionCount,
          difficulty,
          format,
        });
        setLoading(false);
        return;
      }

      // Save quiz data
      const itemData = {
        type: 'quiz',
        title: `Quiz (${difficulty}) - ${new Date().toLocaleDateString()}`,
        content,
        quiz: text,
        questionCount,
        difficulty,
        format,
      };

      // Save to Firestore and handle response
      const itemId = await saveToFirestore('generatedItems', itemData);
      if (!itemId) {
        toast.error('Failed to save quiz.');
      } else {
        toast.success('Quiz saved successfully!');
      }

      addQuiz(itemData);
    } catch (error) {
      toast.error('Error generating quiz: ' + error.message);
      setQuiz('Error generating quiz: ' + error.message);
    } finally {
      setLoading(false);
    }
  };


   // Handles downloading quiz as PDF
   
  const handleDownload = () => {
    if (quiz) {
      downloadPlan(quiz, 'quiz.pdf', 'Generated Quiz');
      toast.success('Quiz downloaded as PDF!');
    }
  };

  /**
   * Returns appropriate color classes based on difficulty level
   */
  const getDifficultyColor = diff => {
    switch (diff) {
      case 'easy':
        return 'text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20';
      case 'medium':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20';
      case 'hard':
        return 'text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-900/20';
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Quiz Generator
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Create interactive quizzes from your study materials using AI
          </p>
        </div>

        {/* Generated Quiz Display */}
        {quiz && (
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Generated Quiz
              </h2>
              <button
                onClick={handleDownload}
                className='btn btn-primary flex items-center space-x-2'
              >
                <FiDownload className='w-4 h-4' />
                <span>Download PDF</span>
              </button>
            </div>

            <div className='card p-6'>
              <div className='prose prose-gray dark:prose-invert max-w-none'>
                <ReactMarkdown>{quiz}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className='card p-8'>
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-6'>
            Generate New Quiz
          </h3>

          {/* Input Method Toggle */}
          <div className='mb-6'>
            <div className='flex items-center space-x-4'>
              <label className='flex items-center space-x-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={useText}
                  onChange={() => setUseText(!useText)}
                  className='w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded cursor-pointer focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
                />
                <span className='text-gray-700 dark:text-gray-300'>
                  Use text input instead of file upload
                </span>
              </label>
            </div>
          </div>

          {/* Content Input */}
          <div className='mb-6'>
            {useText ? (
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Content
                </label>
                <textarea
                  placeholder='Paste or type your content here...'
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  className='input min-h-[200px] resize-y'
                  rows={8}
                />
              </div>
            ) : (
              <div>
                <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                  Upload File
                </label>
                <div className='border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-primary-400 dark:hover:border-primary-500 transition-colors'>
                  <input
                    type='file'
                    onChange={e => setFile(e.target.files[0])}
                    accept='.pdf,.docx,.pptx,.txt,.csv,.xlsx'
                    className='hidden'
                    id='file-upload'
                  />
                  <label htmlFor='file-upload' className='cursor-pointer'>
                    <FiUpload className='mx-auto h-12 w-12 text-gray-400 dark:text-gray-500 mb-4' />
                    <div className='text-gray-600 dark:text-gray-400'>
                      <span className='font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500'>
                        Click to upload
                      </span>{' '}
                      or drag and drop
                    </div>
                    <div className='text-sm text-gray-500 dark:text-gray-500 mt-1'>
                      PDF, DOCX, PPTX, TXT, CSV, XLSX (max 10MB)
                    </div>
                    {file && (
                      <div className='mt-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-md'>
                        <div className='flex items-center space-x-2'>
                          <FiFileText className='w-4 h-4 text-green-600 dark:text-green-400' />
                          <span className='text-sm text-green-700 dark:text-green-300'>
                            {file.name}
                          </span>
                        </div>
                      </div>
                    )}
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Quiz Configuration */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Number of Questions
              </label>
              <input
                type='number'
                value={questionCount}
                onChange={e => setQuestionCount(Number(e.target.value))}
                min={10}
                max={100}
                className='input'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Difficulty
              </label>
              <select
                value={difficulty}
                onChange={e => setDifficulty(e.target.value)}
                className='input'
              >
                <option value='easy'>Easy</option>
                <option value='medium'>Medium</option>
                <option value='hard'>Hard</option>
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Format
              </label>
              <select
                value={format}
                onChange={e => setFormat(e.target.value)}
                className='input'
              >
                <option value='mcq'>Multiple Choice</option>
                <option value='tf'>True / False</option>
              </select>
            </div>

            <div className='flex items-end'>
              <button
                onClick={handleGenerateQuiz}
                disabled={loading}
                className='btn btn-primary w-full flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed'
              >
                {loading ? (
                  <>
                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <FiPlay className='w-4 h-4' />
                    <span>Generate Quiz</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Quiz Preview Info */}
          <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4'>
            <div className='flex items-center space-x-2 mb-3'>
              <FiFile className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              <h4 className='font-medium text-blue-900 dark:text-blue-100'>
                Quiz Preview
              </h4>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm'>
              <div className='flex items-center space-x-2'>
                <span className='text-blue-700 dark:text-blue-300'>
                  Questions:
                </span>
                <span className='font-medium text-blue-900 dark:text-blue-100'>
                  {questionCount}
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                <span className='text-blue-700 dark:text-blue-300'>
                  Difficulty:
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(
                    difficulty
                  )}`}
                >
                  {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)}
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                <span className='text-blue-700 dark:text-blue-300'>
                  Format:
                </span>
                <span className='font-medium text-blue-900 dark:text-blue-100'>
                  {format === 'mcq' ? 'Multiple Choice' : 'True/False'}
                </span>
              </div>
            </div>
          </div>

          {!isAuthenticated && (
            <div className='mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                <span className='text-sm text-yellow-700 dark:text-yellow-300'>
                  Sign in to save your generated quizzes
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QuizGenerator;
