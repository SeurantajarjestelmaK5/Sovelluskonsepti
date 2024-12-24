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
} from "firebase/firestore";
import * as Cleaning from "../../constants/CleaningTasks";

export const FetchDiningRoomDefaults = async (): Promise<string[]> => {
  const docRef = doc(db, "omavalvonta", "siivous", "sali", "defaults");
  const docSnapshot = await getDoc(docRef);

  if (docSnapshot.exists()) {
    const data = docSnapshot.data();
    return data as string[];
  } else {
    return [];
  }
};

export const FetchKitchenDefaults = async (): Promise<{
  sunday?: string[];
  tuesday?: string[];
  wednesday?: string[];
}> => {
  const docRef = doc(db, "omavalvonta", "siivous", "keittiö", "defaults");
  const docSnapshot = await getDoc(docRef);

  if (docSnapshot.exists()) {
    const data = docSnapshot.data();
    return {
      sunday: data.sunday || [],
      tuesday: data.tuesday || [],
      wednesday: data.wednesday || [],
    };
  } else {
    return {};
  }
};

export const checkAndPopulateDefaults = async (
  side: string,
  year: string,
  month: string,
  week: string
) => {

  const weekRef = doc(db, "omavalvonta", "siivous", side, year, month, week);

  // Check if week exists
  const weekSnapshot = await getDoc(weekRef);
  if (weekSnapshot.exists()) {
    console.log("Data already exists for the selected week.");
    return true; // Week already exists
  }

  // Get current date for the `date` field
  const currentDate = new Date().toISOString(); // ISO format for consistency

  // Determine tasks based on side
  let dayTasks: { [key: string]: string[] };
  if (side === "keittiö") {
    dayTasks = {
      sunday: Cleaning.kitchenTasksSunday,
      tuesday: Cleaning.kitchenTasksTuesday,
      wednesday: Cleaning.kitchenTasksWednesday,
    };
  } else if (side === "sali") {
    const dayRef = collection(
      db,
      "omavalvonta",
      "siivous",
      side,
      year,
      month,
      week,
      "all"
    );
    const batch = writeBatch(db);

    Cleaning.diningroomTasks.forEach((task, index) => {
      const taskRef = doc(dayRef, `task-${index}`);
      batch.set(taskRef, {
        name: task,
        completed: false, // Task starts as not completed
        date: currentDate, // Default to current date
      });
    });

    await batch.commit();
    return false; // Defaults populated
  } else {
    throw new Error("Invalid side selected");
  }

  // Write kitchen tasks for each day
  const batch = writeBatch(db);

  for (const [day, tasks] of Object.entries(dayTasks)) {
    const dayRef = collection(
      db,
      "omavalvonta",
      "siivous",
      side,
      year,
      month,
      week,
      day
    );

    tasks.forEach((task, index) => {
      const taskRef = doc(dayRef, `task-${index}`);
      batch.set(taskRef, {
        name: task,
        completed: false, // Task starts as not completed
        date: currentDate, // Default to current date
      });
    });
  }

  await batch.commit();
  return false; // Indicates that defaults were populated
};

export const fetchTasksBySideAndWeek = async (
  side: string,
  year: string,
  month: string,
  week: string
) => {
  if (side === "sali") {
    // Dining Room
    try {
      const tasksRef = collection(
        db,
        "omavalvonta",
        "siivous",
        "sali",
        year,
        month,
        week,
        "all"
      );

      const tasksSnapshot = await getDocs(tasksRef);

      if (tasksSnapshot.empty) {
        console.warn("No dining room tasks found.");
        return { dining: [] };
      }

      const tasks: any[] = [];

      tasksSnapshot.forEach((taskDoc) => {
        const task = taskDoc.data();
        tasks.push({
          id: taskDoc.id, // Include Firestore document ID
          name: task.name,
          completed: task.completed || false,
          date: task.date || "",
        });
      });

      return { dining: tasks };
    } catch (error) {
      console.error("Error fetching dining room tasks:", error);
      throw error;
    }
  } else if (side === "keittiö") {
    // Kitchen Logic
    try {
      const weekRef = doc(
        db,
        "omavalvonta",
        "siivous",
        "keittiö",
        year,
        month,
        week
      );

      const days = ["sunday", "tuesday", "wednesday"]; // Specify the subcollections
      const tasks: { [day: string]: any[] } = {};

      for (const day of days) {
        const dayTasksRef = collection(weekRef, day); // Subcollection under the week

        const dayTasksSnapshot = await getDocs(dayTasksRef);

        if (dayTasksSnapshot.empty) {
          console.warn(`No tasks found for ${day}.`);
          tasks[day] = [];
        } else {
          const dayTasks = dayTasksSnapshot.docs.map((taskDoc) => {
            const task = taskDoc.data();
            return {
              id: taskDoc.id, // Include Firestore document ID
              name: task.name,
              completed: task.completed || false,
              date: task.date || "",
            };
          });

          tasks[day] = dayTasks;
        }
      }

      return tasks;
    } catch (error) {
      console.error("Error fetching kitchen tasks:", error);
      throw error;
    }
  }
};

export const toggleTaskCompletionInFirestore = async (
  side: string,
  year: string,
  month: string,
  week: string,
  day: string | null, // `day` is optional for sali
  taskId: string, // Firestore document ID
  completed: boolean
) => {
  try {
    if (side === "keittiö") {
      // Kitchen tasks: include day in the path
      const taskDocRef = doc(
        db,
        "omavalvonta",
        "siivous",
        "keittiö",
        year,
        month,
        week,
        day!, // Ensure `day` is provided for kitchen tasks
        taskId
      );

      await updateDoc(taskDocRef, {
        completed,
        date: completed ? new Date().toISOString() : "",
      });

      console.log(
        `Kitchen task "${taskId}" on ${day} marked as ${
          completed ? "completed" : "incomplete"
        }`
      );
    } else if (side === "sali") {
      // Dining room tasks: no `day`, tasks are under "all"
      const taskDocRef = doc(
        db,
        "omavalvonta",
        "siivous",
        "sali",
        year,
        month,
        week,
        "all",
        taskId // Firestore document ID under "all"
      );

      await updateDoc(taskDocRef, {
        completed,
        date: completed ? new Date().toISOString() : "",
      });

      console.log(
        `Dining room task "${taskId}" marked as ${
          completed ? "completed" : "incomplete"
        }`
      );
    } else {
      console.error(`Invalid side: "${side}".`);
      throw new Error("Side must be either 'keittiö' or 'sali'.");
    }
  } catch (error) {
    console.error("Error updating task completion in Firestore:", error);
    throw error;
  }
};
