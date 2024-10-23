import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";



export default function ReportsHome() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Raportit</Text>
      <Link href="/cleaningReport">
      <Button
        children="Viikkosiivous"
        mode="contained"
      />
      </Link>
      <Link href="/wasteReport">
      <Button
        children="Jätteet"
        mode="contained"
      />
      </Link>
      <Link href="/sampleReport">
      <Button
        children="Näytteenotto"
        mode="contained"
      />
      </Link>
      <Link href="/tempReport">
      <Button
        children="Lämpötilat"
        mode="contained"
      />
      </Link>
      <Link href="/inventoryReport">
      <Button
        children="Inventaario"
        mode="contained"
      />
      </Link>
      <Link href="../">
      <Button
        children="Back"
        mode="contained"
      />
      </Link>
    </View>
  );
}
