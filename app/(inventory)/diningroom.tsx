import YearMonthPickerModal from "@/components/modals/YearMonthPicker";
import { getDiningroomStyles } from "@/styles/inventory/diningroomStyle";
import { useThemeColors } from "@/constants/ThemeColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useState, useEffect, useMemo, useRef } from "react";
import {
  Alert,
  FlatList,
  KeyboardAvoidingView,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { db } from "@/firebase/config";
import AddItemModal from "@/components/modals/AddItemModal";
import {
  collection,
  getDocs,
  updateDoc,
  doc,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import BackButton from "@/components/buttons/BackButton";
import LoadingScreen from "@/components/misc/LoadingScreen";
import { useLoadingScreenStyle } from "@/styles/components/loadingScreenStyle";
import SmallLoadingIndicator from "@/components/misc/SmallLoadingIncidator";
import { exportAndSendData } from "@/scripts/mailSender";
import AddItemButton from "@/components/buttons/AddItemButton";
import SendInventoryButton from "@/components/buttons/SendInventoryButton";
export interface InventoryItem {
  Alv: number;
  Alv0: number;
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
  const [selectedCategory, setSelectedCategory] = useState<string>("Tankit");
  const [inventoryData, setInventoryData] = useState<InventoryData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [itemAdded, setItemAdded] = useState(false);
  const ThemeColors = useThemeColors();
  const diningroomStyle = useMemo(
    () => getDiningroomStyles(ThemeColors),
    [ThemeColors]
  );
  const [tempValues, setTempValues] = useState<{
    [key: string]: { Määrä?: string; Hinta?: string; Alv?: string };
  }>({});
  const cachedData = useRef<Record<string, InventoryData>>({});
  const styles = useMemo(
    () => useLoadingScreenStyle(ThemeColors),
    [ThemeColors]
  );

  /** KUUKAUDET, PVM HAKU FUNKTIOT ALKAA */
  const finnishMonths = [
    "Tammikuu",
    "Helmikuu",
    "Maaliskuu",
    "Huhtikuu",
    "Toukokuu",
    "Kesäkuu",
    "Heinäkuu",
    "Elokuu",
    "Syyskuu",
    "Lokakuu",
    "Marraskuu",
    "Joulukuu",
  ];

const getFormattedDate = () => {
  if (!selectedDate) return "";

  const [month, year] = selectedDate.split("-").map(Number);
  const monthName = finnishMonths[month - 1];

  return `${monthName} ${year}`;
};

useEffect(() => {
  if (!selectedDate) {
    const currentDate = new Date();
    let currentMonth = currentDate.getMonth() + 1; // JS months are 0-indexed
    let currentYear = currentDate.getFullYear();
    const currentDay = currentDate.getDate();

    // If it's the 1st or 2nd, go back to the previous month
    if (currentDay <= 2) {
      currentMonth -= 1;
      if (currentMonth === 0) {
        currentMonth = 12;
        currentYear -= 1;
      }
    }

    setSelectedDate(`${String(currentMonth).padStart(2, "0")}-${currentYear}`);
  }
}, [selectedDate]);

  /** KUUKAUDET, PVM HAKU FUNKTIOT LOPPUU */

  /** MODAALIEN HELPPERIT ALKAA */

  const handleConfirm = (formattedDate: string) => {
    setSelectedDate(formattedDate);
    setModalVisible(false);
  };

  /** TÄÄ ON TUOTTEEN LISÄYS MODAALILLE */
  const handleModalToggle = () => {
    setAddItemModalVisible(true);
  };

  const handleItemAdded = () => {
    setAddItemModalVisible(false);
    setItemAdded(true);
  };

  /** MODAALIEN HELPPERIT LOPPUU */

  /** TUOTTEIDEN PÄÄ RENDERI */

  const renderInventoryItem = ({
    item,
    index,
  }: {
    item: InventoryItem;
    index: number;
  }) => {
    const isEven = index % 2 === 0;
    const rowStyle = [
      diningroomStyle.tableRow,
      {
        backgroundColor: isEven
          ? ThemeColors.navSelected
          : ThemeColors.navDefault,
      }, // Alternate colors
    ];

    return (
      <View style={rowStyle} key={`${item.Nimi}-${index}`}>
        <Text style={{ ...diningroomStyle.cellText, marginRight: 20 }}>
          {item.Nimi}
        </Text>
        <TextInput
          removeClippedSubviews={false}
          style={{ ...diningroomStyle.editableCell }}
          value={tempValues[item.Nimi]?.Määrä ?? item.Määrä.toString()}
          onChangeText={(text) => handleChange(item.Nimi, "Määrä", text)}
          onEndEditing={() => handleEditingEnd(item, "Määrä", index)}
          keyboardType="numeric"
        />
        <Text style={{ ...diningroomStyle.cellText, flex: 0.4 }}>
          {item.Alv}
        </Text>
        <TextInput
          removeClippedSubviews={false}
          style={{ ...diningroomStyle.editableCell }}
          value={tempValues[item.Nimi]?.Hinta ?? item.Hinta.toString()}
          onChangeText={(text) => {
            const regex = /^[0-9]*\.?[0-9]*$/;
            if (regex.test(text)) {
              handleChange(item.Nimi, "Hinta", text);
            }
          }}
          onEndEditing={() => handleEditingEnd(item, "Hinta", index)}
          keyboardType="decimal-pad"
        />
        <Text style={{ ...diningroomStyle.cellText, flex: 0.4 }}>
          {item.Yhteishinta?.toFixed(2)}
        </Text>
        <Text style={{ ...diningroomStyle.cellText, flex: 0.4 }}>
          {item.Alv0}
        </Text>
        <Pressable onPress={() => confirmDeleteItem(item)}>
          <MaterialCommunityIcons
            name="trash-can-outline"
            style={diningroomStyle.trashIcon}
          />
        </Pressable>
      </View>
    );
  };

  /** TÄSSÄ ON UUDEN KUUKAUDEN TEKEMINEN DATABASEEN JOS SELLAISTA EI VIELÄ OLE  */
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
        Määrä: itemData.Määrä,
        Yhteishinta: 0,
        Alv0: 0 / (1 + itemData.Alv / 100),
        Hinta: itemData.Hinta,
      };
      const newDocRef = doc(db, "inventaario", month, "sali", item.id);
      await setDoc(newDocRef, newItemData);
    });
  };

  /** JA SE SITTEN LOPPUU TÄHÄN*/

  /** INVENTAARION FUNKTIOT ALKAA */

  const fetchInventory = async (date: string) => {
    try {
      setIsLoading(true);
      await checkOrCreateMonth(date);

      const inventoryRef = collection(db, "inventaario", date, "sali");
      const querySnapshot = await getDocs(inventoryRef);

      const fetchedData: InventoryData = {
        Tankit: [],
        Oluet: [],
        Siiderit: [],
        Tyhjät: [],
        Viinit: [],
        Alkoholit: [],
        ALV14: [],
      };

      querySnapshot.forEach((doc) => {
        const data = doc.data() as InventoryItem;
        fetchedData[data.Kategoria]?.push(data);
      });
      if (isFirstLoad) {
        setIsFirstLoad(false); // Update to false after first load completes
      }
      return fetchedData; // Return fetched data for caching
    } catch (error) {
      console.error("Error fetching inventory data:", error);
      return {}; // Return empty object in case of error
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch data on initial load or when selectedDate changes
  useEffect(() => {
    if (selectedDate) {
      if (itemAdded) {
        // Fetch data if not cached
        fetchInventory(selectedDate).then((data) => {
          cachedData.current[selectedDate] = data;
          setInventoryData(data);
          setItemAdded(false);
          return;
        });
      }
      if (cachedData.current[selectedDate]) {
        // If data for the selected date is already cached, use it
        setInventoryData(cachedData.current[selectedDate]);
        setIsLoading(false);
      } else {
        // Fetch data if not cached
        fetchInventory(selectedDate).then((data) => {
          cachedData.current[selectedDate] = data;
          setInventoryData(data);
        });
      }
    }
  }, [selectedDate, itemAdded]);

  /** MÄÄRIEN PÄIVITTÄMINEN JA ITEMIEN POISTAMINEN ALKAA  */
  const handleEditingEnd = async (
    item: InventoryItem,
    field: "Määrä" | "Hinta" | "Alv",
    index: number
  ) => {
    const tempValue = tempValues[item.Nimi]?.[field];
    if (tempValue !== undefined) {
      const parsedValue = parseFloat(tempValue);
      if (!isNaN(parsedValue) && parsedValue !== item[field]) {
        try {
          let newYhteishinta = item.Yhteishinta;
          let newALV0 = 0;

          if (field === "Määrä") {
            newYhteishinta = parsedValue * item.Hinta;
            newALV0 = +(
              (item.Hinta / (1 + item.Alv / 100)) *
              parsedValue
            ).toFixed(2);
          } else if (field === "Hinta") {
            newYhteishinta = item.Määrä * parsedValue;
            newALV0 = +(
              (parsedValue / (1 + item.Alv / 100)) *
              item.Määrä
            ).toFixed(2);
          }

          const docRef = doc(
            db,
            "inventaario",
            selectedDate!,
            "sali",
            item.Nimi
          );
          await updateDoc(docRef, {
            [field]: parsedValue,
            Yhteishinta: newYhteishinta,
            Alv0: newALV0,
          });

          setInventoryData((prevData) => {
            const updatedCategoryItems = [...prevData[selectedCategory]];
            const updatedItem = {
              ...updatedCategoryItems[index],
              [field]: parsedValue,
              Yhteishinta: newYhteishinta,
              Alv0: newALV0,
            };
            updatedCategoryItems[index] = updatedItem;

            return { ...prevData, [selectedCategory]: updatedCategoryItems };
          });
        } catch (error) {
          console.error("Error updating inventory item:", error);
        }
      }
    }
  };

  const handleChange = (
    itemName: string,
    field: "Määrä" | "Hinta",
    value: string
  ) => {
    setTempValues((prevTempValues) => ({
      ...prevTempValues,
      [itemName]: {
        ...prevTempValues[itemName],
        [field]: value,
      },
    }));
  };

  const confirmDeleteItem = (item: InventoryItem) => {
    Alert.alert(
      "Poista tuote",
      `Haluatko varmasti poistaa tuotteen ${item.Nimi}?`,
      [
        { text: "Peruuta", style: "cancel" },
        {
          text: "Poista",
          style: "destructive",
          onPress: () => removeInventoryItem(item),
        },
      ],
      { cancelable: true }
    );
  };
  const removeInventoryItem = async (itemToRemove: InventoryItem) => {
    try {
      const itemRef = doc(
        db,
        "inventaario",
        selectedDate!,
        "sali",
        itemToRemove.Nimi
      );
      await deleteDoc(itemRef); // Remove from Firebase

      // Remove from local state
      setInventoryData((prevData) => {
        const updatedCategoryItems = prevData[selectedCategory].filter(
          (item) => item.Nimi !== itemToRemove.Nimi
        );
        return { ...prevData, [selectedCategory]: updatedCategoryItems };
      });
    } catch (error) {
      console.error("Error deleting inventory item:", error);
    }
  };
  const handleInventorySend = async (selectedDate: any) => {
    exportAndSendData(selectedDate, "sali");
  };

  /** MÄÄRIEN PÄIVITTÄMINEN JA ITEMIEN POISTAMINEN LOPPUU  */

  /** INVENTAARION FUNKTIOT LOPPUU */
  if (isLoading && isFirstLoad) {
    // Show full screen LoadingScreen on first load
    return <LoadingScreen />;
  }
  return (
    <View style={diningroomStyle.container}>
      <Text style={diningroomStyle.headerText}>Inventaario - Sali</Text>
      <Pressable
        style={diningroomStyle.oneBox}
        onPress={() => setModalVisible(true)}
      >
        <Text style={diningroomStyle.dateText}>{getFormattedDate()}</Text>
        <MaterialCommunityIcons
          name="calendar"
          style={diningroomStyle.calendarIcon}
        />
      </Pressable>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          marginVertical: 10,
        }}
      >
        <FlatList
          contentContainerStyle={diningroomStyle.scrollList}
          data={Object.keys(inventoryData)}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Pressable
              onPress={() => setSelectedCategory(item)}
              style={[
                diningroomStyle.categoryButton,
                selectedCategory === item &&
                  diningroomStyle.selectedCategoryButton,
              ]}
            >
              <Text
                style={[
                  diningroomStyle.categoryText,
                  selectedCategory === item &&
                    diningroomStyle.selectedCategoryText,
                ]}
              >
                {item}
              </Text>
            </Pressable>
          )}
          keyExtractor={(item) => item}
        />
      </View>

      <View style={diningroomStyle.tableHeader}>
        <Text style={{ ...diningroomStyle.columnHeader, marginRight: 100 }}>
          Tuote
        </Text>
        <Text style={diningroomStyle.columnHeader}>Määrä</Text>
        <Text style={diningroomStyle.columnHeader}>ALV %</Text>
        <Text style={diningroomStyle.columnHeader}>Kpl. €</Text>
        <Text style={diningroomStyle.columnHeader}>Yht. €</Text>
        <Text style={{ ...diningroomStyle.columnHeader, marginRight: 20 }}>
          Yht. ALV 0%
        </Text>
      </View>
      <View style={diningroomStyle.inventoryTable}>
        {isLoading ? (
          <SmallLoadingIndicator />
        ) : (
          <KeyboardAvoidingView>
            <FlatList
              style={{ marginHorizontal: 10 }}
              removeClippedSubviews={false}
              data={inventoryData[selectedCategory] || []}
              renderItem={renderInventoryItem}
              keyExtractor={(item, index) => `${item.Nimi}-${index}`}
              ListEmptyComponent={
                <Text style={diningroomStyle.cellText}>Tyhjältä näyttää!</Text>
              }
            />
          </KeyboardAvoidingView>
        )}
      </View>
      <View style={diningroomStyle.backButton}>
        <View style={{ marginTop: 10 }}>
          <BackButton />
        </View>
        <AddItemButton onClick={handleModalToggle} />
        <SendInventoryButton
          onClick={() => handleInventorySend(selectedDate)}
        />
      </View>
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
