import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { saveToFirestore } from '../../../../utils/saveToFirestore';
import { handleFileUpload } from '../../../../utils/handleFileUpload';
import { downloadPlan } from '../../../../utils/downloadPlan';
import { model, auth } from '../../../../Firebase/firebase';
import { toast } from 'react-toastify';
import {
  FiUpload,
  FiFileText,
  FiDownload,
  FiPlay,
  FiRotateCcw,
} from 'react-icons/fi';

const FlashcardGenerator = () => {
  const { state } = useLocation();
  const [file, setFile] = useState(null);
  const [useText, setUseText] = useState(false);
  const [textInput, setTextInput] = useState('');
  const [title, setTitle] = useState('');
  const [flashcardType, setFlashcardType] = useState('term');
  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user =>
      setIsAuthenticated(!!user)
    );
    return () => unsubscribe();
  }, []);

  // Load saved flashcards if coming from History
  useEffect(() => {
    if (state?.savedData) {
      const { title, originalContent, cards, flashcardType } = state.savedData;
      setTitle(title || '');
      setTextInput(originalContent || '');
      setFlashcards(cards || []);
      setFlashcardType(flashcardType || 'term');
      setUseText(!!originalContent);
      setFile(null);
    }
  }, [state]);

  const toggleFlip = index =>
    setFlippedCards(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );

  const handleGenerate = async () => {
    if (!title.trim()) return toast.error('Please enter a title.');
    if (!useText && !file)
      return toast.error('Please upload a file or enter text.');
    if (useText && !textInput.trim())
      return toast.error('Please enter text content.');

    setLoading(true);
    setFlashcards([]);

    try {
      const content = useText ? textInput : await handleFileUpload(file);
      const prompt = `From the content below, generate 10 ${
        flashcardType === 'term' ? 'Term and Definition' : 'Question and Answer'
      } flashcards. Format as:

[Front] <text>
[Back] <text>

${content}`;

      const result = await model.generateContent(prompt);
      const text = await (await result.response).text();

      // Parse AI output
      const parsed = text
        .split(/\[Front\]|\[Back\]/)
        .map(s => s.trim())
        .filter(Boolean);
      const cards = [];
      for (let i = 0; i + 1 < parsed.length; i += 2) {
        cards.push({ front: parsed[i], back: parsed[i + 1] });
      }
      setFlashcards(cards);

      const itemData = {
        type: 'flashcard',
        title: title.trim(),
        originalContent: content,
        cards,
        flashcardType,
      };
      await saveToFirestore('generatedItems', itemData);
      toast.success('Flashcards generated and saved successfully!');
    } catch (error) {
      toast.error('Error generating flashcards: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!flashcards.length) return toast.error('No flashcards to download.');
    const text = flashcards
      .map((c, i) => `Card ${i + 1}\nFront: ${c.front}\nBack: ${c.back}\n\n`)
      .join('');
    downloadPlan(
      text,
      `${title || 'flashcards'}.pdf`,
      title || 'Generated Flashcards'
    );
    toast.success('Flashcards downloaded as PDF!');
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-6'>
      <div className='max-w-7xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Flashcard Generator
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Transform your study materials into interactive flashcards using AI
          </p>
        </div>

        {/* Generated Flashcards Display */}
        {flashcards.length > 0 && (
          <div className='mb-8'>
            <div className='flex items-center justify-between mb-6'>
              <h2 className='text-xl font-semibold text-gray-900 dark:text-white'>
                Generated Flashcards ({flashcards.length})
              </h2>
              <button
                onClick={handleDownload}
                className='btn btn-primary flex items-center space-x-2'
              >
                <FiDownload className='w-4 h-4' />
                <span>Download PDF</span>
              </button>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'>
              {flashcards.map((card, index) => (
                <div
                  key={index}
                  className='group cursor-pointer perspective-1000'
                  onClick={() => toggleFlip(index)}
                >
                  <div
                    className={`relative w-full h-48 transition-transform duration-500 transform-style-preserve-3d ${
                      flippedCards.includes(index) ? 'rotate-y-180' : ''
                    }`}
                  >
                    {/* Front of card */}
                    <div className='absolute inset-0 w-full h-full backface-hidden'>
                      <div className='card h-full p-6 flex flex-col justify-center items-center text-center'>
                        <div className='text-sm text-gray-500 dark:text-gray-400 mb-2'>
                          {flashcardType === 'term' ? 'Term' : 'Question'}
                        </div>
                        <div className='text-gray-900 dark:text-white font-medium leading-relaxed'>
                          {card.front}
                        </div>
                        <div className='mt-4 text-xs text-gray-400 dark:text-gray-500'>
                          Click to flip
                        </div>
                      </div>
                    </div>

                    {/* Back of card */}
                    <div className='absolute inset-0 w-full h-full backface-hidden rotate-y-180'>
                      <div className='card h-full p-6 flex flex-col justify-center items-center text-center bg-primary-50 dark:bg-primary-900/20 border-primary-200 dark:border-primary-700'>
                        <div className='text-sm text-primary-600 dark:text-primary-400 mb-2'>
                          {flashcardType === 'term' ? 'Definition' : 'Answer'}
                        </div>
                        <div className='text-gray-900 dark:text-white font-medium leading-relaxed'>
                          {card.back}
                        </div>
                        <div className='mt-4 text-xs text-primary-500 dark:text-primary-400'>
                          Click to flip back
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Input Form */}
        <div className='card p-8'>
          <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-6'>
            Generate New Flashcards
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
                  Content
                </label>
                <textarea
                  value={textInput}
                  onChange={e => setTextInput(e.target.value)}
                  placeholder='Paste or type your content here...'
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
                    accept='.pdf,.docx,.txt,.csv,.xlsx,.pptx'
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
                      PDF, DOCX, TXT, CSV, XLSX, PPTX (max 10MB)
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

          {/* Configuration Options */}
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6 mb-6'>
            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Set Title
              </label>
              <input
                type='text'
                placeholder='Enter a title for your flashcard set'
                value={title}
                onChange={e => setTitle(e.target.value)}
                className='input'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2'>
                Flashcard Type
              </label>
              <select
                value={flashcardType}
                onChange={e => setFlashcardType(e.target.value)}
                className='input'
              >
                <option value='term'>Term / Definition</option>
                <option value='qa'>Question / Answer</option>
              </select>
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
                    <span>Generate Flashcards</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {!isAuthenticated && (
            <div className='p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-md'>
              <div className='flex items-center space-x-2'>
                <div className='w-2 h-2 bg-yellow-500 rounded-full'></div>
                <span className='text-sm text-yellow-700 dark:text-yellow-300'>
                  Sign in to save your generated flashcards
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FlashcardGenerator;
