import React from 'react';
import footerLogo from '/icons/LS-logo.png';

function Footer() {
  return (
    <footer className='bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-8'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex flex-col md:flex-row items-center md:items-start justify-around space-y-4 md:space-y-0'>
          
          {/* Logo */}
          <div className='flex items-center mb-2 md:mb-0'>
            <img
              src={footerLogo}
              alt='Footer Logo'
              className='h-10 w-auto transition-transform duration-300 hover:scale-105'
            />
          </div>

          {/* Footer Text */}
          <div className='text-center md:text-right space-y-1'>
            <p className='text-sm text-gray-600 dark:text-gray-300'>
              Made with 💜 by Hilly & Kwame
            </p>
            <p className='text-sm text-gray-500 dark:text-gray-400'>
              © 2025 LearnSmart. All rights reserved.
            </p>
          </div>

        </div>
      </div>
    </footer>
  );
}

export default Footer;
