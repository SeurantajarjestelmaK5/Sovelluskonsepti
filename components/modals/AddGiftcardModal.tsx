import { useThemeColors } from "@/constants/ThemeColors";
import { useMemo, useEffect } from "react";
import { Modal, View, Text, Pressable, TextInput } from "react-native";
import { GiftcardType } from "@/components/functions/GiftcardFunctions";
import { getGiftcardStyles } from "@/styles/giftcards/giftcardStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button } from "react-native-paper";

interface AddGiftcardModalProps {
  visible: boolean;
  onClose: () => void;
  modalType: "new" | "existing";
  giftcard?: GiftcardType;
}

export default function AddGiftcardModal({
  visible,
  onClose,
  modalType,
  giftcard,
}: AddGiftcardModalProps) {
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getGiftcardStyles(ThemeColors), [ThemeColors]);

  useEffect(() => {
    // Reset form when modal opens
    if (visible) {
      // Add any form reset logic here if needed
    }
  }, [visible]);

  const handleSubmit = () => {
    // TODO: Implement form submission logic
    console.log(`Submitting ${modalType} giftcard`);
    onClose();
  };

  const isNewGiftcard = modalType === "new";

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <View style={styles.modalContainer}>
        {/* Header */}
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>
            {isNewGiftcard
              ? "Lisää uusi lahjakortti"
              : "Lisää olemassa oleva lahjakortti"}
          </Text>
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
          {isNewGiftcard ? (
            // New giftcard form
            <View style={styles.formContainer}>
              <Text style={styles.formLabel}>Lahjakortin tiedot</Text>
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
              <Text style={styles.helpText}>
                Uusi lahjakortti luodaan järjestelmään
              </Text>
            </View>
          ) : (
            // Existing giftcard form
            <View style={styles.formContainer}>
              <Text style={styles.formLabel}>
                Hae olemassa oleva lahjakortti
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="Lahjakortin ID"
                placeholderTextColor={ThemeColors.text + "80"}
              />
              <Text style={styles.helpText}>
                Syötä olemassa olevan lahjakortin ID
              </Text>
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
            {isNewGiftcard ? "Luo lahjakortti" : "Hae lahjakortti"}
          </Button>
        </View>
      </View>
    </Modal>
  );
}
