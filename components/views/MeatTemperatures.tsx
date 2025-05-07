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
      <View style={styles.measurement}>
        <Text style={styles.header}>Nauta</Text>
        <View style={styles.inputContainer}>
          <Text style={styles.header}>Lämpötila:</Text>
          <TextInput
            style={styles.input}
            value={beefTemp.toString()}
            keyboardType="numeric"
            onChangeText={(text) => {
              const value = parseFloat(text);
              if (!isNaN(value)) {
                setBeefTemp(value);
              } else {
                Alert.alert("Virheellinen syöte", "Syötä kelvollinen luku.");
              }
            }}
          />
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.header}>Päivämäärä:
          </Text>
          <TextInput
            style={styles.input}
            value={beefTemp.toString()}
            keyboardType="numeric"
            onChangeText={(text) => {
              const value = parseFloat(text);
              if (!isNaN(value)) {
                setBeefTemp(value);
              } else {
                Alert.alert("Virheellinen syöte", "Syötä kelvollinen luku.");
              }
            }}
          />
        </View>
      </View>
    </View>
  );
}
