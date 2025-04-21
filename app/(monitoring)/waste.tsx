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
  KeyboardAvoidingView,
  Platform,
  Keyboard,
} from "react-native";
import CalendarComponent from "@/components/modals/CalendarComponent";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackButton from "@/components/buttons/BackButton";
import WasteButton from "@/components/buttons/WasteButton";
import * as WasteFunctions from "@/components/functions/WasteFunctions";
import LoadingScreen from "@/components/misc/LoadingScreen";
import SmallLoadingIndicator from "@/components/misc/SmallLoadingIncidator";
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
  const [monthTotals, setMonthTotals] = useState({});
  const [chosenWaste, setChosenWaste] = useState<{
    name: string;
    visible: boolean;
  } | null>(null);
  const [showInKilograms, setShowInKilograms] = useState(true);
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

  const getCurrentDate = () => {
    const date = new Date();
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const fullDate = `${day}.${month}.${year}`;
    const currDate = `${day}`;
    const currMonth = month.toString().length === 1 ? `0${month}` : `${month}`;
    const currYear = `${year}`;
    setCalendarDate(fullDate);
    setDate(currDate);
    setMonth(currMonth);
    setYear(currYear);
    return fullDate;
  };

  useEffect(() => {
    getCurrentDate();
  }, []);

  const navigationHandler = (iconPressed: string) => {
      let newDay = parseInt(date, 10);
      let newMonth = parseInt(month, 10);
      let newYear = parseInt(year, 10);

      if (iconPressed === "left") {
        newDay -= 1;
        if (newDay < 1) {
          newMonth -= 1;
          if (newMonth < 1) {
            newMonth = 12;
            newYear -= 1;
          }
          newDay = new Date(newYear, newMonth, 0).getDate();
        }
      } else if (iconPressed === "right") {
        newDay += 1;
        const daysInMonth = new Date(newYear, newMonth, 0).getDate();
        if (newDay > daysInMonth) {
          newDay = 1;
          newMonth += 1;
          if (newMonth > 12) {
            newMonth = 1;
            newYear += 1;
          }
        }
      }

      // Format month and day to ensure two digits
      const formattedMonth = newMonth < 10 ? `0${newMonth}` : `${newMonth}`;
      const formattedDay = newDay < 10 ? `0${newDay}` : `${newDay}`;

      const newFullDate = `${formattedDay}.${formattedMonth}.${newYear}`;

      setDate(formattedDay);
      setMonth(formattedMonth);
      setYear(`${newYear}`);
      setCalendarDate(newFullDate);
      fetchAllWasteData();
  };

  const fetchAndSetWasteData = async (wasteName: string) => {
    const fetchWasteData = async (type: string) => {
      switch (type) {
        case "Bio":
          return WasteFunctions.FetchBioWaste(month, year, date);
        case "Muovi":
          return WasteFunctions.FetchPlasticWaste(month, year, date);
        case "Pahvi":
          return WasteFunctions.FetchCardboardWaste(month, year, date);
        case "Seka":
          return WasteFunctions.FetchMixedWaste(month, year, date);
        case "Metalli":
          return WasteFunctions.FetchMetalWaste(month, year, date);
        case "Lasi":
          return WasteFunctions.FetchGlassWaste(month, year, date);
        default:
          throw new Error(`Unknown waste type: ${type}`);
      }
    };

    const addDefaultWasteIfMissing = async (type: string) => {
      const wasteData = await fetchWasteData(type);
      if (wasteData === null) {
        await WasteFunctions.AddWaste(type, month, year, date, 0);
        const newWasteData = await fetchWasteData(type); // Fetch updated data immediately
        const setWasteData = {
          Bio: setBioData,
          Muovi: setPlasticData,
          Pahvi: setCardboardData,
          Seka: setMixedData,
          Metalli: setMetalData,
          Lasi: setGlassData,
        }[type];

        if (setWasteData) setWasteData(newWasteData ? [newWasteData] : []);
        return true;
      }
      return false;
    };

    await addDefaultWasteIfMissing(wasteName);
    const updatedWasteData = await fetchWasteData(wasteName);

    // Update the specific waste data immediately
    const setWasteData = {
      Bio: setBioData,
      Muovi: setPlasticData,
      Pahvi: setCardboardData,
      Seka: setMixedData,
      Metalli: setMetalData,
      Lasi: setGlassData,
    }[wasteName];

    if (setWasteData) setWasteData(updatedWasteData ? [updatedWasteData] : []);

    // Update monthly totals
    const monthTotal = await WasteFunctions.getMonthTotal(
      month,
      year,
      wasteName
    );
    setMonthTotals((prevTotals) => ({
      ...prevTotals,
      [wasteName]: monthTotal,
    }));
  };

  const fetchAllWasteData = async () => {

    const wasteTypes = ["Bio", "Muovi", "Pahvi", "Seka", "Metalli", "Lasi"];

    // Create promises for all fetch operations
    await Promise.all(
      wasteTypes.map((wasteType) => fetchAndSetWasteData(wasteType))
    );

  };

  useEffect(() => {
    if (!month || !year || !date || bioData.length === undefined) {
      return;
    }

    fetchAllWasteData();
  }, [month, year, date, bioData.length]);

  useEffect(() => {
    
    const fetchDatesWithData = async () => {
      try {
        const dates = await WasteFunctions.FetchDatesWithData(month, year);
        setDateList(dates);
      } catch (error) {
        console.error("Error fetching waste data:", error);
      }
    };

    if (month && year && date) {
      fetchDatesWithData(); // Fetch only when month and year are valid
    }
  }, [month, year, date]);


  return (

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0} // Adjust this offset based on headers
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
          <View style={styles.container}>
            <Text style={styles.header}>Jätteet</Text>
            <View style={styles.navigationContainer}>
              <Pressable hitSlop={30} onPress={() => navigationHandler("left")}>
                <MaterialCommunityIcons
                  name="chevron-left"
                  size={35}
                  color={ThemeColors.tint}
                />
              </Pressable>
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
              <Pressable
                hitSlop={30}
                onPress={() => navigationHandler("right")}
              >
                <MaterialCommunityIcons
                  name="chevron-right"
                  size={35}
                  color={ThemeColors.tint}
                />
              </Pressable>
            </View>
            {calendarModal && (
              <Modal
                visible={calendarModal}
                animationType="slide"
                transparent={true}
                onDismiss={() => setCalendarModal(false)}
              >
                <TouchableWithoutFeedback
                  onPress={() => setCalendarModal(false)}
                >
                  <View
                    style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)" }}
                  >
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
              {(bioData.length > 0
                ? bioData
                : Array(1).fill({ id: "dummy", name: "Loading..." })
              ).map((data, index) => (
                <WasteButton
                  key={data.id !== "dummy" ? data.id : `dummy-bio-${index}`}
                  data={data}
                  wasteName="Bio"
                  date={{ day: date, month: month, year: year }}
                  wasteModal={
                    chosenWaste?.name === "Bio" && chosenWaste?.visible
                  }
                  showModal={() => showWasteModal("Bio")}
                  setWasteModal={() => {
                    fetchAndSetWasteData("Bio");
                    hideWasteModal();
                  }}
                  addWaste={() => {
                    fetchAndSetWasteData("Bio");
                  }}
                  styles={styles}
                  ThemeColors={ThemeColors}
                  isLoading={data.id === "dummy"}
                />
              ))}

              {(mixedData.length > 0
                ? mixedData
                : Array(1).fill({ id: "dummy", name: "Loading..." })
              ).map((data, index) => (
                <WasteButton
                  key={data.id !== "dummy" ? data.id : `dummy-mixed-${index}`}
                  data={data}
                  wasteName="Seka"
                  date={{ day: date, month: month, year: year }}
                  wasteModal={
                    chosenWaste?.name === "Seka" && chosenWaste?.visible
                  }
                  showModal={() => showWasteModal("Seka")}
                  setWasteModal={hideWasteModal}
                  addWaste={() => {
                    fetchAndSetWasteData("Seka");
                  }}
                  styles={styles}
                  ThemeColors={ThemeColors}
                  isLoading={data.id === "dummy"}
                />
              ))}

              {(plasticData.length > 0
                ? plasticData
                : Array(1).fill({ id: "dummy", name: "Loading..." })
              ).map((data, index) => (
                <WasteButton
                  key={data.id !== "dummy" ? data.id : `dummy-plastic-${index}`}
                  data={data}
                  wasteName="Muovi"
                  date={{ day: date, month: month, year: year }}
                  wasteModal={
                    chosenWaste?.name === "Muovi" && chosenWaste?.visible
                  }
                  showModal={() => showWasteModal("Muovi")}
                  setWasteModal={hideWasteModal}
                  addWaste={() => {
                    fetchAndSetWasteData("Muovi");
                  }}
                  styles={styles}
                  ThemeColors={ThemeColors}
                  isLoading={data.id === "dummy"}
                />
              ))}

              {(cardboardData.length > 0
                ? cardboardData
                : Array(1).fill({ id: "dummy", name: "Loading..." })
              ).map((data, index) => (
                <WasteButton
                  key={
                    data.id !== "dummy" ? data.id : `dummy-cardboard-${index}`
                  }
                  data={data}
                  wasteName="Pahvi"
                  date={{ day: date, month: month, year: year }}
                  wasteModal={
                    chosenWaste?.name === "Pahvi" && chosenWaste?.visible
                  }
                  showModal={() => showWasteModal("Pahvi")}
                  setWasteModal={hideWasteModal}
                  addWaste={() => {
                    fetchAndSetWasteData("Pahvi");
                  }}
                  styles={styles}
                  ThemeColors={ThemeColors}
                  isLoading={data.id === "dummy"}
                />
              ))}

              {(metalData.length > 0
                ? metalData
                : Array(1).fill({ id: "dummy", name: "Loading..." })
              ).map((data, index) => (
                <WasteButton
                  key={data.id !== "dummy" ? data.id : `dummy-metal-${index}`}
                  data={data}
                  wasteName="Metalli"
                  date={{ day: date, month: month, year: year }}
                  wasteModal={
                    chosenWaste?.name === "Metalli" && chosenWaste?.visible
                  }
                  showModal={() => showWasteModal("Metalli")}
                  setWasteModal={hideWasteModal}
                  addWaste={() => {
                    fetchAndSetWasteData("Metalli");
                  }}
                  styles={styles}
                  ThemeColors={ThemeColors}
                  isLoading={data.id === "dummy"}
                />
              ))}

              {(glassData.length > 0
                ? glassData
                : Array(1).fill({ id: "dummy", name: "Loading..." })
              ).map((data, index) => (
                <WasteButton
                  key={data.id !== "dummy" ? data.id : `dummy-glass-${index}`}
                  data={data}
                  wasteName="Lasi"
                  date={{ day: date, month: month, year: year }}
                  wasteModal={
                    chosenWaste?.name === "Lasi" && chosenWaste?.visible
                  }
                  showModal={() => showWasteModal("Lasi")}
                  setWasteModal={hideWasteModal}
                  addWaste={() => {
                    fetchAndSetWasteData("Lasi");
                  }}
                  styles={styles}
                  ThemeColors={ThemeColors}
                  isLoading={data.id === "dummy"}
                />
              ))}
            </View>

            <View>
            <Text style={{ ...styles.text }}>Kuukausi yhteensä:</Text>
            {Object.entries(monthTotals).map(([wasteType, total]) => (
              <Text key={wasteType} style={{ ...styles.text }}>
                {wasteType}:{" "}
                {showInKilograms
                  ? ((total as number) / 1000).toFixed(2)
                  : (total as number)}{" "}
                {showInKilograms ? "kg" : "g"}
              </Text>
            ))}
            <Button
              children={`Näytä ${showInKilograms ? "grammoina" : "kiloina"}`}
              icon={() => (
                <MaterialCommunityIcons name="scale-balance" size={20} />
              )}
              contentStyle={{ flexDirection: "row-reverse" }}
              mode="contained"
              buttonColor={ThemeColors.tint}
              onPress={() => setShowInKilograms((prev) => !prev)}
            />
          </View>

          <View style={styles.buttonContainer}>
            <BackButton />
          </View>
          </View>
        </TouchableWithoutFeedback>
      </KeyboardAvoidingView>

  );
}
