import { db } from "@/firebase/config";
import { doc, setDoc, collection } from "firebase/firestore";

interface SampleItem {
    date: string;
    nayte: string;
    tulos: number;
    arvio: string;
    toimenpiteet: string;
  }


export async function addSample(
    selectedDate: string,
    item : SampleItem
): Promise<void> {
    try {
        const [day, month, year] = selectedDate.split('.').map(String)
        const dayMonth : string = `${day}-${month}`
        const itemRef = doc(collection(db, "omavalvonta", "näytteenotto", year), `${dayMonth}-${item.nayte}`);
        await setDoc(itemRef, item);
      } catch (error) {
        console.error("Error adding inventory item:", error);
        throw error; // Rethrow error to handle it where the function is called
      }
}