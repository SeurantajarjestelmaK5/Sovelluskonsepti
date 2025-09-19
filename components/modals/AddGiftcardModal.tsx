import { useThemeColors } from "@/constants/ThemeColors";
import { useMemo, useEffect, useState } from "react";
import { Modal, View, Text, Pressable, TextInput } from "react-native";
import {
  AddGiftcard,
  findNextGiftcardId,
  GiftcardType,
} from "@/components/functions/GiftcardFunctions";
import { getGiftcardStyles } from "@/styles/giftcards/giftcardStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";
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
  const [newGiftcardValue, setNewGiftcardValue] = useState<number | "">("");
  const [newGiftcardCreated, setNewGiftcardCreated] = useState<Date | null>(
    null
  );
  const [newGiftcardValid, setNewGiftcardValid] = useState<Date | null>(null);

  useEffect(() => {
    if (visible) {
      setActiveTab("new");
      setGiftcardDates();
      findGiftcardId();
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
        await AddGiftcard(
          {
            id: newGiftcardId,
            value: Number(newGiftcardValue),
            start_date: Timestamp.fromDate(newGiftcardCreated),
            end_date: Timestamp.fromDate(newGiftcardValid),
            expired: false,
            used: false,
          },
        );

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
              <Text style={styles.formLabel}>Lahjakortin numero</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Lahjakortin ID"
                placeholderTextColor={ThemeColors.text + "80"}
                value={newGiftcardId}
              />
              <Text style={styles.formLabel}>Lahjakortin arvo (€)</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    borderColor:
                      newGiftcardValue === "" || newGiftcardValue === null
                        ? "red"
                        : ThemeColors.navDefault,
                  },
                ]}
                placeholder="Arvo (€)"
                placeholderTextColor={ThemeColors.text + "80"}
                keyboardType="numeric"
                value={newGiftcardValue.toString()}
                onChangeText={(text) =>
                  setNewGiftcardValue(text === "" ? "" : Number(text))
                }
              />
              <Text style={styles.formLabel}>Lahjakortti luotu</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    borderColor:
                      newGiftcardCreated === null
                        ? "red"
                        : ThemeColors.navDefault,
                  },
                ]}
                placeholder="Luotu"
                placeholderTextColor={ThemeColors.text + "80"}
                keyboardType="numeric"
                value={
                  newGiftcardCreated
                    ? newGiftcardCreated.toLocaleDateString()
                    : ""
                }
                onChangeText={(text) => {
                  const date = new Date(text);
                  if (!isNaN(date.getTime())) {
                    setNewGiftcardCreated(date);
                  }
                }}
              />
              <Text style={styles.formLabel}>Lahjakortti voimassa</Text>
              <TextInput
                style={[
                  styles.textInput,
                  {
                    borderColor:
                      newGiftcardValid === null
                        ? "red"
                        : ThemeColors.navDefault,
                  },
                ]}
                placeholder="Voimassa"
                placeholderTextColor={ThemeColors.text + "80"}
                keyboardType="numeric"
                value={
                  newGiftcardValid ? newGiftcardValid.toLocaleDateString() : ""
                }
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
              <Text style={styles.formLabel}>
                Lisää aiemmin myyty lahjakortti
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Lahjakortin ID"
                placeholderTextColor={ThemeColors.text + "80"}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Arvo (€)"
                placeholderTextColor={ThemeColors.text + "80"}
                keyboardType="numeric"
              />
            </View>
          )}
        </View>

        {/* Footer */}
        <View style={styles.modalFooter}>
          <Button
            mode="outlined"
            onPress={onClose}
            style={[styles.modalButton, styles.cancelButton]}
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
