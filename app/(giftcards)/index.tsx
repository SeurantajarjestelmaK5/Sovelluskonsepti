import React, { useEffect, useState } from "react";
import { FlatList, Pressable, Text, View } from "react-native";
import { Button, Searchbar } from "react-native-paper";
import { getGiftcardStyles } from "@/styles/giftcards/giftcardStyle";
import { useThemeColors } from "@/constants/ThemeColors";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo } from "react";
import AppHeader from "@/components/misc/AppHeader";
import { GiftcardType } from "@/components/functions/GiftcardFunctions";
import Giftcard from "../../components/misc/Giftcard";
import { Timestamp } from "firebase/firestore";
import AddGiftcardModal from "@/components/modals/AddGiftcardModal";

export default function GiftcardsHome() {
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getGiftcardStyles(ThemeColors), [ThemeColors]);
  const [searchQuery, setSearchQuery] = useState("");
  const [giftcards, setGiftcards] = useState<GiftcardType[]>([]);
  const [modalVisible, setModalVisible] = useState(false);

  const searchHandler = (query: string) => {
    if (query.trim() === "") {
      // If search is empty, show all giftcards
      setGiftcards(testGiftcards);
    } else {
      // Filter by ID (case-insensitive)
      const filteredGiftcards = testGiftcards.filter((giftcard) =>
        giftcard.id.toLowerCase().includes(query.toLowerCase())
      );
      setGiftcards(filteredGiftcards);
    }
  };

  const openGiftcardModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  useEffect(() => {
    // Initialize with all giftcards
    setGiftcards(testGiftcards);
  }, []);

  const testGiftcards = [
    {
      id: "mursu-22564",
      value: 100,
      start_date: Timestamp.fromDate(new Date("2025-01-01")),
      end_date: Timestamp.fromDate(new Date("2026-01-01")),
      expired: false,
      used: false,
    },
    {
      id: "2004",
      value: 25,
      start_date: Timestamp.fromDate(new Date("2025-01-01")),
      end_date: Timestamp.fromDate(new Date("2026-01-01")),
      expired: false,
      used: false,
    },
    {
      id: "5543",
      value: 50,
      start_date: Timestamp.fromDate(new Date("2025-01-01")),
      end_date: Timestamp.fromDate(new Date("2026-01-01")),
      expired: false,
      used: false,
    },
  ];

  return (
    <View style={styles.container}>
      <AppHeader />
      <View style={styles.addButtonContainer}>
        <Button
          mode="contained"
          onPress={openGiftcardModal}
          icon="plus"
          children="Lisää lahjakortti"
          contentStyle={styles.addButton}
          style={{ borderRadius: 10, width: "40%" }}
          labelStyle={{ fontSize: 18 }}
        />
      </View>
      <Searchbar
        placeholder="Hae lahjakorttia"
        value={searchQuery}
        onChangeText={(text) => {
          setSearchQuery(text);
          searchHandler(text);
        }}
        onClearIconPress={() => {
          setSearchQuery("");
          searchHandler("");
        }}
        clearIcon="close"
        style={{ width: "90%", backgroundColor: ThemeColors.navDefault }}
      />
      {giftcards.length === 0 ? (
        <View style={styles.noResultsContainer}>
          <Text style={styles.noResultsText}>
            {searchQuery.trim() === ""
              ? "Ei lahjakortteja"
              : `Ei tuloksia haulle "${searchQuery}"`}
          </Text>
        </View>
      ) : (
        <FlatList
          data={giftcards}
          renderItem={({ item }) => <Giftcard giftcard={item} />}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          style={{ width: "95%", marginTop: 20, marginHorizontal: "auto" }}
        />
      )}
      <AddGiftcardModal visible={modalVisible} onClose={closeModal} />
    </View>
  );
}
