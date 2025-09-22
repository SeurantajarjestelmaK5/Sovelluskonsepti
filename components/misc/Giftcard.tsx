import { GiftcardType, useGiftcard } from "@/components/functions/GiftcardFunctions";
import { useMemo, useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useThemeColors } from "@/constants/ThemeColors";
import { getGiftcardStyles } from "@/styles/giftcards/giftcardStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Portal, Modal, Dialog, Button, Surface } from "react-native-paper";

export default function Giftcard({ giftcard, onUse }: { giftcard: GiftcardType, onUse: () => void }) {
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getGiftcardStyles(ThemeColors), [ThemeColors]);
  const [useGiftcardModal, setUseGiftcardModal] = useState(false);
  return (
    <>
      <Surface style={styles.giftcard} elevation={2}>
        <View style={styles.buttonContainer}>
          <Pressable
            style={styles.deleteButton}
            onPress={() => setUseGiftcardModal(true)}
          >
            <MaterialCommunityIcons
              name="check-bold"
              style={styles.deleteIcon}
            />
          </Pressable>
          <Pressable style={styles.spendButton}>
            <MaterialCommunityIcons name="minus" style={styles.spendIcon} />
          </Pressable>
        </View>
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
      </Surface>

      {/* Use Paper's Dialog for better UX */}
      <Portal>
        <Dialog
          visible={useGiftcardModal}
          onDismiss={() => setUseGiftcardModal(false)}
        >
          <Dialog.Title>Käytä lahjakortti</Dialog.Title>
          <Dialog.Content>
            <Text style={styles.dialogText}>
              Haluatko varmasti käyttää lahjakortin{" "}
              <Text style={styles.valueHighlight}>{giftcard.id}</Text> arvolla{" "}
              <Text style={styles.valueHighlight}>{giftcard.value}€</Text>?
            </Text>
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
              onPress={() => {
                useGiftcard(giftcard.id);
                setUseGiftcardModal(false);
                onUse();
              }}
              style={styles.actionButton}
              contentStyle={{ backgroundColor: "green" }}
              labelStyle={{ fontSize: 16 }}
              children="Käytä"
            />
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </>
  );
}
