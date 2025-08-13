import React, { useState } from "react";
import { db, auth, model } from "../../../../Firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import "./FlashcardGenerator.css";
import { handleFileUpload } from "../../../../utils/handleFileUpload";
import { downloadPlan } from "../../../../utils/downloadPlan"; 

function FlashcardGenerator() {
  const [file, setFile] = useState(null);
  const [useText, setUseText] = useState(false);
  const [textInput, setTextInput] = useState("");
  const [flashcardType, setFlashcardType] = useState("term");
  const [flashcards, setFlashcards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [flippedCards, setFlippedCards] = useState([]);

  const toggleFlip = (index) => {
    setFlippedCards((prev) =>
      prev.includes(index)
        ? prev.filter((i) => i !== index)
        : [...prev, index]
    );
  };

  const handleGenerate = async () => {
    if (!useText && !file) return alert("Please upload a file.");
    if (useText && !textInput.trim()) return alert("Please enter text.");

    setLoading(true);
    setFlashcards([]);

    try {
      const content = useText ? textInput : await handleFileUpload(file);
      const prompt = `From the content below, generate 10 ${
        flashcardType === "term"
          ? "Term and Definition"
          : "Question and Answer"
      } style flashcards. Format output as:
      
[Front] <text>
[Back] <text>

${content}`;

      const result = await model.generateContent(prompt);
      const text = await result.response.text();

      // Parse AI output
      const parsed = text
        .split(/\[Front\]|\[Back\]/)
        .map((item) => item.trim())
        .filter((x) => x);

      const cards = [];
      for (let i = 0; i < parsed.length; i += 2) {
        cards.push({ front: parsed[i], back: parsed[i + 1] });
      }
      setFlashcards(cards);

      // Save to Firestore if logged in
      const user = auth.currentUser;
      if (user) {
        await addDoc(collection(db, "flashcards"), {
          uid: user.uid,
          content,
          cards,
          flashcardType,
          createdAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error(error);
      alert("Error generating flashcards.");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (flashcards.length === 0) return;

    const text = flashcards
      .map(
        (c, i) =>
          `Card ${i + 1}\nFront: ${c.front}\nBack: ${c.back}\n\n`
      )
      .join("");

    downloadPlan(text, "flashcards.pdf", "Generated Flashcards");
  };

  return (
    <div className="flashcard-generator">
      <h1>Flashcard Generator</h1>

      {flashcards.length > 0 && (
        <div className="flashcards-display">
          <div className="cards-grid">
            {flashcards.map((card, index) => (
              <div
                className="generated-card"
                key={index}
                onClick={() => toggleFlip(index)}
              >
                <div
                  className={`card-inner ${
                    flippedCards.includes(index) ? "flipped" : ""
                  }`}
                >
                  <div className="card-front">{card.front}</div>
                  <div className="card-back">{card.back}</div>
                </div>
              </div>
            ))}
          </div>

          <button onClick={handleDownload} className="download-btn">
            Download PDF
          </button>
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
          accept=".pdf,.docx,.txt,.csv,.xlsx,.pptx"
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
        <select
          value={flashcardType}
          onChange={(e) => setFlashcardType(e.target.value)}
        >
          <option value="term">Term / Definition</option>
          <option value="qa">Question / Answer</option>
        </select>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="generate-btn"
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
}

export default FlashcardGenerator;
