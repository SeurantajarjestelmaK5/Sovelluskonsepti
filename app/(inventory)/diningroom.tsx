 import YearMonthPickerModal from "@/components/YearPicker";
import { diningroomStyle } from "@/styles/inventory/diningroomStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Button, Modal } from "react-native-paper";

// FIXES TODO 25.10
// Fixaus toho modaalii jos ei valittua kuukautta ottaa nykyisen
// KOKO Kuu-Kalenteri bar clickableksi josta aukeaa modaali
// Importtaa koko paska keittiö invikseen

export default function Diningroom() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);

  const finnishMonths = [
    "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu",
    "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"
  ];

  const handleConfirm = (formattedDate: string) => {
    setSelectedDate(formattedDate)
    setModalVisible(false);    
  };

  const getFormattedDate = () => {
    if (!selectedDate) return "";

    // Split the selectedDate into month and year
    const [month, year] = selectedDate.split("-");
    
    // Convert month number to Finnish month name
    const monthName = finnishMonths[parseInt(month) - 1];
    
    return `${monthName} ${year}`;
  };
  


  return (
    <View style={diningroomStyle.headerContainer}>
      <Text style={diningroomStyle.headerText}>Inventaario - keittiö</Text> 
      <View style={diningroomStyle.oneBox}>
      {selectedDate && (
          <Text style={diningroomStyle.dateText}>{getFormattedDate()}</Text>
        )}
      <Pressable>
      <MaterialCommunityIcons name="calendar" style={diningroomStyle.backIcon} onPress={() => setModalVisible(true)}/>
      </Pressable>
      </View>
      <View style={diningroomStyle.container}>
      
      </View>
      <Pressable>
      <Link href="../">
      <MaterialCommunityIcons name="arrow-left" style={diningroomStyle.backIcon}/>
      </Link>
      </Pressable>
      

      {/*TÄSTÄ ALKAA KALENTERIN MODAALI*/ }
    <YearMonthPickerModal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      onConfirm={handleConfirm}
    />
    </View>
  );
}
