import YearMonthPickerModal from "@/components/YearPicker";
import { diningroomStyle } from "@/styles/inventory/diningroomStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState, useEffect } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { db } from "@/firebase/config";
import AddItemModal from "@/components/AddItemModal";
import { collection, getDocs, updateDoc, doc, query, where, setDoc, getDoc } from "firebase/firestore";

export interface InventoryItem {
  Alv: number;
  Hinta: number;
  Määrä: number;
  Yksikkö: string;
  Nimi: string;
  Yhteishinta: number;
  Kategoria: string;
}

type InventoryData = {
  [key: string]: InventoryItem[];
};

export default function Diningroom() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [addItemModalVisible, setAddItemModalVisible] = useState(false); 
  const [selectedCategory, setSelectedCategory] = useState<string>("Viinat");
  const [inventoryData, setInventoryData] = useState<InventoryData>({});
  const [isLoading, setIsLoading] = useState(true);

  /** KUUKAUDET, PVM HAKU FUNKTIOT ALKAA */
  const finnishMonths = [
    "Tammikuu", "Helmikuu", "Maaliskuu", "Huhtikuu", "Toukokuu", "Kesäkuu",
    "Heinäkuu", "Elokuu", "Syyskuu", "Lokakuu", "Marraskuu", "Joulukuu"
  ];

  const getFormattedDate = () => {
    if (!selectedDate) return "";
    const [month, year] = selectedDate.split("-");
    const monthName = finnishMonths[parseInt(month) - 1];
    return `${monthName} ${year}`;
  };

  useEffect(() => {
    if (!selectedDate) {
      const currentDate = new Date();
      const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
      const currentYear = currentDate.getFullYear();
      setSelectedDate(`${currentMonth}-${currentYear}`);
    }
  }, [selectedDate]);

  /** KUUKAUDET, PVM HAKU FUNKTIOT LOPPUU */


/** MODAALIEN HELPPERIT ALKAA */

  const handleConfirm = (formattedDate: string) => {
    setSelectedDate(formattedDate);
    setModalVisible(false);
  };
  const handleAddItem = () => setAddItemModalVisible(true); // Open AddItemModal

  const handleItemAdded = () => {
    setAddItemModalVisible(false);
  };

/** MODAALIEN HELPPERIT LOPPUU */


