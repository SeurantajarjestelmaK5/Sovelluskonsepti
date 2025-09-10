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
} from "firebase/firestore";

export interface GiftcardType {
  id: string;
  start_date: Timestamp;
  end_date: Timestamp;
  value: number;
  expired: boolean;
  used: boolean;
}
