import React, { useState, useRef, useEffect } from 'react';
import { model } from '../../../../Firebase/firebase';
import { saveToFirestore } from '../../../../utils/saveToFirestore';
import {
  FiSend,
  FiTrash2,
  FiUser,
  FiMessageCircle,
  FiLoader,
} from 'react-icons/fi';
import ReactMarkdown from 'react-markdown';

const ConceptExplainer = ({
  placeholder = 'Ask about anything...',
  initialValue = '',
}) => {
  const [message, setMessage] = useState(initialValue);
  const [isSending, setIsSending] = useState(false);
  const [messages, setMessages] = useState([]);
  const textAreaRef = useRef(null);
  const chatContainerRef = useRef(null);

  // Auto-resize textarea
  useEffect(() => {
    const resizeTextarea = () => {
      if (textAreaRef.current) {
        textAreaRef.current.style.height = 'auto';
        textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
      }
    };
    resizeTextarea();
    const observer = new ResizeObserver(resizeTextarea);
    if (textAreaRef.current) observer.observe(textAreaRef.current);
    return () => observer.disconnect();
  }, [message]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth',
      });
    }
  }, [messages]);

  const handleSend = async () => {
    const trimmedMsg = message.trim();
    if (!trimmedMsg || isSending) return;

    const userMsg = {
      id: crypto.randomUUID(),
      text: trimmedMsg,
      sender: 'user',
      timestamp: new Date().toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    setMessages(prev => [...prev, userMsg]);
    setIsSending(true);

    try {
      // Limit conversation context to last 10 messages to avoid huge prompts
      const recentMessages = [...messages, userMsg].slice(-10);
      const conversationContext = recentMessages
        .map(msg => `${msg.sender === 'user' ? 'User' : 'Bot'}: ${msg.text}`)
        .join('\n');

      const prompt = `
You are a helpful assistant explaining concepts.
Conversation history:
${conversationContext}

Bot:`;

      const result = await model.generateContent(prompt);
      const botResponse = await result.response.text();

      const botMsg = {
        id: crypto.randomUUID(),
        text: botResponse || "Sorry, I didn't understand. Could you rephrase?",
        sender: 'bot',
        timestamp: new Date().toLocaleTimeString([], {
          hour: '2-digit',
          minute: '2-digit',
        }),
      };

      setMessages(prev => [...prev, botMsg]);
      setMessage('');

      await saveToFirestore('conceptExplainerChats', {
        conversation: [...recentMessages, botMsg],
      });
    } catch (error) {
      console.error('Error generating AI response:', error);
      alert('Failed to get response. Please try again.');
    } finally {
      setIsSending(false);
      textAreaRef.current?.focus();
    }
  };

  const handleKeyDown = e => {
    if (e.key === 'Enter' && !e.shiftKey && !isSending) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-6'>
      <div className='max-w-4xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Concept Explainer
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            Get clear explanations and answers to your questions using AI
          </p>
        </div>

        {/* Chat Container */}
        <div className='card h-[600px] flex flex-col'>
          {/* Chat Header */}
          <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-primary-100 dark:bg-primary-900/20 rounded-full flex items-center justify-center'>
                <FiMessageCircle className='w-5 h-5 text-primary-600 dark:text-primary-400' />
              </div>
              <div>
                <h3 className='font-semibold text-gray-900 dark:text-white'>
                  AI Assistant
                </h3>
                <p className='text-sm text-gray-500 dark:text-gray-400'>
                  Ask me anything and I'll explain it clearly
                </p>
              </div>
            </div>
          </div>

          {/* Chat Messages */}
          <div
            ref={chatContainerRef}
            className='flex-1 overflow-y-auto p-4 space-y-4'
          >
            {messages.length === 0 ? (
              <div className='flex flex-col items-center justify-center h-full text-center'>
                <div className='w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4'>
                  <FiMessageCircle className='w-8 h-8 text-gray-400 dark:text-gray-500' />
                </div>
                <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
                  Start a conversation
                </h3>
                <p className='text-gray-500 dark:text-gray-400 max-w-md'>
                  Ask me to explain any concept, solve a problem, or answer your
                  questions. I'm here to help!
                </p>
              </div>
            ) : (
              messages.map(msg => (
                <div
                  key={msg.id}
                  className={`flex ${
                    msg.sender === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`flex items-start space-x-3 max-w-[80%] ${
                      msg.sender === 'user'
                        ? 'flex-row-reverse space-x-reverse'
                        : ''
                    }`}
                  >
                    {/* Avatar */}
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        msg.sender === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300'
                      }`}
                    >
                      {msg.sender === 'user' ? (
                        <FiUser className='w-4 h-4' />
                      ) : (
                        <FiMessageCircle className='w-4 h-4' />
                      )}
                    </div>

                    {/* Message */}
                    <div
                      className={`rounded-lg px-4 py-3 ${
                        msg.sender === 'user'
                          ? 'bg-primary-600 text-white'
                          : 'bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white'
                      }`}
                    >
                      <div className='prose prose-sm max-w-none'>
                        <ReactMarkdown
                          components={{
                            // Override link colors for user messages
                            a: ({ node, ...props }) => (
                              <a
                                {...props}
                                className={`underline ${
                                  msg.sender === 'user'
                                    ? 'text-white hover:text-gray-200'
                                    : 'text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300'
                                }`}
                              />
                            ),
                            // Override code block styling
                            code: ({ node, inline, ...props }) =>
                              inline ? (
                                <code
                                  {...props}
                                  className={`px-1 py-0.5 rounded text-sm ${
                                    msg.sender === 'user'
                                      ? 'bg-primary-700 text-white'
                                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                  }`}
                                />
                              ) : (
                                <code
                                  {...props}
                                  className={`block p-2 rounded text-sm ${
                                    msg.sender === 'user'
                                      ? 'bg-primary-700 text-white'
                                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                                  }`}
                                />
                              ),
                          }}
                        >
                          {msg.text}
                        </ReactMarkdown>
                      </div>
                      <div
                        className={`text-xs mt-2 ${
                          msg.sender === 'user'
                            ? 'text-primary-200'
                            : 'text-gray-500 dark:text-gray-400'
                        }`}
                      >
                        {msg.timestamp}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {/* Loading indicator */}
            {isSending && (
              <div className='flex justify-start'>
                <div className='flex items-start space-x-3 max-w-[80%]'>
                  <div className='w-8 h-8 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0'>
                    <FiMessageCircle className='w-4 h-4 text-gray-600 dark:text-gray-300' />
                  </div>
                  <div className='bg-gray-100 dark:bg-gray-800 rounded-lg px-4 py-3'>
                    <div className='flex items-center space-x-2'>
                      <FiLoader className='w-4 h-4 animate-spin text-gray-500 dark:text-gray-400' />
                      <span className='text-sm text-gray-500 dark:text-gray-400'>
                        Thinking...
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Input Area */}
          <div className='p-4 border-t border-gray-200 dark:border-gray-700'>
            <div className='flex items-end space-x-3'>
              <div className='flex-1 relative'>
                <textarea
                  ref={textAreaRef}
                  className='w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 resize-none focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent min-h-[44px] max-h-32'
                  placeholder={placeholder}
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  disabled={isSending}
                  rows={1}
                />
              </div>

              {/* Action Buttons */}
              <div className='flex items-center space-x-2'>
                {message && (
                  <button
                    onClick={() => setMessage('')}
                    disabled={isSending}
                    className='p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                    aria-label='Clear message'
                  >
                    <FiTrash2 className='w-4 h-4' />
                  </button>
                )}

                <button
                  onClick={handleSend}
                  disabled={isSending || !message.trim()}
                  className='p-2 bg-primary-600 hover:bg-primary-700 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                  aria-label='Send message'
                >
                  {isSending ? (
                    <FiLoader className='w-4 h-4 animate-spin' />
                  ) : (
                    <FiSend className='w-4 h-4' />
                  )}
                </button>
              </div>
            </div>

            {/* Help Text */}
            <div className='mt-2 text-xs text-gray-500 dark:text-gray-400'>
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConceptExplainer;
