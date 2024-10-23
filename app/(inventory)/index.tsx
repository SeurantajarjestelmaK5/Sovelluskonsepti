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
    
      <Link href="/kitchen">
      <Button
        children="Keittiö"
        mode="contained"
      />
      </Link>
      <Link href="/diningroom">
      <Button
        children="Sali"
        mode="contained"
      />
      </Link>
    </View>
  );
}
