import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../../../Firebase/firebase";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { toast } from "react-toastify";
import "./History.css";

const History = () => {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!auth.currentUser) return;

    const q = query(
      collection(db, `users/${auth.currentUser.uid}/generatedItems`),
      orderBy("createdAt", "desc")
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedItems = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setItems(fetchedItems);
        setLoading(false);
      },
      (error) => {
        toast.error("Failed to load history: " + error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const handleDelete = async (itemId) => {
    try {
      await deleteDoc(
        doc(db, `users/${auth.currentUser.uid}/generatedItems`, itemId)
      );
      toast.success("Item deleted successfully!");
    } catch (error) {
      toast.error("Failed to delete item: " + error.message);
    }
  };

  // ✅ Navigate to the correct tool based on item.type
  const openItem = (item) => {
    let toolPath = "";
    switch (item.type) {
      case "quiz":
        toolPath = "/aitools/quiz-generator";
        break;
      case "flashcard":
        toolPath = "/aitools/flashcard-generator";
        break;
      case "study-plan":
        toolPath = "/aitools/study-planner";
        break;
      case "concept-explainer":
        toolPath = "/aitools/concept-explainer";
        break;
      default:
        toast.error("Unknown tool type");
        return;
    }
    navigate(toolPath, { state: { savedData: item } });
  };

  if (loading) {
    return <div className="history-loading">Loading...</div>;
  }

  return (
    <div className="history-container">
      <h2>Your Generated Items</h2>
      {items.length === 0 ? (
        <p className="no-items">No items generated yet.</p>
      ) : (
        <ul className="history-list">
          {items.map((item) => (
            <li
              key={item.id}
              className="history-item"
              onClick={() => openItem(item)}
              style={{ cursor: "pointer" }}
            >
              <div className="item-details">
                <h3>{item.title || "Untitled"}</h3>
                <p>Type: {item.type || "Unknown"}</p>
                <p>
                  Created:{" "}
                  {item.createdAt?.toDate
                    ? item.createdAt.toDate().toLocaleString()
                    : "No date"}
                </p>
              </div>
              <button
                className="delete-button"
                onClick={(e) => {
                  e.stopPropagation(); // ✅ Prevent click from opening item
                  handleDelete(item.id);
                }}
              >
                <i className="fa-solid fa-trash-can"></i>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default History;
