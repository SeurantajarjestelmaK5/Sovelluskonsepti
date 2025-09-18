import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  writeBatch,
  Firestore,
  updateDoc,
  addDoc,
  Timestamp,
  orderBy,
} from "firebase/firestore";

export interface GiftcardType {
  id: string;
  start_date: Timestamp;
  end_date: Timestamp;
  value: number;
  expired: boolean;
  used: boolean;
}
export const findNextGiftcardId = async (): Promise<string> => {
  const giftcardsRef = collection(db, "lahjakortit");
  const snapshot = await getDocs(giftcardsRef);

  // Filter documents to only include those with numeric IDs
  const numericDocs = snapshot.docs.filter((doc) => {
    const id = doc.id; // Document ID is the key, not a field in data
    return !isNaN(Number(id)) && id !== "";
  });

  if (numericDocs.length === 0) {
    return "1";
  }

  // Find the highest numeric ID
  const highestId = Math.max(...numericDocs.map((doc) => Number(doc.id)));

  // Return the next ID as a string
  return (highestId + 1).toString();
};
