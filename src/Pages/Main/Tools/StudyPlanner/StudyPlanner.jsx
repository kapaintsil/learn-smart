import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { saveToFirestore } from '../../../../utils/saveToFirestore';
import { handleFileUpload } from '../../../../utils/handleFileUpload';
import { downloadPlan } from '../../../../utils/downloadPlan';
import { model, auth } from '../../../../Firebase/firebase';
import { toast } from 'react-toastify';
import ReactMarkdown from 'react-markdown';
import {
  FiUpload,
  FiFileText,
  FiDownload,
  FiPlay,
  FiCalendar,
  FiClock,
  FiBookOpen,
} from 'react-icons/fi';

const StudyPlanner = () => {
  const { state } = useLocation();
  const [textInput, setTextInput] = useState('');
  const [file, setFile] = useState(null);
  const [useText, setUseText] = useState(true);
  const [title, setTitle] = useState('');
  const [examDate, setExamDate] = useState('');
  const [dailyHours, setDailyHours] = useState(2);
  const [plan, setPlan] = useState('');
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user =>
      setIsAuthenticated(!!user)
    );
    return () => unsubscribe();
  }, []);

  // Load saved data if navigated from History
  useEffect(() => {
    if (state?.savedData) {
      const {
        title,
        originalContent,
        generatedPlan,
        examDate,
        dailyHours,
        file,
      } = state.savedData;
      setTitle(title || '');
      setTextInput(originalContent || '');
      setPlan(generatedPlan || '');
      setExamDate(examDate || '');
      setDailyHours(dailyHours || 2);
      setUseText(!file);
    }
  }, [state]);

  const handleGenerate = async () => {
    if (!title.trim()) return toast.error('Please enter a plan title.');
    if (!useText && !file)
      return toast.error('Please provide text input or upload a file.');
    if (!examDate || !dailyHours)
      return toast.error('Please fill in exam date and daily hours.');

    setLoading(true);
    setPlan('');

    try {
      const studyContent = useText ? textInput : await handleFileUpload(file);

      const prompt = `Create a detailed daily study plan based on the content below.
Today is ${new Date().toDateString()} and the exam date is ${examDate}.
The user has ${dailyHours} hours available per day. Divide content efficiently across days.
Format output as:

[Day X] <Topics to study>

${studyContent}`;

      const result = await model.generateContent(prompt);
      const generatedText = await (await result.response).text();
      setPlan(generatedText);

      if (!isAuthenticated || !auth.currentUser) {
        toast.info('Study plan generated but not saved (please sign in).');
        return;
      }

      const itemData = {
        type: 'study-plan',
        title: title.trim(),
        originalContent: studyContent,
        generatedPlan: generatedText,
        examDate,
        dailyHours,
      };
      await saveToFirestore('generatedItems', itemData);
      toast.success('Study plan generated and saved successfully!');
    } catch (error) {
      toast.error('Error generating study plan: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!plan) return toast.error('No study plan to download.');
    downloadPlan(
      plan,
      `${title || 'study-plan'}.pdf`,
      title || 'Generated Study Plan'
    );
    toast.success('Study plan downloaded as PDF!');
  };

  const getDaysUntilExam = () => {
    if (!examDate) return null;
    const today = new Date();
    const exam = new Date(examDate);
    const diffTime = exam - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExam = getDaysUntilExam();

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Study Planner
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Create personalized study plans based on your content and schedule
          </p>
        </div>

        {/* Generated Study Plan Display */}
        {plan && (
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Generated Study Plan
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
                <ReactMarkdown>{plan}</ReactMarkdown>
              </div>
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className='card p-8'>
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-6'>
            Create New Study Plan
          </h3>

          {/* Input Method Toggle */}
          <div className='mb-6'>
            <div className='flex items-center space-x-4'>
              <label className='flex items-center space-x-2 cursor-pointer'>
                <input
                  type='checkbox'
                  checked={useText}
                  onChange={() => setUseText(!useText)}
                  className='w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 rounded focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600'
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
                  Study Content
                </label>
                <textarea
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder='Paste or type your study content here...'
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
                    accept='.pdf,.docx,.txt,.csv,.xlsx'
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
                      PDF, DOCX, TXT, CSV, XLSX (max 10MB)
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

          {/* Study Plan Configuration */}
          <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Plan Title
              </label>
              <input
                type='text'
                placeholder='Enter a title for your study plan'
                value={title}
                onChange={e => setTitle(e.target.value)}
                className='input'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Exam Date
              </label>
              <div className='relative'>
                <input
                  type='date'
                  value={examDate}
                  onChange={e => setExamDate(e.target.value)}
                  className='input pl-10'
                />
                <FiCalendar className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
              </div>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Daily Study Hours
              </label>
              <div className='relative'>
                <input
                  type='number'
                  value={dailyHours}
                  min='1'
                  max='12'
                  onChange={e => setDailyHours(Number(e.target.value))}
                  className='input pl-10'
                />
                <FiClock className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
              </div>
            </div>

            <div className='flex items-end'>
              <button
                onClick={handleGenerate}
                disabled={loading || !isAuthenticated}
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
                    <span>Generate Plan</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Study Plan Preview */}
          <div className='bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-4'>
            <div className='flex items-center space-x-2 mb-3'>
              <FiBookOpen className='w-5 h-5 text-blue-600 dark:text-blue-400' />
              <h4 className='font-medium text-blue-900 dark:text-blue-100'>
                Study Plan Preview
              </h4>
            </div>
            <div className='grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm'>
              <div className='flex items-center space-x-2'>
                <span className='text-blue-700 dark:text-blue-300'>Title:</span>
                <span className='font-medium text-blue-900 dark:text-blue-100'>
                  {title || 'Not set'}
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                <span className='text-blue-700 dark:text-blue-300'>
                  Exam Date:
                </span>
                <span className='font-medium text-blue-900 dark:text-blue-100'>
                  {examDate || 'Not set'}
                </span>
              </div>
              <div className='flex items-center space-x-2'>
                <span className='text-blue-700 dark:text-blue-300'>
                  Daily Hours:
                </span>
                <span className='font-medium text-blue-900 dark:text-blue-100'>
                  {dailyHours} hours
                </span>
              </div>
            </div>
            {daysUntilExam !== null && (
              <div className='mt-3 pt-3 border-t border-blue-200 dark:border-blue-700'>
                <div className='flex items-center space-x-2'>
                  <span className='text-blue-700 dark:text-blue-300'>
                    Time until exam:
                  </span>
                  <span
                    className={`font-medium px-2 py-1 rounded-full text-xs ${
                      daysUntilExam < 0
                        ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
                        : daysUntilExam <= 7
                        ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                        : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                    }`}
                  >
                    {daysUntilExam < 0
                      ? 'Exam date has passed'
                      : daysUntilExam === 0
                      ? 'Today'
                      : `${daysUntilExam} day${daysUntilExam === 1 ? '' : 's'}`}
                  </span>
                </div>
              </div>
            )}
          </div>

          {!isAuthenticated && (
            <div className='mt-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                <span className='text-sm text-yellow-700 dark:text-yellow-300'>
                  Sign in to save your generated study plans
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudyPlanner;
