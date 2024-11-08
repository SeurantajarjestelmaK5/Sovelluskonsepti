import React, { useMemo } from "react";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import BackButton from "@/components/BackButton";

import { useThemeColors } from "@/constants/ThemeColors";
import { getReportStyles } from "@/styles/reports/placeholder";

export default function sampleReport() {
  const colors = useThemeColors();
  const styles = useMemo(() => getReportStyles(colors), [colors]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Näytteet - Raportit</Text>
      <View style={styles.content}>
        <Text style={styles.text}>Näytteenottoraportit</Text>
      </View>
      <View style={styles.buttonContainer}>
        <BackButton />
      </View>
    </View>
  );
}
