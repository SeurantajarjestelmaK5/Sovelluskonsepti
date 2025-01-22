import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
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
    // const { checkedFirst, setCheckedFirst } = useState(false);
    // const { checkedSecond, setCheckedSecond } = useState(false);
    // const { checkedThird, setCheckedThird } = useState(false);

  const renderTask = (task: Task, day: string) => {

    
    if (task.name === "Tiskikone") {
      return (
        <TouchableOpacity
          onPress={() => toggleTaskCompletion(day, task.id)}
          style={[styles.taskItemWashing, task.completed && styles.taskCompleted]}
        >
          <View>
            <Text style={styles.taskName}>{task.name}</Text>
            <Text
              style={[styles.taskDate, task.completed && { color: "black" }]}
            >
              {task.completed ? `Siivottu: ${task.date}` : "Ei siivottu"}
            </Text>
          </View>

          <View style={styles.radioButtonContainer}>
            <Checkbox
              status={task.completed ? "checked" : "unchecked"}
              onPress={() => toggleTaskCompletion(day, task.id)}
              uncheckedColor={ThemeColors.text}
              color="white"
            />
            <Checkbox
              status={task.completed ? "checked" : "unchecked"}
              onPress={() => toggleTaskCompletion(day, task.id)}
              uncheckedColor={ThemeColors.text}
              color="white"
            />
            <Checkbox
              status={task.completed ? "checked" : "unchecked"}
              onPress={() => toggleTaskCompletion(day, task.id)}
              uncheckedColor={ThemeColors.text}
              color="white"
            />
          </View>

        </TouchableOpacity>
      );
    }

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
  };
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
