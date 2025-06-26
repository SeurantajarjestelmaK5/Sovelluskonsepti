import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import { useThemeColors } from "@/constants/ThemeColors";
import { getWashingTempStyles } from "@/styles/views/washingMachineTempStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, TextInput } from "react-native-paper";
import * as TemperatureFunctions from "@/components/functions/TemperatureFunctions";
import CalendarComponent from "@/components/modals/CalendarComponent";
import WMTemps from "./components/WMTemps";

export default function WashingMachineTemperatures() {
  const ThemeColors = useThemeColors();
  const styles = getWashingTempStyles(ThemeColors);
  const [currentDate, setCurrentDate] = useState("");
  const [currentMonth, setCurrentMonth] = useState("");
  const [currentYear, setCurrentYear] = useState("");
  const [washTemp, setWashTemp] = useState("");
  const [rinseTemp, setRinseTemp] = useState("");
  const [calendarModal, setCalendarModal] = useState(false);
  

  // State to trigger re-render of WMTemps
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString();
    setCurrentDate(day);
    setCurrentMonth(month);
    setCurrentYear(year);
  }, []);

  const saveButtonHandler = async () => {
    Keyboard.dismiss();

    if (!washTemp || !rinseTemp) {
      Alert.alert("Virhe", "Täytä kaikki kentät ennen tallentamista.");
      return;
    }
    const data = {
      Pesuvesi: parseFloat(washTemp),
      Huuhteluvesi: parseFloat(rinseTemp),
      Pvm: `${currentDate}.${currentMonth}`,
    };
    try {
      await TemperatureFunctions.saveItem(
        "Tiskikone",
        currentYear,
        currentMonth,
        data
      );
      setRefreshKey((prevKey) => prevKey + 1);
    } catch (error) {
      console.error("Error saving data:", error);
      Alert.alert("Virhe", "Tallennus epäonnistui.");
    }
    setWashTemp("");
    setRinseTemp("");
  };

  const handleDayPress = (day: any) => {
    const [year, month, date] = day.dateString.split("-");
    setCurrentDate(date);
    setCurrentMonth(month);
    setCurrentYear(year);
    setCalendarModal(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.icon}>
          <MaterialCommunityIcons
            color={ThemeColors.text}
            name="chart-bubble"
            size={43}
          />
          <Text style={styles.iconLabel}>Pesuvesi (°C)</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            activeOutlineColor={ThemeColors.tint}
            value={washTemp}
            onChangeText={(text) => setWashTemp(text)}
          />
        </View>
        <View style={styles.icon}>
          <MaterialCommunityIcons
            color={ThemeColors.text}
            name="water"
            size={43}
          />
          <Text style={styles.iconLabel}>Huuhteluvesi (°C)</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            activeOutlineColor={ThemeColors.tint}
            value={rinseTemp}
            onChangeText={(text) => setRinseTemp(text)}
          />
        </View>
        <View style={styles.icon}>
          <MaterialCommunityIcons
            color={ThemeColors.text}
            name="calendar"
            size={43}
          />
          <Text style={styles.iconLabel}>Päivämäärä</Text>
          <Button
            children={`${currentDate}.${currentMonth}`}
            mode="contained"
            style={styles.calendarButton}
            labelStyle={{ fontSize: 17, color: "black" }}
            onPress={() => setCalendarModal(true)}
          />
        </View>
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
      <Button
        children="Tallenna"
        mode="contained"
        style={styles.saveButton}
        labelStyle={{ fontSize: 17 }}
        onPress={saveButtonHandler}
      />

      
      <WMTemps
        day={currentDate}
        month={currentMonth}
        year={currentYear}
        refreshKey={refreshKey} // Pass refreshKey as a prop
      />
    </View>
  );
}