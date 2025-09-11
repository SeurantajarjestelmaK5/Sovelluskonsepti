import { GiftcardType } from "@/components/functions/GiftcardFunctions";
import { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useThemeColors } from "@/constants/ThemeColors";
import { getGiftcardStyles } from "@/styles/giftcards/giftcardStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Portal, Modal, Dialog, Button, Paragraph } from "react-native-paper";

export default function Giftcard({ giftcard }: { giftcard: GiftcardType }) {
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getGiftcardStyles(ThemeColors), [ThemeColors]);
  const [useGiftcardModal, setUseGiftcardModal] = useState(false);
  return (
    <>
      <View style={styles.giftcard}>
        {/* <MaterialCommunityIcons
      name="pencil"
      style={{color: "white", position: "absolute", left: 10, top: 10, fontSize: 25}}
    /> */}
        <View style={[styles.cardAttribute, { minWidth: "22%" }]}>
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
        <View style={styles.buttonContainer}>
          <Pressable style={styles.spendButton}>
            <MaterialCommunityIcons name="minus" style={styles.spendIcon} />
          </Pressable>
          <Pressable
            style={styles.deleteButton}
            onPress={() => setUseGiftcardModal(true)}
          >
            <MaterialCommunityIcons
              name="check-bold"
              style={styles.deleteIcon}
            />
          </Pressable>
        </View>
      </View>

      {/* Use Paper's Dialog for better UX */}
      <Portal>
        <Dialog
          visible={useGiftcardModal}
          onDismiss={() => setUseGiftcardModal(false)}
        >
          <Dialog.Title>Käytä lahjakortti</Dialog.Title>
          <Dialog.Content>
            <Text>
              Haluatko varmasti käyttää lahjakortin "{giftcard.id}" arvolla{" "}
              {giftcard.value}€?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={() => setUseGiftcardModal(false)}>Peruuta</Button>
            <Button
              mode="contained"
              onPress={() => {
                // TODO: Implement giftcard usage logic
                console.log(`Using giftcard: ${giftcard.id}`);
                setUseGiftcardModal(false);
              }}
            >
              Käytä
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
