import React, { useEffect, useMemo, useState } from "react";
import { Link } from "expo-router";
import {
  Pressable,
  Text,
  View,
  FlatList,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Keyboard,
} from "react-native";
import { Button, TextInput } from "react-native-paper";
import { Picker } from "@react-native-picker/picker";
import BackButton from "@/components/buttons/BackButton";
import AntDesign from "@expo/vector-icons/AntDesign";

import { db } from "../../firebase/config";
import {
  collection,
  getDocs,
  doc,
  getDoc,
  setDoc,
  query,
  writeBatch,
  Firestore,
  updateDoc,
  addDoc,
} from "firebase/firestore";

import { useThemeColors } from "@/constants/ThemeColors";
import { getFeedBackStyles } from "@/styles/components/feedBackStyle";

export default function FeedBackComponent() {
  const [category, setCategory] = useState("kehitysidea");
  const [message, setMessage] = useState("");
  const [messageHeader, setMessageHeader] = useState("");
  const ThemeColors = useThemeColors();
  const styles = useMemo(() => getFeedBackStyles(ThemeColors), [ThemeColors]);

  const sendFeedback = () => {
        if (messageHeader === "") {
          alert("Otsikko ei voi olla tyhjä.");
          return;
        } else if (message === "") {
          alert("Viesti ei voi olla tyhjä.");
          return;
        } else {
          const feedbackRef = doc(db, "palautteet", messageHeader);
          const feedback = {
            category: category,
            message: message,
          };
          setDoc(feedbackRef, feedback);
          setCategory("kehitysidea");
          setMessage("");
          setMessageHeader("");
          alert("Kiitos palautteestasi!");
        }
  };

  return (
    <View style={styles.container}>
      <View style={styles.textContent}>
        <Text style={styles.header}>Jätä palautetta</Text>
        <Text style={styles.text}>
          {""}
          Löysitkö bugin? Onko invisnäkymä ärsyttävä? Haluatko muuten vaan
          morjestaa kehittäjiä? Jätä vapaamuotoinen viesti alle. Valitse kategoria ja lisää otsikoksi
          lyhyt kuvaus palautteen sisällöstä. Mikäli haluat raportoida virheistä
          sovelluksesta niin kuvailethan löytämäsi bugin mahdollisimman
          tarkasti.{""}
        </Text>
      </View>
      <Picker
        selectedValue={category}
        onValueChange={(itemValue) => setCategory(itemValue as string)}
        mode="dropdown"
        style={styles.dropdownButton}
      >
        <Picker.Item
          label="Bugi/Muu virhe"
          value="bugi"
          style={styles.dropdownItem}
        />
        <Picker.Item
          label="Kehitysidea"
          value="kehitysidea"
          style={styles.dropdownItem}
        />
        <Picker.Item
          label="Muu palaute"
          value="muu"
          style={styles.dropdownItem}
        />
      </Picker>
      <KeyboardAvoidingView behavior="padding" style={styles.inner}>
        <TextInput
          mode="outlined"
          placeholder="Otsikko"
          activeOutlineColor={ThemeColors.tint}
          onChangeText={(text) => setMessageHeader(text)}
          value={messageHeader}
          style={{ ...styles.textInput, padding: 0 }}
        />
        <TextInput
          mode="outlined"
          placeholder="Kirjoita viesti"
          activeOutlineColor={ThemeColors.tint}
          onChangeText={(text) => setMessage(text)}
          value={message}
          multiline
          numberOfLines={6}
          contentStyle={{ height: 150 }}
          style={{ ...styles.textInput, paddingTop: 10 }}
        />

        <Button
          children="Lähetä"
          labelStyle={styles.buttonText}
          mode="contained"
          onPress={sendFeedback}
          buttonColor={ThemeColors.tint}
          contentStyle={{ height: 70, width: "100%" }}
          style={styles.button}
          rippleColor="white"
        />
      </KeyboardAvoidingView>
    </View>
  );
}
