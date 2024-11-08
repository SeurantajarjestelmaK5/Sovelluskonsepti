import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button, Pressable, StyleSheet, FlatList } from "react-native";
import { InventoryItem } from "@/app/(inventory)/diningroom";
import { addInventoryItem } from "@/scripts/addInventoryItem";

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

  const categories = ["Tankit", "Olut", "Siiderit", "Tyhjät", "Viinit", "Alkoholi", "ALV14"];

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
          <Text style={styles.header}>Add New Item</Text>

          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={styles.input}
          />
          <TextInput
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={styles.input}
          />
          <TextInput
            placeholder="Unit"
            value={unit}
            onChangeText={setUnit}
            style={styles.input}
          />

          {/* Dropdown for Category */}
          <Pressable onPress={() => setShowCategoryDropdown(!showCategoryDropdown)} style={styles.dropdownButton}>
            <Text>{category || "Select Category"}</Text>
          </Pressable>
          {showCategoryDropdown && (
            <View style={styles.dropdownList}>
              <FlatList
                data={categories}
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <Pressable onPress={() => { setCategory(item); setShowCategoryDropdown(false); }}>
                    <Text style={styles.dropdownItem}>{item}</Text>
                  </Pressable>
                )}
              />
            </View>
          )}

          <Text style={styles.label}>Select ALV</Text>
          {[14, 25.5].map((value) => (
            <Pressable key={value} onPress={() => setAlv(value)} style={styles.radioButtonContainer}>
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
          <Button title="Add Item" onPress={handleAddItem} disabled={!isFormValid} />
          <Button title="Cancel" onPress={onClose} color="red" />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    padding: 20,
    borderRadius: 10,
  },
  header: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 8,
    marginBottom: 12,
  },
  dropdownButton: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    marginBottom: 10,
    borderRadius: 5,
  },
  dropdownList: {
    borderWidth: 1,
    borderColor: "#ccc",
    maxHeight: 100,
    marginBottom: 10,
    borderRadius: 5,
  },
  dropdownItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
  },
  radioButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  radioButton: {
    height: 20,
    width: 20,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#333",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 8,
  },
  radioButtonSelected: {
    backgroundColor: "#333",
  },
  radioButtonInner: {
    height: 10,
    width: 10,
    borderRadius: 5,
    backgroundColor: "white",
  },
});

export default AddItemModal;
