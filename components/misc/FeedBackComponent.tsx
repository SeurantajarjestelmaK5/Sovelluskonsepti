import React, { useEffect, useMemo, useState } from "react";
import { Link } from "expo-router";
import { Pressable, Text, View, FlatList } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import BackButton from "@/components/buttons/BackButton";
import AntDesign from "@expo/vector-icons/AntDesign";

import { useThemeColors } from "@/constants/ThemeColors";
import { getFeedBackStyles } from "@/styles/components/feedBackStyle";

export default function FeedBackComponent() {
  const [category, setCategory] = useState("kehitysidea");
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getFeedBackStyles(ThemeColors), [ThemeColors]);

  return (
    <View style={styles.container}>
      <View style={styles.textContent}>
        <Text style={styles.header}>Jätä palautetta</Text>
        <Text style={styles.text}>
          {""}
          Löysitkö bugin? Onko invisnäkymä ärsyttävä? Haluatko muuten vaan
          morjestaa kehittäjiä? Jätä vapaamuotoinen viesti alle, mikäli haluat
          raportoida virheistä sovelluksesta niin kuvailethan löytämäsi bugin
          mahdollisimman tarkasti.{""}
        </Text>
      </View>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue as string)}
        mode="dropdown"
        style={styles.dropdownButton}
      >
        <Picker.Item label="Bugi/Muu virhe" value="bugi" style={styles.dropdownItem} />
        <Picker.Item
          label="Kehitysidea"
          value="kehitysidea"
          style={styles.dropdownItem}
        />
        <Picker.Item
          label="Muu palaute"
          value="muu"
          style={styles.dropdownItem}
        />
      </Picker>
      <TextInput
        mode="outlined"
        label="Viesti"
        multiline
        numberOfLines={6}
        style={styles.textInput}
      />
    </View>
  );
}
