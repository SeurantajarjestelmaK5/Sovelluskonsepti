import { useMemo, useEffect, useState } from "react";
import {
  Text,
  View,
  Image,
  Dimensions,
  Pressable,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import CalendarComponent from "@/components/CalendarComponent";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import BackButton from "@/components/BackButton";
import { db } from "@/firebase/config.js";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  getDoc,
  setDoc,
  serverTimestamp,
} from "firebase/firestore";
import LoadingScreen from "@/components/LoadingScreen";

import { useThemeColors } from "@/constants/ThemeColors";
import { useColorScheme } from "react-native";
import { getWasteStyles } from "@/styles/monitoring/wasteStyles";
import { TextInput, Button, Icon } from "react-native-paper";

interface WasteData {
  id: string;
  yksikkö: string;
  määrä: number;
}

export default function waste() {
  const [docData, setDocData] = useState<WasteData[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [date, setDate] = useState("");
  const [calendarModal, setCalendarModal] = useState(false);
  const [wasteModal, setWasteModal] = useState(false);
  const [dateList, setDateList] = useState<string[]>([]);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [wasteAmount, setWasteAmount] = useState<number>(0);

  const ThemeColors = useThemeColors();
  const colorScheme = useColorScheme();
  const styles = useMemo(() => getWasteStyles(ThemeColors), [ThemeColors]);

  const handleDatePress = (day: any) => {
    const [year, month, dayOfMonth] = day.dateString.split("-");
    const formattedDate = `${dayOfMonth}.${month}.${year}`;
    setDate(formattedDate);
    setSelectedDate(day.dateString);
    setTimeout(() => setCalendarModal(false), 50);
  };

  const showWasteModal = (docId: string) => {
    setSelectedDocId(docId);
    setWasteModal(true);
  };

  const initialWasteList = [
    { id: "Bio", yksikkö: "g", määrä: 0 },
    { id: "Muovi", yksikkö: "g", määrä: 0 },
    { id: "Pahvi", yksikkö: "g", määrä: 0 },
    { id: "Seka", yksikkö: "g", määrä: 0 },
    { id: "Metalli", yksikkö: "g", määrä: 0 },
    { id: "Lasi", yksikkö: "g", määrä: 0 },
  ];

  useEffect(() => {
    const getCurrentDate = () => {
      const date = new Date();
      const day = date.getDate();
      const month = date.getMonth() + 1;
      const year = date.getFullYear();
      const currDate = `${day}.${month}.${year}`;
      setDate(currDate);
    };
    getCurrentDate();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const fetchAllDates = async () => {
      try {
        const querySnapshot = await getDocs(
          collection(db, "omavalvonta", "jätteet", "tallennetut")
        );
        const data: string[] = querySnapshot.docs.map((doc) => doc.id);
        setDateList(data);
      } catch (error) {
        console.error("Error getting documents: ", error);
      }
    };

    fetchAllDates();
    setIsLoading(false);
  }, [date]);

  const fetchWaste = async () => {
    if (!date) return;

    try {
      const querySnapshot = await getDocs(
        collection(db, "omavalvonta", "jätteet", date)
      );
      const data: WasteData[] = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      })) as WasteData[];
      setDocData(data);
    } catch (error) {
      console.error("Error getting documents: ", error);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchWaste();
    setIsLoading(false);
  }, [date]);

  const initializeWasteForDate = async () => {
    if (!date) return;

    try {
      const dateRef = collection(db, "omavalvonta", "jätteet", date);

      for (const waste of initialWasteList) {
        const wasteDocRef = doc(dateRef, waste.id);
        const wasteSnap = await getDoc(wasteDocRef);

        if (!wasteSnap.exists()) {
          await setDoc(wasteDocRef, {
            määrä: waste.määrä,
            yksikkö: waste.yksikkö,
          });
        }
      }

      fetchWaste();
    } catch (error) {
      console.error("Error initializing waste data: ", error);
    }
  };

  const addWaste = async (docId: string, amount: number) => {
    try {
      const docRef = collection(db, "omavalvonta", "jätteet", date);
      const docSnap = await getDoc(doc(docRef, docId));
      const dateRef = collection(db, "omavalvonta", "jätteet", "tallennetut");

      if (docSnap.exists()) {
        await updateDoc(doc(docRef, docId), {
          määrä: amount + docSnap.data().määrä,
        });
      } else {
        await setDoc(doc(docRef, docId), {
          määrä: amount,
          yksikkö: "g",
        });
      }

      await setDoc(doc(dateRef, date), {
        date: date,
      });

      initializeWasteForDate();
      setWasteModal(false);
      fetchWaste();
    } catch (error) {
      console.error("Error adding document: ", error);
    }
  };

  if (isLoading) {
    return <LoadingScreen />;
  } else {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>Jätteet</Text>
        <Pressable
          style={styles.calendar}
          onPress={() => setCalendarModal(!calendarModal)}
        >
          <Text style={styles.text}>{date}</Text>
          <MaterialCommunityIcons
            name="calendar"
            size={35}
            color={ThemeColors.tint}
          />
        </Pressable>
        {calendarModal && (
          <Modal
            visible={calendarModal}
            animationType="slide"
            transparent={true}
            onDismiss={() => setCalendarModal(false)}
          >
            <TouchableWithoutFeedback onPress={() => setCalendarModal(false)}>
              <View style={{ flex: 1 }}>
                <CalendarComponent
                  onDayPress={handleDatePress}
                  dataDates={dateList}
                  selectedDate={selectedDate}
                />
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        )}
        <View style={styles.content}>
          {!docData || docData.length === 0
            ? initialWasteList.map((doc) => (
                <View key={doc.id} style={styles.wasteContainer}>
                  <View style={styles.wasteContent}>
                    <Text style={styles.text}>{doc.id}</Text>
                    <Text style={styles.text}>
                      {doc.määrä}
                      {doc.yksikkö}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="plus"
                    size={35}
                    color={ThemeColors.tint}
                    onPress={() => showWasteModal(doc.id)}
                  />
                  <Modal
                    visible={wasteModal}
                    animationType="slide"
                    transparent={true}
                    onDismiss={() => setWasteModal(false)}
                  >
                    <TouchableWithoutFeedback
                      onPress={() => setWasteModal(false)}
                    >
                      <View style={styles.wasteModalContainer}>
                        <TouchableWithoutFeedback>
                          <View style={styles.wasteModal}>
                            {selectedDocId && (
                              <>
                                <Text style={styles.header}>
                                  {selectedDocId}
                                </Text>
                                <TextInput
                                  mode="outlined"
                                  style={styles.wasteInput}
                                  placeholder="Määrä"
                                  keyboardType="numeric"
                                  activeOutlineColor={ThemeColors.tint}
                                  onChangeText={(text) =>
                                    setWasteAmount(Number(text))
                                  }
                                />
                                <Button
                                  children="Lisää"
                                  icon={() => (
                                    <MaterialCommunityIcons
                                      name="plus"
                                      size={20}
                                    />
                                  )}
                                  contentStyle={{
                                    flexDirection: "row-reverse",
                                  }}
                                  mode="contained"
                                  buttonColor={ThemeColors.tint}
                                  onPress={() =>
                                    addWaste(selectedDocId, wasteAmount)
                                  }
                                />
                              </>
                            )}
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </TouchableWithoutFeedback>
                  </Modal>
                </View>
              ))
            : docData.map((doc) => (
                <View key={doc.id} style={styles.wasteContainer}>
                  <View style={styles.wasteContent}>
                    <Text style={styles.text}>{doc.id}</Text>
                    <Text style={styles.text}>
                      {doc.määrä}
                      {doc.yksikkö}
                    </Text>
                  </View>
                  <MaterialCommunityIcons
                    name="plus"
                    size={35}
                    color={ThemeColors.tint}
                    onPress={() => showWasteModal(doc.id)}
                  />
                  <Modal
                    visible={wasteModal}
                    animationType="slide"
                    transparent={true}
                    onDismiss={() => setWasteModal(false)}
                  >
                    <TouchableWithoutFeedback
                      onPress={() => setWasteModal(false)}
                    >
                      <View style={styles.wasteModalContainer}>
                        <TouchableWithoutFeedback>
                          <View style={styles.wasteModal}>
                            {selectedDocId && (
                              <>
                                <Text style={styles.header}>
                                  {selectedDocId}
                                </Text>
                                <TextInput
                                  mode="outlined"
                                  style={styles.wasteInput}
                                  placeholder="Määrä"
                                  keyboardType="numeric"
                                  activeOutlineColor={ThemeColors.tint}
                                  onChangeText={(text) =>
                                    setWasteAmount(Number(text))
                                  }
                                />
                                <Button
                                  children="Lisää"
                                  icon={() => (
                                    <MaterialCommunityIcons
                                      name="plus"
                                      size={20}
                                    />
                                  )}
                                  contentStyle={{
                                    flexDirection: "row-reverse",
                                  }}
                                  mode="contained"
                                  buttonColor={ThemeColors.tint}
                                  onPress={() =>
                                    addWaste(selectedDocId, wasteAmount)
                                  }
                                />
                              </>
                            )}
                          </View>
                        </TouchableWithoutFeedback>
                      </View>
                    </TouchableWithoutFeedback>
                  </Modal>
                </View>
              ))}
        </View>
        <View style={styles.buttonContainer}>
          <BackButton />
        </View>
      </View>
    );
  }
}
