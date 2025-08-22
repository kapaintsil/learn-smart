import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  updateProfile,
} from 'firebase/auth';
import { setDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../Firebase/firebase';
import { toast } from 'react-toastify';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import signupImage from '../../assets/images/Learner.png';
import googleLogo from '/icons/google-logo.png';
import websiteLogo from '/icons/website-logo.png';

const SignUp = () => {
  const navigate = useNavigate();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Handle form submission for email/password signup
  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const fullName = `${firstName} ${lastName}`.trim();
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Update Firebase auth profile
      await updateProfile(user, { displayName: fullName });

      // Store user data in Firestore
      await setDoc(doc(db, 'users', user.uid), {
        firstName,
        lastName,
        email,
        fullName,
        createdAt: new Date().toISOString(),
      });

      toast.success('Account created successfully!');
      navigate('/aitools');
    } catch (error) {
      const errorMessage =
        error.code === 'auth/email-already-in-use'
          ? 'Email is already in use.'
          : error.code === 'auth/weak-password'
          ? 'Password should be at least 6 characters.'
          : error.message;
      toast.error(errorMessage);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const userCredential = await signInWithPopup(auth, provider);
      const user = userCredential.user;

      // Store Google user data in Firestore
      await setDoc(
        doc(db, 'users', user.uid),
        {
          firstName: user.displayName?.split(' ')[0] || '',
          lastName: user.displayName?.split(' ').slice(1).join(' ') || '',
          email: user.email,
          fullName: user.displayName || '',
          createdAt: new Date().toISOString(),
        },
        { merge: true }
      );

      toast.success('Signed up with Google!');
      navigate('/aitools');
    } catch (error) {
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
        <div className='max-w-4xl w-full grid lg:grid-cols-2 gap-0 items-stretch rounded-xl shadow-lg overflow-hidden bg-white dark:bg-gray-800'>
          {/* Form */}
          <div className='p-8 sm:p-12 w-full flex flex-col justify-center'>
            <h2 className='text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center'>
              Create Account
            </h2>

            <form onSubmit={handleSubmit} className='space-y-5'>
              <div className='grid grid-cols-2 gap-3'>
                <div>
                  <input
                    type='text'
                    placeholder='First Name'
                    value={firstName}
                    onChange={e => setFirstName(e.target.value)}
                    required
                    className='input'
                    aria-label='First Name'
                  />
                </div>
                <div>
                  <input
                    type='text'
                    placeholder='Last Name'
                    value={lastName}
                    onChange={e => setLastName(e.target.value)}
                    required
                    className='input'
                    aria-label='Last Name'
                  />
                </div>
              </div>

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
                Create Account
              </button>

              <p className='text-center text-gray-600 dark:text-gray-400 text-sm'>
                Already have an account?{' '}
                <Link
                  to='/signin'
                  className='text-primary-600 dark:text-primary-400 hover:underline'
                >
                  Sign in
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
                className='w-full flex items-center justify-center space-x-3 px-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors'
                aria-label='Sign up with Google'
              >
                <img src={googleLogo} alt='Google Logo' className='w-5 h-5' />
                <span>Continue with Google</span>
              </button>
            </form>
          </div>

          {/* Image */}
          <div className='hidden lg:flex justify-center items-center bg-gray-50 dark:bg-gray-900'>
            <img
              src={signupImage}
              alt='Sign up illustration'
              className='w-full h-full object-cover'
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
