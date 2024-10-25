import { Link } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";
import { Button } from "react-native-paper";
import { reportNavStyle } from "@/styles/navigations/reportNavStyle";
import { MaterialCommunityIcons } from "@expo/vector-icons";

export default function ReportsHome() {
  return (
    <View
      style={reportNavStyle.container}
    >
      <View style={reportNavStyle.buttonContainer} >
        <Link href="/cleaningReport" asChild>
        <Pressable style={reportNavStyle.button}>
          <Text style={reportNavStyle.buttonText}>Viikkosiivous - raportti</Text>
          <MaterialCommunityIcons name="spray-bottle" style={reportNavStyle.reportIcon}/>
        </Pressable>
        </Link>
        <Link href="/wasteReport" asChild>
        <Pressable style={reportNavStyle.button}>
          <Text style={reportNavStyle.buttonText}>Jätteet</Text>
          <MaterialCommunityIcons name="trash-can-outline" style={reportNavStyle.reportIcon}/>
        </Pressable>
        </Link>
      </View>
      <View style={reportNavStyle.buttonContainer} >

        <Link href="/sampleReport" asChild>
        <Pressable style={reportNavStyle.button}>
          <Text style={reportNavStyle.buttonText}>Näytteenotto</Text>
          <MaterialCommunityIcons name="test-tube" style={reportNavStyle.reportIcon}/>
        </Pressable>
        </Link>
        <Link href="/tempReport" asChild>
        <Pressable style={reportNavStyle.button}>
          <Text style={reportNavStyle.buttonText}>Lämpötilat</Text>
          <MaterialCommunityIcons name="thermometer" style={reportNavStyle.reportIcon}/>
        </Pressable>
        </Link>
        </View>
      <View style={reportNavStyle.invButtonContainer} >
        <Link href="/inventoryReport" asChild>
        <Pressable style={reportNavStyle.invButton}>
          <Text style={reportNavStyle.buttonText}>Inventaario</Text>
          <MaterialCommunityIcons name="clipboard-list" style={reportNavStyle.reportIcon}/>
        </Pressable>
        </Link>
      </View>
    </View>
  );
}
