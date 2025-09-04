import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import { FiSun, FiMoon, FiLogOut } from 'react-icons/fi';
import wm_Logo from '/icons/website-logo.png';
import dm_Logo from '/icons/logo-dm.png';

const NavBar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { isDark, toggleTheme } = useTheme();

  const handleSignOut = async () => {
    await logout();
    navigate('/');
  };

  return (
    <nav className='bg-white dark:bg-gray-800 shadow-md border-b border-gray-200 dark:border-gray-700'>
      <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8'>
        <div className='flex justify-between items-center h-16'>
          {/* Logo */}
          <div className='flex items-center'>
            <img
              src={isDark ? dm_Logo : wm_Logo}
              alt='Learn Smart Logo'
              onClick={() => navigate('/')}
              className='h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity'
            />
          </div>

          {/* Right side */}
          <div className='flex items-center justify-center space-x-4'>
            {/* Theme toggle */}
            <button
              onClick={toggleTheme}
              className='p-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors'
              aria-label={
                isDark ? 'Switch to light mode' : 'Switch to dark mode'
              }
            >
              {isDark ? (
                <FiSun className='h-5 w-5 text-yellow-500' />
              ) : (
                <FiMoon className='h-5 w-5 text-gray-600' />
              )}
            </button>

            {user ? (
              <>
                <span className='text-sm text-gray-700 dark:text-gray-300'>
                  Hello, {user.displayName || 'User'}
                </span>
                <button
                  onClick={handleSignOut}
                  className='btn btn-outline flex items-center space-x-2'
                  aria-label='Sign out'
                >
                  <FiLogOut className='h-4 w-4' />
                  <span>Sign Out</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => navigate('/signin')}
                  className='btn btn-outline'
                  aria-label='Sign in'
                >
                  Sign In
                </button>
                <button
                  onClick={() => navigate('/signup')}
                  className='btn btn-primary'
                  aria-label='Sign up'
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
