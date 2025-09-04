import React from 'react';
import heroCardFeatures from '../data/heroCardFeatures';

function HeroCards() {
  return (
    <section className='py-20 px-4 sm:px-6 lg:px-8 bg-white dark:bg-gray-900'>
      <div className='max-w-7xl mx-auto'>
        {/* Section Title */}
        <h2 className='text-3xl sm:text-4xl lg:text-5xl font-bold text-center text-gray-900 dark:text-white mb-16 leading-tight'>
          Tired of juggling multiple tools?{' '}
          <span className='text-primary-600 dark:text-primary-400'>
            LearnSmart is the place for you!
          </span>
        </h2>

        {/* Cards Grid */}
        <div className='grid md:grid-cols-2 lg:grid-cols-3 gap-8'>
          {heroCardFeatures.map((feature, index) => (
            <div
              key={index}
              className='card p-8 text-center hover:shadow-lg transition-shadow duration-300 group relative flex flex-col'
            >
              {/* Logo */}
              <div className='w-16 h-16 mx-auto bg-primary-100 dark:bg-primary-900 rounded-full flex items-center justify-center 
                              absolute -top-8 left-1/2 transform -translate-x-1/2 z-10 shadow-md
                              group-hover:scale-110 transition-transform duration-300'>
                <img
                  src={feature.logo}
                  alt={`${feature.title} Icon`}
                  className='w-8 h-8 object-contain'
                />
              </div>

              {/* Card Content */}
              <h3 className='text-xl font-semibold text-gray-900 dark:text-white mb-4 mt-10'>
                {feature.title}
              </h3>
              <p className='text-gray-600 dark:text-gray-300 leading-relaxed'>
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HeroCards;
