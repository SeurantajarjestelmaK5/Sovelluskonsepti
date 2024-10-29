import YearMonthPickerModal from "@/components/YearPicker";
import { diningroomStyle } from "@/styles/inventory/diningroomStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import { useState, useEffect } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import {db, app} from "@/firebase/config"
import { collection, getDocs, updateDoc, setDoc, doc } from "firebase/firestore";

interface InventoryItem {
  Alv: number;
  Hinta: number;
  Määrä: number;
  Yksikkö: string;
  Nimi: string;
  Yhteishinta: number;
  Kategoria: string;
}

type InventoryData = {
  Viinat?: InventoryItem[];
  Miedot?: InventoryItem[];
  Limsat?: InventoryItem[];
};



export default function Diningroom() {
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<keyof InventoryData>("Viinat");
  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  
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

  const handleConfirm = (formattedDate: string) => {
    setSelectedDate(formattedDate);
    setModalVisible(false);    
  };

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const inventoryRef = collection(db, "inventaario", selectedDate, "sali");
        const querySnapshot = await getDocs(inventoryRef);
  
        const inventoryData: InventoryData = {
          Viinat: [],
          Miedot: [],
          Limsat: [],
        };
  
        querySnapshot.forEach((doc) => {
          const data = doc.data() as InventoryItem;
          console.log(data);
          console.log(inventoryData[selectedCategory]);
          
          inventoryData[selectedCategory as keyof InventoryData].push({
            Alv: data.Alv,
            Hinta: data.Hinta,
            Kategoria: data.Kategoria,
            Määrä: data.Määrä,
            Yhteishinta: data.Yhteishinta,
            Yksikkö: data.Yksikkö,
            Nimi: data.Nimi
          });
        });
        console.log(inventoryData);
        console.log(inventoryData[selectedCategory]);
        
        
        if (selectedCategory){
        setInventoryData(inventoryData[selectedCategory])
      }
      } catch (error) {
        console.error("Error fetching inventory data:", error);
        // Handle errors, e.g., display an error message to the user
      }
    };
  
    if (selectedDate && selectedCategory) {
      fetchInventory();
    }
  }, [selectedDate, selectedCategory]);
  const selectCategory = (category: keyof InventoryData) => {
    setSelectedCategory(category);
  };
  const updateQuantity = async (index: number, newQuantity: string) => {
    const updatedInventory = inventoryData.map((item, idx) =>
        idx === index ? { ...item, Määrä: parseInt(newQuantity) || 0 } : item
    );
    setInventoryData(updatedInventory);

    const docRef = doc(db, "inventory", selectedDate, "keittiö", /* documentId */);
    await updateDoc(docRef, {
        // Update the specific field based on your Firebase schema
        määrä: newQuantity,
    });
};

  return (
    <View style={diningroomStyle.container}>
      <Text style={diningroomStyle.headerText}>Inventaario - keittiö</Text> 

      <Pressable style={diningroomStyle.oneBox} onPress={() => setModalVisible(true)}>
        <Text style={diningroomStyle.dateText}>{getFormattedDate()}</Text>
        <MaterialCommunityIcons name="calendar" style={diningroomStyle.calendarIcon} />
      </Pressable>

      <ScrollView 
        contentContainerStyle={diningroomStyle.scrollList} 
        horizontal={true}
        showsHorizontalScrollIndicator={false}
      >
        {(["Viinat", "Miedot", "Limsat"] as Array<keyof InventoryData>).map((category) => (
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

      <ScrollView 
        style={{ flex: 1, width: '100%' }} 
        contentContainerStyle={diningroomStyle.inventoryTable}
        showsVerticalScrollIndicator={true}
        horizontal={true}
      >
        {inventoryData[selectedCategory]?.length > 0 && (
        <View style={diningroomStyle.tableHeader}>
          <Text style={diningroomStyle.columnHeader}>Tuote</Text>
          <Text style={diningroomStyle.columnHeader}>Määrä</Text>
          <Text style={diningroomStyle.columnHeader}>Yksikkö</Text>
          <Text style={diningroomStyle.columnHeader}>€</Text>
          <Text style={diningroomStyle.columnHeader}>Yht. €</Text>
        </View>
        )}
        {inventoryData[selectedCategory]?.map((item : InventoryItem, index : number) => (
          <View key={index} style={diningroomStyle.tableRow}>
            <Text style={diningroomStyle.cellText}>{item.Nimi}</Text>
            <TextInput
              style={diningroomStyle.editableCell}
              value={item.Määrä.toString()}
              onChangeText={(text) => updateQuantity(index, text)}
              keyboardType="numeric"
            />
            <Text style={diningroomStyle.cellText}>{item.Yksikkö}</Text>
            <Text style={diningroomStyle.cellText}>{item.Hinta.toFixed(2)}</Text>
            <Text style={diningroomStyle.cellText}>{item.Yhteishinta.toFixed(2)}</Text>
          </View>
        ))}
        
      </ScrollView>

      <Pressable>
        <Link href="../">
          <MaterialCommunityIcons name="arrow-left" style={diningroomStyle.backIcon}/>
        </Link>
      </Pressable>

      <YearMonthPickerModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onConfirm={handleConfirm}
      />
    </View>
  );
}

