 import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { Button } from "react-native-paper";



export default function Diningroom() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Takas inventaarioon</Text>
    
      <Link href="/inventory">
      <Button
        children="Testi 3"
        mode="contained"
       
      />
      </Link>
      <Text>Inventaarion indexi</Text>
    
      <Link href="(monitoring)">
      <Button
        children="Omavalvontaan"
        mode="contained"
      />
      </Link>
    </View>
  );
}
