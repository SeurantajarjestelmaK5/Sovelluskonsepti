import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
  Pressable,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { Button, TextInput } from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/ThemeColors";
import { getKevinModalStyles } from "@/styles/components/kevinModalStyle";
import * as CleaningFunctions from "@/components/functions/CleaningFunctions";
import KevinSamples from "./components/KevinSamples";

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
  const [activeTab, setActiveTab] = useState("cleaning");

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
      // Sort tasks by date in descending order (newest first)
      const sortedTasks = tasks.sort((a, b) => {
        // Parse dates in DD.MM.YYYY format
        const [dayA, monthA, yearA] = a.date.split(".").map(Number);
        const [dayB, monthB, yearB] = b.date.split(".").map(Number);

        // Create Date objects for comparison
        const dateA = new Date(yearA, monthA - 1, dayA);
        const dateB = new Date(yearB, monthB - 1, dayB);

        // Sort in descending order (newest first)
        return dateB.getTime() - dateA.getTime();
      });
      setTasks(sortedTasks);
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
          <View style={styles.tabContainer}>
            <Pressable
              style={
                activeTab === "cleaning"
                  ? {
                      ...styles.tabButtonActive,
                      borderTopLeftRadius: 10,
                      borderTopRightRadius: 10,
                      borderRightWidth: 1,
                      borderTopWidth: 1,
                      borderColor: "grey",
                    }
                  : {
                      ...styles.tabButton,
                      borderTopLeftRadius: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: "grey",
                    }
              }
              onPress={() => setActiveTab("cleaning")}
            >
              <Text
                style={{
                  ...styles.tabHeader,
                  color:
                    activeTab === "cleaning"
                      ? ThemeColors.tint
                      : ThemeColors.text,
                }}
              >
                Pihvikoneen pesu
              </Text>
            </Pressable>
            <Pressable
              style={
                activeTab === "samples"
                  ? {
                      ...styles.tabButtonActive,
                      borderTopRightRadius: 10,
                      borderTopLeftRadius: 10,
                      borderLeftWidth: 1,
                      borderTopWidth: 1,
                      borderColor: "grey",
                    }
                  : {
                      ...styles.tabButton,
                      borderTopRightRadius: 10,
                      borderBottomWidth: 1,
                      borderBottomColor: "grey",
                    }
              }
              onPress={() => setActiveTab("samples")}
            >
              <Text
                style={{
                  ...styles.tabHeader,
                  color:
                    activeTab === "samples"
                      ? ThemeColors.tint
                      : ThemeColors.text,
                }}
              >
                Pihvinäytteet
              </Text>
            </Pressable>
          </View>

          {activeTab === "cleaning" && (
            <>
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
            </>
          )}
          {activeTab === "samples" && (
            <KevinSamples />
          )}
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
