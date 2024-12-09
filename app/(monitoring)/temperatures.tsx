import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Modal, Pressable, Text, View } from "react-native";
import BackButton from "@/components/buttons/BackButton";
import { useThemeColors } from "@/constants/ThemeColors";
import { getTempStyles } from "@/styles/monitoring/tempStyles";
import { db } from "@/firebase/config";
import { addDoc, collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import YearMonthPickerModal from "@/components/modals/YearPicker";
import { Calendar } from "react-native-calendars";

export default function Temperatures() {
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getTempStyles(ThemeColors), [ThemeColors]);
  const categories = ["Tiskikone", "Liha", "Jäähdytys"];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]); // Default to the first category
  const [selectedDateMMYY, setSelectedDateMMYY] = useState<string>(() => {
    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    const currentYear = currentDate.getFullYear();
    return `${currentMonth}-${currentYear}`;
  });
  const [modalVisible, setModalVisible] = useState(false);
  const [categoryData, setCategoryData] = useState<any[]>([]); // To store data fetched from Firebase
  const [isCalendarVisible, setCalendarVisible] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>("Päivämäärä"); // Default placeholder
  const [itemAdded, setItemAdded] = useState(false);


  /** Function to Fetch Data from Firebase Based on Category and Date */
  const fetchCategoryData = async () => {
   
    try {
      const [month, year] = selectedDateMMYY.split("-");
      const collectionRef = collection(db, "omavalvonta", "lämpötilat", selectedCategory, year, month);
      const snapshot = await getDocs(collectionRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log(data);
      
      setCategoryData(data);
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  /** Trigger Data Fetching when Category or Date Changes */
  useEffect(() => {
    fetchCategoryData();
  }, [selectedCategory, selectedDateMMYY]);

  /** Date Formatting for Display */
  const getFormattedDate = () => {
    const finnishMonths = [
      "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu",
      "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu",
    ];
    if (!selectedDateMMYY) return "";
    const [month, year] = selectedDateMMYY.split("-");
    const monthName = finnishMonths[parseInt(month) - 1];
    return `${monthName} ${year}`;
  };

  useEffect(() => {
    if (!selectedDateMMYY) {
      const currentDate = new Date();
      const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
      const currentYear = currentDate.getFullYear();
      setSelectedDateMMYY(`${currentMonth}-${currentYear}`);
      console.log("date selected");
      
    }
  }, [selectedDateMMYY]);

/** JÄÄHDYTYS TIETOKANTA HELPPERIT */

const [product, setProduct] = useState("");
const [initialTemp, setInitialTemp] = useState("");
const [finalTemp, setFinalTemp] = useState("");
const [time, setTime] = useState("");
const [date, setDate] = useState("");


const handleAdd = async () => {
  if (!product || !initialTemp || !finalTemp || !time || !date) {
    alert("Täytä kaikki kentät!"); // "Fill in all fields!"
    return;
  }
  try {
    const [month, year] = selectedDateMMYY.split("-");
    const reFormat = date.split('.').join('-')
    const collectionRef = doc(collection(db, "omavalvonta", "lämpötilat", selectedCategory, year, month), `${reFormat}-${product}` );

    await setDoc(collectionRef, {
      Tuote: product,
      Alkulämpö: parseFloat(initialTemp),
      Loppulämpö: parseFloat(finalTemp),
      Aika: parseFloat(time),
      Pvm: date,
    });

    setProduct("");
    setInitialTemp("");
    setFinalTemp("");
    setTime("");
    fetchCategoryData()
    alert("Data tallennettu onnistuneesti!"); // "Data saved successfully!"
    
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Virhe tietojen tallennuksessa."); // "Error saving data."
  }
};

const confirmDeleteItem = (item: any) => {
  Alert.alert(
    "Poista tuote",
    `Haluatko varmasti poistaa tuotteen ${item.Tuote} päiväyksellä ${item.Pvm}?`,
    [
      { text: "Peruuta", style: "cancel" },
      { text: "Poista", style: "destructive", onPress: () => removeInventoryItem(item) }
    ],
    { cancelable: true }
  );
};

const removeInventoryItem = async (item: any) => {
  try {
    const [month, year] = selectedDateMMYY.split("-");
    const reFormat = item.Pvm.split('.').join('-')
    console.log(reFormat, month, year);
  
    const itemRef = doc(db, "omavalvonta", "lämpötilat", selectedCategory, year, month, `${reFormat}-${item.Tuote}`);
    console.log(itemRef);
    
    await deleteDoc(itemRef); // Remove from Firebase
    console.log("deleted");
    setItemAdded(true)
    updateData()
  } catch (error) {
    console.error("Error deleting inventory item:", error);
  }
};
const updateData = () => {
  if (itemAdded) {
    fetchCategoryData()
    setItemAdded(false)
  }
};

/** JÄÄHDYTYS HELPPERIT LOPPUU */

  /** Content Rendering Based on Selected Category */
  const renderContent = () => {
    switch (selectedCategory) {
      case "Tiskikone":
        return (
          <View>
            {categoryData.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.text}>{item.name}</Text>
                <Text style={styles.text}>{item.temperature}°C</Text>
              </View>
            ))}
          </View>
        );
      case "Liha":
        return (
          <View>
            <Text style={styles.text}>Liha lämpötilat:</Text>
            {categoryData.map((item) => (
              <View key={item.id} style={styles.tableRow}>
                <Text style={styles.text}>{item.product}</Text>
                <Text style={styles.text}>{item.temperature}°C</Text>
              </View>
            ))}
          </View>
        );
        case "Jäähdytys":
          return (
            <View style={[styles.container, { backgroundColor: "#fff" }]}>
              {/* Input Fields Section */}
              <View style={[styles.content, { maxHeight: "35%" }]}>
                <View style={styles.tableRow}>
                  <Text style={styles.text}>Tuote</Text>
                  <MaterialCommunityIcons name="thermometer-plus" size={43} color={ThemeColors.text} />
                  <MaterialCommunityIcons name="thermometer-minus" size={43} color={ThemeColors.text} />
                  <MaterialCommunityIcons name="clock" size={43} color={ThemeColors.text} />
                  <MaterialCommunityIcons name="calendar" size={43} color={ThemeColors.text} />
                </View>
                <View style={styles.tableRow}>
                  <TextInput
                    placeholder="Tuote"
                    value={product}
                    onChangeText={setProduct}
                  />
                  <TextInput
                    placeholder="Alkulämpö"
                    value={initialTemp}
                    onChangeText={setInitialTemp}
                    keyboardType="numeric"
                  />
                  <TextInput
                    placeholder="Loppulämpö"
                    value={finalTemp}
                    onChangeText={setFinalTemp}
                    keyboardType="numeric"
                  />
                  <TextInput
                    placeholder="Aika"
                    value={time}
                    onChangeText={setTime}
                    keyboardType="numeric"
                  />
                   <Pressable style={styles.button} onPress={openCalendar}>
                  <Text>{selectedDay}</Text>
                </Pressable>
                </View>
                <Pressable style={styles.button} onPress={handleAdd}>
                  <Text>Lisää</Text>
                </Pressable>
              </View>
        
              {/* Data Display Section */}
              <View style={styles.content}>
                <Pressable
                  style={styles.calendarButton}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.text}>{getFormattedDate()}</Text>
                  <MaterialCommunityIcons name="calendar" size={43} />
                </Pressable>
                {categoryData.map((item) => (
                  <View style={styles.tableRow} key={item.id}>
                    <Text style={styles.text}>{item.Tuote}</Text>
                    <Text style={styles.text}>{item.Alkulämpö}</Text>
                    <Text style={styles.text}>{item.Loppulämpö}</Text>
                    <Text style={styles.text}>{item.Pvm}</Text>
                    <Pressable onPress={() => confirmDeleteItem(item)}>
                        <MaterialCommunityIcons name="trash-can-outline" size={43} />
                    </Pressable>
                  </View>
                ))}
              </View>
            </View>
          );
      default:
        return null;
    }
  };

  /** Modal Confirmation Handler */
  const handleConfirm = (formattedDate: string) => {
    setSelectedDateMMYY(formattedDate);
    setModalVisible(false);
  };
  /** Calendar Modal Handlers */
  const openCalendar = () => setCalendarVisible(true);
  const closeCalendar = () => setCalendarVisible(false);
  const onDateSelected = (day: any) => {    
    const [year, month, dayOfMonth] = day.dateString.split('-'); // Split YYYY-MM-DD
    const formattedDate = `${parseInt(dayOfMonth, 10)}.${parseInt(month, 10)}`; // Format as D.M
    setSelectedDay(formattedDate);
    setDate(formattedDate);

  console.log(formattedDate);
  closeCalendar();
  };
  /** Main Component Return */
 
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lämpötilat</Text>

      {/* Categories Row */}
      <View
        style={{
          flexDirection: "row",
          marginVertical: 10,
          backgroundColor: "#fff",
          alignItems: "center",
        }}
      >
        <FlatList
          contentContainerStyle={styles.scrollList}
          data={categories}
          horizontal
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
        <Modal
      visible={isCalendarVisible}
      transparent={true} // Makes the modal background transparent
      animationType="slide" // Optional: Add slide animation
      onRequestClose={closeCalendar} // Android back button closes modal
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "rgba(0, 0, 0, 0.5)", // Dim background
        }}
      >
        <View
          style={{
            backgroundColor: ThemeColors.background,
            borderRadius: 10,
            padding: 20,
            width: "90%",
          }}
        >
          <Calendar
            onDayPress={onDateSelected} // Handle date selection
            markedDates={{
              [selectedDay]: { selected: true }, // Highlight selected date
            }}
          />
          <Pressable onPress={closeCalendar} style={styles.closeButton}>
            <Text style={styles.text}>Sulje</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
      </View>
    </View>
  );
}
