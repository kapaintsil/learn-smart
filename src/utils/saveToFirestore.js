import { setDoc, doc, serverTimestamp, collection } from 'firebase/firestore';
import { auth, db } from '../Firebase/firebase';

const saveToFirestore = async (collectionName, data, retries = 3) => {
  if (!auth.currentUser) {
    console.error("saveToFirestore: No authenticated user");
    throw new Error('User not authenticated');
  } 

  const itemId = doc(collection(db, `users/${auth.currentUser.uid}/${collectionName}`)).id;
  const itemData = {
    ...data,
    createdAt: serverTimestamp(),
  };

  let attempts = 0;
  while (attempts < retries) {
    try {
      console.log("saveToFirestore: Attempt", attempts + 1, "saving to", collectionName, "with data:", itemData);
      await setDoc(doc(db, `users/${auth.currentUser.uid}/${collectionName}`, itemId), itemData);
      console.log("saveToFirestore: Saved item with ID:", itemId);
      return itemId;
    } catch (error) {
      attempts++;
      console.error("saveToFirestore: Attempt", attempts, "failed:", error);
      if (attempts === retries) {
        throw new Error(`Failed to save to ${collectionName} after ${retries} attempts: ${error.message}`);
      }
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }
  }
};

export { saveToFirestore };