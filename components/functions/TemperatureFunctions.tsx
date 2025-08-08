import { db } from "../../firebase/config";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  getDoc,
  setDoc,
  updateDoc,
} from "firebase/firestore";

export const fetchCategoryData = async (
  category: string,
  year: string,
  month: string
) => {
  const docRef = collection(
    db,
    "omavalvonta",
    "lämpötilat",
    category,
    year,
    month
  );
  const docSnap = await getDocs(docRef);
  if (!docSnap.empty) {
    return docSnap.docs.map((doc) => ({
      id: doc.id, // Include the document ID
      ...doc.data(), // Spread the document data
    }));
  }
  return [];
};

export const saveItem = async (
  category: string,
  year: string,
  month: string,
  data: any
) => {
  const docRef = doc(
    collection(db, "omavalvonta", "lämpötilat", category, year, month)
  );
  await setDoc(docRef, data);

  return docRef.id; // Return the generated ID if needed
};

export const deleteItem = async (
  category: string,
  year: string,
  month: string,
  id: string
) => {
  const docRef = doc(
    db,
    "omavalvonta",
    "lämpötilat",
    category,
    year,
    month,
    id
  );
  await deleteDoc(docRef);
};

export const updateItem = async (
  category: string,
  year: string,
  month: string,
  id: string,
  updateData: any
) => {
  const docRef = doc(
    db,
    "omavalvonta",
    "lämpötilat",
    category,
    year,
    month,
    id
  );
  await updateDoc(docRef, updateData);
};
