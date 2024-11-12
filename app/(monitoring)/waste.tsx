import React, { useMemo, useEffect, useState } from "react";
import { Text, View, Image, Dimensions } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import BackButton from "@/components/BackButton";
import { db } from "@/firebase/config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import LoadingScreen from "@/components/LoadingScreen";

import { useThemeColors } from "@/constants/ThemeColors";
import { useColorScheme } from "react-native";
import { getWasteStyles } from "@/styles/monitoring/wasteStyles";

interface WasteData {
  id: string;
  yksikkö: string;
  määrä: number;
}

export default function waste() {
  const [docData, setDocData] = useState<WasteData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState("");

  const ThemeColors = useThemeColors();
  const colorScheme = useColorScheme();
  const styles = useMemo(() => getWasteStyles(ThemeColors), [ThemeColors]);

  const checkOrientation = async () => {
    const windowHeight = Dimensions.get("window").height;
    console.log(windowHeight);
  };

  const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const currDate = `${day}-${month}-${year}`;
    setDate(currDate);
  };

  useEffect(() => {
    getCurrentDate();
  }, []);


  useEffect(() => {
    setIsLoading(true);
    const fetchWaste = async () => {
      if (!date) return;

      try {
        const querySnapshot = await getDocs(
          collection(db, "omavalvonta", "jätteet", date)
        );
        const data: WasteData[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as WasteData[];
        setDocData(data);
        console.log(data, date);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };
    fetchWaste();
    setIsLoading(false);
  }, [date]);

  if (isLoading) {
    return <LoadingScreen />;
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Jätteet</Text>
        <View style={styles.content}>
          <Text style={styles.text}>Tähän tulee jätteiden seuranta</Text>
          <Text style={styles.text}>Päivämäärä: {date}</Text>
          {docData.map((doc) => (
            <View key={doc.id}>
              <Text style={styles.text}>{doc.id}</Text>
              <Text style={styles.text}>{doc.määrä}</Text>
              <Text style={styles.text}>{doc.yksikkö}</Text>
            </View>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <BackButton />
        </View>
      </View>
    );
  }
}
