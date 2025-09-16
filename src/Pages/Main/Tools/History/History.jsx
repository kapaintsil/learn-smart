import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../../../Firebase/firebase';
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { toast } from 'react-toastify';
import {
  FiTrash2,
  FiFileText,
  FiCalendar,
  FiClock,
  FiEdit3,
  FiFolder,
  FiSearch,
  FiFilter,
} from 'react-icons/fi';

const History = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, `users/${auth.currentUser.uid}/generatedItems`),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(
      q,
      snapshot => {
        const fetchedItems = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(fetchedItems);
        setLoading(false);
      },
      error => {
        toast.error('Failed to load history: ' + error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async itemId => {
    try {
      await deleteDoc(
        doc(db, `users/${auth.currentUser.uid}/generatedItems`, itemId)
      );
      toast.success('Item deleted successfully!');
    } catch (error) {
      toast.error('Failed to delete item: ' + error.message);
    }
  };

  // Navigate to the correct tool based on item.type
  const openItem = item => {
    let toolPath = '';
    switch (item.type) {
      case 'quiz':
        toolPath = '/aitools/quiz-generator';
        break;
      case 'flashcard':
        toolPath = '/aitools/flashcard-generator';
        break;
      case 'study-plan':
        toolPath = '/aitools/study-planner';
        break;
      case 'concept-explainer':
        toolPath = '/aitools/concept-explainer';
        break;
      default:
        toast.error('Unknown tool type');
        return;
    }
    navigate(toolPath, { state: { savedData: item } });
  };

  const getTypeIcon = type => {
    switch (type) {
      case 'quiz':
        return '📝';
      case 'flashcard':
        return '🃏';
      case 'study-plan':
        return '📅';
      case 'concept-explainer':
        return '💡';
      default:
        return '📄';
    }
  };

  const getTypeColor = type => {
    switch (type) {
      case 'quiz':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'flashcard':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'study-plan':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'concept-explainer':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeLabel = type => {
    switch (type) {
      case 'quiz':
        return 'Quiz';
      case 'flashcard':
        return 'Flashcards';
      case 'study-plan':
        return 'Study Plan';
      case 'concept-explainer':
        return 'Concept Explainer';
      default:
        return 'Unknown';
    }
  };

  const formatDate = date => {
    if (!date) return 'No date';
    const dateObj = date.toDate ? date.toDate() : new Date(date);
    const now = new Date();
    const diffTime = Math.abs(now - dateObj);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      return 'Today';
    } else if (diffDays === 2) {
      return 'Yesterday';
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return dateObj.toLocaleDateString();
    }
  };

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title
      ?.toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || item.type === filterType;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className='min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center'>
        <div className='text-center'>
          <div className='animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4'></div>
          <p className='text-gray-600 dark:text-gray-400'>
            Loading your history...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className='min-h-screen bg-gray-50 dark:bg-gray-900 p-6'>
      <div className='max-w-6xl mx-auto'>
        {/* Header */}
        <div className='mb-8'>
          <h1 className='text-3xl font-bold text-gray-900 dark:text-white mb-2'>
            Your History
          </h1>
          <p className='text-gray-600 dark:text-gray-400'>
            View and manage your generated study materials
          </p>
        </div>

        {/* Search and Filter */}
        <div className='card p-6 mb-6'>
          <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
            <div className='relative'>
              <FiSearch className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
              <input
                type='text'
                placeholder='Search by title...'
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className='input pl-10'
              />
            </div>
            <div className='relative'>
              <FiFilter className='absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400' />
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                className='input pl-10'
              >
                <option value='all'>All Types</option>
                <option value='quiz'>Quizzes</option>
                <option value='flashcard'>Flashcards</option>
                <option value='study-plan'>Study Plans</option>
                <option value='concept-explainer'>Concept Explainers</option>
              </select>
            </div>
          </div>
        </div>

        {/* Content */}
        {items.length === 0 ? (
          <div className='card p-12 text-center'>
            <FiFolder className='mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4' />
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
              No items yet
            </h3>
            <p className='text-gray-600 dark:text-gray-400 mb-6'>
              Start creating study materials to see them here
            </p>
            <button
              onClick={() => navigate('/aitools')}
              className='btn btn-primary'
            >
              Create Your First Item
            </button>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className='card p-12 text-center'>
            <FiSearch className='mx-auto h-16 w-16 text-gray-400 dark:text-gray-500 mb-4' />
            <h3 className='text-lg font-medium text-gray-900 dark:text-white mb-2'>
              No results found
            </h3>
            <p className='text-gray-600 dark:text-gray-400'>
              Try adjusting your search or filter criteria
            </p>
          </div>
        ) : (
          <div className='space-y-4'>
            <div className='flex items-center justify-between'>
              <p className='text-sm text-gray-600 dark:text-gray-400'>
                {filteredItems.length} of {items.length} items
              </p>
            </div>

            <div className='grid gap-4'>
              {filteredItems.map(item => (
                <div
                  key={item.id}
                  className='card p-6 hover:shadow-lg transition-shadow duration-200 cursor-pointer group'
                  onClick={() => openItem(item)}
                >
                  <div className='flex items-start justify-between'>
                    <div className='flex-1 min-w-0'>
                      <div className='flex items-center space-x-3 mb-3'>
                        <span className='text-2xl'>
                          {getTypeIcon(item.type)}
                        </span>
                        <div className='flex-1 min-w-0'>
                          <h3 className='text-lg font-semibold text-gray-900 dark:text-white truncate group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors'>
                            {item.title || 'Untitled'}
                          </h3>
                        </div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(
                            item.type
                          )}`}
                        >
                          {getTypeLabel(item.type)}
                        </span>
                      </div>

                      <div className='flex items-center space-x-6 text-sm text-gray-600 dark:text-gray-400'>
                        <div className='flex items-center space-x-1'>
                          <FiCalendar className='w-4 h-4' />
                          <span>{formatDate(item.createdAt)}</span>
                        </div>
                        {item.examDate && (
                          <div className='flex items-center space-x-1'>
                            <FiClock className='w-4 h-4' />
                            <span>
                              Exam:{' '}
                              {new Date(item.examDate).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                        {item.dailyHours && (
                          <div className='flex items-center space-x-1'>
                            <FiFileText className='w-4 h-4' />
                            <span>{item.dailyHours}h/day</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className='flex items-center space-x-2 ml-4'>
                      <button
                        className='p-2 text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 transition-colors opacity-0 group-hover:opacity-100'
                        onClick={e => {
                          e.stopPropagation();
                          openItem(item);
                        }}
                        title='Edit'
                      >
                        <FiEdit3 className='w-4 h-4' />
                      </button>
                      <button
                        className='p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100'
                        onClick={e => {
                          e.stopPropagation();
                          handleDelete(item.id);
                        }}
                        title='Delete'
                      >
                        <FiTrash2 className='w-4 h-4' />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
