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
  const [chosenWaste, setChosenWaste] = useState<{
    name: string;
    visible: boolean;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(false);

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

  const showWasteModal = (wasteName: string) => {
    setChosenWaste({ name: wasteName, visible: true });
  };

  const hideWasteModal = () => {
    setChosenWaste(null); // Close modal
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
    setIsLoading(true);
    const getCurrentDate = () => {
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const fullDate = `${day}.${month}.${year}`;
      const currDate = `0${day}`;
      const currMonth = `${month}`;
      const currYear = `${year}`;
      setCalendarDate(fullDate);
      setDate(currDate);
      setMonth(currMonth);
      setYear(currYear);
      console.log(currDate);
    };
    getCurrentDate();
    setIsLoading(false);
  }, []);

useEffect(() => {
  const fetchAndSetWasteData = async () => {
    setIsFetching(true);

    // First fetch existing data
    const mixedWaste = await WasteFunctions.FetchMixedWaste(month, year, date);
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
    const metalWaste = await WasteFunctions.FetchMetalWaste(month, year, date);
    const glassWaste = await WasteFunctions.FetchGlassWaste(month, year, date);
    const bioWaste = await WasteFunctions.FetchBioWaste(month, year, date);

    // Check for missing data and insert defaults if necessary
    let shouldRefetch = false;

    if (bioWaste === null) {
      await WasteFunctions.AddWaste("Bio", month, year, date, 0);
      shouldRefetch = true;
    }
    if (mixedWaste === null) {
      await WasteFunctions.AddWaste("Seka", month, year, date, 0);
      shouldRefetch = true;
    }
    if (plasticWaste === null) {
      await WasteFunctions.AddWaste("Muovi", month, year, date, 0);
      shouldRefetch = true;
    }
    if (cardboardWaste === null) {
      await WasteFunctions.AddWaste("Pahvi", month, year, date, 0);
      shouldRefetch = true;
    }
    if (metalWaste === null) {
      await WasteFunctions.AddWaste("Metalli", month, year, date, 0);
      shouldRefetch = true;
    }
    if (glassWaste === null) {
      await WasteFunctions.AddWaste("Lasi", month, year, date, 0);
      shouldRefetch = true;
    }

    // Re-fetch data if defaults were added
    if (shouldRefetch) {
      setIsFetching(true); // Show loading while re-fetching
      const updatedMixedWaste = await WasteFunctions.FetchMixedWaste(
        month,
        year,
        date
      );
      const updatedPlasticWaste = await WasteFunctions.FetchPlasticWaste(
        month,
        year,
        date
      );
      const updatedCardboardWaste = await WasteFunctions.FetchCardboardWaste(
        month,
        year,
        date
      );
      const updatedMetalWaste = await WasteFunctions.FetchMetalWaste(
        month,
        year,
        date
      );
      const updatedGlassWaste = await WasteFunctions.FetchGlassWaste(
        month,
        year,
        date
      );
      const updatedBioWaste = await WasteFunctions.FetchBioWaste(
        month,
        year,
        date
      );

      setBioData(updatedBioWaste ? [updatedBioWaste] : []);
      setMixedData(updatedMixedWaste ? [updatedMixedWaste] : []);
      setPlasticData(updatedPlasticWaste ? [updatedPlasticWaste] : []);
      setCardboardData(updatedCardboardWaste ? [updatedCardboardWaste] : []);
      setMetalData(updatedMetalWaste ? [updatedMetalWaste] : []);
      setGlassData(updatedGlassWaste ? [updatedGlassWaste] : []);
    } else {
      // Update state if no re-fetch is necessary
      setBioData(bioWaste ? [bioWaste] : []);
      setMixedData(mixedWaste ? [mixedWaste] : []);
      setPlasticData(plasticWaste ? [plasticWaste] : []);
      setCardboardData(cardboardWaste ? [cardboardWaste] : []);
      setMetalData(metalWaste ? [metalWaste] : []);
      setGlassData(glassWaste ? [glassWaste] : []);
    }

    setIsFetching(false); // End loading
  };

  fetchAndSetWasteData();
}, [month, year, date]);

  useEffect(() => {
    const fetchDatesWithData = async () => {
      try {
        const dates = await WasteFunctions.FetchDatesWithData(month, year);
        setDateList(dates);
      } catch (error) {
        console.error("Error fetching waste data:", error);
      }
    };

    if (month && year) {
      fetchDatesWithData(); // Fetch only when month and year are valid
    }
  }, [month, year, date]);

  if (isLoading) {
    return <LoadingScreen />;
  }
  if (isFetching) {
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
        <SmallLoadingIndicator />
      </View>
    );
  }
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
            wasteName="Bio"
            wasteModal={chosenWaste?.name === "Bio" && chosenWaste?.visible}
            showModal={() => showWasteModal("Bio")}
            setWasteModal={hideWasteModal}
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
            wasteModal={chosenWaste?.name === "Seka" && chosenWaste?.visible}
            showModal={() => showWasteModal("Seka")}
            setWasteModal={hideWasteModal}
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
            wasteModal={chosenWaste?.name === "Muovi" && chosenWaste?.visible}
            showModal={() => showWasteModal("Muovi")}
            setWasteModal={hideWasteModal}
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
            wasteModal={chosenWaste?.name === "Pahvi" && chosenWaste?.visible}
            showModal={() => showWasteModal("Pahvi")}
            setWasteModal={hideWasteModal}
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
            wasteModal={chosenWaste?.name === "Metalli" && chosenWaste?.visible}
            showModal={() => showWasteModal("Metalli")}
            setWasteModal={hideWasteModal}
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
            wasteModal={chosenWaste?.name === "Lasi" && chosenWaste?.visible}
            showModal={() => showWasteModal("Lasi")}
            setWasteModal={hideWasteModal}
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
