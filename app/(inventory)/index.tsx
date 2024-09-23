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
      <Text>Inventaarion indexi</Text>
    
      <Text>Inventaarion indexi</Text>
    
      <Link href="inventory">
      <Button
        children="Inviksiin bro"
        mode="contained"
      />
      </Link>
    </View>
  );
}
