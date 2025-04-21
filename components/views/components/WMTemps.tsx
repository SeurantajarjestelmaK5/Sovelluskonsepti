import React, { useEffect, useMemo, useState } from "react";
import {
  Alert,
  FlatList,
  Pressable,
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
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
  const ThemeColors = useThemeColors();
  const styles = getWashingTempStyles(ThemeColors);
  const [filterMonth, setFilterMonth] = useState("");
  const [filterYear, setFilterYear] = useState("");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [propDate, setPropDate] = useState("");
  const [fetchedData, setFetchedData] = useState<any[]>([]);

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
    try {
      const data = await TemperatureFunctions.fetchCategoryData(
        "Tiskikone",
        year,
        month
      );

      setFetchedData(data || []);
    } catch (error) {
      console.error("Error fetching data:", error);
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
                "Tiskikone",
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
      {fetchedData.length > 0 ? (
        <FlatList
          data={fetchedData}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={true}
          style={styles.dataList}
          scrollEnabled={true}
          contentContainerStyle={{ paddingBottom: 20 }}
          renderItem={({ item }) => (
            <Pressable style={styles.dataItemContainer} onPress={() => {}}>
              <View style={styles.dataItem}>
                <MaterialCommunityIcons
                  name="chart-bubble"
                  size={30}
                  color={ThemeColors.text}
                />
                <Text style={styles.label}>{item.Pesuvesi} °C</Text>
              </View>
              <View style={styles.dataItem}>
                <MaterialCommunityIcons
                  name="water"
                  size={30}
                  color={ThemeColors.text}
                />
                <Text style={styles.label}>{item.Huuhteluvesi} °C</Text>
              </View>
              <View style={styles.dataItem}>
                <MaterialCommunityIcons
                  name="calendar"
                  size={30}
                  color={ThemeColors.text}
                />
                <Text style={styles.label}>{item.Pvm}</Text>
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
