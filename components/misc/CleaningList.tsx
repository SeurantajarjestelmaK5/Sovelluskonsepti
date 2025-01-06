import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useThemeColors } from "@/constants/ThemeColors";
import { getCleaningListStyles } from "@/styles/monitoring/cleaningListStyles";
import SmallLoadingIndicator from "./SmallLoadingIncidator";

interface Task {
  name: string;
  completed: boolean;
  date: string;
  id: string;
}

interface DisplayTasksProps {
  kitchenTasksSunday: Task[];
  kitchenTasksTuesday: Task[];
  kitchenTasksWednesday: Task[];
  diningRoomTasks: Task[];
  selectedSide: string;
  isLoading: boolean;
  toggleTaskCompletion: (day: string, taskName: string) => void; // Callback to toggle completion
}

const DisplayTasks: React.FC<DisplayTasksProps> = ({
  kitchenTasksSunday,
  kitchenTasksTuesday,
  kitchenTasksWednesday,
  diningRoomTasks,
  selectedSide,
  isLoading,
  toggleTaskCompletion,
}) => {
  const ThemeColors = useThemeColors();
  const styles = useMemo(
    () => getCleaningListStyles(ThemeColors),
    [ThemeColors]
  );
  
  const renderTask = (task: Task, day: string) => (
    <TouchableOpacity
      onPress={() => toggleTaskCompletion(day, task.id)} // Use task.id instead of task.name
      style={[
        styles.taskItem,
        task.completed && styles.taskCompleted, // Highlight if completed
      ]}
    >
      <Text style={styles.taskName}>{task.name}</Text>
      <Text style={styles.taskDate}>
        {task.completed ? `Completed on: ${task.date}` : "Not Completed"}
      </Text>
    </TouchableOpacity>
  );
  
  if (isLoading) {
    return <SmallLoadingIndicator />;
  }

  return (
    <View style={styles.container}>
      {selectedSide === "Keittiö" ? (
        <>
          <Text style={styles.header}>Sunnuntai</Text>
          <FlatList
            data={kitchenTasksSunday}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderTask(item, "sunday")}
          />

          <Text style={styles.header}>Tiistai</Text>
          <FlatList
            data={kitchenTasksTuesday}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderTask(item, "tuesday")}
          />

          <Text style={styles.header}>Keskiviikko</Text>
          <FlatList
            data={kitchenTasksWednesday}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderTask(item, "wednesday")}
          />
        </>
      ) : (
        <>
          <Text style={styles.header}>Siivoukset</Text>
          <FlatList
            data={diningRoomTasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderTask(item, "all")}
          />
        </>
      )}
    </View>
  );
};

export default DisplayTasks;
