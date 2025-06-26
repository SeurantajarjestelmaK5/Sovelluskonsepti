import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Text, View, TextInput } from "react-native";
import { useThemeColors } from "@/constants/ThemeColors";
import { getMeatTempStyles } from "@/styles/views/meatTempStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";

export default function WashingMachineTemperatures() {
  const ThemeColors = useThemeColors();
  const styles = getMeatTempStyles(ThemeColors);
  const [beefTemp, setBeefTemp] = useState(0);
  const [porkTemp, setPorkTemp] = useState(0);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Remontissa! Palaa myöhemmin.</Text>
    </View>
  );
}
