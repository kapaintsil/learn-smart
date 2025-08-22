import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

function Sidebar({ aiToolsData }) {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveClass = toolId =>
    location.pathname.includes(`/aitools/${toolId}`)
      ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 border-r-2 border-primary-600'
      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800';

  return (
    <div
      className={`relative flex h-full ${
        isOpen ? 'w-64' : 'w-16'
      } transition-all duration-300 ease-in-out`}
    >
      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col ${
          isOpen ? 'w-64' : 'w-16'
        }`}
      >
        <div className='p-4 border-b border-gray-200 dark:border-gray-700'>
          <h2
            className={`font-semibold text-gray-900 dark:text-white ${
              isOpen ? 'block' : 'hidden'
            }`}
          >
            AI Tools
          </h2>
        </div>

        <nav className='flex-1 p-2'>
          <ul className='space-y-1'>
            {aiToolsData.map(tool => (
              <li key={tool.id}>
                <button
                  onClick={() => navigate(`/aitools/${tool.id}`)}
                  className={`w-full flex items-center px-3 py-3 rounded-lg transition-colors duration-200 ${getActiveClass(
                    tool.id
                  )}`}
                  title={!isOpen ? tool.name : undefined}
                >
                  <img
                    src={tool.icon}
                    alt={`${tool.name} icon`}
                    className='w-6 h-6 object-contain flex-shrink-0'
                    draggable='false'
                  />
                  {isOpen && (
                    <span className='ml-3 text-sm font-medium truncate'>
                      {tool.name}
                    </span>
                  )}
                </button>
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Toggle Button */}
      <button
        className='absolute -right-3 top-4 w-6 h-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors z-10'
        onClick={() => setIsOpen(v => !v)}
        title={isOpen ? 'Hide sidebar' : 'Show sidebar'}
      >
        {isOpen ? (
          <FiChevronLeft className='w-4 h-4' />
        ) : (
          <FiChevronRight className='w-4 h-4' />
        )}
      </button>
    </div>
  );
}

export default Sidebar;
