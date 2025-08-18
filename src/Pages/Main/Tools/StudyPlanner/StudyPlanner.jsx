import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { saveToFirestore } from "../../../../utils/saveToFirestore";
import { handleFileUpload } from "../../../../utils/handleFileUpload";
import { downloadPlan } from "../../../../utils/downloadPlan";
import { model, auth } from "../../../../Firebase/firebase";
import { toast } from "react-toastify";
import ReactMarkdown from "react-markdown";
import "./StudyPlanner.css";

const StudyPlanner = () => {
  const { state } = useLocation();
  const [textInput, setTextInput] = useState("");
  const [file, setFile] = useState(null);
  const [useText, setUseText] = useState(true);
  const [title, setTitle] = useState("");
  const [examDate, setExamDate] = useState("");
  const [dailyHours, setDailyHours] = useState();
  const [plan, setPlan] = useState("");
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Monitor authentication state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => setIsAuthenticated(!!user));
    return () => unsubscribe();
  }, []);

  // Load saved data if navigated from History
  useEffect(() => {
    if (state?.savedData) {
      const { title, originalContent, generatedPlan, examDate, dailyHours, file } = state.savedData;
      setTitle(title || "");
      setTextInput(originalContent || "");
      setPlan(generatedPlan || "");
      setExamDate(examDate || "");
      setDailyHours(dailyHours || 2);
      setUseText(!file);
    }
  }, [state]);

  const handleGenerate = async () => {
    if (!title.trim()) return toast.error("Please enter a plan title.");
    if (!useText && !file) return toast.error("Please provide text input or upload a file.");
    if (!examDate || !dailyHours) return toast.error("Please fill in exam date and daily hours.");

    setLoading(true);
    setPlan("");

    try {
      const studyContent = useText ? textInput : await handleFileUpload(file);

      const prompt = `Create a detailed daily study plan based on the content below.
Today is ${new Date().toDateString()} and the exam date is ${examDate}.
The user has ${dailyHours} hours available per day. Divide content efficiently across days.
Format output as:

[Day X] <Topics to study>

${studyContent}`;

      const result = await model.generateContent(prompt);
      const generatedText = await (await result.response).text();
      setPlan(generatedText);

      if (!isAuthenticated || !auth.currentUser) {
        toast.info("Study plan generated but not saved (please sign in).");
        return;
      }

      const itemData = {
        type: "study-plan",
        title: title.trim(),
        originalContent: studyContent,
        generatedPlan: generatedText,
        examDate,
        dailyHours,
      };
      await saveToFirestore("generatedItems", itemData);
      toast.success("Study plan generated and saved successfully!");
    } catch (error) {
      toast.error("Error generating study plan: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!plan) return toast.error("No study plan to download.");
    downloadPlan(plan, `${title || "study-plan"}.pdf`, title || "Generated Study Plan");
    toast.success("Study plan downloaded as PDF!");
  };

  return (
    <div className="study-planner">
      <header className="study-planner-header">
        <h2>Generate Study Plan</h2>
      </header>

      {plan && (
        <section className="study-plan-output">
          <h2>Study Plan Generator</h2>
          <div className="markdown-output">
            <ReactMarkdown>{plan}</ReactMarkdown>
          </div>
          <button onClick={handleDownload} className="download-btn" aria-label="Download Study Plan as PDF">
            Download as PDF
          </button>
        </section>
      )}
      <section className="study-planner-form">
        {useText ? (
          <textarea
            className="text-area"
            value={textInput}
            onChange={e => setTextInput(e.target.value)}
            placeholder="Paste or type content here..."
          />
        ) : (
          <input
            type="file"
            className="file-input"
            onChange={e => setFile(e.target.files[0])}
            accept=".pdf,.docx,.txt,.csv,.xlsx"
          />
        )}

        <div className="controls">
          <input
            type="text"
            placeholder="Enter title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <label className="toggle">
            Use Text Input
            <input type="checkbox" checked={useText} onChange={() => setUseText(!useText)} />
          </label>
          <label htmlFor="examDate">
            Exam Date
            <input type="date" value={examDate} onChange={e => setExamDate(e.target.value)} />
          </label>
          <label htmlFor="dailyHours">
            Daily Study Hours
            <input
              type="number"
              value={dailyHours}
              min="1"
              onChange={e => setDailyHours(Number(e.target.value))}
            />
          </label>
          <button onClick={handleGenerate} disabled={loading || !isAuthenticated} className="generate-btn">
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default StudyPlanner;
