import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Modal, TouchableWithoutFeedback } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, TextInput } from "react-native-paper";
import { useThemeColors } from "@/constants/ThemeColors";
import { getWasteStyles } from "@/styles/monitoring/wasteStyles";

interface WasteData {
  id: string;
  yksikkö: string;
  määrä: number;
}

interface WasteButtonProps {
  data: WasteData;
  wasteName: string;
  wasteModal: boolean;
  showModal: (wasteName: string) => void;
  setWasteModal: (visible: boolean) => void;
  addWaste: (id: string, amount: number) => void;
  styles: any; // Pass the styles for layout, typography, etc.
  ThemeColors: { tint: string }; // Theme colors for consistency
}

export default function WasteButton({
  data,
  wasteName,
  wasteModal,
  showModal,
  setWasteModal,
  addWaste,
  styles,
  ThemeColors,
}: WasteButtonProps) {
  const [wasteAmount, setWasteAmount] = useState<number>(0);

  useEffect(() => {
    console.log(data);
  }, [data]);


    if (!data) {
      return (
        <View style={styles.wasteContainer}>
          <Text style={styles.text}>{wasteName}</Text>
          <Text style={styles.text}>Ei tietoja</Text>{" "}
          {/* Display placeholder */}
          <MaterialCommunityIcons
            name="plus"
            size={35}
            color={ThemeColors.tint}
            onPress={() => showModal(wasteName)}
          />
        </View>
      );
    }

  return (
    <View key={data.id} style={styles.wasteContainer}>
      <View style={styles.wasteContent}>
        <Text style={styles.text}>{wasteName}</Text>
        <Text style={styles.text}>
          {data.määrä}
          {data.yksikkö}
        </Text>
      </View>

      {/* Add waste button */}
      <MaterialCommunityIcons
        name="plus"
        size={35}
        color={ThemeColors.tint}
        onPress={() => showModal(wasteName)}
      />

      {/* Waste modal */}
      <Modal
        visible={wasteModal}
        animationType="slide"
        transparent={true}
        onDismiss={() => setWasteModal(false)}
      >
        <TouchableWithoutFeedback onPress={() => setWasteModal(false)}>
          <View style={styles.wasteModalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.wasteModal}>
                <Text style={styles.header}>{wasteName}</Text>
                <TextInput
                  mode="outlined"
                  style={styles.wasteInput}
                  placeholder="Määrä"
                  keyboardType="numeric"
                  activeOutlineColor={ThemeColors.tint}
                  onChangeText={(text) => setWasteAmount(Number(text))}
                />
                <Button
                  children="Lisää"
                  icon={() => <MaterialCommunityIcons name="plus" size={20} />}
                  contentStyle={{ flexDirection: "row-reverse" }}
                  mode="contained"
                  buttonColor={ThemeColors.tint}
                  onPress={() => {
                    addWaste(data.id, wasteAmount);
                    setWasteModal(false); // Close modal
                  }}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
