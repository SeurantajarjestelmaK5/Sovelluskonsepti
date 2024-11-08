import React, { useMemo, useEffect, useState } from "react";
import { Text, View, Image, Dimensions } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import BackButton from "@/components/BackButton";
import { db } from "@/firebase/config";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";

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


  const ThemeColors = useThemeColors();
  const colorScheme = useColorScheme();
  const styles = useMemo(() => getWasteStyles(ThemeColors), [ThemeColors]);
  const date = "1-10-24";

  const checkOrientation = async () => {
    const windowHeight = Dimensions.get("window").height;
    console.log(windowHeight);
  };

  useEffect(() => {
    setIsLoading(true);
    const fetchWaste = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "omavalvonta", "jätteet", date)
        );
        const data: WasteData[] = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        })) as WasteData[];
        setDocData(data);
        console.log(data, orientation);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };
    checkOrientation();
    fetchWaste();
    setIsLoading(false);
  }, []);

  if (isLoading) {
    return (
      <View style={{ ...styles.container, justifyContent: "flex-start" }}>
        <Image
          source={
            colorScheme === "light"
              ? require("../../assets/images/k5light.png")
              : require("../../assets/images/k5dark.jpg")
          }
          style={styles.logo}
        />
        <Text style={styles.text}>Ladataan...</Text>
        <ActivityIndicator size="large" color={ThemeColors.tint} />
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Jätteet</Text>
        <View style={styles.content}>
          <Text style={styles.text}>Tähän tulee jätteiden seuranta</Text>
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
