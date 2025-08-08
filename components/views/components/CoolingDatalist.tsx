import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useThemeColors } from "@/constants/ThemeColors";
import { getWashingTempStyles } from "@/styles/views/washingMachineTempStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, TextInput } from "react-native-paper";
import * as TemperatureFunctions from "@/components/functions/TemperatureFunctions";

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

export default function WMTemps({
  month,
  year,
  day,
  refreshKey,
}: {
  month: string;
  year: string;
  day: string;
  refreshKey: number;
}) {
  const [fetchedData, setFetchedData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [endTempInput, setEndTempInput] = useState(false);
  const [editingItemId, setEditingItemId] = useState<string | null>(null);
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<any>(null);
  const ThemeColors = useThemeColors();
  const styles = useMemo(
    () => getWashingTempStyles(ThemeColors),
    [ThemeColors]
  );
  const [currentDate, setCurrentDate] = useState(new Date());
  const [propDate, setPropDate] = useState("");

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

  const getParsedDate = (date: Date) => {
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    const parsedDate = `${day}.${month}.${year}`;
    setPropDate(parsedDate);
  };

  const fetchCategoryData = async (month: string, year: string) => {
    setIsLoading(true);
    try {
      const data = await TemperatureFunctions.fetchCategoryData(
        "Jäähdytys",
        year,
        month
      );
      const sortedData = data.sort((a: any, b: any) => {
        const dayA = parseInt(a.date.split(".")[0]);
        const dayB = parseInt(b.date.split(".")[0]);
        return dayA - dayB;
      });
      setFetchedData(sortedData || []);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const parseMonth = (index: string) => {
    return finnishMonths[parseInt(index) - 1];
  };

  useEffect(() => {
    if (month) {
      setFilterMonth(parseMonth(month));
    }
    if (year) {
      setFilterYear(year);
    }
    getParsedDate(currentDate);
  }, [month, year]);

  useEffect(() => {
    if (filterMonth && filterYear) {
      const monthIndex = finnishMonths.indexOf(filterMonth) + 1;
      const formattedMonth = monthIndex.toString().padStart(2, "0");
      fetchCategoryData(formattedMonth, filterYear);
    }
  }, [filterMonth, filterYear, refreshKey]);

  useEffect(() => {
    if (endTempInput && editingItemId) {
      // Increase timeout to ensure modal is fully rendered
      const timer = setTimeout(() => {
        if (inputRef.current) {
          inputRef.current.focus();
        }
      }, 100); // Try a longer delay

      return () => clearTimeout(timer);
    }
  }, [endTempInput, editingItemId]);

  const submitEditing = async () => {
    if (!inputValue.trim() || !editingItemId) return;

    try {
      // Find the item being edited
      const itemToUpdate = fetchedData.find(
        (item) => item.id === editingItemId
      );
      if (!itemToUpdate) return;

      // Update the item in Firebase
      await TemperatureFunctions.updateItem(
        "Jäähdytys",
        year,
        month,
        editingItemId,
        { endTemp: parseFloat(inputValue) }
      );

      // Update local state immediately
      setFetchedData((prevData) =>
        prevData.map((item) =>
          item.id === editingItemId
            ? { ...item, endTemp: parseFloat(inputValue) }
            : item
        )
      );

      // Clear the input and hide it
      setEndTempInput(false);
      setEditingItemId(null);
      setInputValue("");

      // Refetch data to ensure we have the latest
      if (filterMonth && filterYear) {
        const monthIndex = finnishMonths.indexOf(filterMonth) + 1;
        const formattedMonth = monthIndex.toString().padStart(2, "0");
        await fetchCategoryData(formattedMonth, filterYear);
      }
    } catch (error) {
      console.error("Error updating temperature:", error);
      Alert.alert("Virhe", "Lämpötilan päivitys epäonnistui.");
    }
  };

  const chevronHandler = (direction: "left" | "right") => {
    let monthIndex = finnishMonths.indexOf(filterMonth);
    let yearIndex = parseInt(filterYear);

    if (direction === "left") {
      monthIndex -= 1;
      if (monthIndex < 0) {
        monthIndex = 11;
        yearIndex -= 1;
      }
    } else if (direction === "right") {
      monthIndex += 1;
      if (monthIndex > 11) {
        monthIndex = 0;
        yearIndex += 1;
      }
    }
    setFilterMonth(finnishMonths[monthIndex]);
    setFilterYear(yearIndex.toString());
  };

  const deleteHandler = async (id: string) => {
    Alert.alert(
      "Vahvista poisto",
      "Haluatko varmasti poistaa tämän kirjauksen?",
      [
        {
          text: "Peruuta",
          style: "cancel",
        },
        {
          text: "Poista",
          onPress: async () => {
            try {
              await TemperatureFunctions.deleteItem(
                "Jäähdytys",
                year,
                month,
                id
              );
              setFetchedData((prevData) =>
                prevData.filter((item) => item.id !== id)
              );
            } catch (error) {
              console.error("Error deleting data:", error);
              Alert.alert("Virhe", "Poisto epäonnistui.");
            }
          },
        },
      ]
    );
  };

  return (
    <>
      {endTempInput && (
        <Pressable
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "transparent",
            zIndex: 1000,
          }}
          onPress={() => {
            setEndTempInput(false);
            setEditingItemId(null);
          }}
        />
      )}
      <Text style={{ fontSize: 20, color: ThemeColors.text, marginTop: 20 }}>
        Tehdyt kirjaukset
      </Text>
      <View style={styles.dateFilterContainer}>
        <MaterialCommunityIcons
          name="chevron-left"
          size={30}
          color={ThemeColors.tint}
          onPress={() => chevronHandler("left")}
          hitslop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        />
        <Text style={{ fontSize: 20, color: ThemeColors.text }}>
          {filterMonth} {filterYear}
        </Text>
        <MaterialCommunityIcons
          name="chevron-right"
          size={30}
          color={ThemeColors.tint}
          onPress={() => chevronHandler("right")}
          hitslop={{ top: 30, bottom: 30, left: 30, right: 30 }}
        />
      </View>
      {isLoading ? (
        <View style={{ ...styles.dataList, minHeight: 370, minWidth: 600 }}>
          <ActivityIndicator size="large" color={ThemeColors.tint} />
        </View>
      ) : fetchedData.length > 0 ? (
        <FlatList
          data={fetchedData}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={true}
          style={styles.dataList}
          scrollEnabled={true}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Pressable style={styles.dataItemContainer} onPress={() => {}}>
              <View style={{ ...styles.dataItem, minWidth: 100 }}>
                <MaterialCommunityIcons
                  name="food-variant"
                  size={30}
                  color={ThemeColors.text}
                />
                <Text style={styles.label}>{item.product}</Text>
              </View>
              <View style={styles.dataItem}>
                <MaterialCommunityIcons
                  name="thermometer-chevron-up"
                  size={30}
                  color={ThemeColors.text}
                />
                <Text style={styles.label}>{item.startTemp} °C</Text>
              </View>
              <Pressable
                onPress={() => {
                  setEndTempInput(true);
                  setEditingItemId(item.id);
                }}
              >
                <View style={styles.dataItem}>
                  <MaterialCommunityIcons
                    name="thermometer-chevron-down"
                    size={30}
                    color={ThemeColors.text}
                  />
                  {item.endTemp ? (
                    <Text style={styles.label}>{item.endTemp} °C</Text>
                  ) : (
                    <Text style={{ fontSize: 16, color: ThemeColors.tint }}>
                      Lisää loppulämpötila
                    </Text>
                  )}
                  {editingItemId === item.id && (
                    <View
                      style={{
                        position: "relative",
                        zIndex: 1001,
                        marginTop: 5,
                      }}
                    >
                      <TextInput
                        mode="outlined"
                        style={{ ...styles.input, width: 150 }}
                        keyboardType="numeric"
                        activeOutlineColor={ThemeColors.tint}
                        onPressIn={(e) => e.stopPropagation()}
                        ref={inputRef}
                        value={inputValue}
                        onChangeText={setInputValue}
                        onSubmitEditing={submitEditing}
                      />
                    </View>
                  )}
                </View>
              </Pressable>
              <View style={styles.dataItem}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={30}
                  color={ThemeColors.text}
                />
                <Text style={styles.label}>{item.date}</Text>
              </View>
              <TouchableOpacity
                onPress={() => deleteHandler(item.id)}
                hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
              >
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={30}
                  color="red"
                />
              </TouchableOpacity>
            </Pressable>
          )}
        />
      ) : (
        <Text style={styles.label}>Ei kirjauksia</Text>
      )}
    </>
  );
}
