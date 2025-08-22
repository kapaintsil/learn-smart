import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../../Firebase/firebase';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import signinImage from '../../assets/images/Learner.png';
import googleLogo from '/icons/google-logo.png';
import websiteLogo from '/icons/website-logo.png';

const SignIn = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Handle email/password sign-in
  const handleSignIn = async e => {
    e.preventDefault();
    setError('');

    try {
      await signInWithEmailAndPassword(auth, email, password);
      toast.success('Signed in successfully!');
      navigate('/aitools');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
      toast.success('Signed in with Google!');
      navigate('/aitools');
    } catch (error) {
      setError(error.message);
      toast.error(error.message);
    }
  };

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col'>
      {/* Logo */}
      <div className='p-6'>
        <img
          src={websiteLogo}
          alt='Learn Smart Logo'
          onClick={() => navigate('/')}
          className='h-8 w-auto cursor-pointer hover:opacity-80 transition-opacity'
        />
      </div>

      {/* Main content */}
      <div className='flex-1 flex items-center justify-center px-4 sm:px-6 lg:px-8'>
        <div className='max-w-6xl w-full grid lg:grid-cols-2 gap-12 items-center'>
          {/* Form */}
          <div className='card p-8 sm:p-12 max-w-md mx-auto w-full'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center'>
              Welcome Back
            </h2>

            <form onSubmit={handleSignIn} className='space-y-6'>
              <div>
                <input
                  type='email'
                  placeholder='Email'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                  className='input'
                  aria-label='Email address'
                />
              </div>

              <div className='relative'>
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder='Password'
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                  className='input pr-12'
                  aria-label='Password'
                />
                <button
                  type='button'
                  onClick={() => setShowPassword(!showPassword)}
                  className='absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300'
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? (
                    <FiEyeOff className='w-5 h-5' />
                  ) : (
                    <FiEye className='w-5 h-5' />
                  )}
                </button>
              </div>

              <button type='submit' className='btn btn-primary w-full'>
                Continue
              </button>

              <p className='text-center text-gray-600 dark:text-gray-400'>
                Don't have an account?{' '}
                <Link
                  to='/signup'
                  className='text-primary-600 dark:text-primary-400 hover:underline'
                >
                  Sign up
                </Link>
              </p>

              <div className='relative'>
                <div className='absolute inset-0 flex items-center'>
                  <div className='w-full border-t border-gray-300 dark:border-gray-600' />
                </div>
                <div className='relative flex justify-center text-sm'>
                  <span className='px-2 bg-white dark:bg-gray-800 text-gray-500'>
                    OR
                  </span>
                </div>
              </div>

              <button
                type='button'
                onClick={handleGoogleSignIn}
                className='w-full flex items-center justify-center space-x-3 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                aria-label='Sign in with Google'
              >
                <img src={googleLogo} alt='Google Logo' className='w-5 h-5' />
                <span>Continue with Google</span>
              </button>
            </form>
          </div>

          {/* Image */}
          <div className='hidden lg:flex justify-center'>
            <img
              src={signinImage}
              alt='Sign in illustration'
              className='max-w-md w-full h-auto object-contain'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;
