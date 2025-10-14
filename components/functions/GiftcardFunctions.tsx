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
  removed: boolean;
}
export const findNextGiftcardId = async (): Promise<string> => {
  const giftcardsRef = collection(db, "lahjakortit");
  const snapshot = await getDocs(giftcardsRef);

  // Filter documents to only include those with numeric IDs
  const numericDocs = snapshot.docs.filter((doc) => {
    const id = doc.id; 
    return !isNaN(Number(id)) && id !== "";
  });


  const unusedIds = numericDocs.filter((doc) => doc.data().used === false);

  if (unusedIds.length === 0) {
      return "1";
    }

  const highestId = Math.max(...unusedIds.map((doc) => Number(doc.id)));

  return (highestId + 1).toString();
};

export const addGiftcard = async (giftcard: GiftcardType) => {
  const giftcardDocRef = doc(db, "lahjakortit", giftcard.id);
  await setDoc(giftcardDocRef, giftcard);
};

export const getAllGiftcards = async (): Promise<GiftcardType[]> => {
  const ref = collection(db, "lahjakortit");
  const snapshot = await getDocs(ref);
  return snapshot.docs.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as GiftcardType)
  );
};

export const getUnusedGiftcards = async (): Promise<GiftcardType[]> => {
  const ref = collection(db, "lahjakortit");
  const snapshot = await getDocs(ref);
  const unusedGiftcards = snapshot.docs.filter(
    (doc) => doc.data().used === false && doc.data().removed === false
  );
  return unusedGiftcards.map(
    (doc) =>
      ({
        id: doc.id,
        ...doc.data(),
      } as GiftcardType)
  );
};

export const useGiftcard = async (id: string, expired: boolean): Promise<void> => {
  try {
  const ref = doc(db, "lahjakortit", id);
  const snapshot = await getDoc(ref);
    if (snapshot.exists()) {
      if (expired) {
        await updateDoc(ref, { removed: true });
      } else {
        await updateDoc(ref, { used: true });
      }
    }
    return;
  } catch (error) {
    console.error("Error using giftcard:", error);
    throw error;
  }
};

export const spendGiftcard = async (id: string, amount: string): Promise<void> => {
  const giftcardDocRef = doc(db, "lahjakortit", id);
  const snapshot = await getDoc(giftcardDocRef);
  if (snapshot.exists()) {
    await updateDoc(giftcardDocRef, { value: snapshot.data().value - Number(amount) });
  }
};

export const checkExistingGiftcard = async (id: string): Promise<boolean> => {
  const giftcardDocRef = doc(db, "lahjakortit", id);
  const snapshot = await getDoc(giftcardDocRef);
  return snapshot.exists();
};

export const setExpiredGiftcard = async (id: string): Promise<void> => {
  const giftcardDocRef = doc(db, "lahjakortit", id);
  await updateDoc(giftcardDocRef, { expired: true });
};