// AddItemModal.tsx
import React, { useState } from "react";
import { Modal, View, Text, TextInput, Button, Pressable } from "react-native";
import { InventoryItem } from "@/app/(inventory)/diningroom"; // Import your InventoryItem type
import { addInventoryItem } from "@/scripts/addInventoryItem"; // Import your addInventoryItem function

interface AddItemModalProps {
  visible: boolean;
  onClose: () => void;
  onItemAdded: () => void; // Callback to refresh the list after adding an item
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
  const [alv, setAlv] = useState(24); // Default ALV to 24

  const handleAddItem = async () => {
    const newItem: InventoryItem = {
      Nimi: name,
      Määrä: parseInt(quantity) || 0,
      Yksikkö: unit,
      Kategoria: category,
      Alv: alv,
      Hinta: 0, // Initial Hinta set to 0
      Yhteishinta: 0, // Initial Yhteishinta set to 0
    };

    await addInventoryItem(selectedDate, location, newItem);
    setName("")
    setQuantity("")
    setUnit("")
    setCategory("")
    onItemAdded(); // Notify the parent component to refresh the data
    onClose(); // Close the modal
  };

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0, 0, 0, 0.5)" }}>
        <View style={{ padding: 20, backgroundColor: "white", borderRadius: 8, width: "80%" }}>
          <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Add New Item</Text>

          <TextInput
            placeholder="Name"
            value={name}
            onChangeText={setName}
            style={{ marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
          />
          <TextInput
            placeholder="Quantity"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            style={{ marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
          />
          <TextInput
            placeholder="Unit"
            value={unit}
            onChangeText={setUnit}
            style={{ marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
          />
          <TextInput
            placeholder="Category"
            value={category}
            onChangeText={setCategory}
            style={{ marginBottom: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" }}
          />

          <Text style={{ fontSize: 16, marginBottom: 5 }}>Select ALV</Text>
          {[ 14, 24].map((value) => (
            <Pressable key={value} onPress={() => setAlv(value)} style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
              <View
                style={{
                  height: 20,
                  width: 20,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: "#333",
                  alignItems: "center",
                  justifyContent: "center",
                  marginRight: 8,
                }}
              >
                {alv === value && <View style={{ height: 10, width: 10, borderRadius: 5, backgroundColor: "#333" }} />}
              </View>
              <Text>{value}%</Text>
            </Pressable>
          ))}

          <Button title="Add Item" onPress={handleAddItem} />
          <Button title="Cancel" onPress={onClose} color="red" />
        </View>
      </View>
    </Modal>
  );
};

export default AddItemModal;
