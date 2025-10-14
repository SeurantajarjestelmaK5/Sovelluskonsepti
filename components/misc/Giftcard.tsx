import {
  GiftcardType,
  useGiftcard,
  spendGiftcard,
  setExpiredGiftcard,
} from "@/components/functions/GiftcardFunctions";
import { useEffect, useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useThemeColors } from "@/constants/ThemeColors";
import { getGiftcardStyles } from "@/styles/giftcards/giftcardStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import {
  Portal,
  Modal,
  Dialog,
  Button,
  Surface,
  TextInput,
  HelperText,
} from "react-native-paper";

export default function Giftcard({
  giftcard,
  onUse,
}: {
  giftcard: GiftcardType;
  onUse: () => void;
}) {
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getGiftcardStyles(ThemeColors), [ThemeColors]);
  const [useGiftcardModal, setUseGiftcardModal] = useState(false);
  const [spendAmountModal, setSpendAmountModal] = useState(false);
  const [spendAmount, setSpendAmount] = useState("");
  const [helperText, setHelperText] = useState("");
  const [expired, setExpired] = useState(false);

  const validateNumericInput = (text: string) => {
    // Allow empty string, numbers, and one decimal point
    const numericRegex = /^[0-9]*\.?[0-9]*$/;
    return numericRegex.test(text);
  };

  const checkExpiration = () => {
    const currentDate = new Date();
    const giftcardDate = giftcard.end_date.toDate();
    if (currentDate > giftcardDate) {
      setExpiredGiftcard(giftcard.id);
      setExpired(true);
    }
    return;
  };

  useEffect(() => {
    checkExpiration();
  }, []);

  const closeSpendAmountModal = () => {
    setSpendAmountModal(false);
    setHelperText("");
    setSpendAmount("");
  };
  const handleSpendAmount = async () => {
    if (spendAmount === "") {
      setHelperText("Anna käytettävä määrä");
      return;
    }
    if (Number(spendAmount) > giftcard.value) {
      setHelperText("Lahjakortin arvo on liian pieni");
      return;
    }
    await spendGiftcard(giftcard.id, spendAmount);
    closeSpendAmountModal();
    onUse();
  };

  return (
    <>
      <Surface style={styles.giftcard} elevation={1}>
        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.deleteButton,
              {
                backgroundColor: expired ? "red" : "green",
                borderColor: expired ? "red" : "green",
              },
            ]}
            onPress={() => setUseGiftcardModal(true)}
          >
            <MaterialCommunityIcons
              name={expired ? "calendar-remove" : "check-bold"}
              style={styles.deleteIcon}
            />
          </Pressable>
          <Pressable
            style={[
              styles.spendButton,
              { display: expired ? "none" : "flex" },
            ]}
            onPress={() => setSpendAmountModal(true)}
          >
            <MaterialCommunityIcons name="minus" style={styles.spendIcon} />
          </Pressable>
        </View>
        <View
          style={[styles.cardAttribute, { minWidth: "22%", maxWidth: "22%" }]}
        >
          <MaterialCommunityIcons
            name="wallet-giftcard"
            style={styles.attributeIcon}
          />
          <Text style={styles.cardLabel}>{giftcard.id}</Text>
        </View>
        <View style={styles.cardAttribute}>
          <MaterialCommunityIcons
            name="currency-eur"
            style={styles.attributeIcon}
          />
          <Text style={styles.cardLabel}>{giftcard.value}€</Text>
        </View>
        <View style={styles.cardAttribute}>
          <MaterialCommunityIcons
            name="calendar-plus"
            style={styles.attributeIcon}
          />
          <Text style={styles.cardLabel}>
            {giftcard.start_date.toDate().toLocaleDateString()}
          </Text>
        </View>
        <View style={styles.cardAttribute}>
          <MaterialCommunityIcons
            name="calendar-remove"
            style={styles.attributeIcon}
          />
          <Text style={styles.cardLabel}>
            {giftcard.end_date.toDate().toLocaleDateString()}
          </Text>
        </View>
      </Surface>

      {/* Use Paper's Dialog for better UX */}
      <Portal>
        <Dialog
          visible={useGiftcardModal}
          onDismiss={() => setUseGiftcardModal(false)}
        >
          <Dialog.Title>
            {expired
              ? "Lahjakortti on erääntynyt"
              : "Käytä lahjakortti"}
          </Dialog.Title>
          <Dialog.Content>
            {expired ? (
              <Text style={styles.dialogText}>
                Haluatko poistaa lahjakortin{" "}
                <Text style={[styles.valueHighlight, { color: "red" }]}>
                  {giftcard.id}
                </Text>
                ?
              </Text>
            ) : (
              <Text style={styles.dialogText}>
                Haluatko varmasti käyttää lahjakortin{" "}
                <Text style={styles.valueHighlight}>{giftcard.id}</Text> arvolla{" "}
                <Text style={styles.valueHighlight}>{giftcard.value}€</Text>?
              </Text>
            )}
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              onPress={() => setUseGiftcardModal(false)}
              style={styles.actionButton}
              labelStyle={{ fontSize: 16, color: ThemeColors.text }}
              children="Peruuta"
            />
            <Button
              mode="contained"
              onPress={async () => {
                try {
                  await useGiftcard(giftcard.id, expired);
                  setUseGiftcardModal(false);
                  onUse();
                } catch (error) {
                  console.error("Failed to use giftcard:", error);
                  // Keep modal open if there's an error
                }
              }}
              style={styles.actionButton}
              contentStyle={{
                backgroundColor: expired ? "red" : "green",
              }}
              labelStyle={{ fontSize: 16 }}
              children={expired ? "Poista" : "Käytä"}
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
      <Portal>
        <Dialog visible={spendAmountModal} onDismiss={closeSpendAmountModal}>
          <Dialog.Title>Käytä osa lahjakortin arvosta</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Paljonko haluat käyttää lahjakortin arvosta?
            </Text>
            <TextInput
              mode="outlined"
              style={styles.spendAmountInput}
              placeholder="Määrä"
              keyboardType="numeric"
              activeOutlineColor={ThemeColors.tint}
              onChangeText={(text) => {
                if (validateNumericInput(text)) {
                  setSpendAmount(text);
                }
              }}
              value={spendAmount}
            />
            <HelperText
              type="error"
              visible={helperText !== ""}
              style={styles.helperText}
            >
              {helperText}
            </HelperText>
          </Dialog.Content>

          <Dialog.Actions>
            <Button
              onPress={closeSpendAmountModal}
              style={styles.actionButton}
              labelStyle={{ fontSize: 16, color: ThemeColors.text }}
              children="Peruuta"
            />

            <Button
              mode="contained"
              onPress={handleSpendAmount}
              style={styles.actionButton}
              labelStyle={{ fontSize: 16 }}
              children="Käytä"
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
