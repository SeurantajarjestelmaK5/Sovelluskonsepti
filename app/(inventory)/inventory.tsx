import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function InventoryHome() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <ThemedText>Täs vois tehä invistä sitte niiin</ThemedText>

    </View>
  );
}
