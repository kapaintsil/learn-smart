import React, { useState } from "react";
import { handleFileUpload } from "../../../../utils/handleFileUpload";
import { downloadPlan } from "../../../../utils/downloadPlan";
import { saveToFirestore } from "../../../../utils/saveToFirestore";
import { model } from "../../../../Firebase/firebase";
import "./QuizGenerator.css";
import ReactMarkdown from "react-markdown";


function QuizGenerator() {
  const [file, setFile] = useState(null);
  const [textInput, setTextInput] = useState("");
  const [useText, setUseText] = useState(false);
  const [questionCount, setQuestionCount] = useState(5);
  const [difficulty, setDifficulty] = useState("medium");
  const [format, setFormat] = useState("mcq");
  const [quiz, setQuiz] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerateQuiz = async () => {
    if (!useText && !file) {
      alert("Please upload a file.");
      return;
    }

    if (useText && !textInput.trim()) {
      alert("Please enter text.");
      return;
    }

    setLoading(true);
    setQuiz("");

    try {
      const content = useText ? textInput : await handleFileUpload(file);

      const prompt = `Generate a ${questionCount}-question ${
        format === "tf" ? "true/false" : "multiple-choice"
      } quiz with answers and explanations. Difficulty: ${difficulty}.\n\n${content}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      setQuiz(text);

      await saveToFirestore("quizzes", {
        content,
        quiz: text,
        questionCount,
        difficulty,
        format,
      });
    } catch (error) {
      console.error("Quiz generation error:", error);
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
       {quiz && (
        <div className="quiz-output">
          <pre><ReactMarkdown>{quiz}</ReactMarkdown></pre>
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
        />
      ) : (
        <input
          type="file"
          className="file-input"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".pdf,.docx,.pptx,.txt,.csv,.xlsx"
        />
      )}

      <div className="controls">
        <label>
          Use Text Input
          <input
            type="checkbox"
            checked={useText}
            onChange={() => setUseText(!useText)}
          />
        </label>

        <label>
          Number of Questions:
          <input
            type="number"
            value={questionCount}
            onChange={(e) => setQuestionCount(Number(e.target.value))}
            min={1}
          />
        </label>

        <label>
          Difficulty:
          <select
            value={difficulty}
            onChange={(e) => setDifficulty(e.target.value)}
          >
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>
        </label>

        <label>
          Format:
          <select value={format} onChange={(e) => setFormat(e.target.value)}>
            <option value="mcq">Multiple Choice</option>
            <option value="tf">True / False</option>
          </select>
        </label>
         <button
        className="generate-btn"
        onClick={handleGenerateQuiz}
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate"}
      </button>
      </div>
    </div>
  );
}

export default QuizGenerator;
