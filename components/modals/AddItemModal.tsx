import React, { useState, useMemo } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
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
  const [category, setCategory] = useState("Tankit");
  const [showCategoryDropdown, setShowCategoryDropdown] = useState(false);
  const [alv, setAlv] = useState(24);

  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getModalStyles(ThemeColors), [ThemeColors]);

  const categories = useMemo(() => {
    return location === "sali"
      ? ["Tankit", "Oluet", "Siiderit", "Tyhjät", "Viinit", "Alkoholit", "ALV14"]
      : ["Lihat", "Tuoreet", "Maitokylmiö", "Kuivat", "Pakasteet", "Muut"];
  }, [location]);

  const handleAddItem = async () => {
    if (!name || !quantity || !unit || !category) {
      return;
    }

    const newItem: InventoryItem = {
      Nimi: name,
      Määrä: parseInt(quantity) || 0,
      Yksikkö: unit,
      Kategoria: category,
      Alv: alv,
      Alv0: 0 / (1 + alv / 100),
      Hinta: 0,
      Yhteishinta: 0,
    };

    await addInventoryItem(selectedDate, location, newItem);
    setShowCategoryDropdown(false);
    onItemAdded();
    onClose();

    setName("");
    setQuantity("");
    setUnit("");
    setCategory("");
  };

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
            dropdownIconColor={ThemeColors.tint}
          >
            {categories.map((categoryOption) => (
              <Picker.Item key={categoryOption} label={categoryOption} value={categoryOption} />
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
              <Text style={{ color: 'white' }}>{value}%</Text>
            </Pressable>
          ))}

          <Button
            children="Lisää tuote"
            onPress={handleAddItem}
            mode="contained"
            disabled={!isFormValid}
            theme={{ colors: { onSurfaceDisabled: ThemeColors.text, surfaceDisabled: ThemeColors.navDefault, primary: ThemeColors.tint } }}
            style={{ marginBottom: 10, marginTop: 10 }}
            contentStyle={{ padding: 10 }}
          />
          <Button
            children="Peruuta"
            onPress={onClose}
            mode="text"
            textColor={ThemeColors.text}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

export default AddItemModal;
