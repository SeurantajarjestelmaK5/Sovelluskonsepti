import React, { useEffect, useMemo, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import BackButton from "@/components/buttons/BackButton";
import { useThemeColors } from "@/constants/ThemeColors";
import { getTempStyles } from "@/styles/monitoring/tempStyles";
import { db } from "@/firebase/config";
import { collection, getDocs } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import YearMonthPickerModal from "@/components/modals/YearPicker";

export default function Temperatures() {
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getTempStyles(ThemeColors), [ThemeColors]);
  const categories = ["Tiskikone", "Liha", "Jäähdytys"];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]); // Default to the first category
  const [selectedDateMMYY, setSelectedDateMMYY] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);


  /** KUUKAUDET, PVM HAKU FUNKTIOT ALKAA */


  const getFormattedDate = () => {
    const finnishMonths = [
      "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu",
      "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"
    ];

    if (!selectedDateMMYY) return "";
    const [month, year] = selectedDateMMYY.split("-");
    const monthName = finnishMonths[parseInt(month) - 1];
    return `${monthName} ${year}`;
  };

  useEffect(() => {    
    if (!selectedDateMMYY) {
      const currentDate = new Date();
      const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
      const currentYear = currentDate.getFullYear();
      setSelectedDateMMYY(`${currentMonth}-${currentYear}`);
      console.log("date selected", selectedDateMMYY);
    }
  }, [selectedDateMMYY]);

/** PÄÄ CONTENTIN RENDERÖINTI */

  const renderContent = () => {
    switch (selectedCategory) {
      case "Tiskikone":
        return (
          <View>
           
          </View>
        );
      case "Liha":
        return (
          <View>
            <Text style={styles.text}>Liha lämpötilat:</Text>
            <Text style={styles.text}>+4°C</Text>
          </View>
        );
      case "Jäähdytys":
        return (
          <View style={[styles.container, {backgroundColor: "#fff"}]}>
            <View style={[styles.content, {maxHeight: "35%"}]}>
            <View style={styles.tableRow}>
              <Text style={styles.text}>Tuote</Text>
            <MaterialCommunityIcons
            name="thermometer-plus"
            size={43}/>
            <MaterialCommunityIcons
            name="thermometer-minus"
            size={43}/>
            <MaterialCommunityIcons
            name="clock"
            size={43}/>
            <MaterialCommunityIcons
            name="calendar"
            size={43}/>
           </View>
           <View style={styles.tableRow}>
            <TextInput/>
            <TextInput
            keyboardType="numeric"
            />
            <TextInput
            keyboardType="numeric"
            />
            <TextInput
            keyboardType="numeric"
            />
            <TextInput
            keyboardType="numeric"
            />
           </View>
           <Pressable style={styles.button}>
            <Text>Lisää</Text>
           </Pressable>
           </View>

           <View style={styles.content}>
           <Pressable
            style={styles.calendarButton}
            onPress={() => setModalVisible(true)}>
        <Text style={styles.text}>{getFormattedDate()}</Text>
        <MaterialCommunityIcons
          name="calendar"
          size={43}
        />
      </Pressable>
        <View style={styles.tableRow} key={``}>
          <Text>

          </Text>
        </View>  
      </View>
           
          </View>
        );
      default:
        return null;
    }
  };
  /** PÄÄCONTENTIN RENDERÖINTI LOPPUU */
  /** MODAALIEN HELPPERIT ALKAA */

  const handleConfirm = (formattedDate: string) => {
    setSelectedDateMMYY(formattedDate);
    setModalVisible(false);
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lämpötilat</Text>

      {/* Categories Row */}
      <View
        style={{
          flexDirection: "row",
          marginVertical: 10,
          backgroundColor: "#fff",
          alignItems: "center"
        }}
      >
        <FlatList
          contentContainerStyle={styles.scrollList}
          data={categories}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedCategory(item)}
              style={[
                styles.button,
                selectedCategory === item && styles.selectedButton,
              ]}
            >
              <Text
                style={[
                  styles.categoryText,
                  selectedCategory === item && styles.selectedCategoryText,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      {/* Render Content Based on Category */}
      <View style={styles.content}>{renderContent()}</View>

      {/* Footer Section */}
      <View style={styles.buttonContainer}>
        <YearMonthPickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirm}
        />
        <BackButton />
      </View>
    </View>
  );
}
