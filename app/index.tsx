import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";




export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Juuri indexi</Text>
      <Link href="(monitoring)">
      <Button
        children="
        Omavalvonta"
        mode="contained"
       
      />
      </Link>
      <Link href="(inventory)">
      <Button
        children="Inventaarioon"
        mode="contained"
       
      />
      </Link>
    </View>
  );
}
