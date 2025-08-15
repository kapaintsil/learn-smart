
export const saveItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving to localStorage (${key}):`, error);
  }
};

export const getItem = (key, defaultValue = null) => {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (${key}):`, error);
    return defaultValue;
  }
};

export const addQuiz = (quizData) => {
  const quizzes = getItem("savedQuizzes", []);
  quizzes.push({ ...quizData, createdAt: new Date().toISOString() });
  saveItem("savedQuizzes", quizzes);
};


export const clearQuizzes = () => {
  localStorage.removeItem("savedQuizzes");
};
