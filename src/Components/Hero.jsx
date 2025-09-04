import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import heroImage from '../assets/images/hero-image.png';
import { FiChevronsRight } from "react-icons/fi";

function Hero() {
  const navigate = useNavigate();
  const { user } = useAuth();

  const headline = [
    { text: 'A centralized', className: 'text-gray-600 dark:text-gray-400' },
    {
      text: 'AI - powered',
      className: 'text-primary-600 dark:text-primary-400 font-semibold',
    },
    { text: 'platform for', className: 'text-gray-600 dark:text-gray-400' },
    {
      text: 'smarter learning',
      className: 'text-primary-600 dark:text-primary-400 font-semibold',
    },
  ];

  const handleGetStarted = () => {
    if (user) {
      navigate('/aitools');
    } else {
      navigate('/signup');
    }
  };

  return (
    <section className='min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8  dark:from-gray-900 dark:to-gray-800'>
      <div className='max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center'>
        {/* Left side - Content */}
        <div className='space-y-8'>
          <h1 className=' text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight'>
            {headline.map((part, index) => (
              <span key={index} className={part.className}>
                {part.text}{' '}
              </span>
            ))}
          </h1>

          <p className='text-lg sm:text-xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl'>
            Learning just got easier! Elevate your academic journey with
            LearnSmart! Find your flashcard generator, quiz generator, and other
            AI tools for you in one location.
          </p>

          <button
            onClick={handleGetStarted}
            className='btn btn-primary flex items-center justify-center text-base sm:text-lg px-4 sm:px-8 py-3 sm:py-4 space-x-2 hover:scale-105 transition-transform'
          >
            <span>{user ? 'Go to Tools' : 'Get Started'}</span>
            <FiChevronsRight className='w-4 h-4 sm:w-5 sm:h-5' />
          </button>

        </div>

        {/* Right side - Image */}
        <div className='flex justify-center lg:justify-end'>
          <img
            src={heroImage}
            alt='Learning illustration'
            className='w-full max-w-lg h-auto object-contain '
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
