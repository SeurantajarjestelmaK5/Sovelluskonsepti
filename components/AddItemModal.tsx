import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
  FlatList,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import { InventoryItem } from "@/app/(inventory)/diningroom";
import { addInventoryItem } from "@/scripts/addInventoryItem";
import { getModalStyles } from "@/styles/components/itemModalStyle";
import { useThemeColors } from "@/constants/ThemeColors";

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onItemAdded: () => void;
  selectedDate: any;
  location: "sali" | "keittiö";
}

const AddItemModal: React.FC<AddItemModalProps> = ({
  visible,
  onClose,
  onItemAdded,
  selectedDate,
  location,
}) => {
  const [name, setName] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [category, setCategory] = useState("");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [alv, setAlv] = useState(24);

  const categories = [
    "Tankit",
    "Oluet",
    "Siiderit",
    "Tyhjät",
    "Viinit",
    "Alkoholit",
    "ALV14",
  ];
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getModalStyles(ThemeColors), [ThemeColors]);

  const handleAddItem = async () => {
    // Check that all fields are filled
    if (!name || !quantity || !unit || !category) {
      return;
    }

    const newItem: InventoryItem = {
      Nimi: name,
      Määrä: parseInt(quantity) || 0,
      Yksikkö: unit,
      Kategoria: category,
      Alv: alv,
      Hinta: 0,
      Yhteishinta: 0,
    };

    await addInventoryItem(selectedDate, location, newItem);
    setShowCategoryDropdown(false);
    onItemAdded();
    onClose();

    // Reset form fields
    setName("");
    setQuantity("");
    setUnit("");
    setCategory("");
  };

  // Check if all fields are filled to enable the submit button
  const isFormValid = name && quantity && unit && category;

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modalContent} onPress={() => {}}>
          <Text style={styles.header}>Lisää tuote</Text>

          <TextInput
            placeholder="Nimi"
            value={name}
            onChangeText={setName}
            style={styles.input}
            mode="outlined"
            activeOutlineColor={ThemeColors.tint}
          />
          <TextInput
            placeholder="Määrä"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={styles.input}
            mode="outlined"
            activeOutlineColor={ThemeColors.tint}
          />
          <TextInput
            placeholder="Yksikkö"
            value={unit}
            onChangeText={setUnit}
            style={styles.input}
            mode="outlined"
            activeOutlineColor={ThemeColors.tint}
          />
          <Picker
            selectedValue={category}
            onValueChange={(itemValue) => setCategory(itemValue as string)}
            mode="dropdown"
            style={styles.dropdownButton}
          >
            {categories.map((category) => (
              <Picker.Item key={category} label={category} value={category} />
            ))}
          </Picker>

          <Text style={styles.label}>Select ALV</Text>
          {[14, 25.5].map((value) => (
            <Pressable
              key={value}
              onPress={() => setAlv(value)}
              style={styles.radioButtonContainer}
            >
              <View
                style={[
                  styles.radioButton,
                  alv === value && styles.radioButtonSelected,
                ]}
              >
                {alv === value && <View style={styles.radioButtonInner} />}
              </View>
              <Text>{value}%</Text>
            </Pressable>
          ))}

          {/* Disable "Add Item" button if form is not valid */}
          <Button
            children="Lisää tuote"
            onPress={handleAddItem}
            mode="contained"
            disabled={!isFormValid}
            theme={{ colors: { onSurfaceDisabled: ThemeColors.text, surfaceDisabled: ThemeColors.navDefault, primary: ThemeColors.tint } }}
          />
          <Button
            children="Peruuta"
            onPress={onClose}
            mode="text"
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AddItemModal;
