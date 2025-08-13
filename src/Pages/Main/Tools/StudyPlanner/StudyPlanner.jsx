import React, { useState } from "react";
import { saveToFirestore } from "../../../../utils/saveToFirestore";
import { downloadPlan } from "../../../../utils/downloadPlan";
import { handleFileUpload } from "../../../../utils/handleFileUpload";
import { model } from "../../../../Firebase/firebase"; // ✅ Import AI model
import ReactMarkdown from "react-markdown";
import "./StudyPlanner.css";

const StudyPlanner = () => {
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState(null);
  const [useText, setUseText] = useState(true);
  const [examDate, setExamDate] = useState("");
  const [dailyHours, setDailyHours] = useState(2);
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    if ((!useText && !file) || !examDate || !dailyHours) {
      return alert("Please fill all required fields.");
    }

    setLoading(true);
    setPlan("");

    try {
      const content = useText ? textInput : await handleFileUpload(file);
      const prompt = `Create a detailed daily study plan based on the content below. Today is ${new Date().toDateString()} and the exam date is ${examDate}. The user has ${dailyHours} hours available per day for study. Divide the content efficiently across the days. Format output as:\n\n[Day X] <Topics to study>\n\n${content}`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();

      setPlan(text);

      await saveToFirestore("studyPlans", {
        content,
        examDate,
        dailyHours,
        plan: text,
      });
    } catch (error) {
      console.error("Error generating study plan:", error);
      alert("An error occurred while generating the study plan.");
    }

    setLoading(false);
  };

  return (
    <div className="study-planner">
      {/* <h1><span role="img" aria-label="study planner">📚</span>Study Planner</h1> */}

      {plan && (
        <div className="study-plan-output">
          <h2>Your Study Plan</h2>
          <div className="markdown-output">
            <ReactMarkdown>{plan}</ReactMarkdown>
          </div>
          <button onClick={() => downloadPlan(plan)}>Download as PDF</button>
        </div>
      )}

      {useText ? (
        <textarea
          className="text-area"
          value={textInput}
          onChange={(e) => setTextInput(e.target.value)}
          placeholder="Paste or type content here..."
        />
      ) : (
        <input
          type="file"
          className="file-input"
          onChange={(e) => setFile(e.target.files[0])}
          accept=".pdf,.docx,.txt,.csv,.xlsx"
        />
      )}

      <div className="controls">
        <label className="toggle">
          <input
            type="checkbox"
            checked={useText}
            onChange={() => setUseText(!useText)}
          />
          Use Text Input
        </label>

        <label>
          Exam Date:
          <input
            type="date"
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
          />
        </label>

        <label>
          Study Hours Per Day:
          <input
            type="number"
            value={dailyHours}
            min="1"
            onChange={(e) => setDailyHours(Number(e.target.value))}
          />
        </label>
      </div>

      <button
        onClick={handleGenerate}
        disabled={loading}
        className="generate-btn"
      >
        {loading ? "Generating..." : "Generate Study Plan"}
      </button>
    </div>
  );
};

export default StudyPlanner;
