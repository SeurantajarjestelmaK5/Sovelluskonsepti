import React, { useMemo } from "react";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import BackButton from "@/components/BackButton";

import { useThemeColors } from "@/constants/ThemeColors";
import { getCleaningStyles } from "@/styles/monitoring/cleaningStyles";

export default function cleaning() {
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getCleaningStyles(ThemeColors), [ThemeColors]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Viikkosiivous</Text>
      <View style={styles.content}>
        <Text style={styles.text}>Tähän tulee viikkosiivous</Text>
      </View>
      <View style={styles.buttonContainer}>
        <BackButton />
      </View>
    </View>
  );
}
