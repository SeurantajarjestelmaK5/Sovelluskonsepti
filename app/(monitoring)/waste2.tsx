import { useMemo, useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import CalendarComponent from "@/components/CalendarComponent";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackButton from "@/components/BackButton";
import { db } from "@/firebase/config.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import LoadingScreen from "@/components/LoadingScreen";
import SmallLoadingIndicator from "@/components/SmallLoadingIncidator";
import { useThemeColors } from "@/constants/ThemeColors";
import { useColorScheme } from "react-native";
import { getWasteStyles } from "@/styles/monitoring/wasteStyles";
import { TextInput, Button, Icon } from "react-native-paper";


export default function Waste2() {


     useEffect(() => {
const fetchMonthlyDocuments = async () => {
  try {
    const parentDocRef = doc(db, "omavalvonta", "jätteet2");

    // First, fetch the subcollection names
    const parentDocSnapshot = await getDoc(parentDocRef);
    if (!parentDocSnapshot.exists()) {
      console.error("Parent document does not exist!");
      return;
    }

    const subcollectionNames = parentDocSnapshot.data()?.subcollectionNames;
    if (!Array.isArray(subcollectionNames)) {
      console.error("subcollectionNames field is missing or invalid!");
      return;
    }

    const allMonthlyData: Record<string, any[]> = {};

    for (const subcollectionName of subcollectionNames) {
      // Access each subcollection
      const subcollectionRef = collection(
        db,
        "omavalvonta",
        "jätteet2",
        subcollectionName
      );
      const subcollectionSnapshot = await getDocs(subcollectionRef);

      const monthlyDocs = subcollectionSnapshot.docs.map((doc) => ({
        id: doc.id, // e.g., '11-2024'
        ...doc.data(), // fields like `1.`, `14.`, `21.` in the documents
      }));

      allMonthlyData[subcollectionName] = monthlyDocs; // Organize data by subcollection
    }

    console.log("Fetched Monthly Data:", allMonthlyData);

    // Example: Accessing a specific subcollection's monthly data
    // console.log("Data for Bio:", allMonthlyData["Bio"]);
  } catch (error) {
    console.error("Error fetching monthly documents:", error);
  }
};

fetchMonthlyDocuments();
  }, []);

}