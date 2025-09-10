import { GiftcardType } from "@/components/functions/GiftcardFunctions";
import { useMemo } from "react";
import { View, Text, Pressable } from "react-native";
import { useThemeColors } from "@/constants/ThemeColors";
import { getGiftcardStyles } from "@/styles/giftcards/giftcardStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function Giftcard({ giftcard }: { giftcard: GiftcardType }) {
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getGiftcardStyles(ThemeColors), [ThemeColors]);
  return (
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
        <Pressable style={styles.deleteButton}>
          <MaterialCommunityIcons name="check-bold" style={styles.deleteIcon} />
        </Pressable>
      </View>
    </View>
  );
}
