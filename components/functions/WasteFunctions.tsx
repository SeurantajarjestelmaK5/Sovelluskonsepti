import { db } from "../../firebase/config";
import { collection, getDocs, doc, getDoc, setDoc } from "firebase/firestore";

interface WasteData {
  id: string;
  yksikkö: string;
  määrä: number;
}

export const FetchBioWaste = async (
  month: string,
  year: string,
  date: string
): Promise<WasteData | null> => {
  if (!month || !date) return null;
  try {
    const docRef = doc(db, "omavalvonta", "jätteet2", "Bio", year, month, date);
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      return {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      } as WasteData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching waste data by date:", error);
    return null;
  }
};

export const FetchMixedWaste = async (
  month: string,
  year: string,
  date: string
): Promise<WasteData | null> => {
  if (!month) return null;
  try {
    const docRef = doc(
      db,
      "omavalvonta",
      "jätteet2",
      "Seka",
      year,
      month,
      date
    );
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      return {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      } as WasteData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching waste data by date:", error);
    return null;
  }
};

export const FetchPlasticWaste = async (
  month: string,
  year: string,
  date: string
): Promise<WasteData | null> => {
  if (!month || !date) return null;
  try {
    const docRef = doc(
      db,
      "omavalvonta",
      "jätteet2",
      "Muovi",
      year,
      month,
      date
    );
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      return {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      } as WasteData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching waste data by date:", error);
    return null;
  }
};

export const FetchCardboardWaste = async (
  month: string,
  year: string,
  date: string
): Promise<WasteData | null> => {
  if (!month || !date) return null;
  try {
    const docRef = doc(
      db,
      "omavalvonta",
      "jätteet2",
      "Pahvi",
      year,
      month,
      date
    );
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      return {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      } as WasteData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching waste data by date:", error);
    return null;
  }
};

export const FetchMetalWaste = async (
  month: string,
  year: string,
  date: string
): Promise<WasteData | null> => {
  if (!month || !date) return null;
  try {
    const docRef = doc(
      db,
      "omavalvonta",
      "jätteet2",
      "Metalli",
      year,
      month,
      date
    );
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      return {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      } as WasteData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching waste data by date:", error);
    return null;
  }
};

export const FetchGlassWaste = async (
  month: string,
  year: string,
  date: string
): Promise<WasteData | null> => {
  if (!month || !date) return null;
  try {
    const docRef = doc(
      db,
      "omavalvonta",
      "jätteet2",
      "Lasi",
      year,
      month,
      date
    );
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      return {
        id: docSnapshot.id,
        ...docSnapshot.data(),
      } as WasteData;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching waste data by date:", error);
    return null;
  }
};

export const FetchDatesWithData = async (
  month: string,
  year: string
): Promise<string[]> => {
  try {
    const wasteTypes = ["Bio", "Pahvi", "Seka", "Lasi", "Metalli", "Muovi"];
    const allDates = new Set<string>(); // Use a Set to store unique dates

    for (const type of wasteTypes) {
      const monthRef = collection(
        db,
        "omavalvonta",
        "jätteet2",
        type,
        year,
        month
      );

      const querySnapshot = await getDocs(monthRef);

      querySnapshot.forEach((doc) => {
        const day = doc.id.padStart(2, "0"); // Ensure day is two digits
        allDates.add(`${day}.${month.padStart(2, "0")}.${year}`); // Add date in DD.MM.YYYY format
      });
    }

    return Array.from(allDates).sort(); // Convert Set to Array and sort
  } catch (error) {
    console.error("Error fetching dates with data:", error);
    return [];
  }
};

export const AddWaste = async (
  wasteType: string,
  month: string,
  year: string,
  date: string,
  amount: number
): Promise<void> => {
  try {
    // Construct document reference path
    const docRef = doc(
      db,
      "omavalvonta",
      "jätteet2",
      wasteType,
      year,
      month,
      date // Path now includes 'year', 'month', 'date'
    );

    // Check if document exists
    const docSnapshot = await getDoc(docRef);
    if (!docSnapshot.exists()) {
      console.log("Document does not exist, creating new document...");
    }

    // Set the document (this will create it if it doesn't exist)
    await setDoc(
      docRef,
      {
        määrä: amount,
        yksikkö: "g",
      },
      { merge: true }
    );
  } catch (error) {
    console.error("Error adding waste data:", error);
  }
};

 export const getMonthTotal = async (
  month: string,
  year: string,
  wasteType: string
): Promise<number> => {
  try {
    const monthRef = collection(
      db,
      "omavalvonta",
      "jätteet2",
      wasteType,
      year,
      month
    );
    const querySnapshot = await getDocs(monthRef);
    let total = 0;

    querySnapshot.forEach((doc) => {
      total += doc.data().määrä;
    });

    return total;
  } catch (error) {
    console.error("Error fetching month total:", error);
    return 0;
  }
};