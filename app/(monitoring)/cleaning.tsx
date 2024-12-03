import React, { useMemo, useState } from "react";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Button } from "react-native-paper";
import BackButton from "@/components/BackButton";
import AntDesign from "@expo/vector-icons/AntDesign";

import { useThemeColors } from "@/constants/ThemeColors";
import { getCleaningStyles } from "@/styles/monitoring/cleaningStyles";

export default function cleaning() {
  const [week, setWeek] = useState(1);
  const [selectedSide, setSelectedSide] = useState("Keittiö");

  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getCleaningStyles(ThemeColors), [ThemeColors]);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.header}>Viikkosiivous</Text>
        <View style={styles.weekCalendar}>
          <AntDesign name="caretleft" size={24} color={ThemeColors.tint} />
          <Text style={styles.text}>Viikko 1 6. - 12.1.2025 </Text>
          <AntDesign name="caretright" size={24} color={ThemeColors.tint} />
        </View>
        <View style={styles.selectionContainer}>
          <Pressable
            onPress={() => {
              setSelectedSide("Keittiö");
            }}
            style={[
              styles.sideSelection,
              selectedSide === "Keittiö" && styles.selectedSide,
            ]}
          >
            <Text style={styles.text}>Keittiö</Text>
          </Pressable>

          <Pressable
            onPress={() => {
              setSelectedSide("Sali");
            }}
            style={[
              styles.sideSelection,
              selectedSide === "Sali" && styles.selectedSide,
            ]}
          >
            <Text style={styles.text}>Sali</Text>
          </Pressable>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <BackButton />
      </View>
    </View>
  );
}
