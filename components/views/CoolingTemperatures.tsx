import React, { useEffect, useMemo, useState } from "react";
import { Alert, Text, View, Pressable, Modal } from "react-native";
import { useThemeColors } from "@/constants/ThemeColors";
import { getCoolingTempStyles } from "@/styles/views/coolingTempStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, TextInput } from "react-native-paper";
import CalendarComponent from "@/components/modals/CalendarComponent";
import * as TemperatureFunctions from "@/components/functions/TemperatureFunctions";
import CoolingDatalist from "@/components/views/components/CoolingDatalist";
import { serverTimestamp } from "firebase/firestore";


export default function CoolingTemperatures() {
  const ThemeColors = useThemeColors();
  const styles = getCoolingTempStyles(ThemeColors);
  const [calendarModal, setCalendarModal] = useState(false);
  const [currentDate, setCurrentDate] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [product, setProduct] = useState("");
  const [startTemp, setStartTemp] = useState("");
  const [endTemp, setEndTemp] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const [coolingTime, setCoolingTime] = useState("");
  const [startTime, setStartTime] = useState("");

  useEffect(() => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    setCurrentDate(day);
    setCurrentMonth(month);
    setCurrentYear(year);
  }, []);

  const handleDayPress = (day: any) => {
    const [year, month, date] = day.dateString.split("-");
    setCurrentDate(date);
    setCurrentMonth(month);
    setCurrentYear(year);
    setCalendarModal(false);
  };

  const saveButtonHandler = async () => {

    if (product === "" || startTemp === "") {
      Alert.alert("Lisää tuote ja alkulämpötila!");
      return;
    }
    const data = {
      product: product,
      startTemp: parseFloat(startTemp),
      endTemp: parseFloat(endTemp),
      date: `${currentDate}.${currentMonth}`,
      startTime: serverTimestamp(),
    };
    try {
      await TemperatureFunctions.saveItem("Jäähdytys", currentYear, currentMonth, data);
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Virhe", "Tallennus epäonnistui.");
    }
    setProduct("");
    setStartTemp("");
    setEndTemp("");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputRow}>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="food-variant"
            color={ThemeColors.text}
            size={43}
          />
          <Text style={styles.label}>Tuote</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            activeOutlineColor={ThemeColors.tint}
            value={product}
            onChangeText={setProduct}
            textColor="black"
          />
        </View>
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="thermometer-chevron-up"
            color={ThemeColors.text}
            size={43}
          />
          <Text style={styles.label}>Alkulämpötila (°C)</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            activeOutlineColor={ThemeColors.tint}
            value={startTemp}
            onChangeText={setStartTemp}
            textColor="black"
          />
        </View>
        {/* <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            name="thermometer-chevron-down"
            color={ThemeColors.text}
            size={43}
          />
          <Text style={styles.label}>Loppulämpötila (°C)</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            activeOutlineColor={ThemeColors.tint}
            value={endTemp}
            onChangeText={setEndTemp}
          />
        </View> */}
        <View style={styles.inputContainer}>
          <MaterialCommunityIcons
            color={ThemeColors.text}
            name="calendar"
            size={43}
          />
          <Text style={styles.label}>Päivämäärä</Text>
          <Button
            children={`${currentDate}.${currentMonth}`}
            mode="contained"
            style={styles.calendarButton}
            labelStyle={{ fontSize: 17, color: "black" }}
            onPress={() => setCalendarModal(true)}
          />
        </View>
        {calendarModal && (
          <Modal
            visible={calendarModal}
            animationType="slide"
            transparent={true}
            onDismiss={() => setCalendarModal(false)}
          >
            <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
              <Pressable
                style={{ flex: 1 }}
                onPress={() => setCalendarModal(false)}
              />
              <View
                style={{
                  position: "absolute",
                  top: "30%",
                  left: "10%",
                  right: "10%",
                }}
              >
                <CalendarComponent
                  onDayPress={handleDayPress}
                  dataDates={[]}
                  selectedDate={`${currentYear}-${currentMonth.padStart(
                    2,
                    "0"
                  )}-${currentDate.padStart(2, "0")}`}
                />
              </View>
            </View>
          </Modal>
        )}
      </View>
      <Button
        children="Tallenna"
        mode="contained"
        style={styles.saveButton}
        labelStyle={{ fontSize: 17 }}
        onPress={saveButtonHandler}
      />
      <CoolingDatalist
        month={currentMonth}
        year={currentYear}
        day={currentDate}
        refreshKey={refreshKey}
      />
    </View>
  );
}
