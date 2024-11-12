import React, { useMemo, useEffect, useState } from "react";
import { Text, View, Image, Dimensions, Pressable } from "react-native";
import {
  Calendar,
  CalendarList,
  Agenda,
  LocaleConfig,
} from "react-native-calendars";
import { MaterialCommunityIcons } from "@expo/vector-icons";
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

LocaleConfig.locales["fi"] = {
  monthNames: [
    "Tammikuu",
    "Helmikuu",
    "Maaliskuu",
    "Huhtikuu",
    "Toukokuu",
    "Kesäkuu",
    "Heinäkuu",
    "Elokuu",
    "Syyskuu",
    "Lokakuu",
    "Marraskuu",
    "Joulukuu",
  ],
  monthNamesShort: [
    "Tammi",
    "Helmi",
    "Maalis",
    "Huhti",
    "Touko",
    "Kesä",
    "Heinä",
    "Elo",
    "Syys",
    "Loka",
    "Marras",
    "Joulu",
  ],
  dayNames: [
    "Sunnuntai",
    "Maanantai",
    "Tiistai",
    "Keskiviikko",
    "Torstai",
    "Perjantai",
    "Lauantai",
  ],
  dayNamesShort: ["Su", "Ma", "Ti", "Ke", "To", "Pe", "La"],
};

LocaleConfig.defaultLocale = "fi";

export default function waste() {
  const [docData, setDocData] = useState<WasteData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState("");
  const [calendarModal, setCalendarModal] = useState(false);

  const ThemeColors = useThemeColors();
  const colorScheme = useColorScheme();
  const styles = useMemo(() => getWasteStyles(ThemeColors), [ThemeColors]);

  const checkOrientation = async () => {
    const windowHeight = Dimensions.get("window").height;
    console.log(windowHeight);
  };

    const handleDatePress = (day: any) => {
      const [year, month, dayOfMonth] = day.dateString.split("-");
      const formattedDate = `${dayOfMonth}.${month}.${year}`;
      setDate(formattedDate); // Set date in "DD.MM.YYYY" format
      setCalendarModal(false);
    };

  const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const currDate = `${day}.${month}.${year}`;
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
        <Pressable
          style={styles.calendar}
          onPress={() => setCalendarModal(!calendarModal)}
        >
          <Text style={styles.text}>{date}</Text>
          <MaterialCommunityIcons
            name="calendar"
            size={35}
            color={ThemeColors.tint}
          />
        </Pressable>
        {calendarModal && (
          <Calendar
            onDayPress={handleDatePress}
            firstDay={1}  
          />
        )}
        <View style={styles.content}>
          {docData.map((doc) => (
            <View key={doc.id} style={styles.wasteContainer}>
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
