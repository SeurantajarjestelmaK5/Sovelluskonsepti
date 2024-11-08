import React, {useMemo} from "react";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";
import BackButton from "@/components/BackButton";

import { useThemeColors } from "@/constants/ThemeColors";
import { getTempStyles } from "@/styles/monitoring/tempStyles";

export default function temperatures() {
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getTempStyles(ThemeColors), [ThemeColors]);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Lämpötila</Text>
      <View style={styles.content}>
        <Text style={styles.text}>Tähän tulee lämpötilaseuranta</Text>
      </View>
      <View style={styles.buttonContainer}>
        <BackButton />
      </View>
    </View>
  );
}
