import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";



export default function temperatures() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Lämpötilat</Text>

      <Link href="../">
      <Button
        children="Back"
        mode="contained"
      />
      </Link>
    </View>
  );
}
