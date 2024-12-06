import React, { useEffect, useMemo, useState } from "react";
import { View, Text, Modal, TouchableWithoutFeedback } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, TextInput } from "react-native-paper";
import * as WasteFunctions from "@/components/functions/WasteFunctions";
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
  addWaste: () => void;
  styles: any;
  ThemeColors: { tint: string };
  date: { day: string; month: string; year: string };
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
  date,
}: WasteButtonProps) {
  const [displayedAmount, setDisplayedAmount] = useState<number>(data.määrä);
  const [wasteAmount, setWasteAmount] = useState<number>(0);

  // Sync wasteAmount with the data prop
  useEffect(() => {
    setDisplayedAmount(data.määrä);
  }, [data.määrä]);

  return (
    <View key={data.id} style={styles.wasteContainer}>
      <View style={styles.wasteContent}>
        <Text style={styles.text}>{wasteName}</Text>
        <Text style={styles.text}>
          {displayedAmount} {data.yksikkö}
        </Text>
      </View>

      <MaterialCommunityIcons
        name="plus"
        size={35}
        color={ThemeColors.tint}
        onPress={() => showModal(wasteName)}
      />

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
                  onPress={async () => {
                    await WasteFunctions.AddWaste(
                      wasteName,
                      date.month,
                      date.year,
                      date.day,
                      wasteAmount
                    );
                    addWaste(); // This triggers re-fetch in the parent
                    setWasteModal(false);
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
