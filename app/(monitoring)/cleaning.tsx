import React, { useEffect, useMemo, useState } from "react";
import { Link } from "expo-router";
import { Pressable, Text, View, FlatList } from "react-native";
import { Button } from "react-native-paper";
import BackButton from "@/components/buttons/BackButton";
import AntDesign from "@expo/vector-icons/AntDesign";

import { useThemeColors } from "@/constants/ThemeColors";
import { getCleaningStyles } from "@/styles/monitoring/cleaningStyles";
import * as CleaningFunctions from "@/components/functions/CleaningFunctions";
import DisplayTasks from "@/components/misc/CleaningList";
import LoadingScreen from "@/components/misc/LoadingScreen";

interface Task {
  name: string;
  completed: boolean;
  date: string;
  id: string;
}

export default function Cleaning() {
  const [year, setYear] = useState<string>("");
  const [month, setMonth] = useState<string>("");
  const [startOfWeek, setStartOfWeek] = useState<string>("");
  const [endOfWeek, setEndOfWeek] = useState<string>("");
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedSide, setSelectedSide] = useState("Keittiö");
  const [loading, setLoading] = useState<boolean>(false);
  const [diningRoomTasks, setDiningRoomTasks] = useState<Task[]>([]);
  const [kitchenTasksSunday, setKitchenTasksSunday] = useState<Task[]>([]);
  const [kitchenTasksTuesday, setKitchenTasksTuesday] = useState<Task[]>([]);
  const [kitchenTasksWednesday, setKitchenTasksWednesday] = useState<Task[]>(
    []
  );

  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getCleaningStyles(ThemeColors), [ThemeColors]);

  const propWeek = startOfWeek + "-" + endOfWeek;

  useEffect(() => {
    updateWeekRange(currentDate);
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

 const toggleTaskCompletion = async (day: string, taskId: string) => {
   try {
     const tasks = {
       sunday: kitchenTasksSunday,
       tuesday: kitchenTasksTuesday,
       wednesday: kitchenTasksWednesday,
       all: diningRoomTasks,
     }[day];

     if (!tasks) return;
     const taskIndex = tasks.findIndex((task) => task.id === taskId);
     if (taskIndex === -1) return;

     const task = tasks[taskIndex];
     const newCompletionStatus = !task.completed;

     await CleaningFunctions.toggleTaskCompletionInFirestore(
       selectedSide === "Keittiö" ? "keittiö" : "sali",
       year,
       month,
       propWeek,
       day === "all" ? null : day, 
       taskId,
       newCompletionStatus
     );

     // Update state locally for immediate feedback
     const updatedTasks = [...tasks];
     updatedTasks[taskIndex] = {
       ...task,
       completed: newCompletionStatus,
       date: new Date().toLocaleString(),
     };

     if (day === "sunday") setKitchenTasksSunday(updatedTasks);
     else if (day === "tuesday") setKitchenTasksTuesday(updatedTasks);
     else if (day === "wednesday") setKitchenTasksWednesday(updatedTasks);
     else if (day === "all") setDiningRoomTasks(updatedTasks); 
   } catch (error) {
     console.error("Error toggling task completion:", error);
   }
 };

  useEffect(() => {
    const checkAndPopulateDefaults = async () => {
      const dataExists = await CleaningFunctions.checkAndPopulateDefaults(
        selectedSide === "Keittiö" ? "keittiö" : "sali",
        year,
        month,
        propWeek
      );
    };
    checkAndPopulateDefaults();
  }, [propWeek, selectedSide]);

  useEffect(() => {
    const fetchAndPopulateTasks = async () => {
      setLoading(true);
      try {
        const sideKey = selectedSide === "Keittiö" ? "keittiö" : "sali";

        // Ensure defaults are populated
        const isPopulated = await CleaningFunctions.checkAndPopulateDefaults(
          sideKey,
          year,
          month,
          propWeek
        );

        // Now fetch tasks
        const tasks = await CleaningFunctions.fetchTasksBySideAndWeek(
          sideKey,
          year,
          month,
          propWeek
        );

        // Update state based on the side
        if (selectedSide === "Keittiö") {
          setKitchenTasksSunday(
            Array.isArray(tasks?.sunday) ? tasks.sunday : []
          );
          setKitchenTasksTuesday(
            Array.isArray(tasks?.tuesday) ? tasks.tuesday : []
          );
          setKitchenTasksWednesday(
            Array.isArray(tasks?.wednesday) ? tasks.wednesday : []
          );
        } else if (selectedSide === "Sali") {
          setDiningRoomTasks(Array.isArray(tasks?.dining) ? tasks.dining : []);
        }
      } catch (error) {
        console.error("Error fetching or populating tasks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAndPopulateTasks();
  }, [selectedSide, propWeek]);


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
        <DisplayTasks
          kitchenTasksSunday={kitchenTasksSunday}
          kitchenTasksTuesday={kitchenTasksTuesday}
          kitchenTasksWednesday={kitchenTasksWednesday}
          diningRoomTasks={diningRoomTasks}
          selectedSide={selectedSide}
          toggleTaskCompletion={toggleTaskCompletion}
          isLoading={loading}
        />
      </View>
      <View style={styles.buttonContainer}>
        <BackButton />
      </View>
    </View>
  );
}