/** TÄSSÄ ON UUDEN KUUKAUDEN TEKEMINEN DATABASEEN JOS SELLAISTA EI VIELÄ OLE */
  const getPreviousMonthDate = (dateString: string): string => {
    const [month, year] = dateString.split("-");
    const date = new Date(parseInt(year), parseInt(month) - 1, 1);
    date.setMonth(date.getMonth() - 1); // Go to the previous month
    const prevMonth = String(date.getMonth() + 1).padStart(2, "0");
    const prevYear = date.getFullYear();
    return `${prevMonth}-${prevYear}`;
  };
  
  const checkOrCreateMonth = async (month: string) => {
    const inventoryRef = collection(db, "inventaario", month, "sali");
    const docSnapshot = await getDocs(inventoryRef);
  
    if (!docSnapshot.empty) {
      // Data for this month already exists
      return;
    }
  
    // Get previous month's data
    const previousMonth = getPreviousMonthDate(month);
    const prevMonthRef = collection(db, "inventaario", previousMonth, "sali");
    const prevMonthSnapshot = await getDocs(prevMonthRef);
  
    if (prevMonthSnapshot.empty) {
      console.warn(`No data found for the previous month: ${previousMonth}`);
      return;
    }
  
    // Copy previous month's data to new month
    prevMonthSnapshot.forEach(async (item) => {
      const itemData = item.data();
      const newItemData = {
        ...itemData,
        Määrä: 0,
        Yhteishinta: 0,
        Hinta: 0,
      };
      const newDocRef = doc(db, "inventaario", month, "sali", item.id);
      await setDoc(newDocRef, newItemData);
    });
  
    console.log(`Created new month entry for ${month} by copying data from ${previousMonth}`);
  };

  /** JA SE SITTEN LOPPUU TÄHÄN*/

  /** INVENTAARION FUNKTIOT ALKAA */
  
  useEffect(() => {
    const fetchInventory = async () => {
      try {
        // Check or create month before fetching inventory
        await checkOrCreateMonth(selectedDate!);
  
        const inventoryRef = collection(db, "inventaario", selectedDate!, "sali");
        const querySnapshot = await getDocs(inventoryRef);
  
        const fetchedData: InventoryData = {
          Viinat: [],
          Miedot: [],
          Limsat: [],
        };
  
        querySnapshot.forEach((doc) => {
          const data = doc.data() as InventoryItem;
          fetchedData[data.Kategoria]?.push(data);
        });
  
        setInventoryData(fetchedData);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setIsLoading(false);
      }
    };
  
    if (selectedDate) {
      fetchInventory();
    }
  }, [selectedDate, selectedCategory, handleItemAdded]);

  const selectCategory = (category: string) => {
    setSelectedCategory(category);
  };

  const updateQuantity = async (index: number, newQuantity: string) => {
    const updatedInventory = inventoryData[selectedCategory].map((item, idx) =>
      idx === index ? { ...item, Määrä: parseInt(newQuantity) || 0 } : item
    );
    setInventoryData((prevData) => ({ ...prevData, [selectedCategory]: updatedInventory }));

    const docRef = doc(db, "inventaario", selectedDate!, "keittiö", /* itemId */);
    await updateDoc(docRef, {
      Määrä: parseInt(newQuantity) || 0,
    });
  };
  /** INVENTAARION FUNKTIOT LOPPUU */

  if (isLoading || !selectedCategory) {
    return <Text>Loading...</Text>;
  }

  return (
    <View style={diningroomStyle.container}>
      <Text style={diningroomStyle.headerText}>Inventaario - sali</Text>

      <Pressable style={diningroomStyle.oneBox} onPress={() => setModalVisible(true)}>
        <Text style={diningroomStyle.dateText}>{getFormattedDate()}</Text>
        <MaterialCommunityIcons name="calendar" style={diningroomStyle.calendarIcon} />
      </Pressable>

      <ScrollView
        contentContainerStyle={diningroomStyle.scrollList}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {Object.keys(inventoryData).map((category) => (
          <Pressable
            key={category}
            onPress={() => selectCategory(category)}
            style={[
              diningroomStyle.categoryButton,
              selectedCategory === category && diningroomStyle.selectedCategoryButton
            ]}
          >
            <Text style={diningroomStyle.categoryText}>{category}</Text>
          </Pressable>
        ))}
      </ScrollView>

      <View style={diningroomStyle.tableHeader}>
        <Text style={diningroomStyle.columnHeader}>Tuote</Text>
        <Text style={diningroomStyle.columnHeader}>Määrä</Text>
        <Text style={diningroomStyle.columnHeader}>Yksikkö</Text>
        <Text style={diningroomStyle.columnHeader}>€</Text>
        <Text style={diningroomStyle.columnHeader}>Yht. €</Text>
      </View>

      <ScrollView
        style={{ flex: 1, width: "100%" }}
        contentContainerStyle={diningroomStyle.inventoryTable}
        showsVerticalScrollIndicator={true}
      >
        {inventoryData[selectedCategory] && inventoryData[selectedCategory].length > 0 ? (
          inventoryData[selectedCategory].map((item, index) => (
            <View key={`${item.Nimi}-${index}`} style={diningroomStyle.tableRow}>
              <Text style={diningroomStyle.cellText}>{item.Nimi}</Text>
              <TextInput
                style={diningroomStyle.editableCell}
                value={item.Määrä.toString()}
                onChangeText={(text) => updateQuantity(index, text)}
                keyboardType="numeric"
              />
              <Text style={diningroomStyle.cellText}>{item.Yksikkö}</Text>
              <Text style={diningroomStyle.cellText}>{item.Hinta?.toFixed(2)}</Text>
              <Text style={diningroomStyle.cellText}>{item.Yhteishinta?.toFixed(2)}</Text>
            </View>
          ))
        ) : (
          <Text style={diningroomStyle.cellText}>No items available in this category.</Text>
        )}
      </ScrollView>

      <Pressable>
        <Link href="../">
          <MaterialCommunityIcons name="arrow-left" style={diningroomStyle.backIcon} />
        </Link>
      </Pressable>
      
      <Pressable onPress={() => {setAddItemModalVisible(true)}}>
          <MaterialCommunityIcons name="plus-thick" style={diningroomStyle.backIcon} />
      </Pressable>


      <YearMonthPickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirm}
      />
       <AddItemModal
       selectedDate={selectedDate}
        location="sali"
        visible={addItemModalVisible}
        onClose={() => setAddItemModalVisible(false)}
        onItemAdded={handleItemAdded} // Handle item addition and data refresh
      />
    </View>
  );
}
