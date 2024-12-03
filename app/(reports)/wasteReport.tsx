import React, { useMemo } from "react";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import BackButton from "@/components/buttons/BackButton";

import { useThemeColors } from "@/constants/ThemeColors";
import { getReportStyles } from "@/styles/reports/placeholder";

export default function wasteReport() {
  const colors = useThemeColors();
  const styles = useMemo(() => getReportStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Jätteet - Raportit</Text>
      <View style={styles.content}>
        <Text style={styles.text}>Roskisraportit</Text>
      </View>
      <View style={styles.buttonContainer}>
        <BackButton />
      </View>
    </View>
  );
}
