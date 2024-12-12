import React, { useEffect, useMemo, useState } from "react";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Button } from "react-native-paper";
import BackButton from "@/components/buttons/BackButton";
import { useThemeColors } from "@/constants/ThemeColors";
import { getSampleStyles } from "@/styles/monitoring/sampleStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import YearMonthPickerModal from "@/components/modals/YearMonthPicker";
import AddSampleModal from "@/components/modals/CreateSampleModal";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "@/firebase/config";
import SmallLoadingIndicator from "@/components/misc/SmallLoadingIncidator";
export default function samples() {
  const [modalVisible, setModalVisible] = useState(false)
  const [sampleModalVisible, setSampleModalVisible] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [samplesData, setSamplesData] = useState<any[]>([])
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
  fetchData()
  console.log(samplesData);
  
}, [selectedYear])

  const handleConfirm = (formattedDate: string) => {
    setSelectedYear(formattedDate);
    setModalVisible(false);
    setSampleModalVisible(false);
  };

  const handleSampleSend = () => {
    setSampleModalVisible(false);
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
                samplesData.map((item) => (
                  <View style={styles.tableRow} key={item.id}>
                    <Text style={styles.text}>{item.date}</Text>
                    <Text style={styles.text}>+{item.nayte}C</Text>
                    <Text style={styles.text}>{item.tulos}</Text>
                    <Text style={styles.text}>{item.arvio}</Text>
                    <Text style={styles.text}>{item.toimenpiteet}</Text>
                    <Pressable onPress={() => {}}>
                      <MaterialCommunityIcons
                        name="trash-can-outline"
                        size={43}
                        color={"#FF0000"}
                      />
                    </Pressable>
                  </View>
                ))
              )}
      
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
      </View>
    </View>
  );
}

