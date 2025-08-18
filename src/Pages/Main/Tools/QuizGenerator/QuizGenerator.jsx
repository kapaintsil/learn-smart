import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { handleFileUpload } from "../../../../utils/handleFileUpload";
import { downloadPlan } from "../../../../utils/downloadPlan";
import { saveToFirestore } from "../../../../utils/saveToFirestore";
import { addQuiz } from "../../../../utils/localStorage";
import { auth, model } from "../../../../Firebase/firebase";
import { toast } from "react-toastify";
import "./QuizGenerator.css";
import ReactMarkdown from "react-markdown";

function QuizGenerator() {
  const { state } = useLocation();
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [useText, setUseText] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [format, setFormat] = useState("mcq");
  const [quiz, setQuiz] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Monitor auth state
  useEffect(() => {
    console.log("QuizGenerator: Initializing auth state listener");
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("QuizGenerator: Auth state changed, user:", user ? user.uid : null);
      setIsAuthenticated(!!user);
    });
    return () => {
      console.log("QuizGenerator: Unsubscribing auth listener");
      unsubscribe();
    };
  }, []);

  // Load saved quiz from History
  useEffect(() => {
    if (state?.savedData) {
      console.log("QuizGenerator: Loading savedData:", state.savedData);
      const { title, content, quiz, questionCount, difficulty, format } = state.savedData;
      setQuiz(quiz || "");
      setTextInput(content || "");
      setQuestionCount(questionCount || 5);
      setDifficulty(difficulty || "medium");
      setFormat(format || "mcq");
      setUseText(!!content);
    } else {
      console.log("QuizGenerator: No savedData provided");
    }
  }, [state]);

  const handleGenerateQuiz = async () => {
    if (!useText && !file) {
      toast.error("Please upload a file.");
      console.error("QuizGenerator: Validation failed: No file uploaded");
      return;
    }
    if (useText && !textInput.trim()) {
      toast.error("Please enter text.");
      console.error("QuizGenerator: Validation failed: Empty text input");
      return;
    }

    setLoading(true);
    setQuiz("");

    try {
      const content = useText ? textInput : await handleFileUpload(file);
      console.log("QuizGenerator: Content processed:", content.substring(0, 100) + "...");

      const prompt = `Generate a ${questionCount}-question ${
        format === "tf" ? "true/false" : "multiple-choice"
      } quiz with answers and explanations. Difficulty: ${difficulty}.\n\n${content}`;

      console.log("QuizGenerator: Sending prompt to AI");
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      console.log("QuizGenerator: AI output:", text.substring(0, 200) + "...");

      setQuiz(text);

      if (!isAuthenticated || !auth.currentUser) {
        console.warn("QuizGenerator: No authenticated user, skipping Firestore save");
        toast.info("Quiz generated but not saved (please sign in).");
        // Save to local storage only
        addQuiz({
          title: `Quiz (${difficulty}) - ${new Date().toLocaleDateString()}`,
          type: "quiz",
          content,
          quiz: text,
          questionCount,
          difficulty,
          format,
        });
        setLoading(false);
        return;
      }

      const itemData = {
        type: "quiz",
        title: `Quiz (${difficulty}) - ${new Date().toLocaleDateString()}`,
        content,
        quiz: text,
        questionCount,
        difficulty,
        format,
      };
      console.log("QuizGenerator: Saving to Firestore:", JSON.stringify(itemData, null, 2));
      const itemId = await saveToFirestore("generatedItems", itemData);
      if (!itemId) {
        console.error("QuizGenerator: Save failed, no itemId returned");
        toast.error("Failed to save quiz.");
      } else {
        console.log("QuizGenerator: Saved to Firestore with itemId:", itemId);
        toast.success("Quiz saved successfully!");
      }

      // Save to local storage
      addQuiz(itemData);
    } catch (error) {
      console.error("QuizGenerator: Error generating or saving quiz:", error);
      toast.error("Error generating quiz: " + error.message);
      setQuiz("Error generating quiz: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (quiz) {
      downloadPlan(quiz, "quiz.pdf", "Generated Quiz");
    }
  };

  return (
    <div className="quiz-container">
      <header className="study-planner-header">
        <h2>Quiz Generator</h2>
      </header>
      {quiz && (
        <div className="quiz-output">
          <pre>
            <ReactMarkdown>{quiz}</ReactMarkdown>
          </pre>
          <button className="download-btn" onClick={handleDownload}>
            Download PDF
          </button>
        </div>
      )}

      {useText ? (
        <textarea
          className="text-area"
          placeholder="Paste or type your content here..."
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          data-testid="text-input"
        />
      ) : (
        <input
          type="file"
          className="file-input"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".pdf,.docx,.pptx,.txt,.csv,.xlsx"
          data-testid="file-input"
        />
      )}

      <div className="controls">
        <label className="toggle">
          Use Text Input
          <input type="checkbox" checked={useText} onChange={() => setUseText(!useText)} data-testid="use-text-toggle" />
        </label>
        <label>
          Number of Questions:
          <input
            type="number"
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            min={1}
            data-testid="question-count-input"
          />
        </label>

        <label>
          Difficulty:
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
            data-testid="difficulty-select"
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <label>
          Format:
          <select value={format} onChange={(e) => setFormat(e.target.value)} data-testid="format-select">
            <option value="mcq">Multiple Choice</option>
            <option value="tf">True / False</option>
          </select>
        </label>

        <button
          className="generate-btn"
          onClick={handleGenerateQuiz}
          disabled={loading}
          data-testid="generate-button"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
}

export default QuizGenerator;