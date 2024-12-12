import { db } from "../../firebase/config";
import { collection, getDocs, doc, getDoc, setDoc, query } from "firebase/firestore";
import * as Cleaning from "../../constants/CleaningTasks";

interface CleaningProps {
year: string;
month: string;
week: string;
day: string;
side: string;
  name: string;
  status: boolean;
}

interface CleaningData {
  name: string;
  status: boolean;
}

export const FetchCleaning = async (
  year: string,
  month: string,
  week: string,
  day: string,
  side: string
): Promise<CleaningData | null> => {
  if (!month || !day) return null;
  try {
    const docRef = doc(
      db,
      "omavalvonta",
      "siivous",
      year,
      month,
      week,
      day,
      side
    );
    const docSnapshot = await getDoc(docRef);

    if (docSnapshot.exists()) {
      const data = docSnapshot.data();
      return {
        name: data.name,
        status: data.status,
      };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error fetching cleaning data by date:", error);
    return null;
  }
};


export const initializeWeekCleaning = async (
    year: string,
    month: string,
    week: string,
    day: string,
    side: string
    ) => {
    if (!month || !day) return null;
    // First check if docs exist
    const docRef = doc(
      db,
      "omavalvonta",
      "siivous",
      year,
      month,
      week,
      day,
      side
    );
    const docSnapshot = await getDoc(docRef);
    if (docSnapshot.exists()) {
      return null;
    }
    // If docs do not exist, initialize them
    if (side === "Keittiö") {
        const tasks = Cleaning.kitchenTasksTuesday;
        const tasks2 = Cleaning.kitchenTasksWednesday;
        const tasks3 = Cleaning.kitchenTasksSunday;
            tasks.map((task) => {
        setDoc(doc(db, "omavalvonta", "siivous", "keittiö", year, month, week, "Tiistai"), {
            name: task,
            status: false,
        });
    });
        tasks2.map((task) => {
        setDoc(doc(db, "omavalvonta", "siivous", "keittiö", year, month, week, "Keskiviikko"), {
            name: task,
            status: false,
        });
    });
        tasks3.map((task) => {
        setDoc(doc(db, "omavalvonta", "siivous","keittiö", year, month, week, "Sunnuntai"), {
            name: task,
            status: false,
        });
    });
    }   else if (side === "Sali") {
        const tasks = Cleaning.diningroomTasks;
        tasks.map((task) => {
        setDoc(doc(db, "omavalvonta", "siivous", "sali", year, month, week, "Siivoukset"), {
            name: task,
            status: false,
        });
    });
    }
}


    