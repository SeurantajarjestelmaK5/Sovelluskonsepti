import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button, TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/ThemeColors";
import { getKevinModalStyles } from "@/styles/components/kevinModalStyle";
import * as CleaningFunctions from "@/components/functions/CleaningFunctions";

interface KevinModalProps {
  modalVisible: boolean;
  onClose: () => void;
  year: string;
  month: string;
}

const authorList = ["Teemu", "Tony", "Lari", "Risto", "Milja", "Milla", "Sepi"];
const finnishMonths = [
  "Tammikuu",
  "Helmikuu",
  "Maaliskuu",
  "Huhtikuu",
  "Toukokuu",
  "Kesäkuu",
  "Heinäkuu",
  "Elokuu",
  "Syyskuu",
  "Lokakuu",
  "Marraskuu",
  "Joulukuu",
];

export default function KevinModal({
  modalVisible,
  onClose,
  year,
  month,
}: KevinModalProps) {
  const ThemeColors = useThemeColors();
  const styles = getKevinModalStyles(ThemeColors);
  const [tasks, setTasks] = useState<any[]>([]);
  const [taskAuthor, setTaskAuthor] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [propDate, setPropDate] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

const getParsedDate = (date: Date) => {
  const day = date.getDate();
  const month = date.getMonth() + 1; // Months are zero-based
  const year = date.getFullYear();
  const parsedDate = `${day}.${month}.${year}`;
  console.log(parsedDate);
  setPropDate(parsedDate);
};

  async function fetchTasks() {
    try {
      const tasks = await CleaningFunctions.fetchKevinTasks(year, month);
      setTasks(tasks);
    } catch (error) {
      console.error("Error fetching Kevin tasks:", error);
    }
  }

  const onDismissModal = () => {
    onClose();
    setTaskAuthor("");
  }


  useEffect(() => {
    if (month) {
      setFilterMonth(finnishMonths[parseInt(month) - 1]);
    }
    if (year) {
      setFilterYear(year);
    }
    getParsedDate(currentDate);
  }, [month, year]);

  useEffect(() => {
    fetchTasks();
  }, [year, month, taskAuthor]);

  // const chevronHandler = (direction: "left" | "right") => {
  //   if (direction === "left") {
  //   }
  // };

  const saveButtonHandler = async () => {
    if (!taskAuthor) {
      alert("Valitse tekijä valikosta ennen tallentamista.");
      return;
    }
    try {
      await CleaningFunctions.saveKevinTask(year, month, taskAuthor, propDate);
    } catch (error) {
      console.error("Error saving Kevin task:", error);
    }
    // setTaskAuthor("");
    fetchTasks();
  };

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onDismissModal}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              <Text style={styles.header}>Pihvikoneen pesu</Text>
              <View style={styles.inputContainer}>
                <Text style={styles.label}> Tekijä </Text>
                <Picker
                  selectedValue={taskAuthor}
                  onValueChange={(itemValue) => setTaskAuthor(itemValue)}
                  style={styles.picker}
                  mode="dropdown"
                  dropdownIconColor={ThemeColors.tint}
                >
                  {taskAuthor === "" && (
                    <Picker.Item label="Valitse tekijä" value="" />
                  )}
                  {authorList.map((author) => (
                    <Picker.Item
                      key={author}
                      label={author}
                      value={author}
                      style={styles.pickerItem}
                    />
                  ))}
                </Picker>
              </View>
              <Button
                children="Tallenna"
                onPress={saveButtonHandler}
                style={styles.closeButton}
                labelStyle={styles.closeButtonText}
              />
              <Text style={{ ...styles.label, marginTop: 40 }}>
                Tehdyt siivoukset:
              </Text>
              <View style={styles.tasksContainer}>
                {/* <View style={styles.dateFilterContainer}>
                  <MaterialCommunityIcons
                    name="chevron-left"
                    size={30}
                    color={ThemeColors.tint}
                    onPress={() => chevronHandler("left")}
                  />
                  <Text style={styles.label}>{filterMonth} {filterYear}</Text>
                  <MaterialCommunityIcons
                    name="chevron-right"
                    size={30}
                    color={ThemeColors.tint}
                    onPress={() => chevronHandler("right")}
                  />
                </View> */}
                <FlatList
                  data={tasks}
                  
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <View style={styles.task} key={item.id}>
                      <Text style={styles.taskText}>{item.author}</Text>
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
                children="Sulje"
                onPress={onDismissModal}
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
