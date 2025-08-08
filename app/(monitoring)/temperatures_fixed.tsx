import React, { useState } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from "react-native";
import BackButton from "@/components/buttons/BackButton";
import { useThemeColors } from "@/constants/ThemeColors";
import { getTemperatureStyles } from "@/styles/monitoring/temperatureStyles";
import { Button } from "react-native-paper";
import MeatTemperatures from "@/components/views/MeatTemperatures";
import CoolingTemperatures from "@/components/views/CoolingTemperatures";
import WashingMachineTemperatures from "@/components/views/WashingMachineTemperatures";


export default function TemperaturesFixedScreen() {
  const ThemeColors = useThemeColors();
  const styles = getTemperatureStyles(ThemeColors);
  const categories = ["Tiskikone", "Liha", "Jäähdytys"];
  const [selectedCategory, setSelectedCategory] = useState(categories[0]);
  const [showCalendar, setShowCalendar] = useState(false);

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
      >
        <Text style={styles.header}>Lämpötilat</Text>
        <View
          style={{
            flexDirection: "row",
            marginVertical: 20,
          }}
        >
          <FlatList
            contentContainerStyle={styles.scrollList}
            style={{ width: "100%" }}
            data={categories}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <Button
                children={item}
                mode="contained"
                onPress={() => setSelectedCategory(item)}
                style={[
                  styles.button,
                  selectedCategory === item && styles.selectedButton,
                ]}
                labelStyle={styles.buttonLabel}
                contentStyle={{
                  paddingVertical: 15,
                  paddingHorizontal: 20,
                }}
              />
            )}
          />
        </View>
        {selectedCategory === "Tiskikone" ? (
          <WashingMachineTemperatures />
        ) : null}
        {selectedCategory === "Liha" ? <MeatTemperatures /> : null}
        {selectedCategory === "Jäähdytys" ? <CoolingTemperatures /> : null}

        <View style={{ position: "absolute", bottom: 10, left: 10 }}>
          <BackButton />
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
