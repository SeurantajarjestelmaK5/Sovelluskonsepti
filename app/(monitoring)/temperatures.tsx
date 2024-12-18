import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Keyboard, KeyboardAvoidingView, Modal, Pressable, Text, TouchableWithoutFeedback, View } from "react-native";
import BackButton from "@/components/buttons/BackButton";
import { useThemeColors } from "@/constants/ThemeColors";
import { getTempStyles } from "@/styles/monitoring/tempStyles";
import { db } from "@/firebase/config";
import { collection, deleteDoc, doc, getDocs, setDoc } from "firebase/firestore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { TextInput } from "react-native-paper";
import YearMonthPickerModal from "@/components/modals/YearMonthPicker";
import { Calendar } from "react-native-calendars";
import SmallLoadingIndicator from "@/components/misc/SmallLoadingIncidator";

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
  const [isLoading, setIsLoading] = useState(false);


  /** Function to Fetch Data from Firebase Based on Category and Date */
  const fetchCategoryData = async () => {
    setIsLoading(true)
    try {
      const [month, year] = selectedDateMMYY.split("-");
      const collectionRef = collection(db, "omavalvonta", "lämpötilat", selectedCategory, year, month);
      const snapshot = await getDocs(collectionRef);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));      
      setCategoryData(data);
      setIsLoading(false)
    } catch (error) {
      console.error("Error fetching category data:", error);
    }
  };

  /** Trigger Data Fetching when Category or Date Changes */
  useEffect(() => {
    if (itemAdded) {
      fetchCategoryData().then(() => setItemAdded(false));
      return;
    }
    fetchCategoryData();
  }, [selectedCategory, selectedDateMMYY, itemAdded]);

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
  }, [selectedDateMMYY, ]);

/** TIETOKANTA HELPPERIT */

const [product, setProduct] = useState("");
const [temp1, setTemp1] = useState("");
const [washingTemp, setWashingTemp] = useState("");
const [rinsingTemp, setRinsingTemp] = useState("");
const [temp2, setTemp2] = useState("");
const [initialTemp, setInitialTemp] = useState("");
const [finalTemp, setFinalTemp] = useState("");
const [time, setTime] = useState("");
const [date, setDate] = useState("");

const handleAdd = async (category : string, meatType? : string) => {
  if (category == "Jäähdytys") {
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
    alert("Tiedot tallennettu onnistuneesti!"); // "Data saved successfully!"
    setItemAdded(true)
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Virhe tietojen tallennuksessa."); // "Error saving data."
  }
} else if (category == "Liha") {

  if (!date || (meatType === "Nauta" && !temp1) || (meatType === "Porsas" && !temp2)) {
    alert("Täytä kaikki kentät!"); // "Fill in all fields!"
    return;
  }
  try {

    const [month, year] = selectedDateMMYY.split("-");
    const reFormat = date.split('.').join('-')
    const collectionRef = doc(collection(db, "omavalvonta", "lämpötilat", selectedCategory, year, month), `${reFormat}-${meatType}` );
    const tempToSave = meatType === "Nauta" ? temp1 : temp2; // Determine which temp to save

    await setDoc(collectionRef, {
      Tuote: meatType,
      Lämpötila: parseFloat(tempToSave),
      Pvm: date,
    });

    if (meatType === "Nauta") setTemp1("");
    if (meatType === "Porsas") setTemp2("");

    alert("Tiedot tallennettu onnistuneesti!"); // "Data saved successfully!"
    setItemAdded(true)
    } catch (error) {
        console.error("Error adding document: ", error);
        alert("Virhe tietojen tallennuksessa."); // "Error saving data."
      }
} else if (category == "Tiskikone") {
  if (!washingTemp || !rinsingTemp || !date) {
    alert("Täytä kaikki kentät!"); // "Fill in all fields!"
    return;
  }
  try {
  const [month, year] = selectedDateMMYY.split("-");
  const reFormat = date.split('.').join('-')
  const collectionRef = doc(collection(db, "omavalvonta", "lämpötilat", selectedCategory, year, month), reFormat);
  await setDoc(collectionRef, {
    Huuhteluvesi : parseFloat(rinsingTemp),
    Pesuvesi : parseFloat(washingTemp),
    Pvm: date,
  });
  setWashingTemp("");
  setRinsingTemp("");
  alert("Tiedot tallennettu onnistuneesti!"); // "Data saved successfully!"
  setItemAdded(true)
  } catch (error) {
    console.error("Error adding document: ", error);
    alert("Virhe tietojen tallennuksessa."); // "Error saving data."
  }
}
}

