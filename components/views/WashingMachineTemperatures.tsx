import React, { useEffect, useMemo, useState } from "react";
import { Alert, FlatList, Pressable, Text, View, Modal, TouchableWithoutFeedback } from "react-native";
import { useThemeColors } from "@/constants/ThemeColors";
import { getWashingTempStyles } from "@/styles/views/washingMachineTempStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Button, TextInput } from "react-native-paper";
import CalendarComponent from "@/components/modals/CalendarComponent";

export default function WashingMachineTemperatures() {
  const ThemeColors = useThemeColors();
  const styles = getWashingTempStyles(ThemeColors);
  const [selectedDateMMYY, setSelectedDateMMYY] = useState<string>(() => {
    const currentDate = new Date();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, "0");
    const currentYear = currentDate.getFullYear();
    return `${currentMonth}-${currentYear}`;
  });
    const [calendarModal, setCalendarModal] = useState(false);

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <View style={styles.icon}>
          <MaterialCommunityIcons
            color={ThemeColors.text}
            name="chart-bubble"
            size={43}
          />
          <Text style={styles.iconLabel}>Pesuvesi</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            activeOutlineColor={ThemeColors.tint}
          />
        </View>
        <View style={styles.icon}>
          <MaterialCommunityIcons
            color={ThemeColors.text}
            name="water"
            size={43}
          />
          <Text style={styles.iconLabel}>Huuhteluvesi</Text>
          <TextInput
            mode="outlined"
            style={styles.input}
            keyboardType="numeric"
            activeOutlineColor={ThemeColors.tint}
          />
        </View>
        <View style={styles.icon}>
          <MaterialCommunityIcons
            color={ThemeColors.text}
            name="calendar"
            size={43}
          />
          <Text style={styles.iconLabel}>Päivämäärä</Text>
          <Button
            children={selectedDateMMYY}
            mode="contained"
            style={styles.calendarButton}
            labelStyle={{ fontSize: 16, color: "black" }}
            rippleColor="grey"
            contentStyle={{
              paddingVertical: 15,
              paddingHorizontal: 30,
            }}
            onPress={() => setCalendarModal(true)}
          />
        </View>
      </View>
      {calendarModal && (
        <Modal
          visible={calendarModal}
          animationType="slide"
          transparent={true}
          onDismiss={() => setCalendarModal(false)}
        >
          <TouchableWithoutFeedback onPress={() => setCalendarModal(false)}>
            <View style={{ flex: 1, backgroundColor: "rgba(0, 0, 0, 0.6)" }}>
              <CalendarComponent
                onDayPress={() => {}}
                dataDates={[]}
                selectedDate={selectedDateMMYY}
              />
            </View>
          </TouchableWithoutFeedback>
        </Modal>
      )}
    </View>
  );
}
