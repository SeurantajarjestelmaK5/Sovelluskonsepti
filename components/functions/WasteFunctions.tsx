import { db } from "../../firebase/config";
import { collection, getDocs, doc, getDoc } from "firebase/firestore";

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
