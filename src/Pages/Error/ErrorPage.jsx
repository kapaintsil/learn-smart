import { useRouteError } from 'react-router-dom';
import NavBar from '../../Components/NavBar';
import { ChevronLeft } from 'lucide-react';

export default function ErrorPage() {
  const error = useRouteError();

  return (
    <div className='min-h-screen bg-background font-manrope flex flex-col'>
      <NavBar />

      <main className='flex-1 flex flex-col items-center justify-center p-6'>
        <div className='max-w-md w-full text-center'>
          {/* Error Icon/Header */}
          <div className='mx-auto w-20 h-20 rounded-full bg-error/10 flex items-center justify-center mb-6'>
            <svg
              xmlns='http://www.w3.org/2000/svg'
              width='40'
              height='40'
              viewBox='0 0 24 24'
              fill='none'
              stroke='#C4371B'
              strokeWidth='2'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <circle cx='12' cy='12' r='10' />
              <line x1='12' y1='8' x2='12' y2='12' />
              <line x1='12' y1='16' x2='12.01' y2='16' />
            </svg>
          </div>

          {/* Error Title */}
          <h1 className='text-4xl font-bold text-gray-900 mb-4'>Oops!</h1>

          {/* Error Message */}
          <p className='text-lg text-gray-600 mb-6'>
            Sorry, an unexpected error has occurred.
          </p>

          {/* Error Details */}
          <div className='bg-error/5 border-l-4 border-error p-4 mb-8 rounded'>
            <p className='text-error font-medium'>
              {error?.statusText || error?.message || 'Unknown error'}
              {error?.status && ` (${error.status})`}
            </p>
          </div>

          {/* Back Button */}
          <button
            onClick={() => window.history.back()}
            className='inline-flex items-center justify-center gap-2 bg-primary hover:bg-primary/90 text-white font-medium py-3 px-6 rounded-lg transition-colors'
          >
            <ChevronLeft className='w-5 h-5' />
            Go Back
          </button>
        </div>
      </main>
    </div>
  );
}
