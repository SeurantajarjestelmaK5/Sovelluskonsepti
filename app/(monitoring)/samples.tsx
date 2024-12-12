import React, { useMemo, useState } from "react";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Button } from "react-native-paper";
import BackButton from "@/components/buttons/BackButton";
import { useThemeColors } from "@/constants/ThemeColors";
import { getSampleStyles } from "@/styles/monitoring/sampleStyles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import YearMonthPickerModal from "@/components/modals/YearMonthPicker";
export default function samples() {
  const [modalVisible, setModalVisible] = useState(false)
  const [selectedYear, setSelectedYear] = useState(() => {
    const currentDate = new Date()
    const currentYear = currentDate.getFullYear()
    return currentYear.toString()
  })
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getSampleStyles(ThemeColors), [ThemeColors]);

  const handleConfirm = (formattedDate: string) => {
    setSelectedYear(formattedDate);
    setModalVisible(false);
  };

  const openItemAddModal = () => {
    
  }
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Pintapuhtausnäyte</Text>
     
        <View style={styles.content}>
          <Pressable style={styles.calendarButton}  onPress={() => setModalVisible(true)}>
          <Text style={styles.text}>{selectedYear}</Text>
          <MaterialCommunityIcons name="calendar" size={43} />
          </Pressable>
        <Text style={styles.text}>Lisää uusi näyte</Text>
        <Pressable style={styles.button}>
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
        <View style={styles.tableRow}>

        </View>
      </View>
      <View style={styles.buttonContainer}>
        <YearMonthPickerModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onConfirm={handleConfirm}
          yearOnly={true}
        />
        <BackButton />
      </View>
    </View>
  );
}
