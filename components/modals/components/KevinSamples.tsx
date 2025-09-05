import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  Modal,
  TouchableWithoutFeedback,
  FlatList,
} from "react-native";
import {
  Button,
  TextInput,
  Checkbox,
  Dialog,
  Portal,
} from "react-native-paper";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColors } from "@/constants/ThemeColors";
import { getKevinModalStyles } from "@/styles/components/kevinModalStyle";
import * as CleaningFunctions from "@/components/functions/CleaningFunctions";

interface SampleItem {
  id: string;
  date: number;
  month: number;
  year: number;
}

export default function KevinSamples({ isActive }: { isActive: boolean }) {
  const ThemeColors = useThemeColors();
  const styles = getKevinModalStyles(ThemeColors);
  const [samples, setSamples] = useState<SampleItem[]>([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [testSample, setTestSample] = useState<SampleItem>({
    id: "",
    date: 0,
    month: 0,
    year: 0,
  });
  const [deleteList, setDeleteList] = useState<SampleItem[]>([]);
  const [visible, setVisible] = useState(false);

  const fetchSamples = async () => {
    const samples = await CleaningFunctions.fetchKevinSamples();
    setSamples(samples as SampleItem[]);
  };

  useEffect(() => {
    fetchSamples();
  }, [isActive]);

  const saveButtonHandler = async () => {
    const newSample: SampleItem = {
      id: "",
      date: currentDate.getDate(),
      month: currentDate.getMonth() + 1,
      year: currentDate.getFullYear(),
    };
    const generatedId = await CleaningFunctions.saveKevinSample(
      newSample.year,
      newSample.month,
      newSample.date
    );
    // Add the new sample with the generated ID to the local state immediately
    const sampleWithId = { ...newSample, id: generatedId };
    setSamples((prevSamples) => [sampleWithId, ...prevSamples]);
  };

  const checkHandler = (item: SampleItem) => {
    setDeleteList([...deleteList, item]);
  };

  const unCheckHandler = (item: SampleItem) => {
    setDeleteList(deleteList.filter((sample) => sample.id !== item.id));
  };

  const deleteHandler = async () => {
    await CleaningFunctions.deleteKevinSamples(deleteList);
    setDeleteList([]);
    setVisible(false);
    fetchSamples();
  };

  return (
    <View style={styles.sampleContainer}>
      <Text style={styles.label}>Lisää näyte</Text>
      <Button
        children={
          <MaterialCommunityIcons name="plus" size={24} color="white" />
        }
        style={styles.closeButton}
        onPress={saveButtonHandler}
      />
      <Text style={{ ...styles.label, marginTop: 40 }}>Näytteet:</Text>
      <View style={styles.tasksContainer}>
        <View style={{ ...styles.flatlistContainer, height: 400 }}>
          <FlatList
            data={samples}
            contentContainerStyle={styles.flatlist}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.task}>
                <Text style={styles.taskText}>{item.date}.{item.month}.</Text>
                <Checkbox
                  color="red"
                  uncheckedColor={ThemeColors.tint}
                  status={
                    deleteList.some((sample) => sample.id === item.id)
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() =>
                    deleteList.some((sample) => sample.id === item.id)
                      ? unCheckHandler(item)
                      : checkHandler(item)
                  }
                />
              </View>
            )}
          />
        </View>
      </View>
      <Button
        onPress={() => {
          setVisible(true);
        }}
        children="Poista valitut"
        mode="contained"
        style={{
          ...styles.closeButton,
          backgroundColor: "red",
          display: deleteList.length > 0 ? "flex" : "none",
        }}
      />
      <Dialog visible={visible} onDismiss={() => setVisible(false)}>
        <Dialog.Title>Poista valitut</Dialog.Title>
        <Dialog.Content>
          <Text>Haluatko varmasti poistaa valitut näytteet?</Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button
            onPress={() => {
              setVisible(false);
            }}
          >
            Peruuta
          </Button>
          <Button
            onPress={() => {
              deleteHandler();
            }}
          >
            Poista
          </Button>
        </Dialog.Actions>
      </Dialog>
    </View>
  );
}
