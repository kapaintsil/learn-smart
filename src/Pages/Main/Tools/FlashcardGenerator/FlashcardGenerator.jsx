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
  const [flashcardType, setFlashcardType] = useState("term");
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [title, setTitle] = useState("");

  // Monitor auth state
  useEffect(() => {
    console.log("FlashcardGenerator: Initializing auth state listener");
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("FlashcardGenerator: Auth state changed, user:", user ? user.uid : null);
      setIsAuthenticated(!!user);
    });
    return () => {
      console.log("FlashcardGenerator: Unsubscribing auth listener");
      unsubscribe();
    };
  }, []);

  // Load saved data from History.jsx
  useEffect(() => {
    if (state?.savedData) {
      console.log("FlashcardGenerator: Loading savedData:", state.savedData);
      const { title, originalContent, cards, flashcardType } = state.savedData;
      setTitle(title || "");
      setTextInput(originalContent || "");
      setFlashcards(cards || []);
      setFlashcardType(flashcardType || "term");
      setUseText(!!originalContent);
      setFile(null); // Reset file since saved data uses text
    } else {
      console.log("FlashcardGenerator: No savedData provided");
    }
  }, [state]);

  const toggleFlip = (index) => {
    setFlippedCards((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    );
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast.error("Please enter a title.");
      console.error("FlashcardGenerator: Validation failed: Missing title");
      return;
    }
    if (!useText && !file) {
      toast.error("Please upload a file or enter text.");
      console.error("FlashcardGenerator: Validation failed: Missing content");
      return;
    }
    if (useText && !textInput.trim()) {
      toast.error("Please enter text content.");
      console.error("FlashcardGenerator: Validation failed: Empty text input");
      return;
    }

    setLoading(true);
    setFlashcards([]);

    try {
      console.log("FlashcardGenerator: Generating flashcards, user:", auth.currentUser?.uid);
      const content = useText ? textInput : await handleFileUpload(file);
      console.log("FlashcardGenerator: Content processed:", content.substring(0, 100) + "...");

      const prompt = `From the content below, generate 10 ${
        flashcardType === "term" ? "Term and Definition" : "Question and Answer"
      } style flashcards. Format output as:

[Front] <text>
[Back] <text>

${content}`;

      console.log("FlashcardGenerator: Sending prompt to AI");
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = await response.text();
      console.log("FlashcardGenerator: AI output:", text.substring(0, 200) + "...");

      // Parse AI output
      const parsed = text
        .split(/\[Front\]|\[Back\]/)
        .map((item) => item.trim())
        .filter((x) => x);
      const cards = [];
      for (let i = 0; i < parsed.length && i + 1 < parsed.length; i += 2) {
        cards.push({ front: parsed[i], back: parsed[i + 1] });
      }
      console.log("FlashcardGenerator: Parsed cards:", cards);
      setFlashcards(cards);

      if (!isAuthenticated || !auth.currentUser) {
        console.warn("FlashcardGenerator: No authenticated user, skipping Firestore save");
        toast.info("Flashcards generated but not saved (please sign in).");
        return;
      }

      const itemData = {
        type: "flashcard",
        title: title.trim(),
        originalContent: content,
        cards,
        flashcardType,
      };
      console.log("FlashcardGenerator: Saving to Firestore:", itemData);
      const itemId = await saveToFirestore("generatedItems", itemData);
      console.log("FlashcardGenerator: Saved to Firestore with itemId:", itemId);
      toast.success("Flashcards generated and saved successfully!");
    } catch (error) {
      console.error("FlashcardGenerator: Error generating or saving flashcards:", error);
      toast.error("Error generating flashcards: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (flashcards.length === 0) {
      toast.error("No flashcards to download.");
      console.error("FlashcardGenerator: Download failed: No flashcards");
      return;
    }

    const text = flashcards
      .map((c, i) => `Card ${i + 1}\nFront: ${c.front}\nBack: ${c.back}\n\n`)
      .join("");
    downloadPlan(text, `${title || "flashcards"}.pdf`, title || "Generated Flashcards");
    toast.success("Flashcards downloaded as PDF!");
    console.log("FlashcardGenerator: Flashcards downloaded as PDF");
  };

  return (
    <div className="flashcard-generator">
      <div className="flashcard-generator-header">
        <h1>Flashcard Generator</h1>
      </div>

      {flashcards.length > 0 && (
        <div className="flashcards-display">
          <h2>Your Flashcards</h2>
          <div className="cards-grid">
            {flashcards.map((card, index) => (
              <div
                className="generated-card"
                key={index}
                onClick={() => toggleFlip(index)}
                data-testid={`flashcard-${index}`}
              >
                <div
                  className={`card-inner ${flippedCards.includes(index) ? "flipped" : ""}`}
                >
                  <div className="card-front">{card.front}</div>
                  <div className="card-back">{card.back}</div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={handleDownload}
            className="download-btn"
            aria-label="Download Flashcards as PDF"
            data-testid="download-button"
          >
            Download PDF
          </button>
        </div>
      )}

      <div className="flashcard-generator-form">
        <div className="input-group">
          <label htmlFor="title" className="sr-only">Flashcard Title</label>
          <input
            id="title"
            type="text"
            placeholder="Enter flashcard set title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            aria-label="Flashcard Title"
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
              accept=".pdf,.docx,.txt,.csv,.xlsx,.pptx"
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
            <label htmlFor="flashcardType" className="sr-only">Flashcard Type</label>
            <select
              id="flashcardType"
              value={flashcardType}
              onChange={(e) => setFlashcardType(e.target.value)}
              aria-label="Flashcard Type"
              data-testid="flashcard-type-select"
            >
              <option value="term">Term / Definition</option>
              <option value="qa">Question / Answer</option>
            </select>
          </div>
          <button
            onClick={handleGenerate}
            disabled={loading || !isAuthenticated}
            className="generate-btn"
            aria-label="Generate Flashcards"
            data-testid="generate-button"
          >
            {loading ? "Generating..." : "Generate Flashcards"}
          </button>
        </div>
        {!isAuthenticated && (
          <p className="auth-warning" data-testid="auth-warning">
            Please sign in to save your flashcards.
          </p>
        )}
      </div>
    </div>
  );
};

export default FlashcardGenerator;