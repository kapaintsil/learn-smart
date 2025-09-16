const aiTools =[
  
  {
    "id": "study-planner",
    "name": "StudyTrack",
    "icon": "/aiTools/Brain.png",
    "description": "Creates personalized study schedules based on exam dates or learning goals.",
    "features": [
      "Custom study timetables",
      "Inputs: deadlines, topics, preferred time",
      "Adjusts based on priorities"
    ],
    "type": "planning",
    "status": "available"
  },
  {
    "id": "flashcard-Generator",
    "name": "SmartDeck",
    "icon": "/aiTools/Flashcard-gen.png",
    "description": "Automatically creates flashcards from documents or pasted text.",
    "features": [
      "Question-answer format",
      "Extracts definitions, dates, facts",
      "Supports spaced repetition format"
    ],
    "type": "study-aid",
    "status": "available"
  },
  {
    "id": "quiz-generator",
    "name": "SmartQuiz",
    "icon": "/aiTools/smartQ.png",
    "description": "Generates multiple-choice or true/false quizzes from text or file input.",
    "features": [
      "MCQ/True-False format",
      "Answer keys and explanations",
      "Supports .pdf, .docx, .csv, .txt, .xlsx files"
    ],
    "type": "assessment",
    "status": "available"
  },
  {
    "id": "concept-explainer",
    "name": "ChatMate",
    "icon": "/aiTools/chatmate.png",
    "description": "Explains difficult academic concepts using analogies, steps, and examples.",
    "features": [
      "Simplifies tough concepts using analogies",
      "Breaks down complex ideas step-by-step",
      "Provides examples or diagrams (if needed)",
      "Supports personalized tone: peer tutor or expert"
    ],
    "type": "ai-tutor",
    "status": "available"
  },
  {
    "id": "history",
    "name": "History",
    "icon": "/aiTools/History.png",
    "description": "Smart note organizer that auto-tags topics and summarizes key points.",
    "features": [
      "Extracts key ideas from notes",
      "Tags subjects/topics automatically",
      "Generates summarized versions of long notes"
    ],
    "type": "text-analysis",
    "status": "available"
  },
]

export default aiTools;