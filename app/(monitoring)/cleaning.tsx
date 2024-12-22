import React, { useEffect, useMemo, useState } from "react";
import { Link } from "expo-router";
import { Pressable, Text, View, FlatList } from "react-native";
import { Button } from "react-native-paper";
import BackButton from "@/components/buttons/BackButton";
import AntDesign from "@expo/vector-icons/AntDesign";

import { useThemeColors } from "@/constants/ThemeColors";
import { getCleaningStyles } from "@/styles/monitoring/cleaningStyles";
import * as CleaningFunctions from "@/components/functions/CleaningFunctions";

export default function Cleaning() {
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [startOfWeek, setStartOfWeek] = useState<string>("");
  const [endOfWeek, setEndOfWeek] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedSide, setSelectedSide] = useState("Keittiö");
  const [diningRoomTasks, setDiningRoomTasks] = useState<string[]>([]);
  const [kitchenTasksSunday, setKitchenTasksSunday] = useState<string[]>([]);
  const [kitchenTasksTuesday, setKitchenTasksTuesday] = useState<string[]>([]);
  const [kitchenTasksWednesday, setKitchenTasksWednesday] = useState<string[]>([]);

  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getCleaningStyles(ThemeColors), [ThemeColors]);

  const propWeek = startOfWeek + "-" + endOfWeek;

  useEffect(() => {
    updateWeekRange(currentDate);

    // CleaningFunctions.FetchCleaning(year, month, currWeek, day, side).then((data) => {
    //   if (data) {
    //     console.log(data);
    //   }
    // });
  }, [currentDate]);
  function updateWeekRange(date: Date) {
    const { startOfWeek, endOfWeek } = getWeekRange(date);

    // Formatter function
    const formatDate = (date: Date) => {
      const day = date.getDate();
      const month = date.getMonth() + 1;
      return `${day}.${month}.`;
    };

    // Format dates and update state
    setYear(startOfWeek.getFullYear().toString());
    setMonth((startOfWeek.getMonth() + 1).toString());
    setStartOfWeek(formatDate(startOfWeek));
    setEndOfWeek(formatDate(endOfWeek));
  }

  function handleSideChange(side: string) {
    if (side === "keittiö") {
      setSelectedSide("Keittiö");
    } else {
      setSelectedSide("Sali");
    }
  }

useEffect(() => {
  CleaningFunctions.CheckIfCleaningExists(
    selectedSide === "Keittiö" ? "keittiö" : "sali",
    year,
    month,
    propWeek
  ).then((data) => {
    if (data) {
      console.log("Cleaning exists");
    } else {
      console.log("Cleaning does not exist");

      // Fetch default tasks based on the selected side
      if (selectedSide === "Keittiö") {
        CleaningFunctions.FetchKitchenDefaults().then((defaults) => {
          console.log("Kitchen defaults: ", defaults);

          // Set state for kitchen tasks (days: sunday, tuesday, wednesday)
          setKitchenTasksSunday(defaults.sunday || []);
          setKitchenTasksTuesday(defaults.tuesday || []);
          setKitchenTasksWednesday(defaults.wednesday || []);
        });
      } else if (selectedSide === "Sali") {
        CleaningFunctions.FetchDiningRoomDefaults().then((defaults) => {
          console.log("Dining room defaults: ", defaults);

          // Assuming you have a single array for all tasks in the dining room
          setDiningRoomTasks(defaults || []);
        });
      }
    }
  });
}, [selectedSide, year, month, propWeek]);

  function getWeekRange(date: Date) {
    const startOfWeek = new Date(date);
    startOfWeek.setDate(date.getDate() - date.getDay() + 1);
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    return { startOfWeek, endOfWeek };
  }

  function handleWeekChange(offset: number) {
    const newDate = new Date(currentDate);
    newDate.setDate(currentDate.getDate() + offset);
    setCurrentDate(newDate);
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Viikkosiivous</Text>
        <View style={styles.weekCalendar}>
          <Pressable
            onPress={() => {
              handleWeekChange(-7);
              // CleaningFunctions.initializeWeekCleaning(
              //   year,
              //   month,
              //   propWeek,
              //   "Tiistai",
              //   selectedSide
              // );
            }}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <AntDesign name="caretleft" size={24} color={ThemeColors.tint} />
          </Pressable>
          <Text style={styles.text}>
            {startOfWeek} - {endOfWeek} {year}
          </Text>
          <Pressable
            onPress={() => handleWeekChange(7)}
            hitSlop={{ top: 10, right: 10, bottom: 10, left: 10 }}
          >
            <AntDesign name="caretright" size={24} color={ThemeColors.tint} />
          </Pressable>
        </View>

        <View style={styles.selectionContainer}>
          <Pressable
            onPress={() => {
              handleSideChange("keittiö");
            }}
            style={[
              styles.sideSelection,
              selectedSide === "Keittiö" && styles.selectedSide,
            ]}
          >
            <Text style={styles.text}>Keittiö</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              handleSideChange("sali");
            }}
            style={[
              styles.sideSelection,
              selectedSide === "Sali" && styles.selectedSide,
            ]}
          >
            <Text style={styles.text}>Sali</Text>
          </Pressable>
        </View>
        <View style={styles.container}>
          {selectedSide === "Keittiö" ? (
            <>
              {/* Kitchen Tasks */}
              <Text style={styles.header}>Sunday Tasks</Text>
              <FlatList
                data={kitchenTasksSunday}
                keyExtractor={(item, index) => `sunday-${index}`}
                renderItem={({ item }) => (
                  <Text >{item}</Text>
                )}
              />

              <Text style={styles.header}>Tuesday Tasks</Text>
              <FlatList
                data={kitchenTasksTuesday}
                keyExtractor={(item, index) => `tuesday-${index}`}
                renderItem={({ item }) => (
                  <Text>{item}</Text>
                )}
              />

              <Text style={styles.header}>Wednesday Tasks</Text>
              <FlatList
                data={kitchenTasksWednesday}
                keyExtractor={(item, index) => `wednesday-${index}`}
                renderItem={({ item }) => (
                  <Text >{item}</Text>
                )}
              />
            </>
          ) : (
            <>
              {/* Dining Room Tasks */}
              <Text style={styles.header}>Dining Room Tasks</Text>
              <FlatList
                data={diningRoomTasks}
                keyExtractor={(item, index) => `dining-${index}`}
                renderItem={({ item }) => (
                  <Text >{item}</Text>
                )}
              />
            </>
          )}
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <BackButton />
      </View>
    </View>
  );
}
