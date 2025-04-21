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
  const [monthIndex, setMonthIndex] = useState(month);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");

  const getParsedDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const parsedDate = `${day}.${month}.${year}`;
    setPropDate(parsedDate);
  };

  async function fetchTasks(year: string, month: string) {
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
  };

  const parseMonth = (index: string) => {
    return finnishMonths[parseInt(index) - 1];
  };


  useEffect(() => {
    if (month) {
      setFilterMonth(parseMonth(month));
    }
    if (year) {
      setFilterYear(year);
    }
    getParsedDate(currentDate);
  }, [month, year]);

useEffect(() => {

  fetchTasks(year, month);

  if (month) {
    setFilterMonth(parseMonth(month));
  }
  if (year) {
    setFilterYear(year);
  }
}, [year, month, taskAuthor]);

  const chevronHandler = (direction: "left" | "right") => {
    let monthIndex = finnishMonths.indexOf(filterMonth);
    let yearIndex = parseInt(filterYear);

    if (direction === "left") {
      monthIndex -= 1;
      if (monthIndex < 0) {
        monthIndex = 11;
        yearIndex -= 1;
      }
    } else if (direction === "right") {
      monthIndex += 1;
      if (monthIndex > 11) {
        monthIndex = 0;
        yearIndex += 1;
      }
    }
    setFilterMonth(finnishMonths[monthIndex]);
    setFilterYear(yearIndex.toString());
    fetchTasks(yearIndex.toString(), (monthIndex + 1).toString());
  };

 const saveButtonHandler = async () => {
   if (!taskAuthor) {
     alert("Valitse tekijä valikosta ennen tallentamista.");
     return;
   }

   // Dynamically calculate the correct month and year from propDate
   const [day, month, year] = propDate.split(".").map((value) => value.trim());

   try {
     await CleaningFunctions.saveKevinTask(year, month, taskAuthor, propDate);
   } catch (error) {
     console.error("Error saving Kevin task:", error);
   }

   setTaskAuthor("");
   fetchTasks(year, month); 
 };

  return (
    <Modal
      transparent={true}
      visible={modalVisible}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
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
            <View style={styles.dateFilterContainer}>
              <MaterialCommunityIcons
                name="chevron-left"
                size={30}
                color={ThemeColors.tint}
                onPress={() => chevronHandler("left")}
                hitSlop={30}
              />
              <Text style={styles.label}>
                {filterMonth} {filterYear}
              </Text>
              <MaterialCommunityIcons
                name="chevron-right"
                size={30}
                color={ThemeColors.tint}
                onPress={() => chevronHandler("right")}
                hitSlop={30}
              />
            </View>
            <View style={{ ...styles.flatlistContainer, height: 300 }}>
              <FlatList
                data={tasks}
                contentContainerStyle={styles.flatlist}
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                  <View style={styles.task} key={item.id}>
                    <Text style={[styles.taskText, { flex: 3 }]}>
                      {item.author}
                    </Text>
                    <Text
                      style={[
                        styles.taskText,
                        { flex: 4, textAlign: "center" },
                      ]}
                    >
                      {item.date}
                    </Text>
                    <MaterialCommunityIcons
                      name="checkbox-marked"
                      size={24}
                      color={ThemeColors.text}
                      style={{ flex: 2, textAlign: "right" }}
                    />
                  </View>
                )}
              />
            </View>
          </View>

          <Button
            children="Sulje"
            onPress={onDismissModal}
            style={styles.closeButton}
            labelStyle={styles.closeButtonText}
          />
        </View>
      </View>
    </Modal>
  );
}
