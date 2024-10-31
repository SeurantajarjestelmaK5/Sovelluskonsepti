import React, { useMemo } from "react";
import { Link } from "expo-router";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

import { useThemeColors } from "@/constants/ThemeColors";
import { getCleaningStyle } from "@/styles/monitoring/cleaningStyles";

export default function cleaning() {
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getCleaningStyle(ThemeColors), [ThemeColors]);

  return (
    <View style={styles.container}>
      <Text>Viikkosiivous</Text>

      <Link href="../">
        <Button children="Back" mode="contained" />
      </Link>
    </View>
  );
}
