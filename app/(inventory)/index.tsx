import { Link } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { invNavStyle } from '../../styles/navigations/inventoryNavStyle';
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function InventoryHome() {
  return (
    <View style={invNavStyle.container}>
      <View style={invNavStyle.buttonContainer} >
      <Link href="/kitchen" asChild>
          <Pressable style={invNavStyle.button}>
            <Text style={invNavStyle.buttonText}>Keittiö</Text>
            <MaterialCommunityIcons name="knife" style={invNavStyle.inventoryIcon}/>
          </Pressable>
          </Link>
      </View>
      <View style={invNavStyle.buttonContainer} >
      <Link href="/diningroom" asChild>
          <Pressable style={invNavStyle.button}>
            <Text style={invNavStyle.buttonText}>Sali</Text>
            <MaterialCommunityIcons name="glass-cocktail" style={invNavStyle.inventoryIcon}/>
          </Pressable>
          </Link>
      </View>
    </View>
  );
}
