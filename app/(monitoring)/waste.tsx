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
import WasteButton from "@/components/WasteButton";
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
import * as WasteFunctions from "@/components/functions/WasteFunctions";
import LoadingScreen from "@/components/LoadingScreen";
import SmallLoadingIndicator from "@/components/SmallLoadingIncidator";
import { useThemeColors } from "@/constants/ThemeColors";
import { useColorScheme } from "react-native";
import { getWasteStyles } from "@/styles/monitoring/wasteStyles";
import { TextInput, Button, Icon } from "react-native-paper";

interface WasteData {
  id: string;
  yksikkö: string;
  määrä: number;
}

export default function waste() {
  const [bioData, setBioData] = useState<WasteData[]>([]);
  const [plasticData, setPlasticData] = useState<WasteData[]>([]);
  const [cardboardData, setCardboardData] = useState<WasteData[]>([]);
  const [metalData, setMetalData] = useState<WasteData[]>([]);
  const [glassData, setGlassData] = useState<WasteData[]>([]);
  const [mixedData, setMixedData] = useState<WasteData[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const [calendarDate, setCalendarDate] = useState<string>("");
  const [date, setDate] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [year, setYear] = useState<string>("");

  const [calendarModal, setCalendarModal] = useState(false);
  const [wasteModal, setWasteModal] = useState(false);
  const [dateList, setDateList] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [wasteAmount, setWasteAmount] = useState<number>(0);

  const ThemeColors = useThemeColors();
  const colorScheme = useColorScheme();
  const styles = useMemo(() => getWasteStyles(ThemeColors), [ThemeColors]);

  const handleDatePress = (day: any) => {
    const [year, month, dayOfMonth] = day.dateString.split("-");
    const formattedDate = `${dayOfMonth}.${month}.${year}`;
    setCalendarDate(formattedDate);
    setDate(dayOfMonth);
    setMonth(month);
    setSelectedDate(day.dateString);
    setTimeout(() => setCalendarModal(false), 50);
  };

  const showWasteModal = (id: string, type: string) => {
    setWasteModal(true);
  };

  const initialWasteList = [
    { id: "Bio", yksikkö: "g", määrä: 0 },
    { id: "Muovi", yksikkö: "g", määrä: 0 },
    { id: "Pahvi", yksikkö: "g", määrä: 0 },
    { id: "Seka", yksikkö: "g", määrä: 0 },
    { id: "Metalli", yksikkö: "g", määrä: 0 },
    { id: "Lasi", yksikkö: "g", määrä: 0 },
  ];

  useEffect(() => {
    const getCurrentDate = () => {
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const fullDate = `${day}.${month}.${year}`;
      const currDate = `${day}`;
      const currMonth = `${month}`;
      const currYear = `${year}`;
      setCalendarDate(fullDate);
      setDate(currDate);
      setMonth(currMonth);
      setYear(currYear);
    };
    getCurrentDate();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const fetchWasteData = async () => {
      const mixedWaste = await WasteFunctions.FetchMixedWaste(
        month,
        year,
        date
      );
      const plasticWaste = await WasteFunctions.FetchPlasticWaste(
        month,
        year,
        date
      );
      const cardboardWaste = await WasteFunctions.FetchCardboardWaste(
        month,
        year,
        date
      );
      const metalWaste = await WasteFunctions.FetchMetalWaste(
        month,
        year,
        date
      );
      const glassWaste = await WasteFunctions.FetchGlassWaste(
        month,
        year,
        date
      );
      const bioWaste = await WasteFunctions.FetchBioWaste(month, year, date);
      setBioData(bioWaste ? [bioWaste] : []);
      setMixedData(mixedWaste ? [mixedWaste] : []);
      setPlasticData(plasticWaste ? [plasticWaste] : []);
      setCardboardData(cardboardWaste ? [cardboardWaste] : []);
      setMetalData(metalWaste ? [metalWaste] : []);
      setGlassData(glassWaste ? [glassWaste] : []);
    };
    fetchWasteData();
    setIsLoading(false);
  }, [month, year, date]);

  useEffect(() => {
    const fetchWasteData = async () => {
      setIsLoading(true);
      try {
        const dates = await WasteFunctions.FetchDatesWithData(month, year);
        console.log("Fetched dates:", dates); // Debugging log
        setDateList(dates);
      } catch (error) {
        console.error("Error fetching waste data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (month && year) {
      fetchWasteData(); // Fetch only when month and year are valid
    }
  }, [month, year]);

  // const addWaste = async (docId: string, amount: number) => {
  //   setIsAdding(true);
  //   try {
  //     const docRef = collection(db, "omavalvonta", "jätteet", date);
  //     const docSnap = await getDoc(doc(docRef, docId));
  //     const dateRef = collection(db, "omavalvonta", "jätteet", "tallennetut");

  //     if (docSnap.exists()) {
  //       await updateDoc(doc(docRef, docId), {
  //         määrä: amount + docSnap.data().määrä,
  //       });
  //     } else {
  //       await setDoc(doc(docRef, docId), {
  //         määrä: amount,
  //         yksikkö: "g",
  //       });
  //     }

  //     await setDoc(doc(dateRef, date), {
  //       date: date,
  //     });

  //     initializeWasteForDate();
  //     setWasteModal(false);
  //     fetchWaste();
  //     setIsAdding(false);
  //   } catch (error) {
  //     console.error("Error adding document: ", error);
  //   }
  // };

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
          <Text style={styles.text}>{calendarDate}</Text>
          <MaterialCommunityIcons
            name="calendar"
            size={35}
            color={ThemeColors.tint}
          />
        </Pressable>
        {calendarModal && (
          <Modal
            visible={calendarModal}
            animationType="slide"
            transparent={true}
            onDismiss={() => setCalendarModal(false)}
          >
            <TouchableWithoutFeedback onPress={() => setCalendarModal(false)}>
              <View style={{ flex: 1 }}>
                <CalendarComponent
                  onDayPress={handleDatePress}
                  dataDates={dateList}
                  selectedDate={selectedDate}
                />
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}

        <View style={styles.content}>
          {bioData.map((data) => (
            <WasteButton
              key={data.id}
              data={data}
              wasteName="Bio" // Pass the type of waste
              wasteModal={wasteModal}
              showModal={showWasteModal}
              setWasteModal={setWasteModal}
              addWaste={() => {}}
              styles={styles}
              ThemeColors={ThemeColors}
            />
          ))}
          {mixedData.map((data) => (
            <WasteButton
              key={data.id}
              data={data}
              wasteName="Seka"
              wasteModal={wasteModal}
              showModal={showWasteModal}
              setWasteModal={setWasteModal}
              addWaste={() => {}}
              styles={styles}
              ThemeColors={ThemeColors}
            />
          ))}
          {plasticData.map((data) => (
            <WasteButton
              key={data.id}
              data={data}
              wasteName="Muovi"
              wasteModal={wasteModal}
              showModal={showWasteModal}
              setWasteModal={setWasteModal}
              addWaste={() => {}}
              styles={styles}
              ThemeColors={ThemeColors}
            />
          ))}
          {cardboardData.map((data) => (
            <WasteButton
              key={data.id}
              data={data}
              wasteName="Pahvi"
              wasteModal={wasteModal}
              showModal={showWasteModal}
              setWasteModal={setWasteModal}
              addWaste={() => {}}
              styles={styles}
              ThemeColors={ThemeColors}
            />
          ))}
          {metalData.map((data) => (
            <WasteButton
              key={data.id}
              data={data}
              wasteName="Metalli"
              wasteModal={wasteModal}
              showModal={showWasteModal}
              setWasteModal={setWasteModal}
              addWaste={() => {}}
              styles={styles}
              ThemeColors={ThemeColors}
            />
          ))}
          {glassData.map((data) => (
            <WasteButton
              key={data.id}
              data={data}
              wasteName="Lasi"
              wasteModal={wasteModal}
              showModal={showWasteModal}
              setWasteModal={setWasteModal}
              addWaste={() => {}}
              styles={styles}
              ThemeColors={ThemeColors}
            />
          ))}
        </View>
        <View style={styles.wasteTotal}>
          <Text style={{ ...styles.text }}>Kuukausi yhteensä: {}</Text>
          {initialWasteList.map((doc) => (
            <Text key={doc.id} style={{ ...styles.text }}>
              {doc.id}: {doc.määrä}
              kg
            </Text>
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <BackButton />
        </View>
      </View>
    );
  }
}
