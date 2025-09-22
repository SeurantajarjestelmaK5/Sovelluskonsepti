import { useThemeColors } from "@/constants/ThemeColors";
import { useMemo, useEffect, useState } from "react";
import { Modal, View, Text, Pressable } from "react-native";
import {
  addGiftcard,
  findNextGiftcardId,
  GiftcardType,
} from "@/components/functions/GiftcardFunctions";
import { getGiftcardStyles } from "@/styles/giftcards/giftcardStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, TextInput } from "react-native-paper";
import { Timestamp } from "firebase/firestore";

interface AddGiftcardModalProps {
  visible: boolean;
  onClose: () => void;
  giftcard?: GiftcardType;
}

export default function AddGiftcardModal({
  visible,
  onClose,
  giftcard,
}: AddGiftcardModalProps) {
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getGiftcardStyles(ThemeColors), [ThemeColors]);
  const [activeTab, setActiveTab] = useState<"new" | "existing">("new");
  const [newGiftcardId, setNewGiftcardId] = useState("");
  const [newGiftcardValue, setNewGiftcardValue] = useState<string>("");
  const [newGiftcardCreated, setNewGiftcardCreated] = useState<Date | null>(
    null
  );
  const [newGiftcardValid, setNewGiftcardValid] = useState<Date | null>(null);

  useEffect(() => {
    if (visible) {
      setActiveTab("new");
      setGiftcardDates();
      findGiftcardId();
      setNewGiftcardValue("");
    }
  }, [visible]);

  const findGiftcardId = async () => {
    const id = await findNextGiftcardId();
    setNewGiftcardId(id);
  };

  const setGiftcardDates = () => {
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    const createdDate = new Date(currentYear, currentMonth, currentDay);
    const validDate = new Date(currentYear + 1, currentMonth, currentDay);
    setNewGiftcardCreated(createdDate);
    setNewGiftcardValid(validDate);
  };

  const validateNumericInput = (text: string) => {
    // Allow empty string, numbers, and one decimal point
    const numericRegex = /^[0-9]*\.?[0-9]*$/;
    return numericRegex.test(text);
  };

  const handleSubmit = async () => {
    if (isNewGiftcard) {
      if (
        newGiftcardId === "" ||
        newGiftcardValue === "" ||
        newGiftcardCreated === null ||
        newGiftcardValid === null
      ) {
        return;
      }
      try {
        await addGiftcard({
          id: newGiftcardId,
          value: Number(newGiftcardValue),
          start_date: Timestamp.fromDate(newGiftcardCreated),
          end_date: Timestamp.fromDate(newGiftcardValid),
          expired: false,
          used: false,
        });

        setNewGiftcardId("");
        setNewGiftcardValue("");
        setNewGiftcardCreated(null);
        setNewGiftcardValid(null);
        onClose();
      } catch (error) {
        console.error("Failed to add giftcard:", error);
      }
    }
  };

  const isNewGiftcard = activeTab === "new";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Lisää lahjakortti</Text>
          <Pressable onPress={onClose} style={styles.closeButton}>
            <MaterialCommunityIcons
              name="close"
              size={24}
              color={ThemeColors.text}
            />
          </Pressable>
        </View>

        {/* Content */}
        <View style={styles.modalContent}>
          {/* Tab Navigation */}
          <View style={styles.tabContainer}>
            <Pressable
              style={[
                styles.tab,
                activeTab === "new" ? styles.activeTab : styles.inactiveTab,
              ]}
              onPress={() => setActiveTab("new")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "new"
                    ? styles.activeTabText
                    : styles.inactiveTabText,
                ]}
              >
                Uusi lahjakortti
              </Text>
            </Pressable>
            <Pressable
              style={[
                styles.tab,
                activeTab === "existing"
                  ? styles.activeTab
                  : styles.inactiveTab,
              ]}
              onPress={() => setActiveTab("existing")}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === "existing"
                    ? styles.activeTabText
                    : styles.inactiveTabText,
                ]}
              >
                Olemassa oleva
              </Text>
            </Pressable>
          </View>

          {/* Form Content */}
          {isNewGiftcard ? (
            // New giftcard form
            <View style={styles.formContainer}>
              <TextInput
                mode="outlined"
                label="Lahjakortin numero"
                placeholder="Lahjakortin ID"
                value={newGiftcardId}
                error={newGiftcardId === "" || newGiftcardId === null}
                style={styles.textInput}
                outlineColor={ThemeColors.navDefault}
                activeOutlineColor={ThemeColors.tint}
                onChangeText={(text) => setNewGiftcardId(text)}
              />
              <TextInput
                mode="outlined"
                label="Lahjakortin arvo (€)"
                placeholder="Arvo (€)"
                value={newGiftcardValue}
                error={newGiftcardValue === "" || newGiftcardValue === null}
                style={styles.textInput}
                outlineColor={ThemeColors.navDefault}
                activeOutlineColor={ThemeColors.tint}
                keyboardType="numeric"
                onChangeText={(text) => {
                  if (validateNumericInput(text)) {
                    setNewGiftcardValue(text);
                  }
                }}
              />
              <TextInput
                mode="outlined"
                label="Lahjakortti luotu"
                placeholder="Luotu"
                value={
                  newGiftcardCreated
                    ? newGiftcardCreated.toLocaleDateString()
                    : ""
                }
                error={newGiftcardCreated === null}
                style={styles.textInput}
                outlineColor={ThemeColors.navDefault}
                activeOutlineColor={ThemeColors.tint}
                keyboardType="numeric"
                onChangeText={(text) => {
                  const date = new Date(text);
                  if (!isNaN(date.getTime())) {
                    setNewGiftcardCreated(date);
                  }
                }}
              />
              <TextInput
                mode="outlined"
                label="Lahjakortti voimassa"
                placeholder="Voimassa"
                value={
                  newGiftcardValid ? newGiftcardValid.toLocaleDateString() : ""
                }
                error={newGiftcardValid === null}
                style={styles.textInput}
                outlineColor={ThemeColors.navDefault}
                activeOutlineColor={ThemeColors.tint}
                keyboardType="numeric"
                onChangeText={(text) => {
                  const date = new Date(text);
                  if (!isNaN(date.getTime())) {
                    setNewGiftcardValid(date);
                  }
                }}
              />
              <Text style={styles.helpText}>
                Uusi lahjakortti luodaan järjestelmään
              </Text>
            </View>
          ) : (
            // Existing giftcard form
            <View style={styles.formContainer}>
              <TextInput
                mode="outlined"
                label="Lisää aiemmin myyty lahjakortti"
                placeholder="Lahjakortin ID"
                style={styles.textInput}
                outlineColor={ThemeColors.navDefault}
                activeOutlineColor={ThemeColors.tint}
                onChangeText={(text) => setNewGiftcardId(text)}
              />
              <TextInput
                mode="outlined"
                label="Arvo (€)"
                placeholder="Arvo (€)"
                style={styles.textInput}
                outlineColor={ThemeColors.navDefault}
                activeOutlineColor={ThemeColors.tint}
                keyboardType="decimal-pad"
              />
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.modalFooter}>
          <Button
            mode="outlined"
            onPress={onClose}
            style={[styles.modalButton, { borderColor: "transparent" }]}
            labelStyle={styles.buttonLabel}
          >
            Peruuta
          </Button>
          <Button
            mode="contained"
            onPress={handleSubmit}
            style={[styles.modalButton, styles.submitButton]}
            labelStyle={styles.buttonLabel}
          >
            {isNewGiftcard ? "Luo lahjakortti" : "Lisää lahjakortti"}
          </Button>
        </View>
      </View>
    </Modal>
  );
}
