import { db, auth } from "../Firebase/firebase";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";

/**
 * Generic function to save any data to a Firestore collection.
 * @param {string} collectionName - The Firestore collection name
 * @param {Object} data - The data object to be saved
 */
export const saveToFirestore = async (collectionName, data) => {
  const user = auth.currentUser;
  if (!user) return;

  const docData = {
    uid: user.uid,
    ...data,
    createdAt: serverTimestamp(),
  };

  try {
    await addDoc(collection(db, collectionName), docData);
  } catch (error) {
    console.error("Error saving to Firestore:", error);
  }
};
