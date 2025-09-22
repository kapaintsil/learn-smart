
[![Ask DeepWiki](https://deepwiki.com/badge.svg)](https://deepwiki.com/kapaintsil/learn-smart) for Deep wiki auto indexing

<h1>📘 LearnSmart AI Assistant</h1>

<p>
  LearnSmart AI Assistant is a web-based platform designed to help students 
  <strong>study smarter</strong> using integrated AI-powered tools. 
  Built with <strong>React</strong> and <strong>Firebase</strong>, 
  and powered by <strong>Google Gemini 2.5</strong>, 
  the platform brings together multiple study tools in one place.
</p>

<hr>

<h2>🌍 Live Demo / Hosting</h2>

<p>
  You can access the hosted version of LearnSmart AI Assistant here:  
  <a href="https://your-firebase-hosting-link.web.app" target="_blank">
    https://your-firebase-hosting-link.web.app
  </a>
</p>

<hr>

<h2>🚀 Features</h2>

<h3>🔹 AI Tools</h3>
<ul>
  <li><strong>Quiz Generator</strong> – Upload text or documents and generate multiple-choice or true/false quizzes with answers and explanations.</li>
  <li><strong>Flashcard Generator</strong> – Convert study notes into digital flashcards for active recall practice.</li>
  <li><strong>Study Planner (Coming Soon)</strong> – Generate personalized study schedules based on exam dates and available hours.</li>
</ul>

<h3>🔹 Core Capabilities</h3>
<ul>
  <li>File/Text Input Support: Accepts <code>.txt</code>, <code>.pdf</code>, <code>.docx</code>, <code>.csv</code>, <code>.xlsx</code>, and direct text input.</li>
  <li>Firebase Integration: Authentication, Firestore database, hosting, and storage.</li>
  <li>User Dashboard: Personalized greeting, recently used tools, quick stats, and daily study tips.</li>
  <li>Progress Tracking: Save and revisit generated quizzes, flashcards, and study plans.</li>
  <li>Clean, responsive interface with <strong>plain CSS styling</strong>.</li>
</ul>

<hr>

<h2>🛠️ Tech Stack</h2>
<ul>
  <li><strong>Frontend:</strong> React (with React Router)</li>
  <li><strong>Backend & Hosting:</strong> Firebase (Authentication, Firestore, Storage, Hosting)</li>
  <li><strong>Frontend Hosting:</strong> Vercel</li>
  <li><strong>AI Model:</strong> Google Gemini 2.5 (via Generative AI API)</li>
  <li><strong>AI Model:</strong> Google Gemini 2.5 (via Generative AI API)</li>
  <li><strong>PDF & DOCX Export:</strong> jsPDF, file-saver</li>
  <li><strong>Version Control:</strong> Git</li>
</ul>

<hr>

<h2>📂 Project Structure</h2>

<pre>
src/
 ├── Components/       # Shared UI components (NavBar, Footer, Sidebar, etc.)
 ├── Pages/
 │    └── Main/Tools/  # Individual AI tools (QuizGenerator, FlashcardGenerator, etc.)
 ├── contexts/         # Theme and global state
 ├── data/             # Tool metadata & static content
 ├── utils/            # File handling, Firestore save functions
 └── routes/           # Routing configuration
</pre>

<hr>

<h2>⚡ Installation</h2>

<ol>
  <li>Clone the repo:
    <pre><code>git clone git@github.com:kapaintsil/learn-smart.git
cd learnsmart-ai-assistant</code></pre>
  </li>
  <li>Install dependencies:
    <pre><code>npm install</code></pre>
  </li>
  <li>Set up <strong>Firebase config</strong> in <code>.env.local</code>:
    <pre><code>REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
REACT_APP_GEMINI_API_KEY=your_gemini_api_key</code></pre>
  </li>
</ol>

<hr>

<h2>▶️ How to Run Locally</h2>

<ol>
  <li>Start the development server:
    <pre><code>npm run dev:host</code></pre>
  </li>
  <li>Open your browser and visit:
    <pre><code>http://localhost:5173</code></pre>
  </li>
  <li>Log in or sign up with Firebase authentication to access all tools.</li>
  <li>From the dashboard, select a tool (e.g., Quiz Generator, Flashcard Generator) and begin using it.</li>
</ol>

<hr>

<h2>🎯 Usage</h2>

<ul>
  <li><strong>Sign up / Log in</strong> with Firebase Authentication.</li>
  <li>Navigate to the <strong>AI Tools Dashboard</strong>.</li>
  <li>Select a tool (e.g., Quiz Generator).</li>
  <li>Upload a file or enter text → configure settings → click <strong>Generate</strong>.</li>
  <li>Save output to Firestore and export as PDF or DOCX.</li>
</ul>

<hr>

<h2>📌 Tools</h2>
<ul>
  <li>✅ Quiz Generator</li>
  <li>✅ Flashcard Generator</li>
  <li>🔄 Study Planner</li>
  <li>🔄 AI Tutor Chat</li>
  <li>🔄 History</li>
  <li>🔄 Dashboard analytics and insights</li>
</ul>

<hr>


<hr>

<h2>📄 License</h2>
<p>
  This project is licensed under the <strong>MIT License</strong>.
</p>

