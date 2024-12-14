import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, KeyboardAvoidingView, Pressable, Text, View } from "react-native";
import BackButton from "@/components/buttons/BackButton";
import { useThemeColors } from "@/constants/ThemeColors";
import { getSampleStyles } from "@/styles/monitoring/sampleStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import YearMonthPickerModal from "@/components/modals/YearMonthPicker";
import AddSampleModal from "@/components/modals/CreateSampleModal";
import { collection,  deleteDoc,  doc,  getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import SmallLoadingIndicator from "@/components/misc/SmallLoadingIncidator";
import SampleInfoModal from "@/components/modals/SampleInfoModal";
export default function samples() {
  const [modalVisible, setModalVisible] = useState(false)
  const [sampleModalVisible, setSampleModalVisible] = useState(false)
  const [sampleInfoModalVisible, setSampleInfoModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [samplesData, setSamplesData] = useState<any[]>([])
  const [itemAdded, setItemAdded] = useState(false);
  const [selectedYear, setSelectedYear] = useState(() => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    return currentYear.toString()
  })
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getSampleStyles(ThemeColors), [ThemeColors]);

  const fetchData = async () => {
    setIsLoading(true)
    try {
      const itemRef = collection(db, "omavalvonta", "näytteenotto", selectedYear);
      const snapshot = await getDocs(itemRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));      
      setSamplesData(data)
      setIsLoading(false)
    } catch (e) {
    console.error("Error fetching data:", e)
  }
}
useEffect(() => {
  if (itemAdded) {
    fetchData().then(() => setItemAdded(false));
    return;
  }
  fetchData()
}, [selectedYear, itemAdded])

  const handleConfirm = (formattedDate: string) => {
    setSelectedYear(formattedDate);
    
    setModalVisible(false);
    setSampleModalVisible(false);
  };

  const handleSampleSend = async () => {
    setSampleModalVisible(false);
    setItemAdded(true)    
  }
const removeInventoryItem = async (item: any) => {
  try {
    const itemRef = doc(db, "omavalvonta", "näytteenotto", selectedYear, item.id);    
    await deleteDoc(itemRef); // Remove from Firebase
    await fetchData()
  } catch (error) {
    console.error("Error deleting inventory item:", error);
  }
};

  const confirmDeleteItem = (item: any) => {
    Alert.alert(
      "Poista kirjaus",
      `Haluatko varmasti poistaa kirjauksen kohteelle ${item.nayte} päiväyksellä ${item.date}?`,
      [
        { text: "Peruuta", style: "cancel" },
        { text: "Poista", style: "destructive", onPress: async () => {await removeInventoryItem(item);
        }}
      ],
      { cancelable: true }
    );
  };

  const renderSampleItem = ({item, index} : {item : any, index: number}) => {
    return (
    <View style={styles.tableRow} key={`${item.nayte}-${index}`}>
    <Text style={styles.text}>{item.date}</Text>
    <Text style={styles.text}>{item.nayte}</Text>
    <Text style={styles.text}>{item.tulos}</Text>
    <Text style={styles.text}>{item.arvio}</Text>
    <Text style={styles.text}>{item.toimenpiteet}</Text>
    <Pressable onPress={() => {confirmDeleteItem(item)}}>
      <MaterialCommunityIcons
        name="trash-can-outline"
        size={43}
        color={"#FF0000"}
      />
    </Pressable>
  </View>
  )
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pintapuhtausnäyte</Text>
     
        <View style={styles.content}>
          <Pressable style={styles.calendarButton}  onPress={() => setModalVisible(true)}>
          <Text style={styles.text}>{selectedYear}</Text>
          <MaterialCommunityIcons name="calendar" size={43} />
          </Pressable>
        <Text style={styles.text} >Lisää uusi näyte</Text>
        <Pressable style={styles.button} onPress={() => setSampleModalVisible(true)}>
        <MaterialCommunityIcons
        name={"plus-thick"}
        size={43}
        />
          </Pressable>
          <View style={styles.tableRow}>
            <Text style={styles.text}>Päiväys</Text>
            <Text style={styles.text}>Näyte</Text>
            <Text style={styles.text}>Tulos</Text>
            <Text style={styles.text}>Arvio</Text>
            <Text style={styles.text}>Toimenpiteet</Text>
          </View>
        </View>

  <View style={styles.content}>
      {isLoading ? (
                <SmallLoadingIndicator />
              ) : (
                <KeyboardAvoidingView>
                  <FlatList
                  removeClippedSubviews={false}
                  data={samplesData}
                  renderItem={renderSampleItem}
                  keyExtractor={(item, index) => `${item.nayte}${index}`}
                  ListEmptyComponent={
                    <Text style={styles.text}>Tyhjältä näyttää!</Text>
                  }
                  />
                </KeyboardAvoidingView>
                )
              }
      
      </View>
      <View style={styles.buttonContainer}>
        <YearMonthPickerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={handleConfirm}
          yearOnly={true}
        />
        <BackButton />
        <AddSampleModal
          visible={sampleModalVisible}
          onClose={() => setSampleModalVisible(false)}
          onConfirm={handleSampleSend}
        />
        <Pressable
        onPress={() => setSampleInfoModalVisible(true)}
        >
          <MaterialCommunityIcons
          name="progress-question"
          size={43}
          />
        </Pressable>
        <SampleInfoModal
        visible={sampleInfoModalVisible}
        onClose={() => setSampleInfoModalVisible(false)}
        />
      </View>
    </View>
  );
}
