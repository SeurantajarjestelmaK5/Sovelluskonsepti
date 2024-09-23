import { ThemedText } from "@/components/ThemedText";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        padding: 20,
      }}
    >
      <ThemedText style={{ fontSize: 20 }}>K5 seuranta-app</ThemedText>
      <Link href="/(monitoring)">
        <Button
          children="
        Omavalvonta"
          mode="contained"
        />
      </Link>
      <Link href="(inventory)">
        <Button children="Inventaarioon" mode="contained" />
      </Link>

      <Link href="(settings)">
        <Button children="Asetukset" mode="contained" />
      </Link>

      <Link href="(reports)">
        <Button children="Raportit" mode="contained" />
      </Link>
    </View>
  );
}
