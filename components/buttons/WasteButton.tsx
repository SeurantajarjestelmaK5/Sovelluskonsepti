import React, { useEffect, useMemo, useState, useRef } from "react";
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  ActivityIndicator,
} from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, TextInput, TouchableRipple } from "react-native-paper";
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
  isLoading: boolean;
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
  isLoading,
}: WasteButtonProps) {
  const [displayedAmount, setDisplayedAmount] = useState<number>(data.määrä);
  const [wasteAmount, setWasteAmount] = useState<number>(0);
  const [modalType, setModalType] = useState<"plus" | "minus">("plus");
  const inputRef = useRef<any>(null);

  // Sync wasteAmount with the data prop
  useEffect(() => {
    setDisplayedAmount(data.määrä);
  }, [data.määrä]);

  // Focus the TextInput when the modal becomes visible
  useEffect(() => {
    if (wasteModal) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [wasteModal]);

  const submitEditing = async () => {
    setWasteModal(false);
    if (modalType === "plus") {
      await WasteFunctions.AddWaste(
        wasteName,
        date.month,
        date.year,
        date.day,
        wasteAmount
      );
    } else {
      await WasteFunctions.RemoveWaste(
        wasteName,
        date.month,
        date.year,
        date.day,
        wasteAmount
      );
    }
    addWaste();
  };

  return (
    <View key={data.id} style={styles.wasteContainer}>
      <View style={styles.wasteContent}>
        <Text style={styles.text}>{wasteName}</Text>
        {isLoading ? (
          <ActivityIndicator size="small" color={ThemeColors.tint} />
        ) : (
          <Text style={styles.text}>
            {displayedAmount} {data.yksikkö}
          </Text>
        )}
      </View>

      <TouchableRipple hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
        <MaterialCommunityIcons
          name="minus"
          size={37}
          color={ThemeColors.tint}
          onPress={() => {
            setModalType("minus");
            showModal(wasteName);
          }}
        />
      </TouchableRipple>

      <TouchableRipple hitSlop={{ top: 15, bottom: 15, left: 15, right: 15 }}>
        <MaterialCommunityIcons
          name="plus"
          size={37}
          color={ThemeColors.tint}
          onPress={() => {
            setModalType("plus");
            showModal(wasteName);
          }}
        />
      </TouchableRipple>

      <Modal
        visible={wasteModal}
        animationType="slide"
        transparent={true}
        onShow={() => inputRef.current?.focus()}
      >
        <TouchableWithoutFeedback onPress={() => setWasteModal(false)}>
          <View style={styles.wasteModalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.wasteModal}>
                <Text style={styles.header}>{wasteName}</Text>
                <Text style={{ ...styles.text, marginBottom: 10 }}>
                  {modalType === "plus" ? "Lisää jätettä" : "Poista jätettä"}
                </Text>
                <TextInput
                  ref={inputRef}
                  autoFocus={true}
                  mode="outlined"
                  style={styles.wasteInput}
                  placeholder="Määrä"
                  keyboardType="numeric"
                  activeOutlineColor={ThemeColors.tint}
                  onChangeText={(text) => setWasteAmount(Number(text))}
                  onSubmitEditing={submitEditing}
                />
                {/* <Button
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
                /> */}
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
}
