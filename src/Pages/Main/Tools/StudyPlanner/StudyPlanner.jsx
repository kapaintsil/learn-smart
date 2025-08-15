import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { saveToFirestore } from "../../../../utils/saveToFirestore";
import { downloadPlan } from "../../../../utils/downloadPlan";
import { handleFileUpload } from "../../../../utils/handleFileUpload";
import { model } from "../../../../Firebase/firebase";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import "./StudyPlanner.css";

const StudyPlanner = () => {
  const { state } = useLocation();
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState(null);
  const [useText, setUseText] = useState(true);
  const [examDate, setExamDate] = useState("");
  const [dailyHours, setDailyHours] = useState(2);
  const [title, setTitle] = useState("");
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  // Load saved data from History.jsx
  useEffect(() => {
    if (state?.savedData) {
      const { title, originalContent, generatedPlan, examDate, dailyHours } = state.savedData;
      setTitle(title || "");
      setTextInput(originalContent || "");
      setPlan(generatedPlan || "");
      setExamDate(examDate || "");
      setDailyHours(dailyHours || 2);
      setUseText(!state.savedData.file); // Assume text input if no file
    }
  }, [state]);

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error("Please enter a plan title.");
      return;
    }
    if ((!useText && !file) || !examDate || !dailyHours) {
      toast.error("Please fill all required fields.");
      return;
    }

    setLoading(true);
    setPlan("");

    try {
      const studyContent = useText ? textInput : await handleFileUpload(file);

      const prompt = `Create a detailed daily study plan based on the content below. 
      Today is ${new Date().toDateString()} and the exam date is ${examDate}. 
      The user has ${dailyHours} hours available per day for study. 
      Divide the content efficiently across the days. 
      Format output as:

      [Day X] <Topics to study>

      ${studyContent}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const generatedText = await response.text();

      setPlan(generatedText);

      await saveToFirestore("generatedItems", {
        type: "study-plan",
        title: title.trim(),
        originalContent: studyContent,
        generatedPlan: generatedText,
        examDate,
        dailyHours,
      });

      toast.success("Study plan generated and saved successfully!");
    } catch (error) {
      console.error("Error generating study plan:", error);
      toast.error("Error generating study plan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (plan) {
      downloadPlan(plan, `${title || "study-plan"}.pdf`, title || "Generated Study Plan");
      toast.success("Study plan downloaded as PDF!");
    } else {
      toast.error("No study plan to download.");
    }
  };

  return (
    <div className="study-planner">
      <div className="study-planner-header">
        <h2>Generate Study Plan</h2>
      </div>
      {plan && (
        <div className="study-plan-output">
          <h2>Your Study Plan</h2>
          <div className="markdown-output">
            <ReactMarkdown>{plan}</ReactMarkdown>
          </div>
          <button
            onClick={handleDownload}
            className="download-btn"
            aria-label="Download Study Plan as PDF"
            data-testid="download-button"
          >
            Download as PDF
          </button>
        </div>
      )}
      <div className="study-planner-form">
        <div className="input-group">
          <label htmlFor="title" className="sr-only">Plan Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter study plan title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            aria-label="Plan Title"
            data-testid="title-input"
          />
        </div>
        {useText ? (
          <div className="input-group">
            <label htmlFor="textInput" className="sr-only">Text Input</label>
            <textarea
              id="textInput"
              className="text-area"
              value={textInput}
              onChange={(e) => setTextInput(e.target.value)}
              placeholder="Paste or type content here..."
              aria-label="Text Input"
              data-testid="text-input"
            />
          </div>
        ) : (
          <div className="input-group">
            <label htmlFor="fileInput" className="sr-only">File Upload</label>
            <input
              id="fileInput"
              type="file"
              className="file-input"
              onChange={(e) => setFile(e.target.files[0])}
              accept=".pdf,.docx,.txt,.csv,.xlsx"
              aria-label="File Upload"
              data-testid="file-input"
            />
          </div>
        )}
        <div className="controls">
          <label className="toggle">
            Use Text Input
            <input
              type="checkbox"
              checked={useText}
              onChange={() => setUseText(!useText)}
              aria-label="Use Text Input"
              data-testid="use-text-checkbox"
            />
          </label>
          <div className="input-group">
            <label htmlFor="examDate" className="sr-only">Exam Date</label>
            <input
              id="examDate"
              type="date"
              value={examDate}
              onChange={(e) => setExamDate(e.target.value)}
              required
              aria-label="Exam Date"
              data-testid="exam-date-input"
            />
          </div>
          <div className="input-group">
            <label htmlFor="dailyHours" className="sr-only">Study Hours Per Day</label>
            <input
              id="dailyHours"
              type="number"
              value={dailyHours}
              min="1"
              onChange={(e) => setDailyHours(Number(e.target.value))}
              required
              aria-label="Study Hours Per Day"
              data-testid="daily-hours-input"
            />
          </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="generate-btn"
          aria-label="Generate Study Plan"
          data-testid="generate-button"
        >
          {loading ? "Generating..." : "Generate Study Plan"}
        </button>
      </div>
    </div>
  );
};

export default StudyPlanner;