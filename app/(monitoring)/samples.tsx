import React, { useMemo } from "react";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import BackButton from "@/components/buttons/BackButton";

import { useThemeColors } from "@/constants/ThemeColors";
import { getSampleStyles } from "@/styles/monitoring/sampleStyles";

export default function samples() {
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getSampleStyles(ThemeColors), [ThemeColors]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Näytteenotto</Text>
      <View style={styles.content}>
        <Text style={styles.text}>Tähän tulee näytteenotto</Text>
      </View>
      <View style={styles.buttonContainer}>
        <BackButton />
      </View>
    </View>
  );
}
