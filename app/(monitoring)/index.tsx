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
      <Text>Omavalvonnan indexi</Text>
      <Link href="testi2">
      <Button
        children="Press me"
        mode="contained"
       
      />
      </Link>
      <Link href="(inventaario)">
      <Button
        children="Inventaarioon"
        mode="contained"
       
      />
      </Link>
    </View>
  );
}
