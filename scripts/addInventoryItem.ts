import { db } from "@/firebase/config";
import { doc, setDoc, collection } from "firebase/firestore";

interface InventoryItem {
  Alv: number;
  Hinta: number;
  Määrä: number;
  Yksikkö: string;
  Nimi: string;
  Yhteishinta: number;
  Kategoria: string;
}

/**
 * Adds an item to the specified inventory location (Sali or Keittiö) for a given month.
 *
 * @param selectedDate - The date string in the format 'MM-YYYY' for the month of the inventory.
 * @param location - The location within the inventory ('sali' or 'keittiö').
 * @param item - The InventoryItem to add to the inventory.
 * @returns A promise that resolves when the item is added.
 */
export async function addInventoryItem(
  selectedDate: string,
  location: "sali" | "keittiö",
  item: InventoryItem
): Promise<void> {
  try {
    const itemRef = doc(collection(db, "inventaario", selectedDate, location), item.Nimi);
    await setDoc(itemRef, item);
    console.log(`Added item '${item.Nimi}' to ${location} for ${selectedDate}.`);
  } catch (error) {
    console.error("Error adding inventory item:", error);
    throw error; // Rethrow error to handle it where the function is called
  }
}
