import React, { useState } from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";
import AntDesign from "@expo/vector-icons/AntDesign";
const WeekView = () => {
  const [currentWeek, setCurrentWeek] = useState(getCurrentWeek());

  function getCurrentWeek() {
    const today = new Date();
    return getWeekRange(today);
  }

  function getWeekRange(date: Date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1); // Monday
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6); // Sunday
    return { startOfWeek, endOfWeek };
  }

  function formatDate(date: Date) {
    return date.toISOString().split("T")[0]; // Format: YYYY-MM-DD
  }

  function handleWeekChange(direction: "prev" | "next") {
    const { startOfWeek } = currentWeek;
    const newStartOfWeek = new Date(startOfWeek);
    newStartOfWeek.setDate(
      newStartOfWeek.getDate() + (direction === "next" ? 7 : -7)
    );
    setCurrentWeek(getWeekRange(newStartOfWeek));
  }

  const { startOfWeek, endOfWeek } = currentWeek;

  const markedDates: { [key: string]: { selected: boolean; marked: boolean; selectedColor: string } } = {};
  let currentDate = new Date(startOfWeek);
  while (currentDate <= endOfWeek) {
    markedDates[formatDate(currentDate)] = {
      selected: true,
      marked: false,
      selectedColor: "#00adf5",
    };
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return (
    <View style={styles.container}>
      <View style={styles.weekHeader}>
        <AntDesign
          name="caretleft"
          size={24}
          color="#007AFF"
          onPress={() => handleWeekChange("prev")}
        />
        <Text style={styles.weekText}>
          Week {startOfWeek.toLocaleDateString()} -{" "}
          {endOfWeek.toLocaleDateString()}
        </Text>
        <AntDesign
          name="caretright"
          size={24}
          color="#007AFF"
          onPress={() => handleWeekChange("next")}
        />
      </View>

      <Calendar
        markedDates={markedDates}
        hideExtraDays
        onDayPress={(day: { dateString: string; day: number; month: number; year: number }) => {
          console.log("Selected day:", day);
        }}
        theme={{
          selectedDayBackgroundColor: "#00adf5",
          todayTextColor: "#00adf5",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  weekHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  weekText: {
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WeekView;
