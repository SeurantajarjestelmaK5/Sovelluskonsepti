import { useThemeColors } from "@/constants/ThemeColors";
import { useMemo, useEffect, useState } from "react";
import { Modal, View, Text, Pressable, TextInput } from "react-native";
import { findNextGiftcardId, GiftcardType } from "@/components/functions/GiftcardFunctions";
import { getGiftcardStyles } from "@/styles/giftcards/giftcardStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";

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
  const [newGiftcardCreated, setNewGiftcardCreated] = useState("");
  const [newGiftcardValid, setNewGiftcardValid] = useState("");

  useEffect(() => {
    if (visible) {
      setActiveTab("new");
      setGiftcardDates();
      findGiftcardId();
    }
    console.log(findGiftcardId());
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
    setNewGiftcardCreated(createdDate.toLocaleDateString());
    setNewGiftcardValid(validDate.toLocaleDateString());
  };

  const handleSubmit = () => {
    // TODO: Implement form submission logic
    console.log(`Submitting ${activeTab} giftcard`);
    onClose();
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
              <Text style={styles.formLabel}>Lahjakortin tiedot</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Lahjakortin ID"
                placeholderTextColor={ThemeColors.text + "80"}
                value={newGiftcardId}
              />
              <TextInput
                style={styles.textInput}
                placeholder="Arvo (€)"
                placeholderTextColor={ThemeColors.text + "80"}
                keyboardType="numeric"
                value={newGiftcardValue.toString()}
              />
              <Text style={styles.formLabel}>Lahjakortti luotu</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Luotu"
                placeholderTextColor={ThemeColors.text + "80"}
                keyboardType="numeric"
                value={newGiftcardCreated}
                onChangeText={setNewGiftcardCreated}
              />
              <Text style={styles.formLabel}>Lahjakortti voimassa</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Voimassa"
                placeholderTextColor={ThemeColors.text + "80"}
                keyboardType="numeric"
                value={newGiftcardValid}
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
