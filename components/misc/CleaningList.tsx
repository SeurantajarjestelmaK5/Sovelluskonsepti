import React from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";

interface Task {
  name: string;
  completed: boolean;
  date: string;
}

interface DisplayTasksProps {
  kitchenTasksSunday: Task[];
  kitchenTasksTuesday: Task[];
  kitchenTasksWednesday: Task[];
  diningRoomTasks: Task[];
  selectedSide: string;
  toggleTaskCompletion: (day: string, taskName: string) => void; // Callback to toggle completion
}

const DisplayTasks: React.FC<DisplayTasksProps> = ({
  kitchenTasksSunday,
  kitchenTasksTuesday,
  kitchenTasksWednesday,
  diningRoomTasks,
  selectedSide,
  toggleTaskCompletion,
}) => {
  const renderTask = (task: Task, day: string) => (
    <TouchableOpacity
      onPress={() => toggleTaskCompletion(day, task.name)}
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

  return (
    <View style={styles.container}>
      {selectedSide === "Keittiö" ? (
        <>
          <Text style={styles.header}>Sunday Tasks</Text>
          <FlatList
            data={kitchenTasksSunday}
            keyExtractor={(item, index) => `sunday-${index}`}
            renderItem={({ item }) => renderTask(item, "sunday")}
          />

          <Text style={styles.header}>Tuesday Tasks</Text>
          <FlatList
            data={kitchenTasksTuesday}
            keyExtractor={(item, index) => `tuesday-${index}`}
            renderItem={({ item }) => renderTask(item, "tuesday")}
          />

          <Text style={styles.header}>Wednesday Tasks</Text>
          <FlatList
            data={kitchenTasksWednesday}
            keyExtractor={(item, index) => `wednesday-${index}`}
            renderItem={({ item }) => renderTask(item, "wednesday")}
          />
        </>
      ) : (
        <>
          <Text style={styles.header}>Dining Room Tasks</Text>
          <FlatList
            data={diningRoomTasks}
            keyExtractor={(item, index) => `dining-${index}`}
            renderItem={({ item }) => renderTask(item, "all")}
          />
        </>
      )}
    </View>
  );
};

export default DisplayTasks;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  taskItem: {
    padding: 10,
    marginVertical: 5,
    borderRadius: 5,
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ccc",
  },
  taskCompleted: {
    backgroundColor: "#d4edda",
    borderColor: "#c3e6cb",
  },
  taskName: {
    fontSize: 16,
  },
  taskDate: {
    fontSize: 12,
    color: "#555",
  },
});
