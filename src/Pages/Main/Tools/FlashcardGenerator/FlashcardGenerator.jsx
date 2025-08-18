import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { saveToFirestore } from "../../../../utils/saveToFirestore";
import { handleFileUpload } from "../../../../utils/handleFileUpload";
import { downloadPlan } from "../../../../utils/downloadPlan";
import { model, auth } from "../../../../Firebase/firebase";
import { toast } from "react-toastify";
import "./FlashcardGenerator.css";

const FlashcardGenerator = () => {
  const { state } = useLocation();
  const [file, setFile] = useState(null);
  const [useText, setUseText] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [title, setTitle] = useState("");
  const [flashcardType, setFlashcardType] = useState("term");
  const [flashcards, setFlashcards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Monitor auth state
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(user => setIsAuthenticated(!!user));
    return () => unsubscribe();
  }, []);

  // Load saved flashcards if coming from History
  useEffect(() => {
    if (state?.savedData) {
      const { title, originalContent, cards, flashcardType } = state.savedData;
      setTitle(title || "");
      setTextInput(originalContent || "");
      setFlashcards(cards || []);
      setFlashcardType(flashcardType || "term");
      setUseText(!!originalContent);
      setFile(null);
    }
  }, [state]);

  const toggleFlip = index =>
    setFlippedCards(prev =>
      prev.includes(index) ? prev.filter(i => i !== index) : [...prev, index]
    );

  const handleGenerate = async () => {
    if (!title.trim()) return toast.error("Please enter a title.");
    if (!useText && !file) return toast.error("Please upload a file or enter text.");
    if (useText && !textInput.trim()) return toast.error("Please enter text content.");

    setLoading(true);
    setFlashcards([]);

    try {
      const content = useText ? textInput : await handleFileUpload(file);
      const prompt = `From the content below, generate 10 ${
        flashcardType === "term" ? "Term and Definition" : "Question and Answer"
      } flashcards. Format as:

[Front] <text>
[Back] <text>

${content}`;

      const result = await model.generateContent(prompt);
      const text = await (await result.response).text();

      // Parse AI output
      const parsed = text.split(/\[Front\]|\[Back\]/).map(s => s.trim()).filter(Boolean);
      const cards = [];
      for (let i = 0; i + 1 < parsed.length; i += 2) {
        cards.push({ front: parsed[i], back: parsed[i + 1] });
      }
      setFlashcards(cards);

      // if (!isAuthenticated || !auth.currentUser) {
      //   toast.info("Flashcards generated but not saved (please sign in).");
      //   return;
      // }

      const itemData = { type: "flashcard", title: title.trim(), originalContent: content, cards, flashcardType };
      await saveToFirestore("generatedItems", itemData);
      toast.success("Flashcards generated and saved successfully!");
    } catch (error) {
      toast.error("Error generating flashcards: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!flashcards.length) return toast.error("No flashcards to download.");
    const text = flashcards.map((c, i) => `Card ${i + 1}\nFront: ${c.front}\nBack: ${c.back}\n\n`).join("");
    downloadPlan(text, `${title || "flashcards"}.pdf`, title || "Generated Flashcards");
    toast.success("Flashcards downloaded as PDF!");
  };

  return (
    <div className="flashcard-generator">
      <header className="flashcard-generator-header">
        <h1>Flashcard Generator</h1>
      </header>
      {flashcards.length > 0 && (
        <section className="flashcards-display">
          <div className="cards-grid">
            {flashcards.map((card, idx) => (
              <div key={idx} className="generated-card" onClick={() => toggleFlip(idx)}>
                <div className={`card-inner ${flippedCards.includes(idx) ? "flipped" : ""}`}>
                  <div className="card-front">{card.front}</div>
                  <div className="card-back">{card.back}</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={handleDownload} className="download-btn">Download PDF</button>
        </section>
      )}
      <section className="flashcard-generator-form">
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
            accept=".pdf,.docx,.txt,.csv,.xlsx,.pptx"
          />
        )}

        <div className="controls">
          <input
            type="text"
            placeholder="Enter set title"
            value={title}
            onChange={e => setTitle(e.target.value)}
          />
          <label className="toggle">
            Use Text Input
            <input type="checkbox" checked={useText} onChange={() => setUseText(!useText)} />
          </label>
          <select value={flashcardType} onChange={e => setFlashcardType(e.target.value)}>
            <option value="term">Term / Definition</option>
            <option value="qa">Question / Answer</option>
          </select>
          <button onClick={handleGenerate} disabled={loading || !isAuthenticated} className="generate-btn">
            {loading ? "Generating..." : "Generate"}
          </button>
        </div>
      </section>
    </div>
  );
};

export default FlashcardGenerator;