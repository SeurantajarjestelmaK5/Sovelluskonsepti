import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import { useThemeColors } from "@/constants/ThemeColors";
import { getWashingTempStyles } from "@/styles/views/washingMachineTempStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";

export default function CoolingTemperatures() {
  const ThemeColors = useThemeColors();
  const styles = getWashingTempStyles(ThemeColors);

  return (
    <View style={styles.container}>
      <Text>Jäähdytys</Text>
    </View>
  );
}
