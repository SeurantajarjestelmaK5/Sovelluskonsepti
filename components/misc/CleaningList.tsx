import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator
} from "react-native";
import { Checkbox } from "react-native-paper";
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

 
  const renderTask = (task: Task, day: string) => {
    if (isLoading) {
      return (
        <TouchableOpacity
          onPress={() => toggleTaskCompletion(day, task.id)}
          style={[styles.taskItem, task.completed && styles.taskCompleted]}
        >
          <Text style={styles.taskName}>{task.name}</Text>
          <Text style={[styles.taskDate, task.completed && { color: "black" }]}>
            {task.completed ? `Siivottu: ${task.date}` : "Ei siivottu"}
          </Text>
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity
        onPress={() => toggleTaskCompletion(day, task.id)}
        style={[styles.taskItem, task.completed && styles.taskCompleted ]}
      >
        <Text style={styles.taskName}>{task.name}</Text>
        <Text style={[styles.taskDate, task.completed && { color: "black" }]}>
          {task.completed ? `Siivottu: ${task.date}` : "Ei siivottu"}
        </Text>
      </TouchableOpacity>
    );
  };

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

          {/* Render Washing Machine Tasks in a Row */}
          <View style={[styles.taskRowContainer, { flexDirection: "row" }]}>
            {diningRoomTasks
              .filter((task) =>
                ["Tiskikone - KE", "Tiskikone - PE", "Tiskikone - SU"].includes(
                  task.name
                )
              )
              .map((task) => (
                <TouchableOpacity
                  key={task.id}
                  onPress={() => toggleTaskCompletion("all", task.id)}
                  style={[
                    styles.taskItemWashing,
                    task.completed && styles.taskCompleted,
                  ]}
                >
                  <View>
                    <Text style={styles.taskName}>{task.name}</Text>
                    <Text
                      style={[
                        styles.taskDate,
                        task.completed && { color: "black" },
                      ]}
                    >
                      {task.completed
                        ? `Siivottu: ${task.date}`
                        : "Ei siivottu"}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
          </View>

          {/* Render Remaining Tasks */}
          <FlatList
            data={diningRoomTasks.filter(
              (task) =>
                ![
                  "Tiskikone - KE",
                  "Tiskikone - PE",
                  "Tiskikone - SU",
                ].includes(task.name)
            )}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => renderTask(item, "all")}
          />
        </>
      )}
    </View>
  );
};

export default DisplayTasks;
