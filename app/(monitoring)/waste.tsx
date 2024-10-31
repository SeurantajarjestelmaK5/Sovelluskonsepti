import React, { useMemo } from "react";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import BackButton from "@/components/BackButton";

import { useThemeColors } from "@/constants/ThemeColors";
import { getWasteStyles } from "@/styles/monitoring/wasteStyles";

export default function waste() {
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getWasteStyles(ThemeColors), [ThemeColors]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Jätteet</Text>
      <View style={styles.content}>
        <Text style={styles.text}>Tähän tulee jätteiden seuranta</Text>
      </View>
      <View style={styles.buttonContainer}>
        <BackButton />
      </View>
    </View>
  );
}