const confirmDeleteItem = (item: any) => {
  Alert.alert(
    item.Tuote ?"Poista tuote" : "Poista",
    item.Tuote ? `Haluatko varmasti poistaa tuotteen ${item.Tuote} päiväyksellä ${item.Pvm}?` : `Haluatko varmasti poistaa kirjauksen päiväyksellä ${item.Pvm}?` ,
    [
      { text: "Peruuta", style: "cancel" },
      { text: "Poista", style: "destructive", onPress: async () => {await removeInventoryItem(item);
        setItemAdded(true);
      }}
    ],
    { cancelable: true }
  );
};

const removeInventoryItem = async (item: any) => {
  try {
    const [month, year] = selectedDateMMYY.split("-");
    const reFormat = item.Pvm.split('.').join('-')  
    if (item.Tuote) {
    const itemRef = doc(db, "omavalvonta", "lämpötilat", selectedCategory, year, month, `${reFormat}-${item.Tuote}`);    
    await deleteDoc(itemRef); // Remove from Firebase
    setItemAdded(true)
  } else {
    const itemRef = doc(db, "omavalvonta", "lämpötilat", selectedCategory, year, month, `${reFormat}`);    
    await deleteDoc(itemRef); // Remove from Firebase
    setItemAdded(true)
    console.log("hit");
    
  }
  } catch (error) {
    console.error("Error deleting inventory item:", error);
  }
};



