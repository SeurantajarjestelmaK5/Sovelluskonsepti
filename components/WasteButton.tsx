import React, {useMemo} from "react";
import { View, Text, Modal, TouchableWithoutFeedback } from "react-native";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, TextInput } from "react-native-paper";
import { useThemeColors } from "@/constants/ThemeColors";
import { getWasteStyles } from "@/styles/monitoring/wasteStyles";



interface WasteData {
  id: string;
  yksikkö: string;
  määrä: number;
}

interface WasteButtonProps {
  data: WasteData;
  wasteName: string;
  wasteModal: boolean;
  showModal: (id: string) => void;
  setWasteModal: (visible: boolean) => void;
  addWaste: (id: string, amount: number) => void;
  styles: any; // Pass the styles for layout, typography, etc.
  ThemeColors: { tint: string }; // Theme colors for consistency
}

export default function WasteButton({
  data,
  wasteName,
  wasteModal,
  showModal,
  setWasteModal,
  addWaste,
  styles,
  ThemeColors,
}: WasteButtonProps) {
  const [wasteAmount, setWasteAmount] = React.useState<number>(0);

    return (
      <View key={data.id} style={styles.wasteContainer}>
        {/* Waste data display */}
        <View style={styles.wasteContent}>
          <Text style={styles.text}>{wasteName}</Text>
          <Text style={styles.text}>
            {data.määrä}
            {data.yksikkö}
          </Text>
        </View>

        {/* Add waste button */}
        <MaterialCommunityIcons
          name="plus"
          size={35}
          color={ThemeColors.tint}
          onPress={() => showModal(data.id)} // Pass the waste type to the handler
        />

        {/* Waste modal */}
        <Modal
          visible={wasteModal}
          animationType="slide"
          transparent={true}
          onDismiss={() => setWasteModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setWasteModal(false)}>
            <View style={styles.wasteModalContainer}>
              <TouchableWithoutFeedback>
                <View style={styles.wasteModal}>
                  {/* Dynamically display the type of waste */}
                  <Text style={styles.header}>{wasteName}</Text>

                  {/* Input for waste amount */}
                  <TextInput
                    mode="outlined"
                    style={styles.wasteInput}
                    placeholder="Määrä"
                    keyboardType="numeric"
                    activeOutlineColor={ThemeColors.tint}
                    onChangeText={(text) => setWasteAmount(Number(text))}
                  />

                  {/* Add waste button */}
                  <Button
                    children="Lisää"
                    icon={() => (
                      <MaterialCommunityIcons name="plus" size={20} />
                    )}
                    contentStyle={{ flexDirection: "row-reverse" }}
                    mode="contained"
                    buttonColor={ThemeColors.tint}
                    onPress={() => {
                      addWaste(data.id, wasteAmount);
                      setWasteModal(false); // Close modal after adding
                    }}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      </View>
    );
}
