import React from "react";
import { Text, View, Modal, TouchableWithoutFeedback, FlatList } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/ThemeColors";
import { getKevinModalStyles } from "@/styles/components/kevinModalStyle";

interface KevinModalProps {
  modalVisible: boolean;
  onClose: () => void;
}

export default function KevinModal({ modalVisible, onClose }: KevinModalProps) {
  const ThemeColors = useThemeColors();
  const styles = getKevinModalStyles(ThemeColors);

  const tasks = [
    {
      name: "Sepi",
      date: "12.3.2025",
      completed: true,
      id: "1",
    },
    {
      name: "Sepi",
      date: "12.3.2025",
      completed: true,
      id: "2",
    },
    {
      name: "Sepi",
      date: "12.3.2025",
      completed: true,
      id: "3",
    },
  ];

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      {" "}
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.header}>Pihvikoneen pesu</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  label="Tekijä"
                  mode="outlined"
                  style={styles.input}
                />
                <TextInput
                  label="Päivämäärä"
                  mode="outlined"
                  style={styles.input}
                />
                {/* <View style={{ flexDirection: "column" }}>
                  <Text style={styles.checkboxLabel}>Pesty</Text>
                  <Checkbox status="checked" onPress={() => {}} />
                </View> */}
              </View>
              <View style={styles.tasksContainer}>
                <FlatList
                    data={tasks}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={styles.task} key={item.id}>
                            <Text style={styles.taskText}>{item.name}</Text>
                            <Text style={styles.taskText}>{item.date}</Text>
                            <MaterialCommunityIcons
                            name="checkbox-marked"
                            size={24}
                            color={ThemeColors.text}
                            />
                        </View>
                        )}
                />
              </View>
              <Button
                children="Tallenna"
                onPress={onClose}
                style={styles.closeButton}
                labelStyle={styles.closeButtonText}
              />
              <Button
                children="Sulje"
                onPress={onClose}
                style={styles.closeButton}
                labelStyle={styles.closeButtonText}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
}
