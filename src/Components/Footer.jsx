import React from 'react';
import footerLogo from '/icons/LS-logo.png';

function Footer() {
  return (
    <footer className=' dark:bg-gray-800 items-center justify-center'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
        <div className='flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0'>
          <div className='flex items-center'>
            <img src={footerLogo} alt='Footer Logo' className='h-8 w-auto' />
          </div>
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