/** JÄÄHDYTYS HELPPERIT LOPPUU */

  /** Content Rendering Based on Selected Category */
  const renderContent = () => {
    const dismissKeyboard = () => {
      Keyboard.dismiss();
    };

    switch (selectedCategory) {
      case "Tiskikone":
        return (
          <KeyboardAvoidingView>
              <TouchableWithoutFeedback onPress={dismissKeyboard}>
          <View style={styles.container}>
            <View style={[styles.content, { maxHeight: "40%" }]}>
              <View style={styles.tableRow}>
                <MaterialCommunityIcons
                  color={ThemeColors.text}
                  name="chart-bubble"
                  size={43}
                />
                <MaterialCommunityIcons
                  color={ThemeColors.text}
                  name="water"
                  size={43}
                />
                <MaterialCommunityIcons
                  color={ThemeColors.text}
                  name="calendar"
                  size={43}
                />
              </View>
              
              <View style={styles.textInputsRow}>
                <TextInput
                  placeholder="Pesuvesi"
                  keyboardType="numeric"
                  value={washingTemp}
                  onChangeText={setWashingTemp}
                  mode="outlined"
                  activeOutlineColor={ThemeColors.tint}
                  style={styles.textInput}
                />
                <TextInput
                  placeholder="Huuhteluvesi"
                  keyboardType="numeric"
                  value={rinsingTemp}
                  onChangeText={setRinsingTemp}
                  mode="outlined"
                  activeOutlineColor={ThemeColors.tint}
                  style={styles.textInput}
                />
                <Pressable style={styles.calendarDisplayButton} onPress={openCalendar}>
                  <Text>{selectedDay}</Text>
                </Pressable>
              </View>
              
              <Pressable
                style={[styles.button]}
                onPress={() => {
                  handleAdd(selectedCategory);
                }}
              >
                <Text>Lisää</Text>
              </Pressable>
            </View>
           

            <View style={[styles.content]}>
              <Pressable
                style={[styles.calendarButton]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.text}>{getFormattedDate()}</Text>
                <MaterialCommunityIcons name="calendar" size={43} color={ThemeColors.tint} />
              </Pressable>
              <View style={styles.tableRow}>
                <MaterialCommunityIcons
                  color={ThemeColors.text}
                  name="chart-bubble"
                  size={43}
                />
                <MaterialCommunityIcons
                  color={ThemeColors.text}
                  name="water"
                  size={43}
                />
                <MaterialCommunityIcons
                  color={ThemeColors.text}
                  name="calendar"
                  size={43}
                />
                <Text></Text>
              </View>
              {isLoading ? (
                <SmallLoadingIndicator />
              ) : (
                categoryData.map((item) => (
                  <View style={styles.tableRow} key={item.id}>
                    <Text style={styles.text}>+{item.Huuhteluvesi}C</Text>
                    <Text style={styles.text}>+{item.Pesuvesi}C</Text>
                    <Text style={styles.text}>{item.Pvm}</Text>
                    <Pressable onPress={() => confirmDeleteItem(item)}>
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
          </View>
          </TouchableWithoutFeedback>
          </KeyboardAvoidingView>
              
        );
        case "Liha":
        return (
          <View style={[styles.container]}>
            <View
              style={[styles.content, { maxHeight: "40%", marginBottom: 50 }]}
            >
              <View style={[styles.tableRow, { marginTop: 50 }]}>
                <Text></Text>
                <Text style={styles.text}>Nauta</Text>
                <Text style={styles.text}> Porsas</Text>
              </View>
              <View style={styles.tableRow}>
                <MaterialCommunityIcons
                  name="thermometer"
                  size={43}
                  color={ThemeColors.text}
                />
                <TextInput
                  placeholder="Lämpötila"
                  keyboardType="numeric"
                  value={temp1}
                  onChangeText={setTemp1}
                  mode="outlined"
                  activeOutlineColor={ThemeColors.tint}
                />
                <TextInput
                  placeholder="Lämpötila"
                  keyboardType="numeric"
                  value={temp2}
                  onChangeText={setTemp2}
                  mode="outlined"
                  activeOutlineColor={ThemeColors.tint}
                />
              </View>
              <View style={styles.tableRow}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={43}
                  color={ThemeColors.text}
                />
                <Pressable
                  style={{
                    ...styles.calendarDisplayButton,
                    height: 60,
                    marginTop: 10,
                  }}
                  onPress={openCalendar}
                >
                  <Text>{selectedDay}</Text>
                </Pressable>
                <Pressable
                  style={{
                    ...styles.calendarDisplayButton,
                    height: 60,
                    marginTop: 10,
                  }}
                  onPress={openCalendar}
                >
                  <Text>{selectedDay}</Text>
                </Pressable>
              </View>
              <View style={styles.tableRow}>
                <Text></Text>
                <Pressable
                  style={[styles.button]}
                  onPress={() => {
                    handleAdd(selectedCategory, "Nauta");
                  }}
                >
                  <Text>Lisää</Text>
                </Pressable>
                <Pressable
                  style={styles.button}
                  onPress={() => {
                    handleAdd(selectedCategory, "Porsas");
                  }}
                >
                  <Text>Lisää</Text>
                </Pressable>
              </View>
            </View>
            <View style={styles.content}>
              <Pressable
                style={[styles.calendarButton]}
                onPress={() => setModalVisible(true)}
              >
                <Text style={styles.text}>{getFormattedDate()}</Text>
                <MaterialCommunityIcons name="calendar" size={43} />
              </Pressable>
              <View style={styles.tableRow}>
                <Text></Text>
                <MaterialCommunityIcons
                  name="thermometer"
                  size={43}
                  color={ThemeColors.text}
                />
                <MaterialCommunityIcons
                  name="calendar"
                  size={43}
                  color={ThemeColors.text}
                />
                <Text></Text>
              </View>
              {isLoading ? (
                <SmallLoadingIndicator />
              ) : (
                categoryData.map((item) => (
                  <View style={styles.tableRow} key={item.id}>
                    <Text style={styles.text}>{item.Tuote}</Text>
                    <Text style={styles.text}>+{item.Lämpötila}C</Text>
                    <Text style={styles.text}>{item.Pvm}</Text>
                    <Pressable onPress={() => confirmDeleteItem(item)}>
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
          </View>
        );
        case "Jäähdytys":
          return (
            <View style={[styles.container]}>
              {/* Input Fields Section */}
              <View style={[styles.content, { maxHeight: "35%" }]}>
                <View style={styles.tableRow}>
                  <Text style={styles.text}>Tuote</Text>
                  <MaterialCommunityIcons
                    name="thermometer-plus"
                    size={43}
                    color={ThemeColors.text}
                  />
                  <MaterialCommunityIcons
                    name="thermometer-minus"
                    size={43}
                    color={ThemeColors.text}
                  />
                  <MaterialCommunityIcons
                    name="clock"
                    size={43}
                    color={ThemeColors.text}
                  />
                  <MaterialCommunityIcons
                    name="calendar"
                    size={43}
                    color={ThemeColors.text}
                  />
                </View>
                <View style={styles.tableRow}>
                  <TextInput
                    placeholder="Tuote"
                    value={product}
                    onChangeText={setProduct}
                    mode="outlined"
                    activeOutlineColor={ThemeColors.tint}
                  />
                  <TextInput
                    placeholder="Alkulämpö"
                    value={initialTemp}
                    onChangeText={setInitialTemp}
                    keyboardType="numeric"
                    mode="outlined"
                    activeOutlineColor={ThemeColors.tint}
                  />
                  <TextInput
                    placeholder="Loppulämpö"
                    value={finalTemp}
                    onChangeText={setFinalTemp}
                    keyboardType="numeric"
                    mode="outlined"
                    activeOutlineColor={ThemeColors.tint}
                  />
                  <TextInput
                    placeholder="Aika"
                    value={time}
                    onChangeText={setTime}
                    keyboardType="numeric"
                    mode="outlined"
                    activeOutlineColor={ThemeColors.tint}
                  />
                  <Pressable style={styles.calendarDisplayButton} onPress={openCalendar}>
                    <Text>{selectedDay}</Text>
                  </Pressable>
                </View>
                <Pressable
                  style={styles.button}
                  onPress={() => {
                    handleAdd(selectedCategory);
                  }}
                >
                  <Text>Lisää</Text>
                </Pressable>
              </View>

              {/* Data Display Section */}
              <View style={styles.content}>
                <Pressable
                  style={[styles.calendarButton]}
                  onPress={() => setModalVisible(true)}
                >
                  <Text style={styles.text}>{getFormattedDate()}</Text>
                  <MaterialCommunityIcons name="calendar" size={43} />
                </Pressable>
                <View style={styles.tableRow}>
                  <MaterialCommunityIcons
                    name="label-outline"
                    size={43}
                    color={ThemeColors.text}
                  />
                  <MaterialCommunityIcons
                    name="thermometer-plus"
                    size={43}
                    color={ThemeColors.text}
                  />
                  <MaterialCommunityIcons
                    name="thermometer-minus"
                    size={43}
                    color={ThemeColors.text}
                  />
                  <MaterialCommunityIcons
                    name="clock"
                    size={43}
                    color={ThemeColors.text}
                  />
                  <MaterialCommunityIcons
                    name="calendar"
                    size={43}
                    color={ThemeColors.text}
                  />
                  <MaterialCommunityIcons />
                </View>
                {isLoading ? (
                  <SmallLoadingIndicator />
                ) : (
                  categoryData.map((item) => (
                    <View style={styles.tableRow} key={item.id}>
                      <Text style={styles.text}>{item.Tuote}</Text>
                      <Text style={styles.text}>{item.Alkulämpö}</Text>
                      <Text style={styles.text}>{item.Loppulämpö}</Text>
                      <Text style={styles.text}>{item.Aika}</Text>
                      <Text style={styles.text}>{item.Pvm}</Text>
                      <Pressable onPress={() => confirmDeleteItem(item)}>
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
