import React, { useState, useMemo, useEffect } from "react";
import {
  Modal,
  View,
  Text,
  Pressable,
  StyleSheet,
} from "react-native";
import { TextInput, Button } from "react-native-paper";
import { useThemeColors } from "@/constants/ThemeColors";
import { getModalStyles } from "@/styles/components/itemModalStyle";
import { addSample } from "@/scripts/addSample";
import { Picker } from "@react-native-picker/picker";

interface AddSampleModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm : () => void;
}
interface SampleItem {
  date: string;
  nayte: string;
  tulos: number;
  arvio: string;
  toimenpiteet: string;
}

const AddSampleModal: React.FC<AddSampleModalProps> = ({
  visible,
  onClose,
}) => {
  const [nayte, setNayte] = useState("");
  const [tulos, setTulos] = useState<number | "">("");
  const [arvio, setArvio] = useState("");
  const [toimenpiteet, setToimenpiteet] = useState("");
  const [currentDate, setCurrentDate] = useState("");

  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getModalStyles(ThemeColors), [ThemeColors]);

  useEffect(() => {
    const date = new Date();
    const formattedDate = `${String(date.getDate()).padStart(2, "0")}.${String(
      date.getMonth() + 1
    ).padStart(2, "0")}.${date.getFullYear()}`;
    setCurrentDate(formattedDate);
    console.log(currentDate);
  }, []);

  useEffect(() => {
    if (typeof tulos === "number") {
      if (tulos <= 1) setArvio("Hyvä");
      else if (tulos <= 5) setArvio("Välttävä");
      else if (tulos <= 45) setArvio("Huono");
      else if (tulos <= 80) setArvio("Huonompi");
      else setArvio("Katastrofi");
    } else {
      setArvio("");
    }
  }, [tulos]);

  const handleAddSample = () => {
    if (!nayte || tulos === "" || !toimenpiteet) return;

    const newSample: SampleItem = {
      date: currentDate,
      nayte,
      tulos: typeof tulos === "number" ? tulos : 0,
      arvio,
      toimenpiteet,
    };

    addSample(currentDate, newSample);
    onClose();

    setNayte("");
    setTulos("");
    setToimenpiteet("");
  };

  const isFormValid = nayte && tulos !== "" && toimenpiteet;

  return (
    <Modal visible={visible} transparent={true} animationType="slide">
    <Pressable style={styles.overlay} onPress={onClose}>
      <Pressable
        style={styles.modalContent}
        onPress={() => {}}
        pointerEvents="box-none"
      >
        <Text style={styles.header}>Lisää Näyte</Text>
        <Text style={styles.label}>Näytepinta</Text>
        <View style={styles.modalContent}>
          <Picker
            selectedValue={nayte}
            onValueChange={(itemValue) => setNayte(itemValue)}
            mode="dropdown"
            style={styles.dropdownButton}
          >
            <Picker.Item style={styles.text} label="Pihvikone" value="Pihvikone" />
            <Picker.Item style={styles.text} label="Nostopöytä" value="Nostopöytä" />
            <Picker.Item style={styles.text} label="Lämpökaappi" value="Lämpökaappi" />
          </Picker>
        </View>
        <TextInput
          placeholder="Tulos - CFU"
          value={tulos.toString()}
          onChangeText={(text) => setTulos(text === "" ? "" : Number(text))}
          keyboardType="numeric"
          style={styles.input}
          mode="outlined"
          activeOutlineColor={ThemeColors.tint}
        />
        <TextInput
          placeholder="Toimenpiteet"
          value={toimenpiteet}
          onChangeText={setToimenpiteet}
          style={styles.input}
          mode="outlined"
          activeOutlineColor={ThemeColors.tint}
        />

        <Button
          children="Lisää Näyte"
          onPress={() => {
            handleAddSample();
            onClose(); // Ensure modal closes after adding the item
          }}
          mode="contained"
          disabled={!isFormValid}
          theme={{
            colors: {
              onSurfaceDisabled: ThemeColors.text,
              surfaceDisabled: ThemeColors.navDefault,
              primary: ThemeColors.tint,
            },
          }}
          style={{ marginBottom: 10, marginTop: 10 }}
          contentStyle={{ padding: 10 }}
        />
        <Button
          children="Peruuta"
          onPress={() => {
            onClose(); // Close the modal on cancel
          }}
          mode="text"
          textColor={ThemeColors.text}
        />
      </Pressable>
    </Pressable>
  </Modal>
  );
};
export default AddSampleModal;
